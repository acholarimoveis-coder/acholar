-- ============================================================
--  ACHOLAR — Melhorias 4 (ajuste manual de localização)
--  Permite corrigir a localização de imóveis do XML sem que a
--  sincronização diária sobrescreva o ajuste.
--  Rode no SQL Editor do Supabase (uma vez só).
-- ============================================================

-- Quando true, a localização (lat/lng) foi ajustada manualmente
-- e a sincronização por XML NÃO deve mais sobrescrevê-la.
alter table imoveis
  add column if not exists geo_travado boolean default false;

-- FIM.
