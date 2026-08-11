import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Rota antiga renomeada para /admin/parcerias (o nome "publicidade" na URL
// era bloqueado por bloqueadores de anúncio). Redireciona no servidor.
export default function PublicidadeAntiga() {
  redirect("/admin/parcerias");
}
