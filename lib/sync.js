import { parseXmlImoveis } from "@/lib/xml";

// Importa/atualiza os imóveis de uma imobiliária a partir do XML (string).
export async function importarXmlParaImobiliaria(supabase, imobId, xml) {
  const itens = parseXmlImoveis(xml);
  if (!itens.length) return { novos: 0, atualizados: 0, total: 0 };

  const { data: existentes } = await supabase
    .from("imoveis")
    .select("id, external_id")
    .eq("imobiliaria_id", imobId)
    .eq("origem", "xml");
  const mapa = new Map((existentes || []).map((e) => [e.external_id, e.id]));

  const novos = [];
  let atualizados = 0;
  const agora = new Date().toISOString();

  for (const it of itens) {
    const campos = { ...it, atualizado_em: agora };
    if (it.external_id && mapa.has(it.external_id)) {
      await supabase.from("imoveis").update(campos).eq("id", mapa.get(it.external_id));
      atualizados++;
    } else {
      novos.push({ ...campos, imobiliaria_id: imobId, origem: "xml", status: "publicado" });
    }
  }
  if (novos.length) await supabase.from("imoveis").insert(novos);

  return { novos: novos.length, atualizados, total: itens.length };
}
