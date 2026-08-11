import { getSessao } from "@/lib/painel";
import CobrancaConfig from "./CobrancaConfig";

export const dynamic = "force-dynamic";

const brl = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default async function AdminHome() {
  const { supabase } = await getSessao();

  const [{ count: nImob }, { count: nPub }, { count: nPend }, { count: nLeads }, imobsRes, planosRes, imoveisRes, cfgRes, anunRes] = await Promise.all([
    supabase.from("imobiliarias").select("*", { count: "exact", head: true }),
    supabase.from("imoveis").select("*", { count: "exact", head: true }).eq("status", "publicado"),
    supabase.from("imoveis").select("*", { count: "exact", head: true }).eq("status", "pendente"),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("imobiliarias").select("id, nome, status, plano_id, data_vigencia"),
    supabase.from("planos").select("id, nome, valor_mensal"),
    supabase.from("imoveis").select("id, titulo, bairro, cidade, visitas").eq("status", "publicado"),
    supabase.from("configuracoes").select("chave, valor").in("chave", ["whatsapp_cobranca", "msg_cobranca"]),
    supabase.from("anuncios").select("valor, status"),
  ]);

  const imobs = imobsRes.data || [];
  const planoMap = Object.fromEntries((planosRes.data || []).map((p) => [p.id, p]));
  const valorDe = (im) => Number(planoMap[im.plano_id]?.valor_mensal || 0);

  // ----- Faturamento -----
  let mrr = 0, receitaTeste = 0;
  const cont = { ativa: 0, teste: 0, tolerancia: 0, pausada: 0, pendente: 0, suspensa: 0 };
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const limite7 = new Date(hoje); limite7.setDate(limite7.getDate() + 7);
  let vencendo7 = 0;
  for (const im of imobs) {
    cont[im.status] = (cont[im.status] || 0) + 1;
    if (im.status === "ativa") mrr += valorDe(im);
    if (im.status === "teste") receitaTeste += valorDe(im);
    if (["ativa", "teste", "tolerancia"].includes(im.status) && im.data_vigencia) {
      const vig = new Date(im.data_vigencia + "T00:00:00");
      if (vig >= hoje && vig <= limite7) vencendo7++;
    }
  }
  // receita de publicidade (banners ativos)
  const receitaPub = (anunRes.data || []).filter((a) => a.status === "ativo").reduce((s, a) => s + Number(a.valor || 0), 0);
  const totalMensal = mrr + receitaPub;

  // ----- Mais procurados (portal) -----
  const imoveis = imoveisRes.data || [];
  const topImoveis = imoveis.filter((m) => (m.visitas || 0) > 0).sort((a, b) => (b.visitas || 0) - (a.visitas || 0)).slice(0, 5);
  const mapaB = {};
  imoveis.forEach((m) => { if (m.bairro) { const k = `${m.bairro} — ${m.cidade || "Jales"}`; mapaB[k] = (mapaB[k] || 0) + (m.visitas || 0); } });
  const topBairros = Object.entries(mapaB).map(([bairro, total]) => ({ bairro, total })).filter((b) => b.total > 0).sort((a, b) => b.total - a.total).slice(0, 5);
  const temDados = topImoveis.length > 0 || topBairros.length > 0;

  const cfg = Object.fromEntries((cfgRes.data || []).map((r) => [r.chave, r.valor]));

  return (
    <>
      <div className="ptop">Visão geral</div>
      <div className="pcontent">
        <div className="pstats" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
          <div className="pstat"><b>{nImob || 0}</b><span>Imobiliárias</span></div>
          <div className="pstat"><b>{nPub || 0}</b><span>Imóveis publicados</span></div>
          <div className="pstat"><b>{nPend || 0}</b><span>Aguardando moderação</span></div>
          <div className="pstat"><b>{nLeads || 0}</b><span>Leads no portal</span></div>
        </div>

        {nPend > 0 ? (
          <div className="ptrial" style={{ background: "linear-gradient(120deg,#FDF3E4,#FBE9CF)" }}>
            Há {nPend} imóvel(is) aguardando sua moderação.
            <span><a href="/admin/imoveis?status=pendente" style={{ color: "#7A5410", fontWeight: 800 }}>Revisar agora →</a></span>
          </div>
        ) : null}

        <div className="pcard">
          <div className="pcard-h">Faturamento mensal</div>
          <div style={{ padding: 18 }}>
            <div className="fat-grid">
              <div className="fat-box primary"><b>{brl(totalMensal)}</b><span>Total mensal (planos + publicidade)</span></div>
              <div className="fat-box"><b>{brl(mrr)}</b><span>Planos das imobiliárias</span></div>
              <div className="fat-box"><b>{brl(receitaPub)}</b><span>Publicidade (banners)</span></div>
              <div className="fat-box"><b>{brl(receitaTeste)}</b><span>Potencial em teste</span></div>
              <div className="fat-box"><b>{(cont.tolerancia || 0) + (cont.pausada || 0)}</b><span>Em atraso / pausadas</span></div>
              <div className={`fat-box ${vencendo7 > 0 ? "warn" : ""}`}><b>{vencendo7}</b><span>Vencendo em 7 dias</span></div>
            </div>
            <div style={{ fontSize: ".76rem", color: "var(--muted)", fontWeight: 600, marginTop: 12 }}>
              Planos: estimativa pelo plano de cada imobiliária ativa (ajuste em Imobiliárias → Editar). Publicidade: soma dos banners ativos.
            </div>
          </div>
        </div>

        {temDados ? (
          <div className="relat-grid">
            <div className="pcard">
              <div className="pcard-h">Imóveis mais procurados do portal</div>
              <div className="rank">
                {topImoveis.map((m, i) => (
                  <a className="rank-row" key={m.id} href={`/imovel/${m.id}`}>
                    <span className="rk-pos">{i + 1}</span>
                    <span className="rk-main"><b>{m.titulo}</b><small>{m.bairro || "—"}, {m.cidade || "Jales"}</small></span>
                    <span className="rk-val">{m.visitas} <i>visitas</i></span>
                  </a>
                ))}
              </div>
            </div>
            <div className="pcard">
              <div className="pcard-h">Bairros mais procurados do portal</div>
              <div className="rank">
                {topBairros.map((b, i) => (
                  <div className="rank-row" key={b.bairro}>
                    <span className="rk-pos">{i + 1}</span>
                    <span className="rk-main"><b>{b.bairro}</b></span>
                    <span className="rk-val">{b.total} <i>visitas</i></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="pcard">
          <div className="pcard-h">Cobrança &amp; renovação</div>
          <div style={{ padding: 18 }}>
            <CobrancaConfig whatsapp={cfg.whatsapp_cobranca} mensagem={cfg.msg_cobranca} />
          </div>
        </div>

        <div className="pcard">
          <div className="pcard-h">Atalhos</div>
          <div style={{ padding: 18 }}>
            <div className="rowacts">
              <a className="btn btn-ghost" href="/admin/imoveis?status=pendente">Moderar imóveis</a>
              <a className="btn btn-ghost" href="/admin/imobiliarias">Gerenciar imobiliárias</a>
              <a className="btn btn-ghost" href="/admin/parcerias">Publicidade</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
