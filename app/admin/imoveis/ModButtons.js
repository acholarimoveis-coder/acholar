"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { moderarImovel } from "@/app/actions/admin";

export default function ModButtons({ id, status }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function acao(novo) {
    setBusy(true);
    await moderarImovel(id, novo);
    setBusy(false);
    router.refresh();
  }

  if (status === "pendente") {
    return (
      <div className="rowacts">
        <button className="btn-xs btn-green" onClick={() => acao("publicado")} disabled={busy}>Aprovar</button>
        <button className="btn-xs btn-red2" onClick={() => acao("reprovado")} disabled={busy}>Reprovar</button>
      </div>
    );
  }
  if (status === "publicado") {
    return <button className="btn-xs btn-red2" onClick={() => acao("pausado")} disabled={busy}>Pausar</button>;
  }
  if (status === "pausado" || status === "reprovado") {
    return <button className="btn-xs btn-green" onClick={() => acao("publicado")} disabled={busy}>Publicar</button>;
  }
  return null;
}
