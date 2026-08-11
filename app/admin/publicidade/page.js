import { getSessao } from "@/lib/painel";
import PublicidadeManager from "./PublicidadeManager";

export const dynamic = "force-dynamic";

export default async function AdminPublicidade() {
  const { supabase } = await getSessao();
  const { data: anuncios } = await supabase.from("anuncios").select("*").order("criado_em", { ascending: false });

  return (
    <>
      <div className="ptop">Publicidade</div>
      <div className="pcontent">
        <PublicidadeManager anuncios={anuncios || []} />
      </div>
    </>
  );
}
