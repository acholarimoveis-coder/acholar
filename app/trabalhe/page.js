import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Trabalhe conosco — Acholar",
  description: "Faça parte do time do Acholar.",
};

export default function Trabalhe() {
  const whats = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "").replace(/\D/g, "");
  return (
    <>
      <SiteHeader />
      <section className="inst-hero">
        <div className="wrap">
          <span className="eyebrow">Faça parte do time</span>
          <h1>Trabalhe conosco</h1>
          <p>Somos um time enxuto, apaixonado pela região de Jales e por resolver problemas de verdade.</p>
        </div>
      </section>

      <section className="wrap">
        <div className="inst-center">
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 16, padding: 40 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: 10 }}>No momento não temos vagas abertas</h2>
            <p style={{ color: "var(--muted)", marginBottom: 20 }}>
              Estamos começando e ainda não abrimos processos seletivos. Mas queremos te conhecer! Envie seu currículo — assim que surgir uma oportunidade com o seu perfil, entramos em contato.
            </p>
            <a className="btn btn-primary" href={whats ? `https://wa.me/${whats}?text=${encodeURIComponent("Olá! Gostaria de deixar meu currículo no banco de talentos do Acholar.")}` : "#"} target="_blank" rel="noopener">
              Enviar meu contato
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
