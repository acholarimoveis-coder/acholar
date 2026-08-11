"use client";
import { useState, useEffect, useCallback } from "react";

export default function Galeria({ fotos, titulo }) {
  const [aberto, setAberto] = useState(false);
  const [i, setI] = useState(0);
  const total = fotos.length;

  const fechar = useCallback(() => setAberto(false), []);
  const abrir = (idx) => { setI(idx); setAberto(true); };
  const prox = useCallback((e) => { e && e.stopPropagation(); setI((v) => (v + 1) % total); }, [total]);
  const ant = useCallback((e) => { e && e.stopPropagation(); setI((v) => (v - 1 + total) % total); }, [total]);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e) => {
      if (e.key === "Escape") fechar();
      else if (e.key === "ArrowRight") prox();
      else if (e.key === "ArrowLeft") ant();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [aberto, fechar, prox, ant]);

  const thumbs = fotos.slice(1, 5);
  const extras = total - 5; // quantas fotos além das 5 mostradas

  return (
    <>
      <div className="gallery-main galeria-click" onClick={() => abrir(0)}>
        <img src={fotos[0]} alt={titulo} />
        <span className="galeria-zoom">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2M11 8v6M8 11h6" /></svg>
          Ampliar
        </span>
      </div>
      {total > 1 ? (
        <div className="gallery-thumbs">
          {thumbs.map((f, idx) => {
            const real = idx + 1;
            const ultimoComExtra = idx === thumbs.length - 1 && extras > 0;
            return (
              <div className="galeria-thumb galeria-click" key={real} onClick={() => abrir(real)}>
                <img src={f} alt="" />
                {ultimoComExtra ? <span className="galeria-mais">+{extras}</span> : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {aberto ? (
        <div className="lbx" onClick={fechar}>
          <button className="lbx-close" onClick={fechar} aria-label="Fechar">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
          {total > 1 ? <button className="lbx-nav prev" onClick={ant} aria-label="Anterior"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" /></svg></button> : null}
          <img className="lbx-img" src={fotos[i]} alt={titulo} onClick={(e) => e.stopPropagation()} />
          {total > 1 ? <button className="lbx-nav next" onClick={prox} aria-label="Próxima"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" /></svg></button> : null}
          <span className="lbx-count">{i + 1} / {total}</span>
        </div>
      ) : null}
    </>
  );
}
