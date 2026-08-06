import { getSessao } from "@/lib/painel";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const { supabase } = await getSessao();
  const [{ count: nImob }, { count: nPub }, { count: nPend }, { count: nLeads }] = await Promise.all([
    supabase.from("imobiliarias").select("*", { count: "exact", head: true }),
    supabase.from("imoveis").select("*", { count: "exact", head: true }).eq("status", "publicado"),
    supabase.from("imoveis").select("*", { count: "exact", head: true }).eq("status", "pendente"),
    supabase.from("leads").select("*", { count: "exact", head: true }),
  ]);

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
          <div className="pcard-h">Atalhos</div>
          <div className="pcontent" style={{ padding: 18 }}>
            <div className="rowacts">
              <a className="btn btn-ghost" href="/admin/imoveis?status=pendente">Moderar imóveis</a>
              <a className="btn btn-ghost" href="/admin/imobiliarias">Gerenciar imobiliárias</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
