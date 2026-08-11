-- ============================================================
--  ACHOLAR — Melhorias 2 (visitas, avisos de cobrança, relatórios)
--  Rode no SQL Editor do Supabase (uma vez só).
-- ============================================================

-- 1) Contador de visitas dos imóveis (chamado quando alguém abre o anúncio).
--    SECURITY DEFINER => roda com privilégio e não depende de RLS.
create or replace function increment_visita(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update imoveis set visitas = coalesce(visitas, 0) + 1
  where id = p_id and status = 'publicado';
$$;

grant execute on function increment_visita(uuid) to anon, authenticated;

-- 2) Configurações de cobrança (WhatsApp do admin + mensagem padrão de renovação).
insert into configuracoes (chave, valor) values
  ('whatsapp_cobranca',''),
  ('msg_cobranca','Olá, sou da imobiliária {imob} e gostaria de fazer a renovação do meu plano.')
on conflict (chave) do nothing;

-- 3) Garante que os planos padrão existem (idempotente).
insert into planos (id, nome, valor_mensal, valor_anual, limite_imoveis, destaques_inclusos) values
  ('a0000000-0000-0000-0000-000000000001','Essencial',99,990,30,0),
  ('a0000000-0000-0000-0000-000000000002','Profissional',199,1990,100,3),
  ('a0000000-0000-0000-0000-000000000003','Premium',349,3490,null,8)
on conflict (id) do nothing;

-- 4) A tabela de configurações precisa ser legível/gravável pelo admin.
alter table configuracoes enable row level security;
drop policy if exists "config leitura" on configuracoes;
create policy "config leitura" on configuracoes for select using (true);
drop policy if exists "config gestao" on configuracoes;
create policy "config gestao" on configuracoes for all using (is_admin()) with check (is_admin());

-- FIM.
