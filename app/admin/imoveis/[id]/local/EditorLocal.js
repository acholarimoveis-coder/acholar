"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { salvarLocalImovel, liberarLocalXml } from "@/app/actions/admin";

const JALES = [-20.2686, -50.5457];

function carregarLeaflet() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.L) return resolve(window.L);
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = () => resolve(window.L);
    document.body.appendChild(s);
  });
}

// Está dentro de uma faixa que faz sentido para o Brasil?
function validoBR(la, ln) {
  return la != null && ln != null && la >= -34 && la <= 6 && ln >= -74 && ln <= -32;
}

export default function EditorLocal({ id, lat0, lng0, travado0 }) {
  const router = useRouter();
  const ref = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const partida = validoBR(lat0, lng0) ? [lat0, lng0] : JALES;
  const [lat, setLat] = useState(partida[0]);
  const [lng, setLng] = useState(partida[1]);
  const [travado, setTravado] = useState(!!travado0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let cancelado = false;
    carregarLeaflet().then((L) => {
      if (cancelado || !ref.current || mapRef.current) return;
      const map = L.map(ref.current).setView(partida, validoBR(lat0, lng0) ? 16 : 14);
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap", maxZoom: 19 }).addTo(map);

      const icone = L.divIcon({
        className: "",
        html: '<div style="background:#0b7573;width:20px;height:20px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.5)"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 20],
      });
      const marker = L.marker(partida, { icon: icone, draggable: true }).addTo(map);
      markerRef.current = marker;
      marker.on("dragend", () => {
        const p = marker.getLatLng();
        setLat(Number(p.lat.toFixed(6)));
        setLng(Number(p.lng.toFixed(6)));
      });
      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        setLat(Number(e.latlng.lat.toFixed(6)));
        setLng(Number(e.latlng.lng.toFixed(6)));
      });
    });
    return () => {
      cancelado = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Move o pino quando os campos numéricos mudam manualmente
  function aplicarCampos(la, ln) {
    if (markerRef.current && mapRef.current && isFinite(la) && isFinite(ln)) {
      markerRef.current.setLatLng([la, ln]);
      mapRef.current.setView([la, ln], mapRef.current.getZoom());
    }
  }

  async function salvar() {
    setBusy(true); setMsg(null); setErro(null);
    const r = await salvarLocalImovel(id, { lat, lng });
    setBusy(false);
    if (r.ok) { setTravado(true); setMsg("Localização salva e travada. A sincronização não vai mais sobrescrever."); router.refresh(); }
    else setErro(r.error || "Não foi possível salvar.");
  }
  async function liberar() {
    setBusy(true); setMsg(null); setErro(null);
    const r = await liberarLocalXml(id);
    setBusy(false);
    if (r.ok) { setTravado(false); setMsg("Localização liberada — voltará a seguir o XML na próxima sincronização."); router.refresh(); }
    else setErro(r.error || "Não foi possível liberar.");
  }
  function irParaJales() {
    setLat(JALES[0]); setLng(JALES[1]); aplicarCampos(JALES[0], JALES[1]);
  }

  return (
    <div>
      <div style={{ background: travado ? "#E7F9EE" : "#FBF3E2", color: travado ? "#1B7E45" : "#96703A", fontWeight: 700, fontSize: ".85rem", padding: "10px 14px", borderRadius: 10, marginBottom: 14 }}>
        {travado ? "🔒 Localização travada manualmente (o XML não sobrescreve)." : "Esta localização ainda segue o XML do cliente. Ajuste e salve para travar."}
      </div>

      <p style={{ fontSize: ".85rem", color: "var(--muted)", fontWeight: 600, marginBottom: 10 }}>
        Arraste o pino ou clique no mapa para marcar o local correto do imóvel.
      </p>

      <div ref={ref} style={{ width: "100%", height: 420, borderRadius: 14, overflow: "hidden", border: "1px solid var(--line)", marginBottom: 14 }} />

      <div className="row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end", marginBottom: 14 }}>
        <div className="field"><label style={{ fontSize: ".8rem", fontWeight: 700 }}>Latitude</label><input className="cf-inp" style={{ marginBottom: 0 }} value={lat} onChange={(e) => { const v = e.target.value; setLat(v); aplicarCampos(Number(v), Number(lng)); }} /></div>
        <div className="field"><label style={{ fontSize: ".8rem", fontWeight: 700 }}>Longitude</label><input className="cf-inp" style={{ marginBottom: 0 }} value={lng} onChange={(e) => { const v = e.target.value; setLng(v); aplicarCampos(Number(lat), Number(v)); }} /></div>
        <button type="button" className="btn btn-ghost" onClick={irParaJales}>Centralizar em Jales</button>
      </div>

      {erro ? <div className="cf-erro" style={{ marginBottom: 10 }}>{erro}</div> : null}
      {msg ? <div style={{ color: "#1B7E45", fontWeight: 700, marginBottom: 10 }}>{msg}</div> : null}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" onClick={salvar} disabled={busy}>{busy ? "Salvando..." : "Salvar localização"}</button>
        {travado ? <button className="btn btn-ghost" onClick={liberar} disabled={busy}>Voltar a usar o XML</button> : null}
        <a className="btn btn-ghost" href={`/imovel/${id}`} target="_blank" rel="noopener">Ver o imóvel no site</a>
      </div>
    </div>
  );
}
