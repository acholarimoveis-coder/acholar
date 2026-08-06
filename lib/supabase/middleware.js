import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Mantém a sessão do usuário viva e protege as rotas /painel.
export async function updateSession(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se tentar acessar o painel ou o admin sem estar logado, manda pro login
  const protegida = request.nextUrl.pathname.startsWith("/painel") || request.nextUrl.pathname.startsWith("/admin");
  if (!user && protegida) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    return NextResponse.redirect(url);
  }

  return response;
}
