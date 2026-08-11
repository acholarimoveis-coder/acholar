export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/painel", "/admin", "/api", "/entrar"] }],
    sitemap: "https://acholar.com.br/sitemap.xml",
    host: "https://acholar.com.br",
  };
}
