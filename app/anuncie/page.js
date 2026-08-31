import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Anuncie seus imóveis — Acholar",
  description: "Coloque os imóveis da sua imobiliária no Acholar e alcance quem procura na região de Jales.",
};

export default function Anuncie() {
  const whats = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "").replace(/\D/g, "");
  const waLink = whats ? `https://wa.me/${whats}?text=${encodeURIComponent("Olá! Quero anunciar os imóveis da minha imobiliária no Acholar.")}` : "#";

  return (
    <>
      <SiteHeader />
      <section className="inst-hero">
        <div className="wrap">
          <span className="eyebrow">Para imobiliárias</span>
          <h1>Coloque seus imóveis onde a região <em>procura</em></h1>
          <p>O Acholar reúne quem está buscando imóvel em Jales e região. Anuncie com trabalho zero e alcance mais compradores.</p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn btn-primary" href={waLink} target="_blank" rel="noopener" style={{ background: "#25D366" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z" /></svg>
              Falar no WhatsApp
            </a>
            <a className="btn btn-ghost" href="/entrar" style={{ color: "#fff", borderColor: "rgba(255,255,255,.5)" }}>Já sou parceiro</a>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="why-grid" style={{ marginTop: 0 }}>
          <div className="why-card" style={{ background: "#fff", border: "1px solid var(--line)", color: "var(--ink)" }}>
            <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--primary)" }}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>
            <h3 style={{ color: "var(--ink)" }}>Mais visibilidade</h3>
            <p style={{ color: "var(--muted)" }}>Seus imóveis aparecem para quem está procurando na região, num portal feito para Jales.</p>
          </div>
          <div className="why-card" style={{ background: "#fff", border: "1px solid var(--line)", color: "var(--ink)" }}>
            <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--primary)" }}><path d="M4 7V5a2 2 0 0 1 2-2h2M20 7V5a2 2 0 0 0-2-2h-2M8 12h8" /></svg>
            <h3 style={{ color: "var(--ink)" }}>Integração automática</h3>
            <p style={{ color: "var(--muted)" }}>Já usa um sistema (Kenlo, Microsistec, Universal...)? Basta o link do seu XML — trabalho zero.</p>
          </div>
          <div className="why-card" style={{ background: "#fff", border: "1px solid var(--line)", color: "var(--ink)" }}>
            <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ color: "var(--primary)" }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            <h3 style={{ color: "var(--ink)" }}>Contatos direto no WhatsApp</h3>
            <p style={{ color: "var(--muted)" }}>Cada interessado chega no seu WhatsApp e fica registrado no seu painel.</p>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="sec-head inst-center"><h2>Como funciona</h2></div>
        <div className="steps-grid">
          <div className="step-c"><div className="n">01</div><h3>Vira parceiro</h3><p>A gente cadastra sua imobiliária e libera seu acesso ao painel.</p></div>
          <div className="step-c"><div className="n">02</div><h3>Sobe seus imóveis</h3><p>Integra o XML do seu sistema ou cadastra manualmente pelo painel.</p></div>
          <div className="step-c"><div className="n">03</div><h3>Recebe contatos</h3><p>Os interessados falam com você por WhatsApp e formulário. Simples assim.</p></div>
        </div>
      </section>

      <section className="wrap">
        <div className="imob-box">
          <div className="txt">
            <h2>Pronto para começar?</h2>
            <p>Fale com a gente e coloque os imóveis da sua imobiliária no ar.</p>
          </div>
          <a className="btn btn-white" href={waLink} target="_blank" rel="noopener">Quero anunciar</a>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
