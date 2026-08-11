import { getSessao } from "@/lib/painel";
import EditarImobForm from "./EditarImobForm";

export const dynamic = "force-dynamic";

export default async function EditarImobiliaria({ params }) {
  const { supabase } = await getSessao();
  const [{ data: imob }, { data: planos }] = await Promise.all([
    supabase.from("imobiliarias").select("*").eq("id", params.id).single(),
    supabase.from("planos").select("id, nome, valor_mensal").order("valor_mensal", { ascending: true }),
  ]);

  if (!imob) {
    return (
      <>
        <div className="ptop">Imobiliária não encontrada</div>
        <div className="pcontent"><a className="btn btn-primary" href="/admin/imobiliarias">Voltar</a></div>
      </>
    );
  }

  return (
    <>
      <div className="ptop">
        <a href="/admin/imobiliarias" style={{ color: "var(--muted)", fontWeight: 700, fontSize: ".85rem", textDecoration: "none" }}>← Imobiliárias</a>
        <div style={{ marginTop: 4 }}>{imob.nome}</div>
      </div>
      <div className="pcontent">
        <div className="pcard" style={{ maxWidth: 640 }}>
          <div style={{ padding: 18 }}>
            <EditarImobForm imob={imob} planos={planos || []} />
          </div>
        </div>
      </div>
    </>
  );
}
