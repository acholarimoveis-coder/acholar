// Cliente do Supabase com a chave "service_role" — só para o servidor / rotinas.
// Ignora as regras de RLS (roda como administrador do banco). NUNCA usar no navegador.
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
