const NOMES = {
  casa: "Casa",
  apartamento: "Apartamento",
  terreno: "Terreno",
  comercial: "Sala comercial",
  rural: "Chácara",
  lancamento: "Empreendimento",
};

// Gera o título no padrão do Acholar (tipo + quartos + negócio + bairro).
export function gerarTitulo({ tipo_imovel, quartos, tipo_negocio, bairro }) {
  let t = NOMES[tipo_imovel] || "Imóvel";
  const q = parseInt(quartos) || 0;
  if (q > 0) t += ` com ${q} quarto${q > 1 ? "s" : ""}`;
  t += tipo_negocio === "locacao" ? " para alugar" : " à venda";
  t += bairro ? ` no ${bairro}` : " em Jales";
  return t;
}
