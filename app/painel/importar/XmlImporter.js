"use client";
import { useState } from "react";
import { salvarXmlUrl, sincronizarXML, sincronizarXMLTexto } from "@/app/actions/sincronizar";

export default function XmlImporter({ xmlUrl }) {
  const [url, setUrl] = useState(xmlUrl || "");
  const [texto, setTexto] = useState("");
  const [msg, setMsg] = useState(null);
  const [erro, setErro] = useState(null);
  const [busy, setBusy] = useState(false);

  async function importarTexto() {
    setBusy(true); setErro(null); setMsg(null);
    const r = await sincronizarXMLTexto(texto);
    setBusy(false);
    if (r.ok) setMsg(`Importação concluída: ${r.novos} novo(s) e ${r.atualizados} atualizado(s).${r.aviso ? " " + r.aviso : ""}`);
    else setErro(r.error);
  }

  async function salvar() {
    setBusy(true); setErro(null); setMsg(null);
    const r = await salvarXmlUrl(url);
    setBusy(false);
    if (r.ok) setMsg("Link do XML salvo.");
    else setErro(r.error);
  }

  async function sincronizar() {
    setBusy(true); setErro(null); setMsg(null);
    const r = await sincronizarXML();
    setBusy(false);
    if (r.ok) {
      setMsg(`Sincronização concluída: ${r.novos} novo(s) e ${r.atualizados} atualizado(s).${r.aviso ? " " + r.aviso : ""}`);
    } else {
      setErro(r.error);
    }
  }

  return (
    <div className="pform">
      <div className="fcard">
        <h3>Integração automática por XML</h3>
        <p style={{ color: "var(--muted)", fontWeight: 600, marginBottom: 16, fontSize: ".92rem" }}>
          Cole o link do XML do seu sistema (Kenlo, Microsistec, Universal...). O Acholar lê e importa seus imóveis.
        </p>
        <div className="field">
          <label>Link do seu XML</label>
          <input className="cf-inp" style={{ marginBottom: 0 }} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="rowacts" style={{ marginTop: 14 }}>
          <button className="btn btn-ghost" onClick={salvar} disabled={busy}>Salvar link</button>
          <button className="btn btn-primary" onClick={sincronizar} disabled={busy}>
            {busy ? "Processando..." : "Sincronizar agora"}
          </button>
        </div>
        {msg ? <div style={{ marginTop: 14, color: "#1B7E45", fontWeight: 700 }}>{msg}</div> : null}
        {erro ? <div className="cf-erro" style={{ marginTop: 14 }}>{erro}</div> : null}
      </div>

      <div className="fcard">
        <h3>Ou cole o conteúdo do XML</h3>
        <p style={{ color: "var(--muted)", fontWeight: 600, marginBottom: 12, fontSize: ".92rem" }}>
          Para testar agora (ou quando o sistema só fornece um arquivo), abra o arquivo XML, copie tudo e cole abaixo.
        </p>
        <textarea className="cf-inp" style={{ marginBottom: 12, minHeight: 120, fontFamily: "monospace", fontSize: ".82rem" }} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="<Properties>...</Properties>" />
        <button className="btn btn-primary" onClick={importarTexto} disabled={busy}>
          {busy ? "Processando..." : "Importar do texto colado"}
        </button>
      </div>

      <div className="fcard">
        <h3>Como funciona</h3>
        <p style={{ color: "#3C4A56", lineHeight: 1.7 }}>
          Ao sincronizar, importamos os imóveis <b>disponíveis</b> do seu XML, geramos o título no padrão do Acholar e
          evitamos duplicar (pelo código de cada imóvel). Rodar de novo atualiza preços e dados dos imóveis já importados.
        </p>
      </div>
    </div>
  );
}
