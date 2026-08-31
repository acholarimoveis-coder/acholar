import { getSessao } from "@/lib/painel";
import { formatPreco, FOTO_PLACEHOLDER } from "@/lib/format";
import ModButtons from "./ModButtons";
import GeocodeButton from "./GeocodeButton";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const rotulos = {
  publicado: ["Publicado", "pub"],
  pendente: ["Pendente", "pend"],
  rascunho: ["Rascunho", ""],
  pausado: ["Pausado", ""],
  reprovado: ["Reprovado", "novo"],
  removido: ["Removido (fora do XML)", "novo"],
};

const filtros = [
  { k: "", n: "Todos" },
  { k: "pendente", n: "Pendentes" },
  { k: "publicado", n: "Publicados" },
  { k: "pausado", n: "Pausados" },
  { k: "removido", n: "Removidos" },
];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const limpaBusca = (t) => (t || "").replace(/[%,()]/g, "").trim();

export default async function AdminImoveis({ searchParams }) {
  const status = searchParams?.status || "";
  const busca = limpaBusca(searchParams?.q);
  const { supabase } = await getSessao();

  let q = supabase.from("imoveis").select("*, imobiliaria:imobiliarias(nome)").order("criado_em", { ascending: false }).limit(100);
  if (status) q = q.eq("status", status);
  if (busca) {
    // Se colou o ID (ou a URL) do imóvel, busca exata; senão busca por texto.
    const idMatch = busca.match(UUID_RE) || busca.match(/([0-9a-f-]{36})/i);
    if (idMatch) q = q.eq("id", idMatch[0]);
    else q = q.or(`titulo.ilike.%${busca}%,bairro.ilike.%${busca}%,cidade.ilike.%${busca}%,codigo.ilike.%${busca}%`);
  }
  const { data: imoveis } = await q;
  const qs = (extra) => new URLSearchParams({ ...(busca ? { q: busca } : {}), ...extra }).toString();

  return (
    <>
      <div className="ptop" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>Imóveis</span>
        <GeocodeButton />
      </div>
      <div className="pcontent">
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div className="rowacts">
            {filtros.map((f) => {
              const query = qs(f.k ? { status: f.k } : {});
              return (
                <a key={f.k} className={`btn-xs ${status === f.k ? "btn-amber2" : "btn-ghost"}`} href={`/admin/imoveis${query ? `?${query}` : ""}`} style={{ textDecoration: "none" }}>
                  {f.n}
                </a>
              );
            })}
          </div>
          <form action="/admin/imoveis" method="get" style={{ display: "flex", gap: 8 }}>
            {status ? <input type="hidden" name="status" value={status} /> : null}
            <input className="cf-inp" name="q" defaultValue={busca} placeholder="Buscar por título, bairro, código ou ID…" style={{ marginBottom: 0, minWidth: 260 }} />
            <button className="btn btn-primary btn-xs" type="submit">Buscar</button>
          </form>
        </div>

        {busca ? (
          <div style={{ fontSize: ".82rem", color: "var(--muted)", fontWeight: 600, marginBottom: 12 }}>
            {imoveis?.length || 0} resultado(s) para “{busca}”. <a href={`/admin/imoveis${status ? `?status=${status}` : ""}`} style={{ color: "var(--primary)", fontWeight: 700 }}>Limpar busca</a>
          </div>
        ) : null}

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
                      <td>
                        <div className="rowacts">
                          <ModButtons id={im.id} status={im.status} />
                          <a className="btn-xs btn-ghost" href={`/admin/imoveis/${im.id}/local`} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }} title="Ajustar localização no mapa">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                            {im.geo_travado ? "Local 🔒" : "Local"}
                          </a>
                        </div>
                      </td>
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
