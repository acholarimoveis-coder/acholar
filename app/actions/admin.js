"use server";
import { getSessao } from "@/lib/painel";
import { createAdminClient } from "@/lib/supabase/admin";
import { importarXmlParaImobiliaria } from "@/lib/sync";

async function comoAdmin() {
  const s = await getSessao();
  if (!s.user || s.profile?.papel !== "admin") return null;
  return s;
}

// Cadastra uma imobiliária nova + o login de acesso ao painel (sem SQL).
export async function criarImobiliaria(campos) {
  const s = await comoAdmin();
  if (!s) return { ok: false, error: "Sem permissão." };

  const email = (campos.email || "").trim().toLowerCase();
  const senha = campos.senha || "";
  if (!campos.nome) return { ok: false, error: "Informe o nome da imobiliária." };
  if (!email || senha.length < 6) return { ok: false, error: "Informe e-mail e senha (mínimo 6 caracteres) para o login." };

  const admin = createAdminClient();
  const hoje = new Date();
  const vig = new Date();
  vig.setDate(vig.getDate() + 90);

  // 1) cria a imobiliária (status "teste" = 90 dias grátis)
  const { data: imob, error: e1 } = await admin
    .from("imobiliarias")
    .insert({
      nome: campos.nome,
      creci: campos.creci || null,
      cidade: campos.cidade || "Jales",
      whatsapp: campos.whatsapp || null,
      telefone: campos.telefone || null,
      email,
      xml_url: campos.xml_url || null,
      sistema: campos.sistema || null,
      status: "teste",
      data_inicio_teste: hoje.toISOString().slice(0, 10),
      data_vigencia: vig.toISOString().slice(0, 10),
    })
    .select("id")
    .single();
  if (e1) return { ok: false, error: "Erro ao criar a imobiliária: " + e1.message };

  // 2) cria o usuário de login
  const { data: u, error: e2 } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  });
  if (e2) {
    await admin.from("imobiliarias").delete().eq("id", imob.id); // desfaz para não deixar lixo
    return { ok: false, error: "Erro ao criar o login: " + e2.message };
  }

  // 3) liga o login à imobiliária
  const { error: e3 } = await admin.from("profiles").insert({
    id: u.user.id,
    nome: campos.nome,
    papel: "imobiliaria",
    imobiliaria_id: imob.id,
  });
  if (e3) return { ok: false, error: "Login criado, mas houve erro no perfil: " + e3.message };

  // 4) importa o XML na hora, se informado
  let sync = null;
  if (campos.xml_url) {
    try {
      const resp = await fetch(campos.xml_url);
      const xml = await resp.text();
      sync = await importarXmlParaImobiliaria(admin, imob.id, xml);
    } catch (err) {
      sync = { erro: err?.message || "Falha ao ler o XML." };
    }
  }

  return { ok: true, id: imob.id, sync };
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

// Salvar configurações (chave/valor) — ex.: WhatsApp e mensagem de cobrança
export async function salvarConfig(pares) {
  const s = await comoAdmin();
  if (!s) return { ok: false, error: "Sem permissão." };
  const rows = Object.entries(pares).map(([chave, valor]) => ({ chave, valor: String(valor ?? "") }));
  const { error } = await s.supabase.from("configuracoes").upsert(rows, { onConflict: "chave" });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// Atualizar campos da imobiliária (status, plano, vigência, destaques contratados)
export async function atualizarImobiliaria(id, campos) {
  const s = await comoAdmin();
  if (!s) return { ok: false, error: "Sem permissão." };
  const permitido = {};
  ["status", "plano_id", "data_vigencia", "destaques_contratados", "destaque_home"].forEach((k) => {
    if (campos[k] !== undefined) permitido[k] = campos[k];
  });
  const { error } = await s.supabase.from("imobiliarias").update(permitido).eq("id", id);
  if (error) return { ok: false, error: error.message };

  // Ao mudar o status da imobiliária, arrasta os imóveis vinculados:
  // - pausada/suspensa  => tira os publicados das buscas (vira "pausado")
  // - reativada         => devolve os que estavam pausados para "publicado"
  if (permitido.status !== undefined) {
    if (["pausada", "suspensa"].includes(permitido.status)) {
      await s.supabase.from("imoveis").update({ status: "pausado" }).eq("imobiliaria_id", id).eq("status", "publicado");
    } else if (["teste", "ativa", "tolerancia"].includes(permitido.status)) {
      await s.supabase.from("imoveis").update({ status: "publicado" }).eq("imobiliaria_id", id).eq("status", "pausado");
    }
  }

  return { ok: true };
}
