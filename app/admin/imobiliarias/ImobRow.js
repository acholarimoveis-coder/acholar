"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { aprovarImobiliaria, atualizarImobiliaria } from "@/app/actions/admin";

export default function ImobRow({ imob }) {
  const router = useRouter();
  const [dest, setDest] = useState(imob.destaques_contratados || 0);
  const [home, setHome] = useState(!!imob.destaque_home);
  const [busy, setBusy] = useState(false);

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

  return (
    <div className="rowacts">
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
    </div>
  );
}
