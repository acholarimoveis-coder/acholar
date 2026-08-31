import { createClient } from "@/lib/supabase/server";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import ImovelCard from "./components/ImovelCard";
import Banner from "./components/Banner";
import { formatPreco, FOTO_PLACEHOLDER, iniciais } from "@/lib/format";

export const dynamic = "force-dynamic";

async function getDestaques() {
  const TOTAL = 6;
  try {
    const supabase = createClient();
    // 1º) imóveis com destaque pago
    const { data: pagos } = await supabase
      .from("imoveis")
      .select("*")
      .eq("status", "publicado")
      .eq("destaque_ativo", true)
      .limit(TOTAL);
    let lista = pagos || [];
    // 2º/3º) completa os slots vazios com imóveis aleatórios
    if (lista.length < TOTAL) {
      const { data: outros } = await supabase
        .from("imoveis")
        .select("*")
        .eq("status", "publicado")
        .limit(40);
      const jaTem = new Set(lista.map((i) => i.id));
      const aleatorios = (outros || [])
        .filter((i) => !jaTem.has(i.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, TOTAL - lista.length);
      lista = [...lista, ...aleatorios];
    }
    return lista;
  } catch {
    return [];
  }
}

// Cidades que têm imóveis publicados, com a contagem — para a seção "Explore por cidade".
async function getCidades() {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("imoveis").select("cidade").eq("status", "publicado");
    const cont = {};
    (data || []).forEach((d) => {
      if (d.cidade) cont[d.cidade] = (cont[d.cidade] || 0) + 1;
    });
    return Object.entries(cont)
      .map(([cidade, total]) => ({ cidade, total }))
      .sort((a, b) => b.total - a.total);
  } catch {
    return [];
  }
}

// Imobiliárias marcadas como destaque pelo admin + os 3 imóveis mais visitados de cada uma.
async function getImobsDestaque() {
  try {
    const supabase = createClient();
    const { data: imobs } = await supabase
      .from("imobiliarias")
      .select("id, nome, cidade, logo_url")
      .eq("destaque_home", true)
      .in("status", ["teste", "ativa", "tolerancia"])
      .limit(4);
    if (!imobs || !imobs.length) return [];
    const out = [];
    for (const im of imobs) {
      const { data: tops } = await supabase
        .from("imoveis")
        .select("id, titulo, preco, tipo_negocio, fotos, bairro")
        .eq("imobiliaria_id", im.id)
        .eq("status", "publicado")
        .order("visitas", { ascending: false })
        .limit(3);
      out.push({ ...im, tops: tops || [] });
    }
    return out.filter((im) => im.tops.length > 0);
  } catch {
    return [];
  }
}

const categorias = [
  { tipo: "casa", nome: "Casas", d: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { tipo: "apartamento", nome: "Apartamentos", d: "M5 3h14v18H5zM9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" },
  { tipo: "terreno", nome: "Terrenos", d: "M4 20h16M6 20V9l6-4 6 4v11" },
  { tipo: "comercial", nome: "Comercial", d: "M3 21h18M5 21V7l7-4 7 4v14" },
  { tipo: "rural", nome: "Rural", d: "M3 20h18M4 20v-6l4-3 4 3M12 14l4-3 4 3v6" },
  { tipo: "lancamento", nome: "Lançamentos", d: "M4 21V8l8-5 8 5v13M9 21v-8h6v8" },
];

export default async function Home() {
  const [destaques, cidades, imobsDestaque] = await Promise.all([getDestaques(), getCidades(), getImobsDestaque()]);

  return (
    <>
      <SiteHeader />

      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" alt="" />
        </div>
        <div className="wrap hero-inner">
          <span className="eyebrow">📍 Imóveis de toda a região de Jales, num lugar só</span>
          <h1>Achar o seu <em>lar</em><br />nunca foi tão simples</h1>
          <p className="sub">Reunimos os imóveis de todas as imobiliárias da região. Encontre, compare e fale direto com quem anuncia.</p>

          <form className="search" action="/imoveis" method="get">
            <div className="search-row">
              <div className="field">
                <label>Onde</label>
                <input name="q" placeholder="Cidade ou bairro — ex.: Centro, Jales" />
              </div>
              <div className="field">
                <label>Negócio</label>
                <select name="negocio" defaultValue="">
                  <option value="">Comprar ou alugar</option>
                  <option value="venda">Comprar</option>
                  <option value="locacao">Alugar</option>
                </select>
              </div>
              <div className="field">
                <label>Tipo</label>
                <select name="tipo" defaultValue="">
                  <option value="">Qualquer tipo</option>
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="terreno">Terreno</option>
                  <option value="comercial">Comercial</option>
                  <option value="rural">Rural</option>
                </select>
              </div>
              <button className="search-btn" type="submit">Buscar</button>
            </div>
          </form>
        </div>
      </section>

      <Banner espaco="home-topo" />

      <section className="wrap">
        <div className="sec-head">
          <h2>Explore por tipo de imóvel</h2>
          <p>Do apartamento no centro ao sítio na zona rural.</p>
        </div>
        <div className="cats">
          {categorias.map((c) => (
            <a key={c.tipo} className="cat" href={`/imoveis?tipo=${c.tipo}`}>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={c.d} /></svg>
              <b>{c.nome}</b>
            </a>
          ))}
        </div>
      </section>

      {cidades.length > 1 ? (
        <section className="wrap">
          <div className="sec-head">
            <h2>Explore por cidade</h2>
            <p>Imóveis de Jales e das cidades vizinhas, num só lugar.</p>
          </div>
          <div className="cidades-grid">
            {cidades.map((c) => (
              <a key={c.cidade} className="cidade-chip" href={`/imoveis?cidade=${encodeURIComponent(c.cidade)}`}>
                <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
                <b>{c.cidade}</b>
                <span>{c.total} {c.total === 1 ? "imóvel" : "imóveis"}</span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="wrap" style={{ paddingTop: 16 }}>
        <div className="feat-head">
          <div className="sec-head" style={{ margin: 0 }}>
            <h2>Imóveis em destaque</h2>
            <p>Selecionados das imobiliárias parceiras da região.</p>
          </div>
          <a className="btn btn-ghost" href="/imoveis">Ver todos os imóveis</a>
        </div>
        <div className="grid">
          {destaques.length > 0 ? (
            destaques.map((im) => <ImovelCard key={im.id} imovel={im} />)
          ) : (
            <div className="empty">Em breve, novos imóveis em destaque por aqui.</div>
          )}
        </div>
      </section>

      {imobsDestaque.length > 0 ? (
        <section className="wrap" style={{ paddingTop: 8 }}>
          <div className="sec-head">
            <h2>Imobiliárias em destaque</h2>
            <p>Parceiras da região e alguns dos imóveis mais procurados de cada uma.</p>
          </div>
          <div className="imobd-grid">
            {imobsDestaque.map((im) => (
              <div key={im.id} className="imobd-card">
                <div className="imobd-side">
                  <a className="imobd-head" href={`/imobiliaria/${im.id}`}>
                    <div className="imobd-logo">
                      {im.logo_url ? <img src={im.logo_url} alt="" /> : <span>{iniciais(im.nome)}</span>}
                    </div>
                    <div className="imobd-info">
                      <b>{im.nome}</b>
                      <span>{im.cidade || "Jales"}</span>
                    </div>
                  </a>
                  <a className="btn btn-ghost imobd-cta" href={`/imobiliaria/${im.id}`}>Ver todos os imóveis</a>
                </div>
                <div className="imobd-imoveis">
                  {im.tops.map((t) => (
                    <a key={t.id} className="imobd-mini" href={`/imovel/${t.id}`} title={t.titulo}>
                      <img src={(t.fotos && t.fotos[0]) || FOTO_PLACEHOLDER} alt="" loading="lazy" />
                      <span className="p">{formatPreco(t.preco, t.tipo_negocio)}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Banner espaco="home-retangulo" />

      <section>
        <div className="why">
          <div className="wrap">
            <div className="sec-head"><h2>Por que usar o Acholar</h2><p>Feito pra quem é da região — e conhece a região.</p></div>
            <div className="why-grid">
              <div className="why-card"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg><h3>Tudo num lugar só</h3><p>Os imóveis de todas as imobiliárias reunidos. Você busca uma vez e compara tudo.</p></div>
              <div className="why-card"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 20h18M4 20v-6l4-3 4 3M12 14l4-3 4 3v6" /></svg><h3>Forte em imóvel rural</h3><p>Sítios, chácaras e fazendas que os portais nacionais quase não mostram.</p></div>
              <div className="why-card"><svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg><h3>Fale direto com a imobiliária</h3><p>Gostou de um imóvel? Fale na hora, por WhatsApp, com quem cuida dele.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="imob-cta" style={{ paddingTop: 0 }}>
        <div className="imob-box">
          <div className="txt">
            <h2>Tem uma imobiliária na região?</h2>
            <p>Coloque seus imóveis no Acholar e alcance quem está procurando agora. Integração automática com seu sistema, trabalho zero.</p>
          </div>
          <a className="btn btn-white" href="/anuncie">Anunciar meus imóveis</a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
