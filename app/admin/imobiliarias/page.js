import { getSessao } from "@/lib/painel";
import ImobRow from "./ImobRow";

export const dynamic = "force-dynamic";

const st = {
  pendente: ["Pendente", "pend"],
  teste: ["Em teste", ""],
  ativa: ["Ativa", "pub"],
  tolerancia: ["Em tolerância", "pend"],
  pausada: ["Pausada", "novo"],
  suspensa: ["Suspensa", "novo"],
};

export default async function AdminImobiliarias() {
  const { supabase } = await getSessao();
  const { data: imobs } = await supabase.from("imobiliarias").select("*").order("criado_em", { ascending: false });

  return (
    <>
      <div className="ptop">Imobiliárias</div>
      <div className="pcontent">
        <div className="pcard">
          {imobs && imobs.length > 0 ? (
            <table className="pt">
              <thead><tr><th>Imobiliária</th><th>Cidade</th><th>Vigência</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {imobs.map((im) => {
                  const [txt, cls] = st[im.status] || [im.status, ""];
                  return (
                    <tr key={im.id}>
                      <td>
                        <b style={{ display: "block" }}>{im.nome}</b>
                        <span style={{ fontSize: ".76rem", color: "var(--muted)" }}>{im.creci ? `CRECI ${im.creci}` : "—"}</span>
                      </td>
                      <td>{im.cidade || "—"}</td>
                      <td style={{ color: "var(--muted)" }}>{im.data_vigencia ? new Date(im.data_vigencia).toLocaleDateString("pt-BR") : "—"}</td>
                      <td><span className={`chip-st ${cls}`}>{txt}</span></td>
                      <td><ImobRow imob={im} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="pempty">Nenhuma imobiliária cadastrada.</div>
          )}
        </div>
      </div>
    </>
  );
}
