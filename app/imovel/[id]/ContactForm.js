"use client";
import { useState } from "react";
import { criarLead } from "@/app/actions/leads";

export default function ContactForm({ imovel, imobiliaria }) {
  const [form, setForm] = useState({ nome: "", email: "", telefone: "" });
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const mensagem = `Olá! Vi este imóvel (${imovel.codigo || "cód. " + imovel.id.slice(0, 8)}) pelo Acholar e tenho interesse. Podemos conversar?`;

  function up(campo, v) {
    setForm((f) => ({ ...f, [campo]: v }));
  }

  async function enviarFormulario(e) {
    e.preventDefault();
    if (!form.nome || !form.telefone) return setErro("Preencha ao menos nome e telefone.");
    setCarregando(true);
    const r = await criarLead({
      imovel_id: imovel.id,
      imobiliaria_id: imovel.imobiliaria_id,
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      mensagem,
      canal: "formulario",
    });
    setCarregando(false);
    if (r.ok) { setEnviado(true); setErro(null); }
    else setErro(r.error || "Não foi possível enviar. Tente novamente.");
  }

  async function abrirWhatsApp() {
    if (!form.nome || !form.telefone) return setErro("Informe nome e telefone para abrir o WhatsApp.");
    setErro(null);
    await criarLead({
      imovel_id: imovel.id,
      imobiliaria_id: imovel.imobiliaria_id,
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      mensagem,
      canal: "whatsapp",
    });
    const num = (imobiliaria?.whatsapp || "").replace(/\D/g, "");
    if (num) window.open(`https://wa.me/${num}?text=${encodeURIComponent(mensagem)}`, "_blank");
  }

  if (enviado) {
    return (
      <div className="contact-card">
        <h3>Mensagem enviada! ✅</h3>
        <p className="hint">A imobiliária recebeu seu contato e vai falar com você em breve.</p>
      </div>
    );
  }

  return (
    <div className="contact-card">
      <div className="imob-mini">
        <div className="av" style={{ overflow: "hidden" }}>
          {imobiliaria?.logo_url
            ? <img src={imobiliaria.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : (imobiliaria?.nome || "IM").split(" ").filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
        </div>
        <div>
          <b>{imobiliaria?.nome || "Imobiliária parceira"}</b>
          <span>{imobiliaria?.creci ? `CRECI ${imobiliaria.creci} · ` : ""}Parceiro Acholar</span>
        </div>
      </div>
      <h3>Tenho interesse</h3>
      <p className="hint">Envie uma mensagem para a imobiliária. É rápido e sem compromisso.</p>
      <form onSubmit={enviarFormulario}>
        <input className="cf-inp" placeholder="Seu nome" value={form.nome} onChange={(e) => up("nome", e.target.value)} />
        <input className="cf-inp" placeholder="Seu e-mail" value={form.email} onChange={(e) => up("email", e.target.value)} />
        <input className="cf-inp" placeholder="Seu telefone / WhatsApp" value={form.telefone} onChange={(e) => up("telefone", e.target.value)} />
        <textarea className="cf-inp" readOnly value={mensagem} />
        {erro ? <div className="cf-erro">{erro}</div> : null}
        <button type="submit" className="cf-btn cf-primary" disabled={carregando}>
          {carregando ? "Enviando..." : "Enviar mensagem"}
        </button>
      </form>
      <button type="button" className="cf-btn cf-wa" onClick={abrirWhatsApp}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z" /></svg>
        Falar no WhatsApp
      </button>
    </div>
  );
}
