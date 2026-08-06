import { getSessao } from "@/lib/painel";
import ImovelForm from "../../ImovelForm";

export const dynamic = "force-dynamic";

export default async function EditarImovel({ params }) {
  const { imob, supabase } = await getSessao();
  const { data: imovel } = await supabase
    .from("imoveis")
    .select("*")
    .eq("id", params.id)
    .eq("imobiliaria_id", imob?.id)
    .single();

  return (
    <>
      <div className="ptop">Editar imóvel</div>
      <div className="pcontent">
        {imovel ? (
          <ImovelForm imovel={imovel} imobId={imob?.id} />
        ) : (
          <div className="pempty">Imóvel não encontrado.</div>
        )}
      </div>
    </>
  );
}
