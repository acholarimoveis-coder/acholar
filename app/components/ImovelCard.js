import { formatPreco, FOTO_PLACEHOLDER } from "@/lib/format";

const Bed = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 14h18M6 10V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" /></svg>);
const Bath = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M6 12V6a2 2 0 0 1 4 0" /></svg>);
const Car = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13v5h-2v-2H7v2H5z" /></svg>);
const Area = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v16H4z" /><path d="M4 9h4M4 15h4M9 4v4M15 4v4" /></svg>);
const Pin = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>);

export default function ImovelCard({ imovel }) {
  const foto = (imovel.fotos && imovel.fotos[0]) || FOTO_PLACEHOLDER;
  const locacao = imovel.tipo_negocio === "locacao";
  return (
    <a className="card" href={`/imovel/${imovel.id}`}>
      <div className="card-photo">
        <img src={foto} alt={imovel.titulo || "Imóvel"} loading="lazy" />
        <span className={`badge ${locacao ? "rent" : ""}`}>{locacao ? "Aluguel" : "À venda"}</span>
      </div>
      <div className="card-body">
        <div className="price">{formatPreco(imovel.preco, imovel.tipo_negocio)}</div>
        <div className="card-title">{imovel.titulo}</div>
        <div className="card-loc"><Pin /> {imovel.bairro}{imovel.cidade ? `, ${imovel.cidade}` : ""}</div>
        <div className="specs">
          {imovel.quartos ? <div><Bed /> {imovel.quartos}</div> : null}
          {imovel.banheiros ? <div><Bath /> {imovel.banheiros}</div> : null}
          {imovel.vagas ? <div><Car /> {imovel.vagas}</div> : null}
          {imovel.area_util ? <div><Area /> {imovel.area_util}m²</div> : null}
        </div>
      </div>
    </a>
  );
}
