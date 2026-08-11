import { createClient } from "@/lib/supabase/server";

// Mostra um banner de publicidade ativo para um espaço específico.
// Se não houver anúncio ativo, não renderiza nada (sem buraco no layout).
export default async function Banner({ espaco }) {
  let anuncio = null;
  try {
    const supabase = createClient();
    const hoje = new Date().toISOString().slice(0, 10);
    const { data } = await supabase.from("anuncios").select("*").eq("espaco", espaco).eq("status", "ativo").limit(20);
    const validos = (data || []).filter(
      (a) => a.imagem_url && (!a.inicio || a.inicio <= hoje) && (!a.fim || a.fim >= hoje)
    );
    if (validos.length) anuncio = validos[Math.floor(Math.random() * validos.length)];
  } catch {
    return null;
  }
  if (!anuncio) return null;

  const img = <img src={anuncio.imagem_url} alt={anuncio.anunciante || "Parceiro"} loading="lazy" />;
  return (
    <div className="promo-slot">
      <div className="wrap">
        <div className={`promo-box ${espaco}`}>
          {anuncio.link ? (
            <a href={anuncio.link} target="_blank" rel="noopener sponsored nofollow">{img}</a>
          ) : (
            img
          )}
          <span className="promo-tag">Publicidade</span>
        </div>
      </div>
    </div>
  );
}
