import { getSessao } from "@/lib/painel";

export const dynamic = "force-dynamic";

const TIPO_NOME = { casa: "Casa", apartamento: "Apartamento", terreno: "Terreno", comercial: "Comercial", rural: "Rural", lancamento: "Lançamento" };

export default async function AdminRelatorios() {
  const { supabase } = await getSessao();
  const [imoveisRes, leadsRes] = await Promise.all([
    supabase.from("imoveis").select("id, titulo, bairro, cidade, tipo_imovel, visitas").eq("status", "publicado"),
    supabase.from("leads").select("id, imovel_id, canal, criado_em"),
  ]);
  const imoveis = imoveisRes.data || [];
  const leads = leadsRes.data || [];

  // ----- números principais -----
  const visitasTotais = imoveis.reduce((s, m) => s + (m.visitas || 0), 0);
  const imoveisVistos = imoveis.filter((m) => (m.visitas || 0) > 0).length;
  const totalLeads = leads.length;
  const leadsWhats = leads.filter((l) => l.canal === "whatsapp").length;
  const conversao = visitasTotais > 0 ? (totalLeads / visitasTotais) * 100 : 0;

  // ----- leads por semana (últimas 8) -----
  const semanas = Array.from({ length: 8 }, () => 0);
  const agora = Date.now();
  leads.forEach((l) => {
    const dias = (agora - new Date(l.criado_em).getTime()) / 86400000;
    const w = Math.floor(dias / 7);
    if (w >= 0 && w < 8) semanas[7 - w]++;
  });
  const maxSem = Math.max(1, ...semanas);

  // ----- leads por imóvel -----
  const leadsPorImovel = {};
  leads.forEach((l) => { if (l.imovel_id) leadsPorImovel[l.imovel_id] = (leadsPorImovel[l.imovel_id] || 0) + 1; });

  // ----- rankings -----
  const topImoveis = [...imoveis].filter((m) => (m.visitas || 0) > 0).sort((a, b) => (b.visitas || 0) - (a.visitas || 0)).slice(0, 6);
  const mapaB = {};
  imoveis.forEach((m) => { if (m.bairro) { const k = `${m.bairro} — ${m.cidade || "Jales"}`; mapaB[k] = (mapaB[k] || 0) + (m.visitas || 0); } });
  const topBairros = Object.entries(mapaB).map(([k, total]) => ({ k, total })).filter((b) => b.total > 0).sort((a, b) => b.total - a.total).slice(0, 6);
  const maxBairro = Math.max(1, ...topBairros.map((b) => b.total));
  const mapaT = {};
  imoveis.forEach((m) => { const k = m.tipo_imovel || "outro"; mapaT[k] = (mapaT[k] || 0) + (m.visitas || 0); });
  const topTipos = Object.entries(mapaT).map(([k, total]) => ({ k, total })).filter((t) => t.total > 0).sort((a, b) => b.total - a.total);
  const maxTipo = Math.max(1, ...topTipos.map((t) => t.total));

  const temTrafego = visitasTotais > 0;

  return (
    <>
      <div className="ptop">Relatórios</div>
      <div className="pcontent">
        <div className="pstats" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
          <div className="pstat"><b>{visitasTotais.toLocaleString("pt-BR")}</b><span>Visitas nos imóveis</span></div>
          <div className="pstat"><b>{imoveisVistos}</b><span>Imóveis visualizados</span></div>
          <div className="pstat"><b>{totalLeads}</b><span>Leads gerados</span></div>
          <div className="pstat"><b>{conversao.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</b><span>Conversão visita→lead</span></div>
          <div className="pstat"><b>{imoveis.length}</b><span>Imóveis publicados</span></div>
        </div>

        <div className="pcard" style={{ marginBottom: 18 }}>
          <div className="pcard-h">Leads por semana <span style={{ color: "var(--muted)", fontWeight: 600, fontSize: ".8rem" }}>últimas 8 semanas</span></div>
          <div className="rchart">
            {semanas.map((v, i) => (
              <div className="rbar" key={i}>
                <div className="v">{v}</div>
                <div className="b" style={{ height: `${(v / maxSem) * 100}%` }} />
                <div className="m">S{i + 1}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pcard" style={{ marginBottom: 18 }}>
          <div className="pcard-h">Funil de conversão <span style={{ color: "var(--muted)", fontWeight: 600, fontSize: ".8rem" }}>do acesso ao contato</span></div>
          <div className="funnel">
            <div className="fstep"><b>{visitasTotais.toLocaleString("pt-BR")}</b><span>Visitas nos imóveis</span></div>
            <div className="farrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg></div>
            <div className="fstep"><span className="pct">{visitasTotais ? ((totalLeads / visitasTotais) * 100).toFixed(1) : 0}%</span><b>{totalLeads}</b><span>Leads gerados</span></div>
            <div className="farrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg></div>
            <div className="fstep"><span className="pct">{totalLeads ? ((leadsWhats / totalLeads) * 100).toFixed(0) : 0}%</span><b>{leadsWhats}</b><span>Contatos via WhatsApp</span></div>
          </div>
        </div>

        {temTrafego ? (
          <>
            <div className="relat-grid">
              <div className="pcard">
                <div className="pcard-h">Imóveis mais vistos</div>
                <table className="pt">
                  <thead><tr><th>#</th><th>Imóvel</th><th>Visitas</th><th>Leads</th></tr></thead>
                  <tbody>
                    {topImoveis.map((m, i) => (
                      <tr key={m.id}>
                        <td style={{ color: "var(--muted)", fontWeight: 800 }}>{i + 1}</td>
                        <td><a href={`/imovel/${m.id}`} style={{ fontWeight: 700, color: "var(--ink)" }}>{m.titulo}</a><div style={{ fontSize: ".76rem", color: "var(--muted)", fontWeight: 600 }}>{m.bairro || "—"}, {m.cidade || "Jales"}</div></td>
                        <td style={{ fontWeight: 700 }}>{m.visitas}</td>
                        <td style={{ fontWeight: 700 }}>{leadsPorImovel[m.id] || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pcard">
                <div className="pcard-h">Bairros mais procurados</div>
                <div className="brk">
                  {topBairros.map((b) => (
                    <div className="brkrow" key={b.k}>
                      <div className="brktop"><span>{b.k}</span><b>{b.total}</b></div>
                      <div className="bbar"><i style={{ width: `${(b.total / maxBairro) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pcard" style={{ marginTop: 18 }}>
              <div className="pcard-h">Tipos mais procurados</div>
              <div className="brk">
                {topTipos.map((t) => (
                  <div className="brkrow" key={t.k}>
                    <div className="brktop"><span>{TIPO_NOME[t.k] || t.k}</span><b>{t.total}</b></div>
                    <div className="bbar"><i style={{ width: `${(t.total / maxTipo) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="pcard"><div className="pempty">Os relatórios de imóveis e bairros mais procurados vão aparecer aqui conforme as pessoas navegam pelo portal.</div></div>
        )}
      </div>
    </>
  );
}
