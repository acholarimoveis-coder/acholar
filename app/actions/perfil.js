"use server";
import { getSessao } from "@/lib/painel";

// Normaliza o WhatsApp para o formato do wa.me (55 + DDD + número)
function normalizarWhatsapp(w) {
  let d = String(w || "").replace(/\D/g, "");
  if (!d) return null;
  if ((d.length === 10 || d.length === 11) && !d.startsWith("55")) d = "55" + d;
  return d;
}

export async function salvarPerfil(dados) {
  const { user, imob, supabase } = await getSessao();
  if (!user || !imob) return { ok: false, error: "Sessão expirada." };

  const campos = {};
  ["nome", "creci", "logo_url", "telefone", "email", "endereco", "bairro", "cidade", "site", "instagram", "descricao"].forEach((k) => {
    if (dados[k] !== undefined) campos[k] = dados[k] || null;
  });
  if (dados.whatsapp !== undefined) campos.whatsapp = normalizarWhatsapp(dados.whatsapp);

  const { error } = await supabase.from("imobiliarias").update(campos).eq("id", imob.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
