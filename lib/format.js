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
