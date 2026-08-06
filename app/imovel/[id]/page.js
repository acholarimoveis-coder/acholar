import { createClient } from "@/lib/supabase/server";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import ContactForm from "./ContactForm";
import { formatPreco, FOTO_PLACEHOLDER } from "@/lib/format";

export const dynamic = "force-dynamic";

async function getImovel(id) {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("imoveis")
      .select("*, imobiliaria:imobiliarias(*)")
      .eq("id", id)
      .eq("status", "publicado")
      .single();
    return data || null;
  } catch {
    return null;
  }
}

const Bed = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 14h18M6 10V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" /></svg>);
const Bath = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M6 12V6a2 2 0 0 1 4 0" /></svg>);
const Car = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13v5h-2v-2H7v2H5z" /></svg>);
const AreaI = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v16H4z" /><path d="M4 9h4M4 15h4M9 4v4M15 4v4" /></svg>);

export default async function ImovelPage({ params }) {
  const imovel = await getImovel(params.id);

  if (!imovel) {
    return (
      <>
        <SiteHeader />
        <div className="wrap" style={{ padding: "80px 0", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.6rem" }}>Imóvel não encontrado</h1>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>Ele pode ter sido removido ou despublicado.</p>
          <a className="btn btn-primary" href="/imoveis" style={{ marginTop: 18 }}>Ver outros imóveis</a>
        </div>
        <SiteFooter />
      </>
    );
  }

  const fotos = (imovel.fotos && imovel.fotos.length ? imovel.fotos : [FOTO_PLACEHOLDER]);
  const locacao = imovel.tipo_negocio === "locacao";
  const specs = [
    imovel.quartos ? { ic: <Bed />, b: imovel.quartos, s: "Quartos" } : null,
    imovel.banheiros ? { ic: <Bath />, b: imovel.banheiros, s: "Banheiros" } : null,
    imovel.vagas ? { ic: <Car />, b: imovel.vagas, s: "Vagas" } : null,
    imovel.area_util ? { ic: <AreaI />, b: `${imovel.area_util}m²`, s: "Área útil" } : null,
  ].filter(Boolean);

  return (
    <>
      <SiteHeader />
      <div className="wrap">
        <div className="crumb">
          <a href="/">Início</a> › <a href="/imoveis">Imóveis</a> › <span>{imovel.bairro}</span>
        </div>

        <div className="det-head">
          <h1>{imovel.titulo}</h1>
          <div className="det-loc">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
            {imovel.endereco ? `${imovel.endereco} — ` : ""}{imovel.bairro}, {imovel.cidade}
          </div>
          <div className="det-price">{formatPreco(imovel.preco, imovel.tipo_negocio)}</div>
        </div>

        <div className="gallery-main">
          <img src={fotos[0]} alt={imovel.titulo} />
        </div>
        {fotos.length > 1 ? (
          <div className="gallery-thumbs">
            {fotos.slice(1, 5).map((f, i) => (<img key={i} src={f} alt="" />))}
          </div>
        ) : null}

        <div className="det-grid">
          <div>
            {specs.length > 0 ? (
              <div className="specs-bar">
                {specs.map((sp, i) => (
                  <div className="spec-box" key={i}>
                    {sp.ic}
                    <div><b>{sp.b}</b><span>{sp.s}</span></div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="det-block">
              <h2>Sobre o imóvel</h2>
              <p>{imovel.descricao || "Sem descrição informada."}</p>
            </div>

            <div className="det-block">
              <h2>Detalhes</h2>
              <p>
                Tipo: {imovel.tipo_imovel} · Negócio: {locacao ? "Locação" : "Venda"}
                {imovel.iptu ? ` · IPTU: ${formatPreco(imovel.iptu)}` : ""}
                {imovel.condominio ? ` · Condomínio: ${formatPreco(imovel.condominio)}` : ""}
              </p>
            </div>
          </div>

          <aside>
            <ContactForm imovel={imovel} imobiliaria={imovel.imobiliaria} />
          </aside>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
