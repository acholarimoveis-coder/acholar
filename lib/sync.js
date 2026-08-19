import { parseXmlImoveis } from "@/lib/xml";

// Importa/atualiza os imóveis de uma imobiliária a partir do XML (string).
export async function importarXmlParaImobiliaria(supabase, imobId, xml) {
  const itens = parseXmlImoveis(xml);
  if (!itens.length) return { novos: 0, atualizados: 0, total: 0 };

  const { data: existentes } = await supabase
    .from("imoveis")
    .select("id, external_id, geo_travado")
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
      await supabase.from("imoveis").update(campos).eq("id", alvo.id);
      atualizados++;
    } else {
      const campos = { ...it, atualizado_em: agora };
      novos.push({ ...campos, imobiliaria_id: imobId, origem: "xml", status: "publicado" });
    }
  }
  if (novos.length) await supabase.from("imoveis").insert(novos);

  return { novos: novos.length, atualizados, total: itens.length };
}
