import { getSessao } from "@/lib/painel";
import EditorLocal from "./EditorLocal";

export const dynamic = "force-dynamic";

export default async function AjustarLocal({ params }) {
  const { supabase } = await getSessao();
  const { data: im } = await supabase
    .from("imoveis")
    .select("id, titulo, endereco, bairro, cidade, lat, lng, geo_travado")
    .eq("id", params.id)
    .single();

  if (!im) {
    return (
      <>
        <div className="ptop">Imóvel não encontrado</div>
        <div className="pcontent"><a className="btn btn-primary" href="/admin/imoveis">Voltar</a></div>
      </>
    );
  }

  const endereco = [im.endereco, im.bairro, im.cidade].filter(Boolean).join(", ");

  return (
    <>
      <div className="ptop">
        <a href="/admin/imoveis" style={{ color: "var(--muted)", fontWeight: 700, fontSize: ".85rem", textDecoration: "none" }}>← Imóveis</a>
        <div style={{ marginTop: 4 }}>Ajustar localização</div>
      </div>
      <div className="pcontent">
        <div className="pcard" style={{ maxWidth: 820 }}>
          <div style={{ padding: 18 }}>
            <h3 style={{ marginTop: 0, marginBottom: 2 }}>{im.titulo}</h3>
            <p style={{ color: "var(--muted)", fontWeight: 600, fontSize: ".85rem", marginBottom: 16 }}>{endereco || "Endereço não informado"}</p>
            <EditorLocal id={im.id} lat0={im.lat} lng0={im.lng} travado0={im.geo_travado} />
          </div>
        </div>
      </div>
    </>
  );
}
