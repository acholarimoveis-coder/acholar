"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Entrar() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    if (error) {
      setErro("E-mail ou senha incorretos.");
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      let destino = "/painel";
      if (user) {
        const { data: perfil } = await supabase.from("profiles").select("papel").eq("id", user.id).single();
        if (perfil?.papel === "admin") destino = "/admin";
      }
      router.push(destino);
      router.refresh();
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <a className="logo" href="/" style={{ justifyContent: "center" }}>
          <img src="/logo-claro.png" alt="Acholar" style={{ height: 40, width: "auto", display: "block", margin: "0 auto" }} />
        </a>
        <h1>Entrar no painel</h1>
        <p className="hint">Acesso para imobiliárias parceiras.</p>
        <form onSubmit={entrar}>
          <input className="cf-inp" type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="cf-inp" type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          {erro ? <div className="cf-erro">{erro}</div> : null}
          <button className="cf-btn cf-primary" type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="hint" style={{ marginTop: 12, marginBottom: 0 }}>
          <a href="/recuperar" style={{ color: "var(--primary)", fontWeight: 700 }}>Esqueci minha senha</a>
        </p>
        <p className="hint" style={{ marginTop: 14, marginBottom: 0 }}>
          Ainda não é parceiro? <a href="/anuncie" style={{ color: "var(--primary)", fontWeight: 700 }}>Anuncie seus imóveis</a>
        </p>
      </div>
    </div>
  );
}
