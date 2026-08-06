import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Quem somos — Acholar",
  description: "O Acholar reúne os imóveis de todas as imobiliárias da região de Jales num só lugar.",
};

export default function QuemSomos() {
  return (
    <>
      <SiteHeader />
      <section className="inst-hero">
        <div className="wrap">
          <span className="eyebrow">Sobre o Acholar</span>
          <h1>Reunimos a região de Jales<br />num <em>só lugar</em></h1>
          <p>Para você achar seu lar mais rápido — e falar direto com quem anuncia.</p>
        </div>
      </section>

      <section className="wrap">
        <div className="prose">
          <h2>Nossa história</h2>
          <p>Tudo começou com uma inquietação simples: por que quem procura um imóvel em Jales precisa visitar o site de cada imobiliária, um por um, para só então comparar? A informação estava espalhada, e a busca virava um trabalho cansativo.</p>
          <p>Foi daí que veio o Acholar. Reunimos, num único portal, os imóveis de todas as imobiliárias da região — venda, locação, rural e lançamentos — com uma busca simples e contato direto com quem anuncia.</p>

          <h2>No que acreditamos</h2>
          <p><strong>Proximidade regional.</strong> Somos daqui e para daqui. Conhecemos os bairros, as pessoas e o mercado da região.</p>
          <p><strong>Transparência.</strong> Informações claras e anúncios sempre atualizados, direto da fonte das imobiliárias.</p>
          <p><strong>Parceria com as imobiliárias.</strong> Crescemos junto. Quanto melhor for para elas, melhor será para todos.</p>
        </div>
      </section>

      <section className="wrap">
        <div className="imob-box">
          <div className="txt">
            <h2>Faça parte do Acholar</h2>
            <p>É de uma imobiliária da região? Coloque seus imóveis no portal e comece com 3 meses grátis.</p>
          </div>
          <a className="btn btn-white" href="/anuncie">Anunciar meus imóveis</a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
