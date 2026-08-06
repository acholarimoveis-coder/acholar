import { createClient } from "@/lib/supabase/server";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ImovelCard from "../components/ImovelCard";

export const dynamic = "force-dynamic";

async function getLancamentos() {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("imoveis")
      .select("*")
      .eq("status", "publicado")
      .eq("tipo_imovel", "lancamento")
      .order("criado_em", { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function Lancamentos() {
  const lancamentos = await getLancamentos();

  return (
    <>
      <SiteHeader />
      <div className="top-strip">
        <div className="wrap">
          <h1>Lançamentos e loteamentos na região</h1>
          <p>Condomínios fechados, loteamentos e novos empreendimentos das incorporadoras de Jales e região.</p>
        </div>
      </div>

      <div className="wrap">
        <section style={{ padding: "34px 0 20px" }}>
          <div className="grid">
            {lancamentos.length > 0 ? (
              lancamentos.map((im) => <ImovelCard key={im.id} imovel={im} />)
            ) : (
              <div className="empty">Ainda não há lançamentos publicados. Volte em breve.</div>
            )}
          </div>
        </section>

        <section className="imob-cta" style={{ padding: "0 0 60px" }}>
          <div className="imob-box">
            <div className="txt">
              <h2>É incorporadora ou loteadora?</h2>
              <p>Divulgue seu lançamento para milhares de pessoas procurando imóvel na região. Fale com a gente.</p>
            </div>
            <a className="btn btn-white" href="/anuncie">Anunciar meu lançamento</a>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
