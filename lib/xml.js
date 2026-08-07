import { XMLParser } from "fast-xml-parser";
import { gerarTitulo } from "@/lib/titulo";

const parser = new XMLParser({ ignoreAttributes: true, trimValues: true, parseTagValue: false });

// Mapeia o "Tipo" do CRM para os tipos do Acholar
const TIPO_MAP = {
  casa: "casa", sobrado: "casa", "casa de condominio": "casa", "casa em condominio": "casa", "casa comercial": "casa",
  apartamento: "apartamento", apto: "apartamento", kitnet: "apartamento", kitchenette: "apartamento", flat: "apartamento", studio: "apartamento", cobertura: "apartamento",
  terreno: "terreno", lote: "terreno", area: "terreno", loteamento: "terreno",
  salao: "comercial", sala: "comercial", "sala comercial": "comercial", comercial: "comercial", "ponto comercial": "comercial", loja: "comercial", galpao: "comercial", predio: "comercial", barracao: "comercial", escritorio: "comercial",
  chacara: "rural", sitio: "rural", fazenda: "rural", rancho: "rural", rural: "rural", "area rural": "rural",
};

function mapTipo(t) {
  const k = String(t || "").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return TIPO_MAP[k] || "casa";
}

// "R$ 350.000,00" -> 350000
function parseMoeda(s) {
  if (s === undefined || s === null || s === "") return null;
  const n = String(s).replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const v = parseFloat(n);
  return isNaN(v) ? null : v;
}

// "113,56" -> 113.56 ; "360" -> 360
function parseNum(s) {
  if (s === undefined || s === null || s === "") return null;
  const n = String(s).replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const v = parseFloat(n);
  return isNaN(v) ? null : v;
}

function parseInteiro(s) {
  if (s === undefined || s === null || s === "") return null;
  const n = parseInt(String(s).replace(/\D/g, ""), 10);
  return isNaN(n) ? null : n;
}

export function parseXmlImoveis(xmlString) {
  const doc = parser.parse(xmlString);
  let props = doc?.Properties?.Property;
  if (!props) return [];
  if (!Array.isArray(props)) props = [props];

  const out = [];
  for (const p of props) {
    const status = String(p.Status || "").trim().toLowerCase();
    if (status && status !== "livre") continue; // só imóveis disponíveis

    const venda = parseMoeda(p.ValorDeVenda);
    const locacao = parseMoeda(p.ValorDeLocacao);
    let tipo_negocio, preco;
    if (venda) { tipo_negocio = "venda"; preco = venda; }
    else if (locacao) { tipo_negocio = "locacao"; preco = locacao; }
    else continue; // sem preço -> pula

    const tipo_imovel = mapTipo(p.Tipo);
    const bairro = p.Bairro ? String(p.Bairro).trim() : null;
    const quartos = parseInteiro(p.Quartos);
    const cidade = p.CidadeEUF ? String(p.CidadeEUF).split("/")[0].trim() : "Jales";
    const externalId = p.Codigo != null && p.Codigo !== "" ? String(p.Codigo)
      : (p.CodigoAlternativo != null ? String(p.CodigoAlternativo) : null);

    out.push({
      external_id: externalId,
      tipo_negocio,
      tipo_imovel,
      preco,
      titulo: gerarTitulo({ tipo_imovel, quartos, tipo_negocio, bairro }),
      quartos,
      suites: parseInteiro(p.Suites),
      vagas: parseInteiro(p.VagasDeGaragem),
      area_util: parseNum(p.AreaUtil),
      area_total: parseNum(p.AreaTotal),
      endereco: p.Endereco ? String(p.Endereco).trim() : null,
      bairro,
      cidade,
    });
  }
  return out;
}
