-- ============================================================
--  ACHOLAR — Ligar um usuário de login à imobiliária piloto
--  Rode DEPOIS de criar o usuário em Authentication -> Users.
--  TROQUE o e-mail abaixo pelo e-mail que você cadastrou.
-- ============================================================

insert into profiles (id, nome, papel, imobiliaria_id)
select id, 'Recanto Jales Imóveis', 'imobiliaria', '11111111-1111-1111-1111-111111111111'
from auth.users
where email = 'TROQUE_PELO_SEU_EMAIL@exemplo.com'
on conflict (id) do update
  set papel = excluded.papel,
      imobiliaria_id = excluded.imobiliaria_id;

-- Confira se ligou certo:
-- select p.nome, p.papel, i.nome as imobiliaria
-- from profiles p join imobiliarias i on i.id = p.imobiliaria_id;
