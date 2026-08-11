"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { criarAnuncio, alternarAnuncio, removerAnuncio } from "@/app/actions/publicidade";

const ESPACOS = [
  { v: "home-topo", nome: "Home — faixa no topo", dica: "Aparece logo abaixo da busca. Ideal ~1200×160px." },
  { v: "home-retangulo", nome: "Home — faixa central", dica: "Aparece no meio da home. Ideal ~1200×220px." },
  { v: "resultados-topo", nome: "Busca — faixa no topo", dica: "Aparece acima dos resultados. Ideal ~1200×140px." },
];

const vazio = { anunciante: "", tipo: "parceiro", espaco: "home-topo", imagem_url: "", link: "", inicio: "", fim: "", valor: "" };

const fmtData = (d) => (d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : null);
const brl = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default function ParceriasManager({ anuncios }) {
  const router = useRouter();
  const [f, setF] = useState(vazio);
  const [subindo, setSubindo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState(null);
  const [msg, setMsg] = useState(null);
  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));

  async function enviarImagem(e) {
    const arq = e.target.files?.[0];
    if (!arq) return;
    setSubindo(true); setErro(null);
    const supabase = createClient();
    const nome = `img-${Date.now()}-${arq.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
    const { error } = await supabase.storage.from("midia").upload(nome, arq, { upsert: true });
    if (error) { setErro("Erro ao enviar a imagem: " + error.message); setSubindo(false); return; }
    const { data } = supabase.storage.from("midia").getPublicUrl(nome);
    up("imagem_url", data.publicUrl);
    setSubindo(false);
  }

  async function salvar(e) {
    e.preventDefault();
    setBusy(true); setErro(null); setMsg(null);
    const r = await criarAnuncio(f);
    setBusy(false);
    if (r.ok) { setMsg("Banner publicado!"); setF(vazio); router.refresh(); }
    else setErro(r.error || "Não foi possível salvar.");
  }

  async function toggle(a) {
    await alternarAnuncio(a.id, a.status === "ativo" ? "encerrado" : "ativo");
    router.refresh();
  }
  async function remover(a) {
    if (!confirm("Remover este banner?")) return;
    await removerAnuncio(a.id);
    router.refresh();
  }

  const espacoAtual = ESPACOS.find((x) => x.v === f.espaco);

  return (
    <div className="pgrid2">
      <div className="pcard">
        <h3 style={{ marginTop: 0 }}>Novo banner</h3>
        <form className="pform" onSubmit={salvar}>
          <div className="field">
            <label>Imagem do banner</label>
            <div className="promo-up">
              {f.imagem_url ? (
                <img src={f.imagem_url} alt="" style={{ width: "100%", borderRadius: 10, display: "block", marginBottom: 10 }} />
              ) : null}
              <label className="upbox" style={{ padding: "12px 16px", display: "inline-block", cursor: "pointer" }}>
                {subindo ? "Enviando..." : f.imagem_url ? "Trocar imagem" : "Enviar imagem"}
                <input type="file" accept="image/*" onChange={enviarImagem} style={{ display: "none" }} />
              </label>
            </div>
          </div>

          <div className="field">
            <label>Espaço</label>
            <select className="cf-inp" style={{ marginBottom: 0 }} value={f.espaco} onChange={(e) => up("espaco", e.target.value)}>
              {ESPACOS.map((x) => <option key={x.v} value={x.v}>{x.nome}</option>)}
            </select>
            <div style={{ fontSize: ".78rem", color: "var(--muted)", fontWeight: 600, marginTop: 6 }}>{espacoAtual?.dica}</div>
          </div>

          <div className="row">
            <div className="field"><label>Anunciante</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.anunciante} onChange={(e) => up("anunciante", e.target.value)} placeholder="Nome do anunciante" /></div>
            <div className="field">
              <label>Tipo</label>
              <select className="cf-inp" style={{ marginBottom: 0 }} value={f.tipo} onChange={(e) => up("tipo", e.target.value)}>
                <option value="parceiro">Parceiro</option>
                <option value="incorporadora">Incorporadora</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="field"><label>Link de destino (opcional)</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.link} onChange={(e) => up("link", e.target.value)} placeholder="https://" /></div>
            <div className="field"><label>Valor contratado (R$)</label><input className="cf-inp" style={{ marginBottom: 0 }} type="number" min="0" step="0.01" value={f.valor} onChange={(e) => up("valor", e.target.value)} placeholder="Ex.: 400" /></div>
          </div>

          <div className="row">
            <div className="field"><label>Início do contrato</label><input className="cf-inp" style={{ marginBottom: 0 }} type="date" value={f.inicio} onChange={(e) => up("inicio", e.target.value)} /></div>
            <div className="field"><label>Fim do contrato</label><input className="cf-inp" style={{ marginBottom: 0 }} type="date" value={f.fim} onChange={(e) => up("fim", e.target.value)} /></div>
          </div>

          {erro ? <div className="cf-erro" style={{ marginBottom: 10 }}>{erro}</div> : null}
          {msg ? <div style={{ color: "#1B7E45", fontWeight: 700, marginBottom: 10 }}>{msg}</div> : null}
          <button className="btn btn-primary" type="submit" disabled={busy || subindo || !f.imagem_url}>{busy ? "Publicando..." : "Publicar banner"}</button>
        </form>
      </div>

      <div className="pcard">
        <h3 style={{ marginTop: 0 }}>Banners cadastrados</h3>
        {anuncios.length === 0 ? (
          <div className="pempty">Nenhum banner ainda. Crie o primeiro ao lado.</div>
        ) : (
          <div className="promo-list">
            {anuncios.map((a) => {
              const esp = ESPACOS.find((x) => x.v === a.espaco);
              return (
                <div className="promo-item" key={a.id}>
                  <img src={a.imagem_url} alt="" />
                  <div className="bi-info">
                    <b>{a.anunciante}</b>
                    <span>{esp ? esp.nome : a.espaco}</span>
                    {a.inicio || a.fim ? <span>{fmtData(a.inicio) || "…"} — {fmtData(a.fim) || "…"}</span> : null}
                    {a.valor ? <span style={{ color: "var(--primary-dark)", fontWeight: 700 }}>{brl(a.valor)}</span> : null}
                    <span className={`chip-st ${a.status === "ativo" ? "pub" : "novo"}`}>{a.status === "ativo" ? "Ativo" : "Encerrado"}</span>
                  </div>
                  <div className="bi-acts">
                    <button className="btn-xs btn-amber2" onClick={() => toggle(a)}>{a.status === "ativo" ? "Pausar" : "Ativar"}</button>
                    <button className="btn-xs" style={{ background: "#FBE9E9", color: "#B42318" }} onClick={() => remover(a)}>Remover</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
