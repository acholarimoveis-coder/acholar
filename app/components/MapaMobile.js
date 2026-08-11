"use client";
import { useState } from "react";
import MapaImoveis from "./MapaImoveis";

// Botão flutuante (só no celular) que abre o mapa em tela cheia.
export default function MapaMobile({ imoveis }) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button className="vermapa-btn" onClick={() => setAberto(true)} aria-label="Ver no mapa">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3z" /><path d="M9 3v15M15 6v15" />
        </svg>
        Ver no mapa
      </button>

      {aberto ? (
        <div className="vermapa-overlay">
          <div className="vm-top">
            <button className="btn btn-primary" onClick={() => setAberto(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M7 4l-3 3 3 3M20 17H4M17 14l3 3-3 3" /></svg>
              Voltar à lista
            </button>
          </div>
          <div className="vm-map">
            <MapaImoveis imoveis={imoveis} />
          </div>
        </div>
      ) : null}
    </>
  );
}
