"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { salvarImovel } from "@/app/actions/imoveis";
import { gerarTitulo } from "@/lib/titulo";

const vazio = {
  tipo_negocio: "venda", tipo_imovel: "casa",
  quartos: "", suites: "", banheiros: "", vagas: "",
  area_util: "", area_total: "",
  bairro: "", endereco: "", cidade: "Jales",
  preco: "", condominio: "", iptu: "",
  descricao: "", fotos: [],
};

export default function ImovelForm({ imovel, imobId }) {
  const router = useRouter();
  const [f, setF] = useState(imovel ? { ...vazio, ...imovel, fotos: imovel.fotos || [] } : vazio);
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [subindo, setSubindo] = useState(false);

  const up = (campo, v) => setF((p) => ({ ...p, [campo]: v }));
  const titulo = useMemo(() => gerarTitulo(f), [f.tipo_imovel, f.quartos, f.tipo_negocio, f.bairro]);

  async function enviarFotos(e) {
    const arquivos = Array.from(e.target.files || []);
    if (!arquivos.length) return;
    setSubindo(true);
    setErro(null);
    const supabase = createClient();
    const novas = [];
    for (const arq of arquivos) {
      const nome = `${imobId}/${Date.now()}-${arq.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
      const { error } = await supabase.storage.from("imoveis").upload(nome, arq, { upsert: false });
      if (error) { setErro("Erro ao enviar foto: " + error.message); continue; }
      const { data } = supabase.storage.from("imoveis").getPublicUrl(nome);
      novas.push(data.publicUrl);
    }
    setF((p) => ({ ...p, fotos: [...p.fotos, ...novas] }));
    setSubindo(false);
  }

  function removerFoto(i) {
    setF((p) => ({ ...p, fotos: p.fotos.filter((_, idx) => idx !== i) }));
  }

  async function salvar(e) {
    e.preventDefault();
    if (!f.bairro) return setErro("Informe ao menos o bairro.");
    if (!f.preco) return setErro("Informe o preço.");
    setSalvando(true);
    setErro(null);
    const r = await salvarImovel(f);
    setSalvando(false);
    if (r.ok) { router.push("/painel/imoveis"); router.refresh(); }
    else setErro(r.error || "Não foi possível salvar.");
  }

  return (
    <form className="pform" onSubmit={salvar}>
      <div className="fcard">
        <h3>Tipo de anúncio</h3>
        <div className="row">
          <div className="field">
            <label>Negócio</label>
            <div className="seg2">
              <button type="button" className={f.tipo_negocio === "venda" ? "on" : ""} onClick={() => up("tipo_negocio", "venda")}>Venda</button>
              <button type="button" className={f.tipo_negocio === "locacao" ? "on" : ""} onClick={() => up("tipo_negocio", "locacao")}>Locação</button>
            </div>
          </div>
          <div className="field">
            <label>Tipo de imóvel</label>
            <select className="cf-inp" style={{ marginBottom: 0 }} value={f.tipo_imovel} onChange={(e) => up("tipo_imovel", e.target.value)}>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
              <option value="rural">Rural</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Título (gerado automaticamente)</label>
          <div className="titlebox">{titulo}</div>
        </div>
      </div>

      <div className="fcard">
        <h3>Localização</h3>
        <div className="row3">
          <div className="field"><label>Bairro</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.bairro} onChange={(e) => up("bairro", e.target.value)} placeholder="Jardim Aeroporto" /></div>
          <div className="field"><label>Endereço</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.endereco} onChange={(e) => up("endereco", e.target.value)} placeholder="Rua..." /></div>
          <div className="field"><label>Cidade</label><input className="cf-inp" style={{ marginBottom: 0 }} value={f.cidade} onChange={(e) => up("cidade", e.target.value)} /></div>
        </div>
      </div>

      <div className="fcard">
        <h3>Características</h3>
        <div className="row4">
          <div className="field"><label>Quartos</label><input className="cf-inp" style={{ marginBottom: 0 }} type="number" value={f.quartos} onChange={(e) => up("quartos", e.target.value)} /></div>
          <div className="field"><label>Suítes</label><input className="cf-inp" style={{ marginBottom: 0 }} type="number" value={f.suites} onChange={(e) => up("suites", e.target.value)} /></div>
          <div className="field"><label>Banheiros</label><input className="cf-inp" style={{ marginBottom: 0 }} type="number" value={f.banheiros} onChange={(e) => up("banheiros", e.target.value)} /></div>
          <div className="field"><label>Vagas</label><input className="cf-inp" style={{ marginBottom: 0 }} type="number" value={f.vagas} onChange={(e) => up("vagas", e.target.value)} /></div>
          <div className="field"><label>Área útil (m²)</label><input className="cf-inp" style={{ marginBottom: 0 }} type="number" value={f.area_util} onChange={(e) => up("area_util", e.target.value)} /></div>
          <div className="field"><label>Área total (m²)</label><input className="cf-inp" style={{ marginBottom: 0 }} type="number" value={f.area_total} onChange={(e) => up("area_total", e.target.value)} /></div>
        </div>
      </div>

      <div className="fcard">
        <h3>Valores</h3>
        <div className="row3">
          <div className="field"><label>Preço (R$)</label><input className="cf-inp" style={{ marginBottom: 0 }} type="number" value={f.preco} onChange={(e) => up("preco", e.target.value)} placeholder="320000" /></div>
          <div className="field"><label>Condomínio (R$)</label><input className="cf-inp" style={{ marginBottom: 0 }} type="number" value={f.condominio} onChange={(e) => up("condominio", e.target.value)} /></div>
          <div className="field"><label>IPTU (R$/mês)</label><input className="cf-inp" style={{ marginBottom: 0 }} type="number" value={f.iptu} onChange={(e) => up("iptu", e.target.value)} /></div>
        </div>
      </div>

      <div className="fcard">
        <h3>Descrição</h3>
        <textarea className="cf-inp" style={{ marginBottom: 0 }} rows={5} value={f.descricao} onChange={(e) => up("descricao", e.target.value)} placeholder="Descreva o imóvel: cômodos, estado, diferenciais, o que tem por perto..." />
      </div>

      <div className="fcard">
        <h3>Fotos</h3>
        <label className="upbox">
          {subindo ? "Enviando fotos..." : "Clique para selecionar as fotos (JPG ou PNG)"}
          <input type="file" accept="image/*" multiple onChange={enviarFotos} style={{ display: "none" }} />
        </label>
        {f.fotos.length > 0 ? (
          <div className="thumbs-up">
            {f.fotos.map((url, i) => (
              <div className="t" key={i}>
                <img src={url} alt="" />
                <button type="button" onClick={() => removerFoto(i)}>×</button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {erro ? <div className="cf-erro" style={{ marginBottom: 10 }}>{erro}</div> : null}
      <div className="fsave">
        <a className="btn btn-ghost" href="/painel/imoveis">Cancelar</a>
        <button className="btn btn-primary" type="submit" disabled={salvando || subindo}>
          {salvando ? "Salvando..." : "Salvar imóvel"}
        </button>
      </div>
    </form>
  );
}
