"use client";
import { useState } from "react";
import { salvarConfig } from "@/app/actions/admin";

export default function CobrancaConfig({ whatsapp, mensagem }) {
  const [wa, setWa] = useState(whatsapp || "");
  const [msg, setMsg] = useState(mensagem || "");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  async function salvar(e) {
    e.preventDefault();
    setBusy(true); setOk(false);
    const r = await salvarConfig({ whatsapp_cobranca: wa, msg_cobranca: msg });
    setBusy(false);
    if (r.ok) { setOk(true); setTimeout(() => setOk(false), 2500); }
  }

  return (
    <form className="pform" onSubmit={salvar} style={{ maxWidth: "none" }}>
      <div className="field">
        <label>Seu WhatsApp de cobrança</label>
        <input className="cf-inp" style={{ marginBottom: 0 }} value={wa} onChange={(e) => setWa(e.target.value)} placeholder="(17) 99999-0000" />
        <div style={{ fontSize: ".78rem", color: "var(--muted)", fontWeight: 600, marginTop: 6 }}>É para cá que vai o botão "Renovar meu plano" do painel das imobiliárias.</div>
      </div>
      <div className="field">
        <label>Mensagem padrão</label>
        <input className="cf-inp" style={{ marginBottom: 0 }} value={msg} onChange={(e) => setMsg(e.target.value)} />
        <div style={{ fontSize: ".78rem", color: "var(--muted)", fontWeight: 600, marginTop: 6 }}>Use <b>{"{imob}"}</b> onde deve entrar o nome da imobiliária.</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Salvando..." : "Salvar"}</button>
        {ok ? <span style={{ color: "#1B7E45", fontWeight: 700 }}>Salvo!</span> : null}
      </div>
    </form>
  );
}
