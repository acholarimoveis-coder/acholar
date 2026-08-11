import { XMLParser } from "fast-xml-parser";
import { gerarTitulo } from "@/lib/titulo";

const parser = new XMLParser({ ignoreAttributes: true, trimValues: true, parseTagValue: false });

/* ---------- helpers de valores ---------- */

// "R$ 350.000,00" -> 350000  (formato brasileiro)
function moedaBR(s) {
  if (s === undefined || s === null || s === "") return null;
  const n = String(s).replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const v = parseFloat(n);
  return isNaN(v) || v === 0 ? (v === 0 ? 0 : null) : v;
}
// número "cru" (3500, 113.56) — padrão internacional
function numRaw(s) {
  if (s === undefined || s === null || s === "") return null;
  const v = parseFloat(String(s).replace(",", ".").replace(/[^\d.-]/g, ""));
  return isNaN(v) ? null : v;
}
// "113,56" -> 113.56 (report BR)
function areaBR(s) {
  if (s === undefined || s === null || s === "") return null;
  const v = parseFloat(String(s).replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, ""));
  return isNaN(v) ? null : v;
}
function inteiro(s) {
  if (s === undefined || s === null || s === "") return null;
  const n = parseInt(String(s).replace(/[^\d]/g, ""), 10);
  return isNaN(n) ? null : n;
}
function floatRaw(s) {
  if (s === undefined || s === null || s === "") return null;
  const v = parseFloat(String(s));
  return isNaN(v) ? null : v;
}
// Só aceita coordenada dentro do Brasil (descarta 0,0, invertida ou fora da faixa).
function geoBR(latRaw, lngRaw) {
  const la = floatRaw(latRaw), ln = floatRaw(lngRaw);
  if (la == null || ln == null) return { lat: null, lng: null };
  if (Math.abs(la) < 0.02 && Math.abs(ln) < 0.02) return { lat: null, lng: null };
  if (la >= -34 && la <= 6 && ln >= -74 && ln <= -32) return { lat: la, lng: ln };
  return { lat: null, lng: null };
}
function texto(s) {
  return s === undefined || s === null ? null : String(s).trim() || null;
}

/* ---------- mapeamento de tipos ---------- */

const TIPO_BR = {
  casa: "casa", sobrado: "casa", "casa de condominio": "casa", "casa em condominio": "casa",
  apartamento: "apartamento", apto: "apartamento", kitnet: "apartamento", flat: "apartamento", studio: "apartamento", cobertura: "apartamento",
  terreno: "terreno", lote: "terreno", area: "terreno", loteamento: "terreno",
  salao: "comercial", sala: "comercial", "sala comercial": "comercial", comercial: "comercial", "ponto comercial": "comercial", loja: "comercial", galpao: "comercial", predio: "comercial", barracao: "comercial", escritorio: "comercial",
  chacara: "rural", sitio: "rural", fazenda: "rural", rancho: "rural", rural: "rural",
};
function tipoBR(t) {
  const k = String(t || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return TIPO_BR[k] || "casa";
}
// Padrão ZAP: "Residential / Home", "Commercial / Office", "Residential / Land/Lot"...
function tipoZap(pt) {
  const s = String(pt || "").toLowerCase();
  if (s.includes("land") || s.includes("lot") || s.includes("terreno")) return "terreno";
  if (s.includes("farm") || s.includes("ranch") || s.includes("rural") || s.includes("agricult")) return "rural";
  if (s.includes("commercial") || s.includes("office") || s.includes("store") || s.includes("building") || s.includes("warehouse") || s.includes("industrial")) return "comercial";
  if (s.includes("apart") || s.includes("condo") || s.includes("flat") || s.includes("kitnet")) return "apartamento";
  return "casa";
}

/* ---------- formato 1: relatório <Properties><Property> ---------- */

function parseProperties(props) {
  if (!Array.isArray(props)) props = [props];
  const out = [];
  for (const p of props) {
    const status = String(p.Status || "").trim().toLowerCase();
    if (status && status !== "livre") continue;
    const venda = moedaBR(p.ValorDeVenda);
    const locacao = moedaBR(p.ValorDeLocacao);
    let tipo_negocio, preco;
    if (venda) { tipo_negocio = "venda"; preco = venda; }
    else if (locacao) { tipo_negocio = "locacao"; preco = locacao; }
    else continue;
    const tipo_imovel = tipoBR(p.Tipo);
    const bairro = texto(p.Bairro);
    const quartos = inteiro(p.Quartos);
    out.push({
      external_id: p.Codigo != null && p.Codigo !== "" ? String(p.Codigo) : (p.CodigoAlternativo != null ? String(p.CodigoAlternativo) : null),
      tipo_negocio, tipo_imovel, preco,
      titulo: gerarTitulo({ tipo_imovel, quartos, tipo_negocio, bairro }),
      quartos, suites: inteiro(p.Suites), vagas: inteiro(p.VagasDeGaragem),
      area_util: areaBR(p.AreaUtil), area_total: areaBR(p.AreaTotal),
      endereco: texto(p.Endereco), bairro,
      cidade: p.CidadeEUF ? String(p.CidadeEUF).split("/")[0].trim() : "Jales",
    });
  }
  return out;
}

/* ---------- formato 2: padrão ZAP / Canal Pro <Listing> ---------- */

function fotosDe(media) {
  let itens = media && media.Item;
  if (!itens) return [];
  if (!Array.isArray(itens)) itens = [itens];
  return itens.map((m) => (typeof m === "string" ? m : (m && m["#text"]) || "")).filter(Boolean);
}

function parseZap(listings) {
  if (!Array.isArray(listings)) listings = [listings];
  const out = [];
  for (const L of listings) {
    const d = L.Details || {};
    const loc = L.Location || {};
    const venda = numRaw(d.ListPrice);
    const locacao = numRaw(d.RentalPrice);
    let tipo_negocio, preco;
    if (venda) { tipo_negocio = "venda"; preco = venda; }
    else if (locacao) { tipo_negocio = "locacao"; preco = locacao; }
    else continue;
    const tipo_imovel = tipoZap(d.PropertyType);
    const bairro = texto(loc.Neighborhood || loc.Neigborhood);
    const quartos = inteiro(d.Bedrooms);
    out.push({
      external_id: L.ListingID != null ? String(L.ListingID) : null,
      tipo_negocio, tipo_imovel, preco,
      titulo: gerarTitulo({ tipo_imovel, quartos, tipo_negocio, bairro }),
      descricao: texto(d.Description),
      quartos, suites: inteiro(d.Suites), banheiros: inteiro(d.Bathrooms), vagas: inteiro(d.Garage),
      area_util: numRaw(d.LivingArea), area_total: numRaw(d.LotArea),
      condominio: numRaw(d.PropertyAdministrationFee), iptu: numRaw(d.YearlyTax),
      endereco: texto(loc.Address), bairro, cidade: texto(loc.City) || "Jales",
      ...geoBR(loc.Latitude, loc.Longitude),
      fotos: fotosDe(L.Media),
    });
  }
  return out;
}

/* ---------- detecção de formato ---------- */

export function parseXmlImoveis(xmlString) {
  const doc = parser.parse(xmlString);

  if (doc?.Properties?.Property) return parseProperties(doc.Properties.Property);

  const feed = doc?.ListingDataFeed || doc;
  const listings = feed?.Listings?.Listing || feed?.Listing || doc?.Listings?.Listing;
  if (listings) return parseZap(listings);

  return [];
}
