"use client";
import { useState } from "react";

export default function NotificacoesSino({ avisos, waLink }) {
  const [aberto, setAberto] = useState(false);
  const n = avisos.length;

  return (
    <div className="sino-wrap">
      <button className="sino-btn" onClick={() => setAberto((v) => !v)} aria-label="Avisos">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
        {n > 0 ? <span className="sino-badge">{n}</span> : null}
      </button>

      {aberto ? (
        <>
          <div className="sino-overlay" onClick={() => setAberto(false)} />
          <div className="sino-panel">
            <div className="sino-head">Avisos</div>
            {n > 0 ? (
              avisos.map((a, i) => (
                <div key={i} className={`sino-item ${a.nivel}`}>
                  <span className="dot" />
                  <div>{a.texto}</div>
                </div>
              ))
            ) : (
              <div className="sino-empty">Nenhum aviso no momento. Tudo em dia! 🎉</div>
            )}
            {n > 0 && waLink ? (
              <a className="btn btn-primary sino-cta" href={waLink} target="_blank" rel="noopener">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2z" /></svg>
                Renovar meu plano
              </a>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
