-- ============================================================
--  ACHOLAR — "Gaveta" (bucket) de fotos dos imóveis
--  Rode no SQL Editor do Supabase (uma vez só).
-- ============================================================

-- Cria o bucket público "imoveis" (para as fotos ficarem visíveis no site)
insert into storage.buckets (id, name, public)
values ('imoveis', 'imoveis', true)
on conflict (id) do nothing;

-- Qualquer pessoa pode VER as fotos (site público)
drop policy if exists "fotos leitura publica" on storage.objects;
create policy "fotos leitura publica" on storage.objects
  for select using (bucket_id = 'imoveis');

-- Usuários logados (imobiliárias) podem ENVIAR fotos
drop policy if exists "fotos upload autenticado" on storage.objects;
create policy "fotos upload autenticado" on storage.objects
  for insert to authenticated with check (bucket_id = 'imoveis');

-- Usuários logados podem atualizar/substituir suas fotos
drop policy if exists "fotos update autenticado" on storage.objects;
create policy "fotos update autenticado" on storage.objects
  for update to authenticated using (bucket_id = 'imoveis');
