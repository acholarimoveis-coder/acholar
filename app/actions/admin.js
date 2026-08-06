"use server";
import { getSessao } from "@/lib/painel";

async function comoAdmin() {
  const s = await getSessao();
  if (!s.user || s.profile?.papel !== "admin") return null;
  return s;
}

// Aprovar / reprovar / pausar um imóvel
export async function moderarImovel(id, novoStatus) {
  const s = await comoAdmin();
  if (!s) return { ok: false, error: "Sem permissão." };
  const { error } = await s.supabase.from("imoveis").update({ status: novoStatus }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Aprovar uma imobiliária (inicia o teste de 90 dias)
export async function aprovarImobiliaria(id) {
  const s = await comoAdmin();
  if (!s) return { ok: false, error: "Sem permissão." };
  const hoje = new Date();
  const vig = new Date();
  vig.setDate(vig.getDate() + 90);
  const { error } = await s.supabase
    .from("imobiliarias")
    .update({
      status: "teste",
      data_inicio_teste: hoje.toISOString().slice(0, 10),
      data_vigencia: vig.toISOString().slice(0, 10),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Atualizar campos da imobiliária (status, plano, vigência, destaques contratados)
export async function atualizarImobiliaria(id, campos) {
  const s = await comoAdmin();
  if (!s) return { ok: false, error: "Sem permissão." };
  const permitido = {};
  ["status", "plano_id", "data_vigencia", "destaques_contratados"].forEach((k) => {
    if (campos[k] !== undefined) permitido[k] = campos[k];
  });
  const { error } = await s.supabase.from("imobiliarias").update(permitido).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
