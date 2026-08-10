import { redirect } from "next/navigation";
import { getSessao, iniciais } from "@/lib/painel";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

export default async function PainelLayout({ children }) {
  const { user, imob } = await getSessao();
  if (!user) redirect("/entrar");

  return (
    <div className="painel">
      <aside className="pside">
        <a className="logo" href="/painel">
          <img src="/logo-escuro.png" alt="Acholar" style={{ height: 30, width: "auto", display: "block" }} />
        </a>
        <nav className="pnav">
          <a href="/painel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>Painel</a>
          <a href="/painel/imoveis"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /></svg>Meus imóveis</a>
          <a href="/painel/importar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V5a2 2 0 0 1 2-2h2M4 17v2a2 2 0 0 0 2 2h2M20 7V5a2 2 0 0 0-2-2h-2M20 17v2a2 2 0 0 1-2 2h-2M8 12h8" /></svg>Importar XML</a>
          <a href="/painel/destaques"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3 6.5 7 .6-5.3 4.6L18.5 21 12 17.3 5.5 21l1.8-7.3L2 9.1l7-.6z" /></svg>Destaques</a>
          <a href="/painel/leads"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>Leads</a>
          <a href="/painel/perfil"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M9 21v-5h6v5" /></svg>Minha imobiliária</a>
        </nav>
        <div className="pspace" />
        <nav className="pnav">
          <a href="/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M21 3l-9 9M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /></svg>Ver o site</a>
          <LogoutButton />
        </nav>
        <div className="puser">
          <div className="av">{iniciais(imob?.nome)}</div>
          <div><b>{imob?.nome || "Imobiliária"}</b><span>Parceiro Acholar</span></div>
        </div>
      </aside>
      <div className="pmain">{children}</div>
    </div>
  );
}
