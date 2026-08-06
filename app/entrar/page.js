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
        <a className="logo" href="/">
          <svg className="mark" viewBox="0 0 40 40" fill="none">
            <path d="M20 4 L34 15 V34 a2 2 0 0 1-2 2 H8 a2 2 0 0 1-2-2 V15 Z" fill="#0E7A6E" />
            <path d="M20 4 L34 15 V20 C30 17 25 16 20 16 S10 17 6 20 V15 Z" fill="#0F1B2D" />
            <circle cx="20" cy="26" r="4.5" fill="#fff" />
          </svg>
          Acholar
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
        <p className="hint" style={{ marginTop: 14, marginBottom: 0 }}>
          Ainda não é parceiro? <a href="/anuncie" style={{ color: "var(--primary)", fontWeight: 700 }}>Anuncie seus imóveis</a>
        </p>
      </div>
    </div>
  );
}
