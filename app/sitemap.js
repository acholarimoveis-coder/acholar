import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const BASE = "https://acholar.com.br";

export default async function sitemap() {
  const estaticas = ["", "/imoveis", "/imobiliarias", "/lancamentos", "/anuncie", "/quem-somos", "/ajuda"].map((p) => ({
    url: BASE + p,
    changeFrequency: "daily",
    priority: p === "" ? 1 : 0.7,
  }));

  let imoveis = [];
  let imobs = [];
  try {
    const supabase = createClient();
    const { data: imv } = await supabase
      .from("imoveis")
      .select("id, atualizado_em")
      .eq("status", "publicado")
      .limit(5000);
    imoveis = (imv || []).map((i) => ({
      url: `${BASE}/imovel/${i.id}`,
      lastModified: i.atualizado_em ? new Date(i.atualizado_em) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const { data: imb } = await supabase
      .from("imobiliarias")
      .select("id")
      .in("status", ["teste", "ativa", "tolerancia"])
      .limit(1000);
    imobs = (imb || []).map((i) => ({
      url: `${BASE}/imobiliaria/${i.id}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // se o banco falhar, ainda entregamos as páginas estáticas
  }

  return [...estaticas, ...imobs, ...imoveis];
}
