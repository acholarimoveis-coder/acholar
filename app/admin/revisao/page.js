import { getSessao } from "@/lib/painel";
import { formatPreco, FOTO_PLACEHOLDER } from "@/lib/format";
import ModButtons from "../imoveis/ModButtons";

export const dynamic = "force-dynamic";

// Calcula os "sinais de alerta" de um imóvel possivelmente desatualizado.
function flags(im) {
  const f = [];
  const semFoto = !im.fotos || im.fotos.length === 0;
  const semArea = (!im.area_util || im.area_util === 0) && (!im.area_total || im.area_total === 0);
  const semDescricao = !im.descricao || String(im.descricao).trim().length < 20;
  const semPreco = im.preco == null;
  const precoBaixo = !semPreco && ((im.tipo_negocio === "venda" && im.preco > 0 && im.preco < 50000) || (im.tipo_negocio === "locacao" && im.preco > 0 && im.preco < 400));
  if (semFoto) f.push("Sem foto");
  if (semArea) f.push("Sem área");
  if (semDescricao) f.push("Sem descrição");
  if (semPreco) f.push("Sem preço");
  if (precoBaixo) f.push("Preço suspeito");
  return f;
}

export default async function AdminRevisao() {
  const { supabase } = await getSessao();
  const { data } = await supabase
    .from("imoveis")
    .select("id, titulo, codigo, preco, tipo_negocio, area_util, area_total, fotos, descricao, bairro, cidade, status, imobiliaria:imobiliarias(nome)")
    .eq("status", "publicado")
    .limit(1000);

  const revisar = (data || [])
    .map((im) => ({ ...im, _flags: flags(im) }))
    .filter((im) => im._flags.length > 0)
    .sort((a, b) => b._flags.length - a._flags.length);

  return (
    <>
      <div className="ptop">Revisão de imóveis</div>
      <div className="pcontent">
        <div className="ptrial" style={{ background: "linear-gradient(120deg,#FDF3E4,#FBE9CF)", marginBottom: 18 }}>
          {revisar.length} imóvel(is) publicado(s) com sinais de estarem desatualizados.
          <span>Revise e pause os que não devem aparecer no portal. Imóvel pausado aqui não volta pela sincronização.</span>
        </div>

        <div className="pcard">
          {revisar.length > 0 ? (
            <table className="pt">
              <thead><tr><th>Imóvel</th><th>Imobiliária</th><th>Preço</th><th>Área</th><th>Sinais</th><th>Ação</th></tr></thead>
              <tbody>
                {revisar.map((im) => {
                  const foto = (im.fotos && im.fotos[0]) || FOTO_PLACEHOLDER;
                  const area = im.area_util || im.area_total;
                  return (
                    <tr key={im.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <img className="pthumb" src={foto} alt="" />
                          <div>
                            <a href={`/imovel/${im.id}`} target="_blank" rel="noopener" style={{ display: "block", fontWeight: 700, color: "var(--ink)" }}>{im.titulo}</a>
                            <span style={{ fontSize: ".76rem", color: "var(--muted)" }}>Cód. {im.codigo || im.id.slice(0, 8)} · {im.bairro || "—"}, {im.cidade || "—"}</span>
                          </div>
                        </div>
                      </td>
                      <td>{im.imobiliaria?.nome || "—"}</td>
                      <td style={{ fontWeight: 700, color: "var(--primary)" }}>{formatPreco(im.preco, im.tipo_negocio)}</td>
                      <td style={{ color: "var(--muted)" }}>{area ? `${area}m²` : "—"}</td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {im._flags.map((fl) => <span key={fl} className="flag">{fl}</span>)}
                        </div>
                      </td>
                      <td><ModButtons id={im.id} status={im.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="pempty">Nenhum imóvel com sinais de alerta. Tudo em ordem! 🎉</div>
          )}
        </div>
      </div>
    </>
  );
}
