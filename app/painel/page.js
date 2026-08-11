import { getSessao } from "@/lib/painel";
import { formatPreco } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PainelHome() {
  const { imob, supabase } = await getSessao();
  const imobId = imob?.id;

  const [{ count: nImoveis }, { count: nAtivos }, { count: nLeads }, { data: leads }, { data: meus }] = await Promise.all([
    supabase.from("imoveis").select("*", { count: "exact", head: true }).eq("imobiliaria_id", imobId),
    supabase.from("imoveis").select("*", { count: "exact", head: true }).eq("imobiliaria_id", imobId).eq("status", "publicado"),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*, imovel:imoveis(titulo)").order("criado_em", { ascending: false }).limit(5),
    supabase.from("imoveis").select("id, titulo, bairro, visitas, tipo_negocio, preco").eq("imobiliaria_id", imobId).eq("status", "publicado"),
  ]);

  // total de visualizações e imóveis mais vistos da imobiliária
  const totalVisitas = (meus || []).reduce((s, m) => s + (m.visitas || 0), 0);
  const topImoveis = (meus || []).filter((m) => (m.visitas || 0) > 0).sort((a, b) => (b.visitas || 0) - (a.visitas || 0)).slice(0, 5);
  // bairros mais vistos (soma das visitas dos imóveis de cada bairro)
  const mapaB = {};
  (meus || []).forEach((m) => { if (m.bairro) mapaB[m.bairro] = (mapaB[m.bairro] || 0) + (m.visitas || 0); });
  const topBairros = Object.entries(mapaB).map(([bairro, total]) => ({ bairro, total })).filter((b) => b.total > 0).sort((a, b) => b.total - a.total).slice(0, 5);
  const temDados = topImoveis.length > 0 || topBairros.length > 0;

  return (
    <>
      <div className="ptop">Painel</div>
      <div className="pcontent">
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 4 }}>
          Olá, {imob?.nome || "imobiliária"} 👋
        </h2>
        <p style={{ color: "var(--muted)", fontWeight: 600, marginBottom: 20 }}>Resumo da sua conta.</p>

        {imob?.status === "teste" ? (
          <div className="ptrial">
            Você está no período de teste grátis.
            <span>{imob.data_vigencia ? `Válido até ${new Date(imob.data_vigencia).toLocaleDateString("pt-BR")}.` : "Aproveite para receber contatos."}</span>
          </div>
        ) : null}

        <div className="pstats" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
          <div className="pstat"><b>{nImoveis || 0}</b><span>Imóveis cadastrados</span></div>
          <div className="pstat"><b>{nAtivos || 0}</b><span>Publicados</span></div>
          <div className="pstat"><b>{totalVisitas.toLocaleString("pt-BR")}</b><span>Visualizações</span></div>
          <div className="pstat"><b>{nLeads || 0}</b><span>Leads recebidos</span></div>
        </div>

        {temDados ? (
          <div className="relat-grid">
            <div className="pcard">
              <div className="pcard-h">Seus imóveis mais procurados</div>
              <div className="rank">
                {topImoveis.length > 0 ? topImoveis.map((m, i) => (
                  <a className="rank-row" key={m.id} href={`/imovel/${m.id}`}>
                    <span className="rk-pos">{i + 1}</span>
                    <span className="rk-main">
                      <b>{m.titulo}</b>
                      <small>{m.bairro || "—"} · {formatPreco(m.preco, m.tipo_negocio)}</small>
                    </span>
                    <span className="rk-val">{m.visitas} <i>visitas</i></span>
                  </a>
                )) : <div className="pempty">Ainda sem visualizações.</div>}
              </div>
            </div>
            <div className="pcard">
              <div className="pcard-h">Bairros mais procurados</div>
              <div className="rank">
                {topBairros.length > 0 ? topBairros.map((b, i) => (
                  <div className="rank-row" key={b.bairro}>
                    <span className="rk-pos">{i + 1}</span>
                    <span className="rk-main"><b>{b.bairro}</b></span>
                    <span className="rk-val">{b.total} <i>visitas</i></span>
                  </div>
                )) : <div className="pempty">Ainda sem dados.</div>}
              </div>
            </div>
          </div>
        ) : null}

        <div className="pcard">
          <div className="pcard-h">Leads recentes <a href="/painel/leads">Ver todos</a></div>
          {leads && leads.length > 0 ? (
            <table className="pt">
              <thead><tr><th>Contato</th><th>Telefone</th><th>Imóvel</th><th>Canal</th><th>Quando</th></tr></thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 700 }}>{l.nome}</td>
                    <td>{l.telefone}</td>
                    <td>{l.imovel?.titulo || "—"}</td>
                    <td><span className="chip-st">{l.canal === "whatsapp" ? "WhatsApp" : "Formulário"}</span></td>
                    <td style={{ color: "var(--muted)" }}>{new Date(l.criado_em).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="pempty">Nenhum lead ainda. Quando alguém entrar em contato pelos seus imóveis, aparece aqui.</div>
          )}
        </div>
      </div>
    </>
  );
}
