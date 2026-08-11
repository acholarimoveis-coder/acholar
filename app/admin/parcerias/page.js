import { getSessao } from "@/lib/painel";
import ParceriasManager from "./ParceriasManager";

export const dynamic = "force-dynamic";

const brl = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export default async function AdminPublicidade() {
  const { supabase } = await getSessao();
  const { data: anuncios } = await supabase.from("anuncios").select("*").order("criado_em", { ascending: false });
  const lista = anuncios || [];

  const ativos = lista.filter((a) => a.status === "ativo");
  const receitaPub = ativos.reduce((s, a) => s + Number(a.valor || 0), 0);

  return (
    <>
      <div className="ptop">Publicidade</div>
      <div className="pcontent">
        <div className="pstats" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
          <div className="pstat"><b>{ativos.length}</b><span>Banners ativos</span></div>
          <div className="pstat"><b>{brl(receitaPub)}</b><span>Receita de publicidade</span></div>
          <div className="pstat"><b>{lista.length}</b><span>Banners cadastrados</span></div>
        </div>

        <ParceriasManager anuncios={lista} />
      </div>
    </>
  );
}
