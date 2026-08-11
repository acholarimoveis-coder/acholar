-- ============================================================
--  ACHOLAR — Melhorias 5 (localização automática por bairro)
--  Quando o imóvel vem do XML sem coordenada válida, o portal
--  calcula uma localização aproximada pelo bairro/cidade.
--  Rode no SQL Editor do Supabase (uma vez só).
-- ============================================================

-- Marca imóveis cuja localização é aproximada (calculada pelo bairro).
alter table imoveis
  add column if not exists geo_aprox boolean default false;

-- Cache de geocodificação: guarda a coordenada de cada "bairro|cidade"
-- já consultado, para não repetir a busca externa.
create table if not exists geocache (
  chave text primary key,           -- ex.: "centro|jales"
  lat double precision,
  lng double precision,
  criado_em timestamptz default now()
);

alter table geocache enable row level security;
-- Leitura liberada; escrita só pelo processo do servidor (service role, que ignora RLS).
drop policy if exists "geocache leitura" on geocache;
create policy "geocache leitura" on geocache for select using (true);

-- FIM.
