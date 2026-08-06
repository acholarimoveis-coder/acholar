"use server";
import { createClient } from "@/lib/supabase/server";

// Grava um lead no banco (contato de um interessado num imóvel).
export async function criarLead(dados) {
  try {
    if (!dados?.nome || !dados?.telefone) {
      return { ok: false, error: "Informe nome e telefone." };
    }
    const supabase = createClient();
    const { error } = await supabase.from("leads").insert({
      imovel_id: dados.imovel_id || null,
      imobiliaria_id: dados.imobiliaria_id || null,
      nome: dados.nome,
      telefone: dados.telefone,
      email: dados.email || null,
      mensagem: dados.mensagem || null,
      canal: dados.canal || "formulario",
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e?.message || "Erro ao enviar." };
  }
}
