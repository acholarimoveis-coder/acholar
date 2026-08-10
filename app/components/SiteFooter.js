export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <a className="logo" href="/">
              <img src="/logo-escuro.png" alt="Acholar" style={{ height: 32, width: "auto", display: "block" }} />
            </a>
            <p className="foot-about">
              O portal de imóveis da região de Jales. Todos os imóveis das imobiliárias num só lugar.
            </p>
          </div>
          <div>
            <h4>Buscar</h4>
            <ul>
              <li><a href="/imoveis?negocio=venda">Comprar</a></li>
              <li><a href="/imoveis?negocio=locacao">Alugar</a></li>
              <li><a href="/imoveis?tipo=rural">Rural</a></li>
              <li><a href="/lancamentos">Lançamentos</a></li>
            </ul>
          </div>
          <div>
            <h4>Imobiliárias</h4>
            <ul>
              <li><a href="/imobiliarias">Busca por imobiliária</a></li>
              <li><a href="/anuncie">Anunciar imóveis</a></li>
              <li><a href="/entrar">Entrar</a></li>
            </ul>
          </div>
          <div>
            <h4>Acholar</h4>
            <ul>
              <li><a href="/quem-somos">Quem somos</a></li>
              <li><a href="/ajuda">Central de ajuda</a></li>
              <li><a href="/trabalhe">Trabalhe conosco</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Acholar · Jales / SP</span>
          <span>
            Site criado por{" "}
            <a href="https://www.franmacomunicacao.com.br/criacao-de-sites" target="_blank" rel="noopener" style={{ color: "#38C6B4", fontWeight: 700 }}>
              Franma Comunicação
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
