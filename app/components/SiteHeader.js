export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap nav">
        <a className="logo" href="/">
          <img src="/logo-claro.png" alt="Acholar" style={{ height: 34, width: "auto", display: "block" }} />
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
