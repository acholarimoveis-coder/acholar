import { getSessao } from "@/lib/painel";
import { formatPreco, FOTO_PLACEHOLDER } from "@/lib/format";
import ModButtons from "./ModButtons";

export const dynamic = "force-dynamic";

const rotulos = {
  publicado: ["Publicado", "pub"],
  pendente: ["Pendente", "pend"],
  rascunho: ["Rascunho", ""],
  pausado: ["Pausado", ""],
  reprovado: ["Reprovado", "novo"],
};

const filtros = [
  { k: "", n: "Todos" },
  { k: "pendente", n: "Pendentes" },
  { k: "publicado", n: "Publicados" },
  { k: "pausado", n: "Pausados" },
];

export default async function AdminImoveis({ searchParams }) {
  const status = searchParams?.status || "";
  const { supabase } = await getSessao();

  let q = supabase.from("imoveis").select("*, imobiliaria:imobiliarias(nome)").order("criado_em", { ascending: false }).limit(100);
  if (status) q = q.eq("status", status);
  const { data: imoveis } = await q;

  return (
    <>
      <div className="ptop">Imóveis</div>
      <div className="pcontent">
        <div className="rowacts" style={{ marginBottom: 16 }}>
          {filtros.map((f) => (
            <a key={f.k} className={`btn-xs ${status === f.k ? "btn-amber2" : "btn-ghost"}`} href={`/admin/imoveis${f.k ? `?status=${f.k}` : ""}`} style={{ textDecoration: "none" }}>
              {f.n}
            </a>
          ))}
        </div>

        <div className="pcard">
          {imoveis && imoveis.length > 0 ? (
            <table className="pt">
              <thead><tr><th>Imóvel</th><th>Imobiliária</th><th>Preço</th><th>Origem</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {imoveis.map((im) => {
                  const foto = (im.fotos && im.fotos[0]) || FOTO_PLACEHOLDER;
                  const [txt, cls] = rotulos[im.status] || [im.status, ""];
                  return (
                    <tr key={im.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <img className="pthumb" src={foto} alt="" />
                          <b>{im.titulo}</b>
                        </div>
                      </td>
                      <td>{im.imobiliaria?.nome || "—"}</td>
                      <td style={{ fontWeight: 700, color: "var(--primary)" }}>{formatPreco(im.preco, im.tipo_negocio)}</td>
                      <td style={{ color: "var(--muted)" }}>{im.origem === "xml" ? "XML" : "Manual"}</td>
                      <td><span className={`chip-st ${cls}`}>{txt}</span></td>
                      <td><ModButtons id={im.id} status={im.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="pempty">Nenhum imóvel neste filtro.</div>
          )}
        </div>
      </div>
    </>
  );
}
