-- ============================================================
--  ACHOLAR — Índice para a importação por XML
--  Evita imóveis duplicados na sincronização (por imobiliária + código).
--  Rode uma vez no SQL Editor.
-- ============================================================

create unique index if not exists uq_imovel_externo
  on imoveis (imobiliaria_id, external_id)
  where external_id is not null;
