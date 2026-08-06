# Acholar — Portal de imóveis da região de Jales

Aplicação em **Next.js** + **Supabase**. Esta pasta (`acholar/`) é o código do portal.

## Estrutura

```
acholar/
├─ app/                 páginas do site (Next.js App Router)
│  ├─ layout.js         estrutura base (idioma, metadados)
│  ├─ globals.css       cores e estilos da marca (design tokens)
│  └─ page.js           página inicial (Home)
├─ lib/supabase/        conexão com o banco (cliente e servidor)
├─ supabase/schema.sql  estrutura do banco de dados
├─ .env.example         modelo das chaves (copie para .env.local)
└─ next.config.mjs      configuração do Next.js
```

## Passo a passo para rodar

### 1. Banco de dados (Supabase)
1. No painel do Supabase, abra **SQL Editor**.
2. Cole todo o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Em **Project Settings → API**, copie a **URL** e as chaves (**anon** e **service_role**).

### 2. Variáveis de ambiente
1. Copie `.env.example` para `.env.local`.
2. Preencha as chaves do Supabase que você copiou.

### 3. Rodar na sua máquina (opcional, para testar)
Requer Node.js 18+ instalado.
```bash
npm install
npm run dev
```
Abra http://localhost:3000

### 4. Publicar (Cloudflare Pages — grátis)
1. Suba esta pasta para um repositório no **GitHub**.
2. No **Cloudflare Pages**, conecte o repositório.
3. Preset de build: **Next.js**. Comando: `npm run build`.
4. Adicione as variáveis de ambiente (as mesmas do `.env.local`).
5. Aponte o domínio `acholar.com.br` para o projeto.

## Progresso (Fase 1)

- [x] Sprint 0 — Fundação do projeto (estrutura, marca, conexão Supabase)
- [x] Sprint 1 — Banco de dados (schema.sql)
- [ ] Sprint 2 — Site público (home, busca, página do imóvel) com dados reais
- [ ] Sprint 3 — Motor de leads (formulário + WhatsApp)
- [ ] Sprint 4 — Painel da imobiliária
- [ ] Sprint 5 — Importação XML
- [ ] Sprint 6 — Painel do administrador
- [ ] Sprint 7 — Destaques, vitrine e publicidade
- [ ] Sprint 8 — Acabamento e lançamento piloto

O visual segue os mockups aprovados em `../mockups/`.
