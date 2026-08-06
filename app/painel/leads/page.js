import { getSessao } from "@/lib/painel";

export const dynamic = "force-dynamic";

export default async function LeadsPainel() {
  const { supabase } = await getSessao();
  const { data: leads } = await supabase
    .from("leads")
    .select("*, imovel:imoveis(titulo)")
    .order("criado_em", { ascending: false });

  return (
    <>
      <div className="ptop">Leads recebidos</div>
      <div className="pcontent">
        <div className="pcard">
          {leads && leads.length > 0 ? (
            <table className="pt">
              <thead><tr><th>Contato</th><th>Telefone</th><th>E-mail</th><th>Imóvel de interesse</th><th>Canal</th><th>Quando</th></tr></thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 700 }}>{l.nome}</td>
                    <td>{l.telefone}</td>
                    <td style={{ color: "var(--muted)" }}>{l.email || "—"}</td>
                    <td>{l.imovel?.titulo || "—"}</td>
                    <td><span className="chip-st">{l.canal === "whatsapp" ? "WhatsApp" : "Formulário"}</span></td>
                    <td style={{ color: "var(--muted)" }}>{new Date(l.criado_em).toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="pempty">Nenhum lead ainda. Os contatos dos seus imóveis vão aparecer aqui.</div>
          )}
        </div>
      </div>
    </>
  );
}
