import { getSessao } from "@/lib/painel";
import ImovelForm from "../ImovelForm";

export const dynamic = "force-dynamic";

export default async function NovoImovel() {
  const { imob } = await getSessao();
  return (
    <>
      <div className="ptop">Novo imóvel</div>
      <div className="pcontent">
        <ImovelForm imobId={imob?.id} />
      </div>
    </>
  );
}
