// Geocodificação aproximada por bairro/cidade usando OpenStreetMap (Nominatim, gratuito).
// Quando um imóvel não tem coordenada válida, calculamos um ponto aproximado
// a partir do bairro + cidade, guardando o resultado num cache (tabela geocache)
// para não repetir a consulta.

const UA = "Acholar/1.0 (https://acholar.com.br)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Uma coordenada é válida se cai dentro do Brasil (e não é ~0,0).
export function coordValidaBR(lat, lng) {
  const la = Number(lat), ln = Number(lng);
  if (lat == null || lng == null || !isFinite(la) || !isFinite(ln)) return false;
  if (Math.abs(la) < 0.02 && Math.abs(ln) < 0.02) return false; // ~ilha nula (oceano)
  return la >= -34 && la <= 6 && ln >= -74 && ln <= -32;
}

async function nominatim(q) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(q)}`;
    const resp = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "pt-BR" } });
    if (!resp.ok) return null;
    const arr = await resp.json();
    if (!arr || !arr.length) return null;
    const la = parseFloat(arr[0].lat), ln = parseFloat(arr[0].lon);
    return coordValidaBR(la, ln) ? { lat: la, lng: ln } : null;
  } catch {
    return null;
  }
}

// Tenta "bairro, cidade, SP"; se falhar, cai para o centro da cidade.
async function geocodeBairroCidade(bairro, cidade) {
  const uf = "SP";
  if (bairro) {
    const r = await nominatim(`${bairro}, ${cidade}, ${uf}, Brasil`);
    if (r) return r;
    await sleep(1100);
  }
  return await nominatim(`${cidade}, ${uf}, Brasil`);
}

// Preenche a localização aproximada dos imóveis sem coordenada válida.
// `admin` deve ser o cliente service-role (ignora RLS).
export async function geocodificarPendentes(admin, { max = 15 } = {}) {
  const { data: ims } = await admin
    .from("imoveis")
    .select("id, bairro, cidade, lat, lng, geo_travado")
    .eq("status", "publicado");

  const pend = (ims || []).filter((i) => !i.geo_travado && !coordValidaBR(i.lat, i.lng) && (i.bairro || i.cidade));
  if (!pend.length) return { pendentes: 0, geocodificados: 0, imoveisAtualizados: 0, restantes: 0 };

  // agrupa por bairro|cidade
  const grupos = new Map();
  for (const i of pend) {
    const cidade = (i.cidade || "Jales").trim();
    const chave = `${(i.bairro || "").trim().toLowerCase()}|${cidade.toLowerCase()}`;
    if (!grupos.has(chave)) grupos.set(chave, { bairro: (i.bairro || "").trim(), cidade, ids: [] });
    grupos.get(chave).ids.push(i.id);
  }

  const chaves = [...grupos.keys()];
  const { data: cacheRows } = await admin.from("geocache").select("chave, lat, lng").in("chave", chaves);
  const cache = new Map((cacheRows || []).map((c) => [c.chave, c]));
  const uncached = chaves.filter((k) => !cache.has(k)).length;

  let geocodificados = 0, imoveisAtualizados = 0, novos = 0;
  for (const [chave, g] of grupos) {
    let coord = cache.get(chave);
    if (!coord) {
      if (novos >= max) continue; // limita as consultas externas por execução
      novos++;
      const r = await geocodeBairroCidade(g.bairro, g.cidade);
      await sleep(1100); // respeita o limite de 1 req/s do Nominatim
      if (!r) continue;
      await admin.from("geocache").upsert({ chave, lat: r.lat, lng: r.lng }, { onConflict: "chave" });
      coord = r;
      geocodificados++;
    }
    if (coord && coord.lat != null) {
      const { error } = await admin.from("imoveis").update({ lat: coord.lat, lng: coord.lng, geo_aprox: true }).in("id", g.ids);
      if (!error) imoveisAtualizados += g.ids.length;
    }
  }

  return { pendentes: pend.length, geocodificados, imoveisAtualizados, restantes: Math.max(0, uncached - novos) };
}
