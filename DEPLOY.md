# Como colocar o Acholar no ar (grátis)

Vamos usar **GitHub** (para guardar o código) + **Netlify** (para hospedar). Ambos gratuitos, e o Netlify permite uso comercial e publica projetos Next.js automaticamente.

> Você só precisa fazer isto uma vez. Depois, cada atualização do código sobe sozinha.

---

## Parte A — Subir o código para o GitHub

A forma mais fácil (sem comandos) é pelo **GitHub Desktop**:

1. Baixe e instale o **GitHub Desktop**: https://desktop.github.com
2. Abra e faça login com a sua conta do GitHub.
3. Menu **File → Add local repository**.
4. Em "Local path", escolha a pasta **`acholar`** (dentro de `Portal Imóveis`).
5. Vai aparecer um aviso de que a pasta ainda não é um repositório — clique no link **"create a repository"**.
   - Name: **acholar**
   - Git ignore: **None** (já temos um pronto)
   - Clique **Create repository**.
6. No canto inferior esquerdo, escreva uma mensagem (ex.: "primeiro commit") e clique **Commit to main**.
7. No topo, clique **Publish repository**.
   - Deixe **"Keep this code private"** marcado.
   - Clique **Publish repository**.

Pronto — o código está no GitHub. ✅

---

## Parte B — Publicar no Netlify

1. Acesse **https://www.netlify.com** e clique em **Sign up** → **Sign up with GitHub** (autorize).
2. Clique em **Add new site → Import an existing project**.
3. Escolha **Deploy with GitHub** e autorize; selecione o repositório **acholar**.
4. O Netlify reconhece o **Next.js** automaticamente. Pode deixar o comando de build como está (`npm run build`).
5. **Antes de publicar**, abra **Add environment variables** e adicione estas 4 (copie os valores do Supabase que você guardou):

   | Nome | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | a URL do seu projeto Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | a chave **anon** |
   | `SUPABASE_SERVICE_ROLE_KEY` | a chave **service_role** (secreta) |
   | `NEXT_PUBLIC_ADMIN_WHATSAPP` | seu WhatsApp, ex.: `5517990000000` |

6. Clique em **Deploy**. Aguarde 2–3 minutos.
7. O Netlify te dá um endereço como **`acholar.netlify.app`** — abra e veja o site no ar! 🎉

> Se você adicionar as variáveis só depois do primeiro deploy, clique em **Trigger deploy → Deploy site** para republicar com elas.

---

## Depois: o domínio

Quando o `acholar.com.br` estiver registrado, a gente aponta ele para o Netlify (em **Domain settings**). Eu te passo os valores de DNS na hora.

---

## Deu algum erro?

Sem problema — me mande o print ou a mensagem que aparecer, que a gente resolve. Erros de build no primeiro deploy são comuns e fáceis de ajustar.
