"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Recuperar() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir`,
    });
    setCarregando(false);
    if (error) setErro("Não foi possível enviar. Confira o e-mail e tente de novo.");
    else setEnviado(true);
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <a className="logo" href="/" style={{ justifyContent: "center" }}>
          <img src="/logo-claro.png" alt="Acholar" style={{ height: 40, width: "auto", display: "block", margin: "0 auto" }} />
        </a>
        <h1>Recuperar senha</h1>
        {enviado ? (
          <>
            <p className="hint">Se existir uma conta com esse e-mail, enviamos um link para você criar uma nova senha. Confira sua caixa de entrada (e o spam).</p>
            <a className="cf-btn cf-primary" href="/entrar" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>Voltar ao login</a>
          </>
        ) : (
          <>
            <p className="hint">Informe o e-mail da sua conta. Enviaremos um link para redefinir a senha.</p>
            <form onSubmit={enviar}>
              <input className="cf-inp" type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
              {erro ? <div className="cf-erro">{erro}</div> : null}
              <button className="cf-btn cf-primary" type="submit" disabled={carregando}>
                {carregando ? "Enviando..." : "Enviar link"}
              </button>
            </form>
            <p className="hint" style={{ marginTop: 14, marginBottom: 0 }}>
              <a href="/entrar" style={{ color: "var(--primary)", fontWeight: 700 }}>Voltar ao login</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
