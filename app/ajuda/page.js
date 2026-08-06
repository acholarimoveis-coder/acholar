import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Central de ajuda — Acholar",
  description: "Tire suas dúvidas sobre o Acholar, o portal de imóveis da região de Jales.",
};

const faqs = [
  { q: "O que é o Acholar?", a: "É um portal que reúne, num só lugar, os imóveis de todas as imobiliárias da região de Jales. Em vez de procurar site por site, você faz uma busca única e compara tudo." },
  { q: "Preciso pagar para buscar imóveis?", a: "Não. Para quem procura um imóvel para comprar ou alugar, o Acholar é totalmente gratuito." },
  { q: "Como falo com a imobiliária de um imóvel?", a: "Na página de cada imóvel há um formulário de contato e um botão para falar direto no WhatsApp da imobiliária responsável." },
  { q: "Os imóveis estão sempre atualizados?", a: "Sim. Os anúncios são sincronizados com os sistemas das imobiliárias, então preço, fotos e disponibilidade ficam atualizados." },
  { q: "O Acholar é uma imobiliária?", a: "Não. O Acholar é um portal de anúncios. Toda negociação, visita e contrato acontece diretamente com a imobiliária que anuncia o imóvel." },
  { q: "Sou de uma imobiliária. Como anuncio?", a: "É simples: você vira parceiro e integra seus imóveis pelo XML do seu sistema (Kenlo, Microsistec, Universal...) ou cadastra manualmente. Comece com 3 meses grátis." },
];

export default function Ajuda() {
  const whats = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "").replace(/\D/g, "");
  return (
    <>
      <SiteHeader />
      <section className="inst-hero">
        <div className="wrap">
          <h1>Como podemos ajudar?</h1>
          <p>As dúvidas mais comuns de quem usa o Acholar.</p>
        </div>
      </section>

      <section className="wrap">
        <div className="faq">
          {faqs.map((f, i) => (
            <details key={i}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <div className="inst-center" style={{ marginTop: 34 }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>Não encontrou o que procurava?</h2>
          <p style={{ color: "var(--muted)", margin: "8px 0 16px" }}>Fale com a nossa equipe.</p>
          <a className="btn btn-primary" href={whats ? `https://wa.me/${whats}` : "#"} target="_blank" rel="noopener" style={{ background: "#25D366" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z" /></svg>
            Falar no WhatsApp
          </a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
