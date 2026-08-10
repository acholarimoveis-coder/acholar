import { redirect } from "next/navigation";
import { getSessao } from "@/lib/painel";
import LogoutButton from "../painel/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  const { user, profile } = await getSessao();
  if (!user) redirect("/entrar");
  if (profile?.papel !== "admin") redirect("/");

  return (
    <div className="painel">
      <aside className="pside admin">
        <a className="logo" href="/admin">
          <img src="/logo-escuro.png" alt="Acholar" style={{ height: 30, width: "auto", display: "block" }} />
        </a>
        <span className="admintag">Administração</span>
        <nav className="pnav">
          <a href="/admin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>Visão geral</a>
          <a href="/admin/imobiliarias"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M9 21v-5h6v5" /></svg>Imobiliárias</a>
          <a href="/admin/imoveis"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /></svg>Imóveis</a>
        </nav>
        <div className="pspace" />
        <nav className="pnav">
          <a href="/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M21 3l-9 9M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /></svg>Ver o site</a>
          <LogoutButton />
        </nav>
        <div className="puser">
          <div className="av" style={{ background: "#C2892B" }}>{(profile?.nome || "AD").slice(0, 2).toUpperCase()}</div>
          <div><b>{profile?.nome || "Administrador"}</b><span>Administrador</span></div>
        </div>
      </aside>
      <div className="pmain">{children}</div>
    </div>
  );
}
