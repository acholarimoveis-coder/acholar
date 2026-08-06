"use client";
import { useState } from "react";
import { alternarDestaque } from "@/app/actions/imoveis";
import { formatPreco, FOTO_PLACEHOLDER } from "@/lib/format";

const Star = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 6.5 7 .6-5.3 4.6L18.5 21 12 17.3 5.5 21l1.8-7.3L2 9.1l7-.6z" /></svg>);

export default function DestaquesManager({ imoveis, contratados, adminWhats }) {
  const [lista, setLista] = useState(imoveis);
  const [erro, setErro] = useState(null);
  const usados = lista.filter((i) => i.destaque_ativo).length;

  async function toggle(im) {
    const ligar = !im.destaque_ativo;
    if (ligar && usados >= contratados) {
      setErro("Você já usou todos os destaques do seu plano.");
      return;
    }
    setErro(null);
    // otimista
    setLista((L) => L.map((x) => (x.id === im.id ? { ...x, destaque_ativo: ligar } : x)));
    const r = await alternarDestaque(im.id, ligar);
    if (!r.ok) {
      setLista((L) => L.map((x) => (x.id === im.id ? { ...x, destaque_ativo: !ligar } : x)));
      setErro(r.limite ? "Você já usou todos os destaques do seu plano." : (r.error || "Erro."));
    }
  }

  if (!contratados || contratados <= 0) {
    const num = (adminWhats || "").replace(/\D/g, "");
    return (
      <div className="upsell">
        <div className="ic"><Star /></div>
        <h3>Destaque não está ativo no seu plano</h3>
        <p>Colocar imóveis em destaque na home é um recurso pago, liberado pela administração do Acholar. Fale com a gente para ativar.</p>
        <a className="btn btn-primary" href={num ? `https://wa.me/${num}?text=${encodeURIComponent("Olá! Quero ativar destaques no meu plano do Acholar.")}` : "#"} target="_blank" rel="noopener">
          Falar com a administração
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="dslots">
        <span style={{ color: "#7A5410" }}>{usados} de {contratados} destaques usados</span>
        <div className="dslot-dots">
          {Array.from({ length: contratados }).map((_, i) => (<span key={i} className={`dsd ${i < usados ? "on" : ""}`} />))}
        </div>
      </div>
      {erro ? <div className="cf-erro" style={{ marginBottom: 12 }}>{erro}</div> : null}
      <div className="pcard">
        {lista.length > 0 ? (
          <table className="pt">
            <thead><tr><th>Imóvel</th><th>Preço</th><th>Destaque</th></tr></thead>
            <tbody>
              {lista.map((im) => (
                <tr key={im.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                      <img className="pthumb" src={(im.fotos && im.fotos[0]) || FOTO_PLACEHOLDER} alt="" />
                      <b>{im.titulo}</b>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: "var(--primary)" }}>{formatPreco(im.preco, im.tipo_negocio)}</td>
                  <td>
                    <button className={`dstar ${im.destaque_ativo ? "on" : ""}`} onClick={() => toggle(im)} title="Destacar na home"><Star /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="pempty">Você ainda não tem imóveis publicados para destacar.</div>
        )}
      </div>
    </>
  );
}
