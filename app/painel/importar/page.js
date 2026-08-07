import { getSessao } from "@/lib/painel";
import XmlImporter from "./XmlImporter";

export const dynamic = "force-dynamic";

export default async function ImportarXML() {
  const { imob } = await getSessao();
  return (
    <>
      <div className="ptop">Importar por XML</div>
      <div className="pcontent">
        <XmlImporter xmlUrl={imob?.xml_url || ""} />
      </div>
    </>
  );
}
