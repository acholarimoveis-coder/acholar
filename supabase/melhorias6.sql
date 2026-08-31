-- ============================================================
--  ACHOLAR — Melhorias 6 (delisting + log de sincronização)
--  - Imóvel que sai do XML do cliente passa a status "removido"
--    (some das buscas). Se voltar ao XML, volta a "publicado".
--  - Registro (log) de cada sincronização.
--  Rode no SQL Editor do Supabase (uma vez só).
-- ============================================================

-- 1) Permite o novo status "removido" na tabela de imóveis.
alter table imoveis drop constraint if exists imoveis_status_check;
alter table imoveis add constraint imoveis_status_check
  check (status in ('rascunho','pendente','publicado','pausado','reprovado','removido'));

-- 2) Log de sincronização (quantos imóveis entraram, mudaram, saíram).
create table if not exists sync_log (
  id uuid primary key default gen_random_uuid(),
  imobiliaria_id uuid references imobiliarias(id) on delete cascade,
  origem text default 'auto',          -- cron | manual | cadastro | auto
  novos int default 0,
  atualizados int default 0,
  removidos int default 0,
  total int default 0,
  criado_em timestamptz default now()
);
create index if not exists idx_sync_log_data on sync_log(criado_em desc);

alter table sync_log enable row level security;
-- Só o admin lê o log.
drop policy if exists "sync_log leitura admin" on sync_log;
create policy "sync_log leitura admin" on sync_log for select using (is_admin());
-- Qualquer usuário logado pode registrar (a imobiliária ao importar; o robô usa service role).
drop policy if exists "sync_log insert" on sync_log;
create policy "sync_log insert" on sync_log for insert to authenticated with check (true);

-- FIM.
