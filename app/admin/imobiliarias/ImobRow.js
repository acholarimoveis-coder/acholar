"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { aprovarImobiliaria, atualizarImobiliaria, sincronizarImobiliariaAdmin } from "@/app/actions/admin";

export default function ImobRow({ imob }) {
  const router = useRouter();
  const [dest, setDest] = useState(imob.destaques_contratados || 0);
  const [home, setHome] = useState(!!imob.destaque_home);
  const [busy, setBusy] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  async function aprovar() {
    setBusy(true);
    await aprovarImobiliaria(imob.id);
    setBusy(false);
    router.refresh();
  }
  async function salvar() {
    setBusy(true);
    await atualizarImobiliaria(imob.id, { destaques_contratados: Number(dest) || 0, destaque_home: home });
    setBusy(false);
    router.refresh();
  }
  async function sincronizar() {
    setSyncing(true); setSyncMsg(null);
    const r = await sincronizarImobiliariaAdmin(imob.id);
    setSyncing(false);
    if (!r.ok) { setSyncMsg("⚠️ " + (r.error || "Falha na sincronização.")); return; }
    setSyncMsg(`✓ +${r.novos} novos · ${r.atualizados} atualizados · ${r.removidos} removidos`);
    router.refresh();
  }

  return (
    <div className="rowacts" style={{ flexWrap: "wrap" }}>
      {imob.status === "pendente" ? (
        <button className="btn-xs btn-green" onClick={aprovar} disabled={busy}>Aprovar</button>
      ) : null}
      <span style={{ fontSize: ".78rem", color: "var(--muted)", fontWeight: 700 }}>Destaques:</span>
      <input className="mininp" type="number" min="0" value={dest} onChange={(e) => setDest(e.target.value)} />
      <label style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: ".78rem", fontWeight: 700, color: "var(--muted)", cursor: "pointer" }}>
        <input type="checkbox" checked={home} onChange={(e) => setHome(e.target.checked)} />
        Home
      </label>
      <button className="btn-xs btn-amber2" onClick={salvar} disabled={busy}>Salvar</button>
      <a className="btn-xs" href={`/admin/imobiliarias/${imob.id}/editar`} style={{ background: "var(--surface-2)", color: "var(--ink)", textDecoration: "none" }}>Editar</a>
      {imob.xml_url ? (
        <button className="btn-xs btn-ghost" onClick={sincronizar} disabled={syncing} title="Baixa o XML do cliente e atualiza agora (mantém as localizações ajustadas)">
          {syncing ? "Sincronizando..." : "🔄 Sincronizar"}
        </button>
      ) : null}
      {syncMsg ? <span style={{ flexBasis: "100%", fontSize: ".78rem", color: "var(--muted)", fontWeight: 600, marginTop: 4 }}>{syncMsg}</span> : null}
    </div>
  );
}
