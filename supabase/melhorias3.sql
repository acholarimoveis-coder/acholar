-- ============================================================
--  ACHOLAR — Melhorias 3 (balde de mídia neutro p/ banners)
--  Motivo: baldes/URLs com a palavra "publicidade" são bloqueados
--  por bloqueadores de anúncio. Usamos um nome neutro: "midia".
--  Rode no SQL Editor do Supabase (uma vez só).
-- ============================================================

insert into storage.buckets (id, name, public)
values ('midia', 'midia', true)
on conflict (id) do nothing;

-- Qualquer pessoa pode VER as imagens (site público)
drop policy if exists "midia leitura publica" on storage.objects;
create policy "midia leitura publica" on storage.objects
  for select using (bucket_id = 'midia');

-- Usuários logados (admin) podem ENVIAR imagens
drop policy if exists "midia upload autenticado" on storage.objects;
create policy "midia upload autenticado" on storage.objects
  for insert to authenticated with check (bucket_id = 'midia');

drop policy if exists "midia update autenticado" on storage.objects;
create policy "midia update autenticado" on storage.objects
  for update to authenticated using (bucket_id = 'midia');

-- FIM.
