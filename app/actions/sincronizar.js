"use server";
import { getSessao } from "@/lib/painel";
import { importarXmlParaImobiliaria } from "@/lib/sync";

// Salva o link do XML da imobiliária
export async function salvarXmlUrl(url) {
  const { user, imob, supabase } = await getSessao();
  if (!user || !imob) return { ok: false, error: "Sessão expirada." };
  const { error } = await supabase.from("imobiliarias").update({ xml_url: url || null }).eq("id", imob.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Núcleo: usa a MESMA lógica protegida do robô diário (respeita localização
// travada/aproximada e não apaga coordenada quando o XML vem sem uma válida).
async function processar(supabase, imob, xml) {
  let r;
  try {
    r = await importarXmlParaImobiliaria(supabase, imob.id, xml, "manual");
  } catch (e) {
    return { ok: false, error: "Erro ao processar o XML: " + (e?.message || "") };
  }
  if (!r.total) return { ok: true, novos: 0, atualizados: 0, aviso: "Nenhum imóvel disponível encontrado no XML." };
  return { ok: true, ...r };
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
