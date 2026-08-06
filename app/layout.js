import "./globals.css";

export const metadata = {
  title: "Acholar — Imóveis à venda e para alugar em Jales e região",
  description:
    "Encontre casas, apartamentos, terrenos e imóveis rurais em Jales e região. Todos os imóveis das imobiliárias num só lugar.",
  metadataBase: new URL("https://acholar.com.br"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
