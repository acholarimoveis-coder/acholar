-- ============================================================
--  ACHOLAR — Tornar um usuário ADMINISTRADOR do portal
--  1) Crie o usuário em Authentication -> Users (e-mail + senha, "Auto Confirm").
--  2) Troque o e-mail abaixo e rode no SQL Editor.
-- ============================================================

insert into profiles (id, nome, papel, imobiliaria_id)
select id, 'Administrador', 'admin', null
from auth.users
where email = 'TROQUE_PELO_EMAIL_DO_ADMIN@exemplo.com'
on conflict (id) do update
  set papel = 'admin',
      imobiliaria_id = null;
