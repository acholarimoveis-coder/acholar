import { createClient } from "@/lib/supabase/server";

// Busca a sessão atual + o perfil + a imobiliária do usuário logado.
export async function getSessao() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, supabase };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, imobiliaria:imobiliarias(*)")
    .eq("id", user.id)
    .single();

  return { user, profile: profile || null, imob: profile?.imobiliaria || null, supabase };
}

export function iniciais(nome) {
  return (nome || "IM")
    .split(" ")
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
