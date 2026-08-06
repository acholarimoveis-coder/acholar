"use server";
import { createClient } from "@/lib/supabase/server";
import { getSessao } from "@/lib/painel";
import { gerarTitulo } from "@/lib/titulo";

function num(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

// Liga/desliga o destaque de um imóvel, respeitando os slots contratados.
export async function alternarDestaque(imovelId, ligar) {
  try {
    const { user, imob, supabase } = await getSessao();
    if (!user || !imob) return { ok: false, error: "Sessão expirada." };

    if (ligar) {
      const { count } = await supabase
        .from("imoveis")
        .select("*", { count: "exact", head: true })
        .eq("imobiliaria_id", imob.id)
        .eq("destaque_ativo", true);
      if ((count || 0) >= (imob.destaques_contratados || 0)) {
        return { ok: false, error: "limite", limite: true };
      }
    }

    const { error } = await supabase
      .from("imoveis")
      .update({ destaque_ativo: ligar })
      .eq("id", imovelId)
      .eq("imobiliaria_id", imob.id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e?.message || "Erro." };
  }
}

export async function salvarImovel(dados) {
  try {
    const { user, imob, supabase } = await getSessao();
    if (!user || !imob) return { ok: false, error: "Sessão expirada. Entre novamente." };

    const registro = {
      imobiliaria_id: imob.id,
      tipo_negocio: dados.tipo_negocio || "venda",
      tipo_imovel: dados.tipo_imovel || "casa",
      titulo: gerarTitulo(dados),
      descricao: dados.descricao || null,
      preco: num(dados.preco),
      condominio: num(dados.condominio),
      iptu: num(dados.iptu),
      quartos: num(dados.quartos),
      suites: num(dados.suites),
      banheiros: num(dados.banheiros),
      vagas: num(dados.vagas),
      area_util: num(dados.area_util),
      area_total: num(dados.area_total),
      endereco: dados.endereco || null,
      bairro: dados.bairro || null,
      cidade: dados.cidade || "Jales",
      fotos: Array.isArray(dados.fotos) ? dados.fotos : [],
      origem: "manual",
      atualizado_em: new Date().toISOString(),
    };

    if (dados.id) {
      // Edição
      const { error } = await supabase.from("imoveis").update(registro).eq("id", dados.id).eq("imobiliaria_id", imob.id);
      if (error) return { ok: false, error: error.message };
      return { ok: true, id: dados.id };
    } else {
      // Novo — entra como "pendente" para moderação do admin
      registro.status = "pendente";
      const { data, error } = await supabase.from("imoveis").insert(registro).select("id").single();
      if (error) return { ok: false, error: error.message };
      return { ok: true, id: data.id };
    }
  } catch (e) {
    return { ok: false, error: e?.message || "Erro ao salvar." };
  }
}
