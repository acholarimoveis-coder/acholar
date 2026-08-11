// Formata preço em reais; acrescenta "/mês" quando é locação.
export function formatPreco(valor, negocio) {
  if (valor === null || valor === undefined) return "Consulte";
  const n = Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
  return negocio === "locacao" ? `${n}/mês` : n;
}

export const FOTO_PLACEHOLDER =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=70";

// Iniciais para o "avatar" quando não há logo (ex.: "Imobiliária Central" -> "IC").
export function iniciais(nome) {
  return (nome || "IM")
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
