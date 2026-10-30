# CLAUDE.md — Brain Logs

Contexto para o Claude Code trabalhar neste repositório. Plano e andamento das fases: [PLAN.md](PLAN.md).

## Como trabalhar com o usuário

- Responder em **português**, de forma **curta e direta**, com passos numerados. Textos longos confundem.
- "Dúvida apenas" / "apenas ideias" / "não mexer em nada" = responder sem alterar código.
- Neste repositório (fase inicial): **commit e push direto na `main`**, sem branch/PR, até ele pedir outra coisa.
- Mensagens de commit em português, no formato `feat: ...` / `fix: ...` / `chore: ...`, terminando com:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- Configurações no site do GitHub (Pages, secrets) e no console do Firebase ele faz: entregar o passo a passo. Não há `gh` instalado.
- Sempre verificar antes de dizer que está pronto: `npm run build`, `npm test -- --watch=false` e `npm run check`.

## O que é

Site público do blog técnico **Brain Logs** em `https://thiago662.github.io/brain-logs-app/`.
O conteúdo é escrito no **Ademiro de Blogs** (CMS do mesmo usuário, repositório `thiago662/ademiro-de-blogs`, pasta `C:\Projetos\Blogs\ademiro-de-blogs`) e lido do Firestore do projeto Firebase `ademiro-dac27`. Este repositório só lê; nunca escreve no banco.

## Stack

- Angular 22 standalone, zoneless, signals; Bootstrap 5.
- **Prerender estático** (`outputMode: "static"` no `angular.json`, sem servidor Express): o build gera um HTML por rota, publicado no GitHub Pages.
- Firebase **Firestore lite** (`firebase/firestore/lite`, REST): leitura apenas.
- `marked` (GFM) para Markdown → HTML.
- Testes unitários com Vitest (`ng test`).

## Estrutura

```
src/app/
  core/blog.service.ts   leitura do Firestore + TransferState (ver "Dados")
  core/markdown.ts       renderMarkdown(md) → HTML (não sanitiza; ver "Segurança")
  core/seo.ts            título + meta tags (description, Open Graph, Twitter, robots)
  core/fields.ts         leitura tolerante de settings (autor, linkedin) e custom (nivel, stack)
  core/logo.ts           <app-logo [grain]>: marca SVG (granulado só no logo grande)
  posts/post-list.*      rota "/"       — lista de posts
  posts/post-page.*      rota "/:slug"  — post
  not-found.ts           rota "**"      — 404 (noindex)
  app.routes.ts          rotas do navegador
  app.routes.server.ts   modo de render por rota (Prerender / Client) e getPrerenderParams
src/environments/
  environment.ts                commitado: blogSlug, siteUrl, importa firebase.config
  firebase.config.example.ts    commitado: modelo vazio
  firebase.config.ts            IGNORADO pelo git: config real do Firebase
tools/check.mjs          teste no Chrome headless do build (npm run check)
.github/workflows/deploy.yml
```

## Comandos

| Comando | Uso |
|---|---|
| `npm start` | dev em http://localhost:4200 (a porta pode estar ocupada pelo blog-de-notas; o Angular oferece outra) |
| `npm run build` | build de produção + prerender em `dist/brain-logs-app/browser` |
| `npm test -- --watch=false` | testes unitários |
| `npm run check` | depois do build: abre o Chrome headless e confere páginas, console e requisições ao Firestore |

Resultado esperado do `npm run check`: `firestoreNaHome: 0` e `firestoreNoPostDireto: 0` (dados vêm no HTML), `postInexistente` com `robots=noindex` e "Nenhum erro de console.".

Mudou o `angular.json`? Reiniciar o `npm start` — o dev server não relê esse arquivo.

## Configuração do Firebase

- Local: `src/environments/firebase.config.ts` (ignorado pelo git) com `apiKey`, `authDomain`, `projectId`, `appId` do projeto `ademiro-dac27`. Se não existir, copiar do `.example` e preencher (valores no `firebaseConfig` do console, ou no `.private/chave.txt` do ademiro).
- Deploy: o workflow gera esse arquivo a partir do secret **`FIREBASE_CONFIG`** (objeto `{ apiKey: ..., ... }` colado do console; já configurado).
- Esses valores não são segredo (vão no JS publicado); a proteção são as Security Rules do ademiro.

## Dados (contrato com o Ademiro)

Firestore:

```
blogs/{blogId}                 slug, name, description, publicUrl, deployUrl, fieldDefs[], settings{}
blogs/{blogId}/posts/{postId}  slug, title, subtitle, summary, coverUrl, body (markdown), tags[],
                               status ('draft'|'published'|'archived'), custom{}, extras[],
                               publishedAt (Timestamp), updatedAt, authorUid
```

- O blog é encontrado por `slug == environment.blogSlug` (`'brain-logs'`).
- **Toda consulta de posts precisa filtrar `status == 'published'`** — as rules negam leitura pública de rascunhos e a consulta inteira falha sem o filtro.
- Índice composto `status ==` + `publishedAt desc` já existe (deploy feito pelo ademiro).
- Campos customizados combinados para este blog (configurar no ademiro, em *Configurações* do blog):
  - escopo **blog** → `settings.autor`, `settings.linkedin`
  - escopo **post** → `custom.nivel` (lista de opções), `custom.stack` (tags)
  - Em 2026-10-30 o blog ainda **não tinha** esses campos e só havia um post de teste (`slug: teste`). O código deve tolerar campos ausentes.
- `extras[]` (campos avulsos por post): `{ key, label, type, value }` — ainda não exibido.

### TransferState e PendingTasks (não remover)

`BlogService.cached()`:
- no prerender, busca no Firestore e grava no `TransferState` (vai embutido no HTML);
- no navegador, usa o que veio no HTML e só consulta o Firestore em navegação interna;
- `PendingTasks.add()` faz o prerender **esperar** as consultas (o app é zoneless; sem isso a página sai vazia). Nesta versão do Angular, `PendingTasks.run()` não devolve o resultado — usar `add()` + `finally`.
- Datas viram string ISO (`publishedAt`) para serem serializáveis.

## Segurança

- HTML do post entra **só** via `[innerHTML]`: o Angular sanitiza (remove `<script>`, eventos, `javascript:`) no navegador e no prerender. Não usar `bypassSecurityTrustHtml`.
- `renderMarkdown` aceita só imagens `https://`.
- O sanitizador do Angular remove `id` e `<input>` (checkbox de lista de tarefas). Aceito por enquanto.

## Particularidades do conteúdo vindo do Ademiro

- O editor (Milkdown) grava imagens em bloco como `![1.00](url "legenda")`: o **alt é a proporção** e a legenda vai no **título**. `renderMarkdown` já usa o título como alt.

## Prerender e deploy

- `app.routes.server.ts`: `/` e `/:slug` em `RenderMode.Prerender`; `getPrerenderParams` lista os slugs publicados. `**` em `RenderMode.Client`.
- O deploy copia `index.csr.html` → `404.html`: rotas sem página (post publicado depois do último build) carregam o app no navegador e buscam o conteúdo.
- `deploy.yml` roda no push na `main`, manualmente (*Run workflow*) e **a cada 6h** (o GitHub pausa agendamentos após 60 dias sem atividade no repo).
- Meta tags usam `environment.siteUrl` para URLs absolutas (exigência do Open Graph).

## Armadilhas já resolvidas

- **`npm ci` no Linux do Actions falhava** com `@emnapi/core ... does not satisfy`: conflito no fallback wasm opcional do build. Resolvido com `overrides` de `@emnapi/*` em 1.x no `package.json` — não remover. Se o `npm ci` do CI voltar a falhar após instalar pacotes no Windows, pedir ao usuário as linhas `npm error` do passo *Run npm ci* e, se for o lock, regenerar com `npm install --package-lock-only` numa pasta limpa só com o `package.json`.
- Lock gerado sobre `node_modules` antigo ficou inconsistente: regenerar do zero resolve.

## Próximos passos (ver PLAN.md)

1. **Usuário, no ademiro:** preencher no Brain Logs a URL pública `https://thiago662.github.io/brain-logs-app` e a URL do deploy `https://github.com/thiago662/brain-logs-app/actions/workflows/deploy.yml`; criar os campos `autor`, `linkedin`, `nivel`, `stack`; publicar posts reais (rascunhos em `C:\Projetos\Blogs\textos`, ex.: "projetos curtos").
2. **Fase 4 — Visual: feita.** Identidade em `src/styles.scss` (tokens `--bl-*`, tema escuro via `data-bs-theme`). Falta só conferir com um post real (nível, stack, capa).
3. **Fase 5 — LinkedIn:** publicar "projetos curtos", rodar o deploy e validar o link no Post Inspector (https://www.linkedin.com/post-inspector/).

## Projetos relacionados

- `C:\Projetos\Blogs\ademiro-de-blogs` — CMS (fonte dos dados). Ver o README de lá para modelo de dados e rules.
- `C:\Projetos\Blogs\blog-de-notas-app` — segundo blog (ensaios; visual de post-its por categoria), ainda em Angular 17 lendo o Realtime DB antigo. Será migrado depois, seguindo o mesmo modelo deste repositório.
- `C:\Projetos\ScrumTruco\scrum-truco-app` — origem do padrão `firebase.config.ts` + secret `FIREBASE_CONFIG`.
