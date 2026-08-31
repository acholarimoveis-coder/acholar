import { parseXmlImoveis } from "@/lib/xml";

// Importa/atualiza os imóveis de uma imobiliária a partir do XML (string).
// origem: "cron" | "manual" | "cadastro" | "auto" (só para o log).
export async function importarXmlParaImobiliaria(supabase, imobId, xml, origem = "auto") {
  const itens = parseXmlImoveis(xml);
  // Guarda de segurança: XML vazio/ilegível NÃO mexe em nada (evita apagar tudo).
  if (!itens.length) return { novos: 0, atualizados: 0, removidos: 0, total: 0 };

  const { data: existentes } = await supabase
    .from("imoveis")
    .select("id, external_id, geo_travado, status")
    .eq("imobiliaria_id", imobId)
    .eq("origem", "xml");
  const mapa = new Map((existentes || []).map((e) => [e.external_id, e]));

  const novos = [];
  let atualizados = 0;
  const agora = new Date().toISOString();

  for (const it of itens) {
    const alvo = it.external_id ? mapa.get(it.external_id) : null;
    if (alvo) {
      const campos = { ...it, atualizado_em: agora };
      // Preserva a localização existente (manual ou aproximada por bairro) quando:
      //  - foi travada manualmente (geo_travado), ou
      //  - o XML não trouxe uma coordenada válida (evita apagar o que já temos).
      if (alvo.geo_travado || campos.lat == null || campos.lng == null) {
        delete campos.lat;
        delete campos.lng;
      }
      // Se o imóvel tinha saído do XML e voltou, republica.
      if (alvo.status === "removido") campos.status = "publicado";
      await supabase.from("imoveis").update(campos).eq("id", alvo.id);
      atualizados++;
    } else {
      const campos = { ...it, atualizado_em: agora };
      novos.push({ ...campos, imobiliaria_id: imobId, origem: "xml", status: "publicado" });
    }
  }
  if (novos.length) await supabase.from("imoveis").insert(novos);

  // Delisting: imóveis publicados que não vieram mais no XML saem do ar ("removido").
  const idsNoXml = new Set(itens.map((i) => i.external_id).filter(Boolean));
  const publicados = (existentes || []).filter((e) => e.status === "publicado");
  const paraRemover = publicados.filter((e) => e.external_id && !idsNoXml.has(e.external_id)).map((e) => e.id);
  let removidos = 0;
  // Trava de segurança: se o XML "removeria" mais de 70% do que está publicado,
  // é provável que o feed veio incompleto — não remove nada nesse caso.
  if (paraRemover.length && (publicados.length === 0 || paraRemover.length / publicados.length <= 0.7)) {
    await supabase.from("imoveis").update({ status: "removido" }).in("id", paraRemover);
    removidos = paraRemover.length;
  }

  // Registra no log (não interrompe a importação se falhar).
  try {
    await supabase.from("sync_log").insert({
      imobiliaria_id: imobId, origem, novos: novos.length, atualizados, removidos, total: itens.length,
    });
  } catch {}

  return { novos: novos.length, atualizados, removidos, total: itens.length };
}
