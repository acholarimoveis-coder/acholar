import { createAdminClient } from "@/lib/supabase/admin";
import { importarXmlParaImobiliaria } from "@/lib/sync";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const token = new URL(request.url).searchParams.get("token");
  const authHeader = request.headers.get("authorization"); // Vercel Cron envia: "Bearer <CRON_SECRET>"
  const autorizado = secret && (token === secret || authHeader === `Bearer ${secret}`);
  if (!autorizado) {
    return new Response("Não autorizado", { status: 401 });
  }

  const supabase = createAdminClient();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // dias de tolerância (config)
  const { data: cfg } = await supabase.from("configuracoes").select("valor").eq("chave", "dias_tolerancia").single();
  const diasTol = parseInt(cfg?.valor || "5", 10) || 5;

  const { data: imobs } = await supabase.from("imobiliarias").select("*");
  let pausadas = 0, emTolerancia = 0;
  const xmlResumo = [];

  for (const im of imobs || []) {
    let statusAtual = im.status;

    // ----- vencimento / tolerância -----
    if (im.data_vigencia && ["teste", "ativa", "tolerancia"].includes(statusAtual)) {
      const vig = new Date(im.data_vigencia + "T00:00:00");
      const limite = new Date(vig);
      limite.setDate(limite.getDate() + diasTol);

      if (hoje > limite) {
        // passou da tolerância -> pausa a imobiliária e os anúncios
        await supabase.from("imobiliarias").update({ status: "pausada" }).eq("id", im.id);
        await supabase.from("imoveis").update({ status: "pausado" }).eq("imobiliaria_id", im.id).eq("status", "publicado");
        statusAtual = "pausada";
        pausadas++;
      } else if (hoje > vig && statusAtual !== "tolerancia") {
        await supabase.from("imobiliarias").update({ status: "tolerancia" }).eq("id", im.id);
        statusAtual = "tolerancia";
        emTolerancia++;
      }
    }

    // ----- sincronização do XML -----
    if (im.xml_url && ["teste", "ativa", "tolerancia"].includes(statusAtual)) {
      try {
        const resp = await fetch(im.xml_url, { cache: "no-store" });
        if (resp.ok) {
          const xml = await resp.text();
          const res = await importarXmlParaImobiliaria(supabase, im.id, xml);
          xmlResumo.push({ imobiliaria: im.nome, ...res });
        } else {
          xmlResumo.push({ imobiliaria: im.nome, erro: `HTTP ${resp.status}` });
        }
      } catch (e) {
        xmlResumo.push({ imobiliaria: im.nome, erro: e?.message || "falha" });
      }
    }
  }

  return Response.json({ ok: true, executadoEm: new Date().toISOString(), pausadas, emTolerancia, xml: xmlResumo });
}
