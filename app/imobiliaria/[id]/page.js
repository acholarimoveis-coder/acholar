import { createClient } from "@/lib/supabase/server";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import ImovelCard from "../../components/ImovelCard";
import { iniciais } from "@/lib/painel";

export const dynamic = "force-dynamic";

async function getDados(id) {
  try {
    const supabase = createClient();
    const { data: imob } = await supabase.from("imobiliarias").select("*").eq("id", id).single();
    const { data: imoveis } = await supabase
      .from("imoveis")
      .select("*")
      .eq("imobiliaria_id", id)
      .eq("status", "publicado")
      .order("criado_em", { ascending: false });
    return { imob: imob || null, imoveis: imoveis || [] };
  } catch {
    return { imob: null, imoveis: [] };
  }
}

export default async function PerfilImobiliaria({ params }) {
  const { imob, imoveis } = await getDados(params.id);

  if (!imob) {
    return (
      <>
        <SiteHeader />
        <div className="wrap" style={{ padding: "80px 0", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem" }}>Imobiliária não encontrada</h1>
          <a className="btn btn-primary" href="/imobiliarias" style={{ marginTop: 16 }}>Ver imobiliárias</a>
        </div>
        <SiteFooter />
      </>
    );
  }

  const whats = (imob.whatsapp || "").replace(/\D/g, "");

  return (
    <>
      <SiteHeader />
      <div className="imob-cover" />
      <div className="wrap">
        <div className="imob-profile">
          <div className="iav" style={{ overflow: "hidden" }}>
            {imob.logo_url ? <img src={imob.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : iniciais(imob.nome)}
          </div>
          <div className="info">
            <h1>{imob.nome}</h1>
            <div className="sub">
              <span>{imob.creci ? `CRECI ${imob.creci}` : "Parceiro Acholar"}</span>
              <span>{imob.cidade || "Jales"}</span>
              <span>{imoveis.length} imóveis</span>
            </div>
          </div>
          {whats ? (
            <a className="btn btn-primary" href={`https://wa.me/${whats}`} target="_blank" rel="noopener">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z" /></svg>
              Falar no WhatsApp
            </a>
          ) : null}
        </div>

        <section style={{ padding: "34px 0 60px" }}>
          <div className="sec-head" style={{ marginBottom: 20 }}><h2>Imóveis desta imobiliária</h2></div>
          <div className="grid">
            {imoveis.length > 0 ? (
              imoveis.map((im) => <ImovelCard key={im.id} imovel={im} />)
            ) : (
              <div className="empty">Esta imobiliária ainda não tem imóveis publicados.</div>
            )}
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
