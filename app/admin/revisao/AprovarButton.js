"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { aprovarRevisao } from "@/app/actions/admin";

export default function AprovarButton({ id }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function ok() {
    setBusy(true);
    await aprovarRevisao(id, true);
    setBusy(false);
    router.refresh();
  }

  return (
    <button className="btn-xs btn-green" onClick={ok} disabled={busy} title="Marcar como conferido — sai da revisão">
      {busy ? "..." : "✓ Está ok"}
    </button>
  );
}
