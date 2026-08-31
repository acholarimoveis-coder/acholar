import { getSessao } from "@/lib/painel";

export const dynamic = "force-dynamic";

const ORIGEM = { cron: "Automático", manual: "Manual (imobiliária)", cadastro: "Cadastro", auto: "Automático" };

export default async function AdminLog() {
  const { supabase } = await getSessao();
  const { data: logs } = await supabase
    .from("sync_log")
    .select("*, imobiliaria:imobiliarias(nome)")
    .order("criado_em", { ascending: false })
    .limit(120);

  const lista = logs || [];
  // Resumo dos últimos 7 dias
  const seteDias = Date.now() - 7 * 86400000;
  const recentes = lista.filter((l) => new Date(l.criado_em).getTime() >= seteDias);
  const somaN = recentes.reduce((s, l) => s + (l.novos || 0), 0);
  const somaA = recentes.reduce((s, l) => s + (l.atualizados || 0), 0);
  const somaR = recentes.reduce((s, l) => s + (l.removidos || 0), 0);

  return (
    <>
      <div className="ptop">Log de sincronização</div>
      <div className="pcontent">
        <div className="pstats" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
          <div className="pstat"><b style={{ color: "#1B7E45" }}>+{somaN}</b><span>Adicionados (7 dias)</span></div>
          <div className="pstat"><b>{somaA}</b><span>Atualizados (7 dias)</span></div>
          <div className="pstat"><b style={{ color: "#C0453C" }}>−{somaR}</b><span>Removidos (7 dias)</span></div>
        </div>

        <div className="pcard">
          {lista.length > 0 ? (
            <table className="pt">
              <thead><tr><th>Quando</th><th>Imobiliária</th><th>Origem</th><th>Adicionados</th><th>Atualizados</th><th>Removidos</th><th>Total no XML</th></tr></thead>
              <tbody>
                {lista.map((l) => (
                  <tr key={l.id}>
                    <td style={{ color: "var(--muted)", whiteSpace: "nowrap" }}>{new Date(l.criado_em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                    <td style={{ fontWeight: 700 }}>{l.imobiliaria?.nome || "—"}</td>
                    <td><span className="chip-st">{ORIGEM[l.origem] || l.origem}</span></td>
                    <td style={{ fontWeight: 700, color: l.novos > 0 ? "#1B7E45" : "var(--muted)" }}>{l.novos > 0 ? `+${l.novos}` : "0"}</td>
                    <td style={{ fontWeight: 700 }}>{l.atualizados || 0}</td>
                    <td style={{ fontWeight: 700, color: l.removidos > 0 ? "#C0453C" : "var(--muted)" }}>{l.removidos > 0 ? `−${l.removidos}` : "0"}</td>
                    <td style={{ color: "var(--muted)" }}>{l.total || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="pempty">Ainda não há registros de sincronização. Eles aparecem aqui a cada importação (automática ou manual).</div>
          )}
        </div>
      </div>
    </>
  );
}
