import { getSessao } from "@/lib/painel";

export const dynamic = "force-dynamic";

export default async function PainelHome() {
  const { imob, supabase } = await getSessao();
  const imobId = imob?.id;

  const [{ count: nImoveis }, { count: nAtivos }, { count: nLeads }, { data: leads }] = await Promise.all([
    supabase.from("imoveis").select("*", { count: "exact", head: true }).eq("imobiliaria_id", imobId),
    supabase.from("imoveis").select("*", { count: "exact", head: true }).eq("imobiliaria_id", imobId).eq("status", "publicado"),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*, imovel:imoveis(titulo)").order("criado_em", { ascending: false }).limit(5),
  ]);

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

        <div className="pstats">
          <div className="pstat"><b>{nImoveis || 0}</b><span>Imóveis cadastrados</span></div>
          <div className="pstat"><b>{nAtivos || 0}</b><span>Publicados</span></div>
          <div className="pstat"><b>{nLeads || 0}</b><span>Leads recebidos</span></div>
        </div>

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
