"use server";
import { getSessao } from "@/lib/painel";
import { parseXmlImoveis } from "@/lib/xml";

// Salva o link do XML da imobiliária
export async function salvarXmlUrl(url) {
  const { user, imob, supabase } = await getSessao();
  if (!user || !imob) return { ok: false, error: "Sessão expirada." };
  const { error } = await supabase.from("imobiliarias").update({ xml_url: url || null }).eq("id", imob.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Núcleo: lê o XML (string) e grava os imóveis (novos + atualizados)
async function processar(supabase, imob, xml) {
  let itens;
  try {
    itens = parseXmlImoveis(xml);
  } catch (e) {
    return { ok: false, error: "Erro ao ler o XML: " + (e?.message || "") };
  }
  if (!itens.length) return { ok: true, novos: 0, atualizados: 0, aviso: "Nenhum imóvel disponível encontrado no XML." };

  const { data: existentes } = await supabase
    .from("imoveis")
    .select("id, external_id")
    .eq("imobiliaria_id", imob.id)
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
      novos.push({ ...campos, imobiliaria_id: imob.id, origem: "xml", status: "publicado" });
    }
  }

  if (novos.length) {
    const { error } = await supabase.from("imoveis").insert(novos);
    if (error) return { ok: false, error: error.message };
  }
  return { ok: true, novos: novos.length, atualizados, total: itens.length };
}

// Baixa o XML de uma URL e sincroniza
export async function sincronizarXML() {
  const { user, imob, supabase } = await getSessao();
  if (!user || !imob) return { ok: false, error: "Sessão expirada." };
  if (!imob.xml_url) return { ok: false, error: "Configure o link do XML primeiro." };

  let xml;
  try {
    const resp = await fetch(imob.xml_url, { cache: "no-store" });
    if (!resp.ok) return { ok: false, error: `Não consegui baixar o XML (código ${resp.status}).` };
    xml = await resp.text();
  } catch (e) {
    return { ok: false, error: "Erro ao baixar o XML: " + (e?.message || "") };
  }
  return processar(supabase, imob, xml);
}

// Importa a partir do conteúdo do XML colado (para testes / CRMs que só dão arquivo)
export async function sincronizarXMLTexto(xmlTexto) {
  const { user, imob, supabase } = await getSessao();
  if (!user || !imob) return { ok: false, error: "Sessão expirada." };
  if (!xmlTexto || xmlTexto.trim().length < 20) return { ok: false, error: "Cole o conteúdo do XML." };
  return processar(supabase, imob, xmlTexto);
}
