export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <a className="logo" href="/" style={{ color: "#fff" }}>
              <svg className="mark" viewBox="0 0 40 40" fill="none">
                <path d="M20 4 L34 15 V34 a2 2 0 0 1-2 2 H8 a2 2 0 0 1-2-2 V15 Z" fill="#fff" />
                <path d="M20 4 L34 15 V20 C30 17 25 16 20 16 S10 17 6 20 V15 Z" fill="#0E7A6E" />
                <circle cx="20" cy="26" r="4.5" fill="#0F1B2D" />
              </svg>
              Acholar
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
