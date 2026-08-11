"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { geocodificarAgora } from "@/app/actions/admin";

export default function GeocodeButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  async function rodar() {
    setBusy(true); setMsg(null);
    const r = await geocodificarAgora();
    setBusy(false);
    if (!r.ok) { setMsg(r.error || "Falha."); return; }
    if (r.pendentes === 0) setMsg("Tudo certo — nenhum imóvel sem localização.");
    else setMsg(`${r.imoveisAtualizados} imóvel(is) posicionados. ${r.restantes > 0 ? `Ainda faltam ~${r.restantes} bairros — clique de novo para continuar.` : "Concluído!"}`);
    router.refresh();
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <button className="btn-xs btn-ghost" onClick={rodar} disabled={busy} title="Preenche a localização aproximada (pelo bairro) dos imóveis sem coordenada">
        {busy ? "Posicionando..." : "📍 Corrigir localizações"}
      </button>
      {msg ? <span style={{ fontSize: ".8rem", color: "var(--muted)", fontWeight: 600 }}>{msg}</span> : null}
    </div>
  );
}
