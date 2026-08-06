-- ============================================================
--  ACHOLAR — Estrutura do banco de dados (Fase 1)
--  Como usar: no painel do Supabase, abra "SQL Editor",
--  cole este arquivo inteiro e clique em "Run".
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- PLANOS ----------
create table if not exists planos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  valor_mensal numeric(10,2) default 0,
  valor_anual numeric(10,2) default 0,
  limite_imoveis int,                 -- null = ilimitado
  destaques_inclusos int default 0,
  ativo boolean default true,
  criado_em timestamptz default now()
);

-- ---------- IMOBILIÁRIAS ----------
create table if not exists imobiliarias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  creci text,
  logo_url text,
  descricao text,
  telefone text,
  whatsapp text,                      -- número que recebe os leads
  email text,
  endereco text,
  bairro text,
  cidade text default 'Jales',
  site text,
  instagram text,
  xml_url text,                       -- link do XML do CRM (Kenlo, Microsistec...)
  sistema text,                       -- CRM detectado
  plano_id uuid references planos(id),
  status text not null default 'pendente'
    check (status in ('pendente','teste','ativa','tolerancia','pausada','suspensa')),
  data_inicio_teste date,
  data_vigencia date,                 -- até quando o plano é válido
  destaques_contratados int default 0,-- quantidade de slots liberada pelo admin
  criado_em timestamptz default now()
);

-- ---------- PERFIS (liga o login do Supabase à imobiliária) ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  papel text not null default 'imobiliaria' check (papel in ('admin','imobiliaria')),
  imobiliaria_id uuid references imobiliarias(id) on delete set null,
  criado_em timestamptz default now()
);

-- helper: o usuário logado é admin?
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from profiles where id = auth.uid() and papel = 'admin');
$$;

-- helper: id da imobiliária do usuário logado
create or replace function minha_imobiliaria() returns uuid
language sql stable security definer set search_path = public as $$
  select imobiliaria_id from profiles where id = auth.uid();
$$;

-- ---------- IMÓVEIS ----------
create table if not exists imoveis (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid not null references imobiliarias(id) on delete cascade,
  codigo text,
  tipo_negocio text not null check (tipo_negocio in ('venda','locacao')),
  tipo_imovel text not null check (tipo_imovel in ('casa','apartamento','terreno','comercial','rural','lancamento')),
  titulo text,                        -- gerado no padrão pela aplicação
  descricao text,
  preco numeric(12,2),
  condominio numeric(10,2),
  iptu numeric(10,2),
  quartos int, suites int, banheiros int, vagas int,
  area_util numeric(10,2), area_total numeric(10,2),
  endereco text, bairro text, cidade text default 'Jales',
  lat double precision, lng double precision,
  fotos jsonb default '[]'::jsonb,    -- lista de URLs
  origem text not null default 'manual' check (origem in ('xml','manual')),
  external_id text,                   -- id do imóvel no XML (evita duplicar)
  destaque_ativo boolean default false,
  visitas int default 0,
  status text not null default 'pendente'
    check (status in ('rascunho','pendente','publicado','pausado','reprovado')),
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);
create index if not exists idx_imoveis_status on imoveis(status);
create index if not exists idx_imoveis_imobiliaria on imoveis(imobiliaria_id);
create index if not exists idx_imoveis_busca on imoveis(cidade,bairro,tipo_negocio,tipo_imovel,preco);

-- ---------- LEADS ----------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  imovel_id uuid references imoveis(id) on delete set null,
  imobiliaria_id uuid references imobiliarias(id) on delete cascade,
  nome text not null,
  telefone text not null,
  email text,
  mensagem text,
  canal text not null default 'formulario' check (canal in ('formulario','whatsapp')),
  status text not null default 'novo' check (status in ('novo','visto','respondido')),
  criado_em timestamptz default now()
);
create index if not exists idx_leads_imobiliaria on leads(imobiliaria_id);

-- ---------- VITRINE DA HOME (slots) ----------
create table if not exists home_slots (
  posicao int primary key,            -- 1, 2, 3...
  tipo text not null default 'auto' check (tipo in ('fixo','auto')),
  imovel_id uuid references imoveis(id) on delete set null
);

-- ---------- PUBLICIDADE ----------
create table if not exists anuncios (
  id uuid primary key default gen_random_uuid(),
  anunciante text not null,
  tipo text check (tipo in ('parceiro','incorporadora')),
  espaco text,                        -- home-topo, home-retangulo, resultados-lateral...
  imagem_url text,
  link text,
  inicio date, fim date,
  valor numeric(10,2),
  status text default 'ativo' check (status in ('ativo','agendado','encerrado')),
  criado_em timestamptz default now()
);

-- ---------- CONFIGURAÇÕES (chave/valor) ----------
create table if not exists configuracoes (
  chave text primary key,
  valor text
);
insert into configuracoes (chave, valor) values
  ('dias_teste_gratis','90'),
  ('dias_tolerancia','5'),
  ('home_total_slots','6')
on conflict (chave) do nothing;

-- ============================================================
--  SEGURANÇA (RLS) — regras básicas. Refinamos nos próximos sprints.
-- ============================================================
alter table imobiliarias enable row level security;
alter table imoveis      enable row level security;
alter table leads        enable row level security;
alter table anuncios     enable row level security;
alter table profiles     enable row level security;

-- Imóveis publicados são visíveis para todos (site público)
create policy "imoveis publicos" on imoveis
  for select using (status = 'publicado' or is_admin() or imobiliaria_id = minha_imobiliaria());
-- A imobiliária gerencia os próprios imóveis; admin gerencia tudo
create policy "imoveis gestao" on imoveis
  for all using (is_admin() or imobiliaria_id = minha_imobiliaria())
  with check (is_admin() or imobiliaria_id = minha_imobiliaria());

-- Imobiliárias ativas visíveis a todos
create policy "imobiliarias publicas" on imobiliarias
  for select using (status in ('teste','ativa','tolerancia') or is_admin() or id = minha_imobiliaria());
create policy "imobiliarias gestao" on imobiliarias
  for all using (is_admin() or id = minha_imobiliaria())
  with check (is_admin() or id = minha_imobiliaria());

-- Qualquer visitante pode CRIAR um lead; só o dono (ou admin) lê
create policy "leads criar" on leads for insert with check (true);
create policy "leads ler"   on leads for select using (is_admin() or imobiliaria_id = minha_imobiliaria());

-- Anúncios de publicidade visíveis a todos; admin gerencia
create policy "anuncios publicos" on anuncios for select using (status = 'ativo' or is_admin());
create policy "anuncios gestao"   on anuncios for all using (is_admin()) with check (is_admin());

-- Perfis: cada um vê o seu; admin vê todos
create policy "profiles proprio" on profiles for select using (id = auth.uid() or is_admin());

-- FIM. Depois inserimos os planos padrão (Essencial/Profissional/Premium)
-- e a primeira imobiliária piloto.
