"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { atualizarImobiliaria } from "@/app/actions/admin";

const STATUS = [
  { v: "pendente", n: "Pendente" },
  { v: "teste", n: "Em teste (grátis)" },
  { v: "ativa", n: "Ativa (pagante)" },
  { v: "tolerancia", n: "Em tolerância" },
  { v: "pausada", n: "Pausada" },
  { v: "suspensa", n: "Suspensa" },
];

export default function EditarImobForm({ imob, planos }) {
  const router = useRouter();
  const [f, setF] = useState({
    status: imob.status || "teste",
    plano_id: imob.plano_id || "",
    data_vigencia: imob.data_vigencia || "",
    destaques_contratados: imob.destaques_contratados || 0,
    destaque_home: !!imob.destaque_home,
  });
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [erro, setErro] = useState(null);
  const up = (k, v) => setF((p) => ({ ...p, [k]: v }));

  async function salvar(e) {
    e.preventDefault();
    setBusy(true); setOk(false); setErro(null);
    const r = await atualizarImobiliaria(imob.id, {
      status: f.status,
      plano_id: f.plano_id || null,
      data_vigencia: f.data_vigencia || null,
      destaques_contratados: Number(f.destaques_contratados) || 0,
      destaque_home: f.destaque_home,
    });
    setBusy(false);
    if (r.ok) { setOk(true); router.refresh(); }
    else setErro(r.error || "Não foi possível salvar.");
  }

  return (
    <form className="pform" onSubmit={salvar} style={{ maxWidth: "none" }}>
      <div className="row">
        <div className="field">
          <label>Status da conta</label>
          <select className="cf-inp" style={{ marginBottom: 0 }} value={f.status} onChange={(e) => up("status", e.target.value)}>
            {STATUS.map((s) => <option key={s.v} value={s.v}>{s.n}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Plano contratado</label>
          <select className="cf-inp" style={{ marginBottom: 0 }} value={f.plano_id} onChange={(e) => up("plano_id", e.target.value)}>
            <option value="">Sem plano</option>
            {planos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome} — {Number(p.valor_mensal || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}/mês</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label>Vigência do plano (vence em)</label>
          <input className="cf-inp" style={{ marginBottom: 0 }} type="date" value={f.data_vigencia} onChange={(e) => up("data_vigencia", e.target.value)} />
        </div>
        <div className="field">
          <label>Destaques liberados</label>
          <input className="cf-inp" style={{ marginBottom: 0 }} type="number" min="0" value={f.destaques_contratados} onChange={(e) => up("destaques_contratados", e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={f.destaque_home} onChange={(e) => up("destaque_home", e.target.checked)} />
          Exibir esta imobiliária em destaque na home
        </label>
      </div>

      {erro ? <div className="cf-erro" style={{ marginBottom: 10 }}>{erro}</div> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Salvando..." : "Salvar alterações"}</button>
        {ok ? <span style={{ color: "#1B7E45", fontWeight: 700 }}>Salvo!</span> : null}
      </div>
    </form>
  );
}
