-- ============================================================
--  ACHOLAR — Melhorias (cidades, destaque de imobiliária, publicidade)
--  Rode no SQL Editor do Supabase (uma vez só).
-- ============================================================

-- 1) Imobiliária em destaque na home (controlado pelo admin)
alter table imobiliarias
  add column if not exists destaque_home boolean default false;

-- 2) Índice para achar os imóveis mais visitados de cada imobiliária
create index if not exists idx_imoveis_visitas on imoveis(imobiliaria_id, visitas desc);

-- 3) Índice para listar cidades distintas rapidamente
create index if not exists idx_imoveis_cidade on imoveis(cidade);

-- 4) "Gaveta" (bucket) público para as imagens dos banners de publicidade
insert into storage.buckets (id, name, public)
values ('publicidade', 'publicidade', true)
on conflict (id) do nothing;

-- Qualquer pessoa pode VER os banners (site público)
drop policy if exists "publicidade leitura publica" on storage.objects;
create policy "publicidade leitura publica" on storage.objects
  for select using (bucket_id = 'publicidade');

-- Usuários logados (admin) podem ENVIAR imagens de banner
drop policy if exists "publicidade upload autenticado" on storage.objects;
create policy "publicidade upload autenticado" on storage.objects
  for insert to authenticated with check (bucket_id = 'publicidade');

drop policy if exists "publicidade update autenticado" on storage.objects;
create policy "publicidade update autenticado" on storage.objects
  for update to authenticated using (bucket_id = 'publicidade');

-- 5) Permitir que o admin gerencie/insira anúncios (a policy de gestão já existe,
--    mas garantimos o insert do admin aqui por segurança)
drop policy if exists "anuncios insert admin" on anuncios;
create policy "anuncios insert admin" on anuncios
  for insert to authenticated with check (is_admin());

-- FIM.
