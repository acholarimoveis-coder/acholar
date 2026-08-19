import { createClient } from "@/lib/supabase/server";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ImovelCard from "../components/ImovelCard";
import MapaImoveis from "../components/MapaImoveis";
import MapaMobile from "../components/MapaMobile";
import Banner from "../components/Banner";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const sp = searchParams || {};
  const tipoNome = { casa: "Casas", apartamento: "Apartamentos", terreno: "Terrenos", comercial: "Imóveis comerciais", rural: "Imóveis rurais", lancamento: "Lançamentos" }[sp.tipo] || "Imóveis";
  const negocio = sp.negocio === "locacao" ? " para alugar" : sp.negocio === "venda" ? " à venda" : "";
  const cidade = sp.cidade || "Jales e região";
  const title = `${tipoNome}${negocio} em ${cidade} | Acholar`;
  const description = `Encontre ${tipoNome.toLowerCase()}${negocio} em ${cidade}. Todos os imóveis das imobiliárias da região reunidos num só lugar.`;
  return { title, description, alternates: { canonical: "/imoveis" } };
}

function limpa(txt) {
  return (txt || "").replace(/[%,()]/g, "").trim();
}

const POR_PAGINA = 20;

async function buscar(sp, page) {
  const negocio = sp.negocio || "";
  const tipo = sp.tipo || "";
  const cidade = sp.cidade || "";
  const q = limpa(sp.q);
  const precoMax = sp.precoMax ? Number(sp.precoMax) : null;
  const quartos = sp.quartos ? Number(sp.quartos) : null;
  const ordenar = sp.ordenar || "recentes";

  try {
    const supabase = createClient();
    let query = supabase.from("imoveis").select("*", { count: "exact" }).eq("status", "publicado");

    if (negocio) query = query.eq("tipo_negocio", negocio);
    if (tipo) query = query.eq("tipo_imovel", tipo);
    if (cidade) query = query.eq("cidade", cidade);
    if (q) query = query.or(`bairro.ilike.%${q}%,cidade.ilike.%${q}%,titulo.ilike.%${q}%`);
    if (precoMax) query = query.lte("preco", precoMax);
    if (quartos) query = query.gte("quartos", quartos);

    if (ordenar === "menor") query = query.order("preco", { ascending: true });
    else if (ordenar === "maior") query = query.order("preco", { ascending: false });
    else query = query.order("criado_em", { ascending: false });

    const from = (page - 1) * POR_PAGINA;
    const { data, count } = await query.range(from, from + POR_PAGINA - 1);
    return { data: data || [], count: count || 0 };
  } catch {
    return { data: [], count: 0 };
  }
}

// Monta a URL de uma página preservando os filtros atuais.
function urlPagina(sp, p) {
  const params = new URLSearchParams();
  ["q", "cidade", "negocio", "tipo", "quartos", "precoMax", "ordenar"].forEach((k) => {
    if (sp[k]) params.set(k, sp[k]);
  });
  if (p > 1) params.set("page", String(p));
  const qs = params.toString();
  return `/imoveis${qs ? `?${qs}` : ""}`;
}

// Lista as cidades que realmente têm imóveis publicados (para o filtro).
async function getCidades() {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("imoveis").select("cidade").eq("status", "publicado");
    return [...new Set((data || []).map((d) => d.cidade).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  } catch {
    return [];
  }
}

export default async function Busca({ searchParams }) {
  const sp = searchParams || {};
  const page = Math.max(1, Number(sp.page) || 1);
  const [{ data: imoveis, count }, cidades] = await Promise.all([buscar(sp, page), getCidades()]);
  const totalPaginas = Math.max(1, Math.ceil(count / POR_PAGINA));

  return (
    <>
      <SiteHeader />

      <div className="results-top">
        <div className="wrap">
          <form className="filterbar" action="/imoveis" method="get">
            <div className="fb wide">
              <label>Onde</label>
              <input name="q" defaultValue={sp.q || ""} placeholder="Bairro ou palavra-chave" />
            </div>
            <div className="fb">
              <label>Cidade</label>
              <select name="cidade" defaultValue={sp.cidade || ""}>
                <option value="">Todas as cidades</option>
                {cidades.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="fb">
              <label>Negócio</label>
              <select name="negocio" defaultValue={sp.negocio || ""}>
                <option value="">Comprar ou alugar</option>
                <option value="venda">Comprar</option>
                <option value="locacao">Alugar</option>
              </select>
            </div>
            <div className="fb">
              <label>Tipo</label>
              <select name="tipo" defaultValue={sp.tipo || ""}>
                <option value="">Qualquer</option>
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="terreno">Terreno</option>
                <option value="comercial">Comercial</option>
                <option value="rural">Rural</option>
                <option value="lancamento">Lançamento</option>
              </select>
            </div>
            <div className="fb">
              <label>Quartos (mín.)</label>
              <select name="quartos" defaultValue={sp.quartos || ""}>
                <option value="">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div className="fb">
              <label>Preço até</label>
              <select name="precoMax" defaultValue={sp.precoMax || ""}>
                <option value="">Sem limite</option>
                <option value="200000">R$ 200 mil</option>
                <option value="400000">R$ 400 mil</option>
                <option value="600000">R$ 600 mil</option>
                <option value="1000000">R$ 1 milhão</option>
              </select>
            </div>
            <div className="fb">
              <label>Ordenar</label>
              <select name="ordenar" defaultValue={sp.ordenar || "recentes"}>
                <option value="recentes">Mais recentes</option>
                <option value="menor">Menor preço</option>
                <option value="maior">Maior preço</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Buscar</button>
          </form>
        </div>
      </div>

      <Banner espaco="resultados-topo" />

      <div className="wrap">
        <div className="rhead">
          <h1>Imóveis em Jales e região</h1>
          <div className="count">{count} {count === 1 ? "imóvel encontrado" : "imóveis encontrados"}</div>
        </div>

        <div className="busca-layout">
          <div className="busca-list">
            {imoveis.length > 0 ? (
              imoveis.map((im) => <ImovelCard key={im.id} imovel={im} />)
            ) : (
              <div className="empty">Nenhum imóvel encontrado com esses filtros. Tente ampliar a busca.</div>
            )}
          </div>
          <div className="busca-map">
            <MapaImoveis imoveis={imoveis} />
          </div>
        </div>

        {totalPaginas > 1 ? (
          <div className="pager">
            {page > 1 ? (
              <a className="btn btn-ghost" href={urlPagina(sp, page - 1)}>← Anterior</a>
            ) : (
              <span className="btn btn-ghost pager-off">← Anterior</span>
            )}
            <span className="pager-info">Página {page} de {totalPaginas}</span>
            {page < totalPaginas ? (
              <a className="btn btn-ghost" href={urlPagina(sp, page + 1)}>Próxima →</a>
            ) : (
              <span className="btn btn-ghost pager-off">Próxima →</span>
            )}
          </div>
        ) : null}
      </div>

      {imoveis.length > 0 ? <MapaMobile imoveis={imoveis} /> : null}

      <SiteFooter />
    </>
  );
}
