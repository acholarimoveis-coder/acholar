// Rotina agendada do Netlify: chama /api/cron uma vez por dia.
export default async () => {
  const base = process.env.URL || process.env.DEPLOY_PRIME_URL || "";
  const secret = process.env.CRON_SECRET || "";
  try {
    const resp = await fetch(`${base}/api/cron?token=${encodeURIComponent(secret)}`);
    const texto = await resp.text();
    return new Response(texto, { status: resp.status, headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, erro: e?.message }), { status: 500 });
  }
};

// Roda todo dia (madrugada, horário UTC)
export const config = { schedule: "@daily" };
