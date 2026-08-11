"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { criarImobiliaria } from "@/app/actions/admin";

const vazio = {
  nome: "", creci: "", cidade: "Jales", whatsapp: "", telefone: "",
  email: "", senha: "", xml_url: "", sistema: "",
};

export default function NovaImobForm() {
  const router = useRouter();
  const [f, setF] = useState(vazio);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState(null);
  const [ok, setOk] = useState(null);
  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));

  async function salvar(e) {
    e.preventDefault();
    setBusy(true); setErro(null); setOk(null);
    const r = await criarImobiliaria(f);
    setBusy(false);
    if (r.ok) {
      const s = r.sync;
      const resumo = s && !s.erro ? ` ${s.novos} imóveis importados do XML.` : s && s.erro ? ` (Atenção: não consegui ler o XML: ${s.erro})` : "";
      setOk(`Imobiliária criada com login de acesso!${resumo}`);
      setF(vazio);
      router.refresh();
    } else {
      setErro(r.error || "Não foi possível criar.");
    }
  }

  return (
    <form className="pform" onSubmit={salvar} style={{ maxWidth: "none" }}>
      <div className="field"><label>Nome da imobiliária *</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.nome} onChange={(e) => up("nome", e.target.value)} placeholder="Ex.: Imobiliária Central" /></div>
      <div className="row">
        <div className="field"><label>CRECI</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.creci} onChange={(e) => up("creci", e.target.value)} /></div>
        <div className="field"><label>Cidade</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.cidade} onChange={(e) => up("cidade", e.target.value)} /></div>
      </div>
      <div className="row">
        <div className="field"><label>WhatsApp (recebe leads)</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.whatsapp} onChange={(e) => up("whatsapp", e.target.value)} placeholder="(17) 99999-0000" /></div>
        <div className="field"><label>Telefone fixo</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.telefone} onChange={(e) => up("telefone", e.target.value)} /></div>
      </div>

      <div style={{ borderTop: "1px solid var(--line)", margin: "8px 0 14px", paddingTop: 14, fontWeight: 700, fontSize: ".85rem" }}>Login de acesso ao painel</div>
      <div className="row">
        <div className="field"><label>E-mail de acesso *</label><input className="cf-inp" style={{ marginBottom: 0 }} type="email" value={f.email} onChange={(e) => up("email", e.target.value)} placeholder="contato@imobiliaria.com" /></div>
        <div className="field"><label>Senha * (mín. 6)</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.senha} onChange={(e) => up("senha", e.target.value)} placeholder="senha inicial" /></div>
      </div>

      <div style={{ borderTop: "1px solid var(--line)", margin: "8px 0 14px", paddingTop: 14, fontWeight: 700, fontSize: ".85rem" }}>Integração automática (opcional)</div>
      <div className="field"><label>Link do XML do CRM</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.xml_url} onChange={(e) => up("xml_url", e.target.value)} placeholder="https://..." /><div style={{ fontSize: ".78rem", color: "var(--muted)", fontWeight: 600, marginTop: 6 }}>Se preencher, os imóveis já são importados na criação.</div></div>
      <div className="field"><label>Sistema / CRM</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.sistema} onChange={(e) => up("sistema", e.target.value)} placeholder="Ex.: Microsistec, Kenlo..." /></div>

      {erro ? <div className="cf-erro" style={{ marginBottom: 10 }}>{erro}</div> : null}
      {ok ? <div style={{ color: "#1B7E45", fontWeight: 700, marginBottom: 10 }}>{ok}</div> : null}
      <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Criando..." : "Criar imobiliária + login"}</button>
    </form>
  );
}
