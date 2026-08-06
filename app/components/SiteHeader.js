export default function SiteHeader() {
  return (
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
          <a href="/imoveis?negocio=venda">Comprar</a>
          <a href="/imoveis?negocio=locacao">Alugar</a>
          <a href="/imoveis?tipo=rural">Rural</a>
          <a href="/lancamentos">Lançamentos</a>
        </nav>
        <div className="nav-spacer" />
        <a className="btn btn-ghost" href="/anuncie">Anuncie seu imóvel</a>
        <a className="btn btn-primary" href="/entrar">Entrar</a>
      </div>
    </header>
  );
}
