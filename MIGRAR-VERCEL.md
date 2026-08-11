# Migrar o Acholar do Netlify para a Vercel (grátis)

Tempo estimado: ~15–20 min. É tudo por clique — não precisa mexer em terminal.

---

## Passo 1 — Subir o código novo pro GitHub

No **GitHub Desktop**:
- Mensagem do commit: `preparar deploy na vercel`
- **Commit to main** → **Push origin**

> Isso só atualiza o repositório. O Netlify não vai publicar (está pausado), e tudo bem — a Vercel é que vai publicar daqui pra frente.

Os arquivos novos que sobem: `vercel.json` (a automação diária) e um ajuste na rota `/api/cron`.

---

## Passo 2 — Criar a conta na Vercel

1. Acesse **https://vercel.com**
2. Clique em **Sign Up** → **Continue with GitHub** (use a mesma conta do GitHub do projeto).
3. Autorize a Vercel a acessar seus repositórios.

---

## Passo 3 — Importar o projeto

1. No painel da Vercel: **Add New… → Project**.
2. Encontre o repositório do **acholar** na lista → **Import**.
3. A Vercel detecta sozinha que é **Next.js** (não mude nada de framework/build).

**Antes de clicar em Deploy**, abra **Environment Variables** e adicione as 4 abaixo (copie os valores exatamente como estão hoje no Netlify, em *Site settings → Environment variables*):

| Nome | Onde pegar |
|------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | mesmo valor do Netlify |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | mesmo valor do Netlify |
| `SUPABASE_SERVICE_ROLE_KEY` | mesmo valor do Netlify |
| `CRON_SECRET` | mesmo valor do Netlify |

> Dica: no Netlify dá pra ver cada valor clicando no "olhinho". Copie e cole um por um.

4. Clique em **Deploy** e aguarde (1–2 min).

---

## Passo 4 — Testar

A Vercel te dá um endereço tipo `acholar.vercel.app`. Abra e confira:
- Home (destaques, cidades, imobiliária em destaque, banners)
- Busca `/imoveis` (mapa com pininhos)
- Uma página de imóvel
- Login e painel

Se tudo abrir certo, seguimos pro domínio.

---

## Passo 5 — Apontar o domínio acholar.com.br pra Vercel

1. Na Vercel: **Project → Settings → Domains → Add** → digite `acholar.com.br` (e depois `www.acholar.com.br`).
2. A Vercel vai mostrar **os registros de DNS exatos** que você precisa configurar (normalmente um registro **A** para `76.76.21.21` no domínio raiz e um **CNAME** para o `www`).
3. Onde o domínio está hoje (no registrador onde você comprou, ou no DNS do Netlify), **troque os registros** pelos que a Vercel indicar.
4. Aguarde a propagação (pode levar de minutos a algumas horas). A Vercel emite o certificado HTTPS sozinha.

> Se hoje o DNS está gerenciado no Netlify, o mais simples é apontar os **nameservers** do domínio (lá no registrador) para os da Vercel — a Vercel também mostra essa opção.

---

## Passo 6 — Conferir a automação diária

Depois do deploy, em **Project → Settings → Cron Jobs**, deve aparecer `/api/cron` rodando **1x por dia**. É o que sincroniza os XMLs e pausa planos vencidos — igual antes. O plano gratuito da Vercel cobre isso.

---

## Depois de migrar

- Pode **cancelar/ignorar o Netlify** — o site vai estar 100% na Vercel.
- O **Supabase não muda nada** (banco, fotos, logins continuam iguais).
- Os deploys novos passam a ser automáticos: todo `Push` no GitHub → a Vercel publica sozinha, **sem modelo de créditos que pausa**.

Qualquer passo que travar, me manda print que eu te desenrolo.
