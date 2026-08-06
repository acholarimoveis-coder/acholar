// Página inicial (Home) — versão inicial do Sprint 0.
// Nos próximos sprints, os imóveis em destaque virão do banco (Supabase).

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="wrap nav">
          <a className="logo" href="/">
            <svg className="mark" viewBox="0 0 40 40" fill="none">
              <path d="M20 4 L34 15 V34 a2 2 0 0 1-2 2 H8 a2 2 0 0 1-2-2 V15 Z" fill="#0E7A6E" />
              <path d="M20 4 L34 15 V20 C30 17 25 16 20 16 S10 17 6 20 V15 Z" fill="#0F1B2D" />
              <circle cx="20" cy="26" r="4.5" fill="#fff" />
            </svg>
            Acholar
          </a>
          <nav className="nav-links">
            <a href="/comprar">Comprar</a>
            <a href="/alugar">Alugar</a>
            <a href="/rural">Rural</a>
            <a href="/lancamentos">Lançamentos</a>
          </nav>
          <div className="nav-spacer" />
          <a className="btn btn-ghost" href="/anuncie">Anuncie seu imóvel</a>
          <a className="btn btn-primary" href="/entrar">Entrar</a>
        </div>
      </header>

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "100px 0 80px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(120deg,#0A5E55,#0F1B2D)" }}>
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.28 }}
          />
        </div>
        <div className="wrap" style={{ position: "relative", zIndex: 1, maxWidth: 850 }}>
          <span
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,.15)",
              color: "#EAF6F4",
              fontWeight: 700,
              fontSize: ".82rem",
              padding: "7px 15px",
              borderRadius: 999,
              marginBottom: 20,
            }}
          >
            📍 Imóveis de toda a região de Jales, num lugar só
          </span>
          <h1 style={{ fontSize: "clamp(2.2rem,5vw,3.6rem)", lineHeight: 1.07, fontWeight: 700, letterSpacing: "-.02em" }}>
            Achar o seu <span style={{ color: "#5FE0CE" }}>lar</span>
            <br />
            nunca foi tão simples
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#D3E4E1", margin: "18px auto 0", maxWidth: 560 }}>
            Reunimos os imóveis de todas as imobiliárias da região. Encontre, compare e fale direto com quem anuncia.
          </p>
        </div>
      </section>

      <section className="wrap" style={{ padding: "56px 0" }}>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
            padding: 28,
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>🚧 Portal em construção — Fase 1</h2>
          <p style={{ color: "var(--muted)", fontWeight: 600, marginTop: 8, maxWidth: 620, marginInline: "auto" }}>
            Esta é a fundação do Acholar rodando em Next.js. Nos próximos passos, ligamos o banco de dados
            (Supabase), a busca de imóveis e os painéis. O visual segue os mockups já aprovados.
          </p>
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span>© 2026 Acholar · Jales / SP</span>
          <span>
            Site criado por{" "}
            <a href="https://www.franmacomunicacao.com.br/criacao-de-sites" target="_blank" rel="noopener" style={{ color: "#38C6B4", fontWeight: 700 }}>
              Franma Comunicação
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}
