-- ============================================================
--  ACHOLAR — Dados de exemplo (para testes da Fase 1)
--  Rode DEPOIS do schema.sql, no SQL Editor do Supabase.
--  Pode rodar mais de uma vez sem duplicar (usa IDs fixos).
-- ============================================================

-- ---------- Planos padrão ----------
insert into planos (id, nome, valor_mensal, valor_anual, limite_imoveis, destaques_inclusos) values
  ('a0000000-0000-0000-0000-000000000001','Essencial',99,990,30,0),
  ('a0000000-0000-0000-0000-000000000002','Profissional',199,1990,100,3),
  ('a0000000-0000-0000-0000-000000000003','Premium',349,3490,null,8)
on conflict (id) do nothing;

-- ---------- Imobiliária piloto ----------
insert into imobiliarias
  (id, nome, creci, whatsapp, cidade, bairro, plano_id, status, destaques_contratados)
values
  ('11111111-1111-1111-1111-111111111111','Recanto Jales Imóveis','12.345-J','5517990000000',
   'Jales','Centro','a0000000-0000-0000-0000-000000000002','ativa',3)
on conflict (id) do nothing;

-- ---------- Imóveis de exemplo (publicados) ----------
insert into imoveis
  (id, imobiliaria_id, codigo, tipo_negocio, tipo_imovel, titulo, descricao, preco,
   quartos, suites, banheiros, vagas, area_util, bairro, cidade, fotos, origem, status, destaque_ativo, visitas)
values
  ('c0000000-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','ACH-1042',
   'venda','casa','Casa com 3 quartos à venda no Jardim Aeroporto',
   'Casa térrea bem conservada, 3 dormitórios sendo 1 suíte, quintal amplo e edícula.',320000,
   3,1,2,2,140,'Jardim Aeroporto','Jales',
   '["https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=70"]','manual','publicado',true,128),

  ('c0000000-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111','ACH-1043',
   'locacao','apartamento','Apartamento com 2 quartos para alugar no Centro',
   'Apartamento mobiliado, 2 dormitórios, próximo ao comércio e serviços.',1400,
   2,0,1,1,68,'Centro','Jales',
   '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=70"]','manual','publicado',false,96),

  ('c0000000-0000-0000-0000-000000000003','11111111-1111-1111-1111-111111111111','ACH-1044',
   'venda','casa','Casa com 4 quartos à venda no Cond. Jardins',
   'Casa de alto padrão com 4 suítes, piscina e área gourmet em condomínio fechado.',890000,
   4,4,5,4,320,'Cond. Jardins','Jales',
   '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=70"]','manual','publicado',true,210),

  ('c0000000-0000-0000-0000-000000000004','11111111-1111-1111-1111-111111111111','ACH-1045',
   'venda','terreno','Terreno à venda no Residencial Panorama',
   'Terreno plano de 250m² em loteamento com infraestrutura, pronto para construir.',145000,
   null,null,null,null,250,'Res. Panorama','Jales',
   '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=70"]','manual','publicado',false,54),

  ('c0000000-0000-0000-0000-000000000005','11111111-1111-1111-1111-111111111111','ACH-1046',
   'venda','rural','Chácara à venda na Zona Rural de Jales',
   'Chácara de 5.000m² com pomar formado, poço artesiano e casa sede de 2 quartos.',480000,
   2,0,2,4,5000,'Zona Rural','Jales',
   '["https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=800&q=70"]','manual','publicado',true,88),

  ('c0000000-0000-0000-0000-000000000006','11111111-1111-1111-1111-111111111111','ACH-1047',
   'locacao','comercial','Sala comercial para alugar na Av. Francisco Jalles',
   'Sala comercial de 80m² na principal avenida, com 2 banheiros e vaga.',2500,
   null,null,2,2,80,'Centro','Jales',
   '["https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=70"]','manual','publicado',false,41)
on conflict (id) do nothing;

-- ---------- Vitrine da home (6 slots automáticos) ----------
insert into home_slots (posicao, tipo) values (1,'auto'),(2,'auto'),(3,'auto'),(4,'auto'),(5,'auto'),(6,'auto')
on conflict (posicao) do nothing;
