import { createClient } from "@/lib/supabase/server";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { iniciais } from "@/lib/painel";

export const dynamic = "force-dynamic";

async function getDados() {
  try {
    const supabase = createClient();
    const [{ data: imobs }, { data: imoveis }] = await Promise.all([
      supabase.from("imobiliarias").select("*").in("status", ["teste", "ativa", "tolerancia"]).order("nome"),
      supabase.from("imoveis").select("imobiliaria_id").eq("status", "publicado"),
    ]);
    const contagem = {};
    (imoveis || []).forEach((i) => { contagem[i.imobiliaria_id] = (contagem[i.imobiliaria_id] || 0) + 1; });
    return { imobs: imobs || [], contagem };
  } catch {
    return { imobs: [], contagem: {} };
  }
}

const cores = ["#0E7A6E", "#4E7B54", "#2C6E8F", "#B15E36", "#5A5EA0", "#3E7C6A"];

export default async function Imobiliarias() {
  const { imobs, contagem } = await getDados();

  return (
    <>
      <SiteHeader />
      <div className="top-strip">
        <div className="wrap">
          <h1>Imobiliárias parceiras da região</h1>
          <p>Conheça as imobiliárias que anunciam no Acholar e veja todos os imóveis de cada uma num só lugar.</p>
        </div>
      </div>

      <div className="wrap">
        <div className="igrid">
          {imobs.length > 0 ? (
            imobs.map((im, idx) => (
              <div className="icard" key={im.id}>
                <div className="top">
                  <div className="iav" style={{ background: cores[idx % cores.length] }}>{iniciais(im.nome)}</div>
                  <div>
                    <h3>{im.nome}</h3>
                    <div className="creci">{im.creci ? `CRECI ${im.creci}` : "Parceiro Acholar"}</div>
                  </div>
                </div>
                <div className="meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /></svg>
                  {contagem[im.id] || 0} imóveis · {im.cidade || "Jales"}
                </div>
                <div className="acts">
                  <a className="btn btn-primary" href={`/imobiliaria/${im.id}`}>Ver imóveis</a>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">Nenhuma imobiliária parceira ainda.</div>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
