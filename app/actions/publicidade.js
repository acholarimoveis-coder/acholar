"use server";
import { getSessao } from "@/lib/painel";

async function comoAdmin() {
  const s = await getSessao();
  if (!s.user || s.profile?.papel !== "admin") return null;
  return s;
}

export async function criarAnuncio(campos) {
  const s = await comoAdmin();
  if (!s) return { ok: false, error: "Sem permissão." };
  if (!campos.imagem_url) return { ok: false, error: "Envie a imagem do banner." };
  if (!campos.espaco) return { ok: false, error: "Escolha o espaço." };

  const novo = {
    anunciante: campos.anunciante || "Anunciante",
    tipo: campos.tipo || "parceiro",
    espaco: campos.espaco,
    imagem_url: campos.imagem_url,
    link: campos.link || null,
    inicio: campos.inicio || null,
    fim: campos.fim || null,
    valor: campos.valor ? Number(campos.valor) : null,
    status: campos.status || "ativo",
  };
  const { error } = await s.supabase.from("anuncios").insert(novo);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function alternarAnuncio(id, status) {
  const s = await comoAdmin();
  if (!s) return { ok: false, error: "Sem permissão." };
  const { error } = await s.supabase.from("anuncios").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function removerAnuncio(id) {
  const s = await comoAdmin();
  if (!s) return { ok: false, error: "Sem permissão." };
  const { error } = await s.supabase.from("anuncios").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
