import NovaImobForm from "./NovaImobForm";

export const dynamic = "force-dynamic";

export default function NovaImobiliaria() {
  return (
    <>
      <div className="ptop">
        <a href="/admin/imobiliarias" style={{ color: "var(--muted)", fontWeight: 700, fontSize: ".85rem", textDecoration: "none" }}>← Imobiliárias</a>
        <div style={{ marginTop: 4 }}>Nova imobiliária</div>
      </div>
      <div className="pcontent">
        <div className="pcard" style={{ maxWidth: 640 }}>
          <NovaImobForm />
        </div>
      </div>
    </>
  );
}
