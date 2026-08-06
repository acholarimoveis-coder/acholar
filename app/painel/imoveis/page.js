import { getSessao } from "@/lib/painel";
import { formatPreco, FOTO_PLACEHOLDER } from "@/lib/format";

export const dynamic = "force-dynamic";

const rotulos = {
  publicado: ["Publicado", "pub"],
  pendente: ["Pendente", "pend"],
  rascunho: ["Rascunho", ""],
  pausado: ["Pausado", ""],
  reprovado: ["Reprovado", "novo"],
};

export default async function MeusImoveis() {
  const { imob, supabase } = await getSessao();
  const { data: imoveis } = await supabase
    .from("imoveis")
    .select("*")
    .eq("imobiliaria_id", imob?.id)
    .order("criado_em", { ascending: false });

  return (
    <>
      <div className="ptop" style={{ justifyContent: "space-between", display: "flex" }}>
        <span>Meus imóveis</span>
        <a className="btn btn-primary" href="/painel/imoveis/novo" style={{ fontSize: ".88rem", padding: "9px 16px" }}>+ Novo imóvel</a>
      </div>
      <div className="pcontent">
        <div className="pcard">
          {imoveis && imoveis.length > 0 ? (
            <table className="pt">
              <thead><tr><th>Imóvel</th><th>Negócio</th><th>Preço</th><th>Visitas</th><th>Status</th></tr></thead>
              <tbody>
                {imoveis.map((im) => {
                  const foto = (im.fotos && im.fotos[0]) || FOTO_PLACEHOLDER;
                  const [txt, cls] = rotulos[im.status] || [im.status, ""];
                  return (
                    <tr key={im.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <img className="pthumb" src={foto} alt="" />
                          <div>
                            <b style={{ display: "block" }}>{im.titulo}</b>
                            <span style={{ fontSize: ".76rem", color: "var(--muted)" }}>Cód. {im.codigo || im.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </td>
                      <td>{im.tipo_negocio === "locacao" ? "Locação" : "Venda"}</td>
                      <td style={{ fontWeight: 700, color: "var(--primary)" }}>{formatPreco(im.preco, im.tipo_negocio)}</td>
                      <td style={{ color: "var(--muted)" }}>{im.visitas || 0}</td>
                      <td><span className={`chip-st ${cls}`}>{txt}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="pempty">
              Você ainda não tem imóveis cadastrados.<br />
              <a href="/painel/imoveis/novo" style={{ color: "var(--primary)", fontWeight: 700 }}>Cadastre seu primeiro imóvel</a> ou conecte seu XML.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
