-- ============================================================
--  ACHOLAR — Cadastrar a Imobiliária Globo (parceira real) com o XML dela
-- ============================================================

-- 1) Cria/atualiza a imobiliária com o link do XML já configurado
insert into imobiliarias (id, nome, whatsapp, cidade, status, xml_url, destaques_contratados, data_inicio_teste, data_vigencia)
values (
  '22222222-2222-2222-2222-222222222222',
  'Imobiliária Globo',
  '5517997180425',
  'Jales',
  'teste',
  'https://publicador-xml.s3-us-west-2.amazonaws.com/c3faa134159757bbb39dc3c4ff03d8bf/microsistec.xml',
  0,
  current_date,
  current_date + 90
)
on conflict (id) do update set xml_url = excluded.xml_url, nome = excluded.nome, whatsapp = excluded.whatsapp;

-- 2) DEPOIS de criar o usuário dela em Authentication -> Users (e-mail + senha, "Auto Confirm"),
--    troque o e-mail abaixo e rode para ligar o login à imobiliária:
insert into profiles (id, nome, papel, imobiliaria_id)
select id, 'Imobiliária Globo', 'imobiliaria', '22222222-2222-2222-2222-222222222222'
from auth.users
where email = 'TROQUE_PELO_EMAIL_DA_GLOBO@exemplo.com'
on conflict (id) do update set imobiliaria_id = excluded.imobiliaria_id, papel = 'imobiliaria';
