"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { salvarPerfil } from "@/app/actions/perfil";

function iniciais(nome) {
  return (nome || "IM").split(" ").filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function PerfilForm({ imob, imobId }) {
  const router = useRouter();
  const [f, setF] = useState({
    nome: imob.nome || "", creci: imob.creci || "", logo_url: imob.logo_url || "",
    whatsapp: imob.whatsapp || "", telefone: imob.telefone || "", email: imob.email || "",
    endereco: imob.endereco || "", bairro: imob.bairro || "", cidade: imob.cidade || "Jales",
    site: imob.site || "", instagram: imob.instagram || "", descricao: imob.descricao || "",
  });
  const [msg, setMsg] = useState(null);
  const [erro, setErro] = useState(null);
  const [busy, setBusy] = useState(false);
  const [subindo, setSubindo] = useState(false);

  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));

  async function enviarLogo(e) {
    const arq = e.target.files?.[0];
    if (!arq) return;
    setSubindo(true); setErro(null);
    const supabase = createClient();
    const nome = `${imobId}/logo-${Date.now()}-${arq.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
    const { error } = await supabase.storage.from("imoveis").upload(nome, arq, { upsert: true });
    if (error) { setErro("Erro ao enviar a logo: " + error.message); setSubindo(false); return; }
    const { data } = supabase.storage.from("imoveis").getPublicUrl(nome);
    up("logo_url", data.publicUrl);
    setSubindo(false);
  }

  async function salvar(e) {
    e.preventDefault();
    setBusy(true); setErro(null); setMsg(null);
    const r = await salvarPerfil(f);
    setBusy(false);
    if (r.ok) { setMsg("Dados salvos!"); router.refresh(); }
    else setErro(r.error || "Não foi possível salvar.");
  }

  return (
    <form className="pform" onSubmit={salvar}>
      <div className="fcard">
        <h3>Logo da imobiliária</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: "var(--primary-soft)", display: "grid", placeItems: "center", overflow: "hidden", flex: "0 0 auto" }}>
            {f.logo_url ? <img src={f.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontFamily: "Sora", fontWeight: 700, color: "var(--primary-dark)", fontSize: "1.3rem" }}>{iniciais(f.nome)}</span>}
          </div>
          <div>
            <label className="upbox" style={{ padding: "12px 16px", display: "inline-block", cursor: "pointer" }}>
              {subindo ? "Enviando..." : "Trocar logo"}
              <input type="file" accept="image/*" onChange={enviarLogo} style={{ display: "none" }} />
            </label>
            <div style={{ fontSize: ".78rem", color: "var(--muted)", fontWeight: 600, marginTop: 6 }}>Aparece no seu perfil e nos seus anúncios.</div>
          </div>
        </div>
      </div>

      <div className="fcard">
        <h3>Dados da imobiliária</h3>
        <div className="row">
          <div className="field"><label>Nome</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.nome} onChange={(e) => up("nome", e.target.value)} /></div>
          <div className="field"><label>CRECI</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.creci} onChange={(e) => up("creci", e.target.value)} /></div>
        </div>
        <div className="field"><label>Descrição</label><textarea className="cf-inp" style={{ marginBottom: 0 }} rows={3} value={f.descricao} onChange={(e) => up("descricao", e.target.value)} placeholder="Fale um pouco sobre a sua imobiliária..." /></div>
      </div>

      <div className="fcard">
        <h3>Contato &amp; atendimento</h3>
        <div className="field">
          <label>WhatsApp <span style={{ background: "#E7F9EE", color: "#1B7E45", fontSize: ".7rem", fontWeight: 800, padding: "2px 8px", borderRadius: 999, marginLeft: 6 }}>recebe os leads</span></label>
          <input className="cf-inp" style={{ marginBottom: 0 }} value={f.whatsapp} onChange={(e) => up("whatsapp", e.target.value)} placeholder="(17) 99999-0000" />
          <div style={{ fontSize: ".78rem", color: "var(--muted)", fontWeight: 600, marginTop: 6 }}>É neste número que chegam os contatos gerados pelo portal.</div>
        </div>
        <div className="row">
          <div className="field"><label>Telefone fixo</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.telefone} onChange={(e) => up("telefone", e.target.value)} /></div>
          <div className="field"><label>E-mail</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.email} onChange={(e) => up("email", e.target.value)} /></div>
        </div>
        <div className="row3">
          <div className="field"><label>Endereço</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.endereco} onChange={(e) => up("endereco", e.target.value)} /></div>
          <div className="field"><label>Bairro</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.bairro} onChange={(e) => up("bairro", e.target.value)} /></div>
          <div className="field"><label>Cidade</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.cidade} onChange={(e) => up("cidade", e.target.value)} /></div>
        </div>
        <div className="row">
          <div className="field"><label>Site</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.site} onChange={(e) => up("site", e.target.value)} placeholder="https://" /></div>
          <div className="field"><label>Instagram</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.instagram} onChange={(e) => up("instagram", e.target.value)} placeholder="@suaimobiliaria" /></div>
        </div>
      </div>

      {erro ? <div className="cf-erro" style={{ marginBottom: 10 }}>{erro}</div> : null}
      {msg ? <div style={{ color: "#1B7E45", fontWeight: 700, marginBottom: 10 }}>{msg}</div> : null}
      <div className="fsave">
        <button className="btn btn-primary" type="submit" disabled={busy || subindo}>{busy ? "Salvando..." : "Salvar dados"}</button>
      </div>
    </form>
  );
}
