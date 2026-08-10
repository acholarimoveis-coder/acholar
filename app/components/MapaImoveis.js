"use client";
import { useEffect, useRef } from "react";
import { formatPreco, FOTO_PLACEHOLDER } from "@/lib/format";

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

export default function MapaImoveis({ imoveis }) {
  const ref = useRef(null);

  useEffect(() => {
    let map;
    let cancelado = false;
    const comGeo = (imoveis || []).filter((i) => i.lat != null && i.lng != null);

    carregarLeaflet().then((L) => {
      if (cancelado || !ref.current) return;
      const centro = comGeo.length ? [comGeo[0].lat, comGeo[0].lng] : [-20.2686, -50.5457]; // Jales
      map = L.map(ref.current).setView(centro, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      const icone = L.divIcon({
        className: "",
        html: '<div style="background:#0b7573;width:16px;height:16px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.4)"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 16],
        popupAnchor: [0, -16],
      });

      const pontos = [];
      comGeo.forEach((im) => {
        const foto = (im.fotos && im.fotos[0]) || FOTO_PLACEHOLDER;
        const preco = formatPreco(im.preco, im.tipo_negocio);
        const html = `<a href="/imovel/${im.id}" style="display:block;width:180px;text-decoration:none;color:#031524;font-family:Sora,sans-serif">
            <img src="${foto}" style="width:100%;height:100px;object-fit:cover;border-radius:8px"/>
            <div style="font-weight:700;color:#0b7573;margin-top:6px">${preco}</div>
            <div style="font-size:13px;font-weight:600;line-height:1.3;margin-top:2px">${im.titulo || ""}</div>
            <div style="font-size:12px;color:#667">${im.bairro || ""}</div>
          </a>`;
        L.marker([im.lat, im.lng], { icon: icone }).addTo(map).bindPopup(html);
        pontos.push([im.lat, im.lng]);
      });
      if (pontos.length > 1) map.fitBounds(pontos, { padding: [30, 30] });
    });

    return () => {
      cancelado = true;
      if (map) map.remove();
    };
  }, [imoveis]);

  return <div ref={ref} style={{ width: "100%", height: "100%", minHeight: 400, borderRadius: 16, overflow: "hidden", background: "var(--surface-2)" }} />;
}
