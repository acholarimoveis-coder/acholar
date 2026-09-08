-- ============================================================
--  ACHOLAR — Melhorias 7 (marcar imóvel como revisado)
--  Permite "aprovar" um imóvel na tela de Revisão para ele sair
--  daquela listagem. Não é tocado pela sincronização do XML.
--  Rode no SQL Editor do Supabase (uma vez só).
-- ============================================================

alter table imoveis
  add column if not exists revisado boolean default false;

-- FIM.
