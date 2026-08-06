import { getSessao } from "@/lib/painel";
import DestaquesManager from "./DestaquesManager";

export const dynamic = "force-dynamic";

export default async function DestaquesPainel() {
  const { imob, supabase } = await getSessao();
  const { data: imoveis } = await supabase
    .from("imoveis")
    .select("id, titulo, fotos, destaque_ativo, preco, tipo_negocio")
    .eq("imobiliaria_id", imob?.id)
    .eq("status", "publicado")
    .order("criado_em", { ascending: false });

  return (
    <>
      <div className="ptop">Destaques</div>
      <div className="pcontent">
        <DestaquesManager
          imoveis={imoveis || []}
          contratados={imob?.destaques_contratados || 0}
          adminWhats={process.env.NEXT_PUBLIC_ADMIN_WHATSAPP}
        />
      </div>
    </>
  );
}
