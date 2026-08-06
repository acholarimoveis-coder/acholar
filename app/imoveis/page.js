import { createClient } from "@/lib/supabase/server";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ImovelCard from "../components/ImovelCard";

export const dynamic = "force-dynamic";

function limpa(txt) {
  return (txt || "").replace(/[%,()]/g, "").trim();
}

async function buscar(sp) {
  const negocio = sp.negocio || "";
  const tipo = sp.tipo || "";
  const q = limpa(sp.q);
  const precoMax = sp.precoMax ? Number(sp.precoMax) : null;
  const quartos = sp.quartos ? Number(sp.quartos) : null;
  const ordenar = sp.ordenar || "recentes";

  try {
    const supabase = createClient();
    let query = supabase.from("imoveis").select("*", { count: "exact" }).eq("status", "publicado");

    if (negocio) query = query.eq("tipo_negocio", negocio);
    if (tipo) query = query.eq("tipo_imovel", tipo);
    if (q) query = query.or(`bairro.ilike.%${q}%,cidade.ilike.%${q}%,titulo.ilike.%${q}%`);
    if (precoMax) query = query.lte("preco", precoMax);
    if (quartos) query = query.gte("quartos", quartos);

    if (ordenar === "menor") query = query.order("preco", { ascending: true });
    else if (ordenar === "maior") query = query.order("preco", { ascending: false });
    else query = query.order("criado_em", { ascending: false });

    const { data, count } = await query.limit(60);
    return { data: data || [], count: count || 0 };
  } catch {
    return { data: [], count: 0 };
  }
}

export default async function Busca({ searchParams }) {
  const sp = searchParams || {};
  const { data: imoveis, count } = await buscar(sp);

  return (
    <>
      <SiteHeader />

      <div className="results-top">
        <div className="wrap">
          <form className="filterbar" action="/imoveis" method="get">
            <div className="fb wide">
              <label>Onde</label>
              <input name="q" defaultValue={sp.q || ""} placeholder="Cidade ou bairro" />
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

      <div className="wrap">
        <div className="rhead">
          <h1>Imóveis em Jales e região</h1>
          <div className="count">{count} {count === 1 ? "imóvel encontrado" : "imóveis encontrados"}</div>
        </div>

        <div className="grid" style={{ paddingBottom: 60 }}>
          {imoveis.length > 0 ? (
            imoveis.map((im) => <ImovelCard key={im.id} imovel={im} />)
          ) : (
            <div className="empty">
              Nenhum imóvel encontrado com esses filtros. Tente ampliar a busca.
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </>
  );
}
