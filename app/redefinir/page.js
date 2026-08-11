"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Redefinir() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [pronto, setPronto] = useState(false);
  const [erro, setErro] = useState(null);
  const [ok, setOk] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setPronto(true);
    });
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) setPronto(true);
      });
    }
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setPronto(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro(null);
    if (senha.length < 6) { setErro("A senha precisa ter pelo menos 6 caracteres."); return; }
    if (senha !== senha2) { setErro("As senhas não conferem."); return; }
    setCarregando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: senha });
    setCarregando(false);
    if (error) { setErro("Não foi possível salvar. Peça um novo link e tente de novo."); return; }
    setOk(true);
    setTimeout(() => { router.push("/painel"); router.refresh(); }, 1500);
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <a className="logo" href="/" style={{ justifyContent: "center" }}>
          <img src="/logo-claro.png" alt="Acholar" style={{ height: 40, width: "auto", display: "block", margin: "0 auto" }} />
        </a>
        <h1>Criar nova senha</h1>
        {ok ? (
          <p className="hint">Senha alterada com sucesso! Redirecionando para o painel...</p>
        ) : !pronto ? (
          <p className="hint">Validando o link... Se você chegou aqui sem clicar no link do e-mail, <a href="/recuperar" style={{ color: "var(--primary)", fontWeight: 700 }}>peça um novo link</a>.</p>
        ) : (
          <>
            <p className="hint">Digite sua nova senha.</p>
            <form onSubmit={salvar}>
              <input className="cf-inp" type="password" placeholder="Nova senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
              <input className="cf-inp" type="password" placeholder="Repita a nova senha" value={senha2} onChange={(e) => setSenha2(e.target.value)} required />
              {erro ? <div className="cf-erro">{erro}</div> : null}
              <button className="cf-btn cf-primary" type="submit" disabled={carregando}>
                {carregando ? "Salvando..." : "Salvar nova senha"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
