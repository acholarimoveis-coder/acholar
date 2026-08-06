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
          <svg className="mark" viewBox="0 0 40 40" fill="none">
            <path d="M20 4 L34 15 V34 a2 2 0 0 1-2 2 H8 a2 2 0 0 1-2-2 V15 Z" fill="#fff" />
            <path d="M20 4 L34 15 V20 C30 17 25 16 20 16 S10 17 6 20 V15 Z" fill="#0E7A6E" />
            <circle cx="20" cy="26" r="4.5" fill="#10261F" />
          </svg>
          Acholar
        </a>
        <nav className="pnav">
          <a href="/painel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>Painel</a>
          <a href="/painel/imoveis"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /></svg>Meus imóveis</a>
          <a href="/painel/leads"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>Leads</a>
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
