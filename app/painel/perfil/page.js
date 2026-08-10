import { getSessao } from "@/lib/painel";
import PerfilForm from "./PerfilForm";

export const dynamic = "force-dynamic";

export default async function Perfil() {
  const { imob } = await getSessao();
  return (
    <>
      <div className="ptop">Minha imobiliária</div>
      <div className="pcontent">
        <PerfilForm imob={imob || {}} imobId={imob?.id} />
      </div>
    </>
  );
}
