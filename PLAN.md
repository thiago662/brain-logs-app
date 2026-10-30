# Plano — Brain Logs

Blog técnico (tecnologia, estudos, carreira) publicado em `https://thiago662.github.io/brain-logs-app/`. O conteúdo vem do **Ademiro de Blogs** (blog `brain-logs` no Firestore do projeto `ademiro`); este repositório é só o site público.

**Objetivo principal:** cada post ter uma página HTML própria gerada no build (prerender), para o link compartilhado no LinkedIn aparecer com título, resumo e imagem.

---

## Decisões

| Tema | Decisão | Motivo |
|---|---|---|
| Base | Projeto novo com `ng new` (Angular atual) em vez de atualizar o 17 | código antigo é pequeno; reescrever é mais barato que migrar |
| Renderização | SSR + prerender (`outputMode: 'static'`) | HTML pronto no build → card do LinkedIn e SEO |
| Hospedagem | GitHub Pages, repositório `brain-logs-app` | mesmo modelo do ademiro |
| Dados | Firestore do ademiro via **Firestore lite** (REST), leitura pública só de posts `published` | menor no navegador, funciona no prerender (Node); rules do ademiro já garantem a leitura |
| Hidratação | **TransferState**: dados do build vão embutidos no HTML | ao abrir uma página pronta, o navegador não consulta o Firestore |
| Config | `src/environments/firebase.config.ts` ignorado pelo git + secret `FIREBASE_CONFIG` | mesmo modelo do ademiro e do scrum-truco |
| Conteúdo | Markdown (`marked`, GFM) → HTML via `[innerHTML]`, **sanitizado pelo Angular** | o sanitizador do Angular roda no navegador e no prerender; sem dependência extra |
| Rotas | `/` lista, `/:slug` post | é o formato do botão "Ver no blog" do ademiro |
| Atualização | deploy no push, manual e agendado a cada 6h | posts novos só ganham página própria após novo build |
| CI | `overrides` fixando `@emnapi/*` em 1.x no `package.json` | fallback wasm opcional do build tem conflito de versão que só o npm do Linux recusa |

---

## Fases

### Fase 0 — Base ✅
- [x] `git init` + commit do projeto atual (URL do banco antigo trocada por placeholder)
- [x] Projeto novo com `ng new` + prerender (`outputMode: 'static'`, sem servidor Express), Bootstrap
- [x] Config do Firebase no modelo `firebase.config.ts` / `firebase.config.example.ts`
- [x] Repositório `brain-logs-app` no GitHub + workflow de deploy no Pages (`404.html` = `index.csr.html`)

### Fase 1 — Dados ✅
- [x] Service: blog pelo slug `brain-logs` + posts publicados (ordem por `publishedAt`) + post por slug
- [x] Tipos do blog (campos fixos; `custom` e `settings` genéricos — campos específicos entram na Fase 4)
- [x] Markdown → HTML (imagens só https; título vira alt quando o Milkdown grava a proporção)

### Fase 2 — Páginas ✅
- [x] `/` lista de posts
- [x] `/:slug` página do post
- [x] 404 (com `noindex`)
- [x] Título + meta tags Open Graph por página (título, resumo, capa)

### Fase 3 — Prerender e publicação
- [x] No build, listar os slugs publicados no Firestore e gerar uma página por post (`getPrerenderParams`)
- [x] Workflow de deploy no push, manual e agendado (a cada 6h)
- [x] No ademiro: URL pública `https://thiago662.github.io/brain-logs-app` e URL do deploy `https://github.com/thiago662/brain-logs-app/actions/workflows/deploy.yml`

### Fase 4 — Visual ✅ (campos criados no ademiro; falta um post real para ver nível e stack)
- [x] Trazer os cards com capa do projeto antigo (capa, nível, título, subtítulo, até 3 de stack, data)
- [x] Autor e LinkedIn (valores do blog); nível e stack (campos do post) — tipados em `core/fields.ts`, tolerando ausência; LinkedIn só `https://`; sem `stack`, usa `tags`

### Fase 5 — Validação no LinkedIn
- [ ] Publicar o post "projetos curtos" no ademiro
- [ ] Testar o link no [Post Inspector do LinkedIn](https://www.linkedin.com/post-inspector/) antes de postar

---

## Fora do primeiro ciclo
- Busca, página por tag, RSS, comentários.

## Pré-requisitos no ademiro
- Campos do blog Brain Logs: `autor` e `linkedin` (escopo blog); `nivel` (lista) e `stack` (tags) (escopo post).
- Pelo menos um post publicado para testar.

## Notas sobre o Markdown
O editor do ademiro grava imagens em bloco como `![1.00](url "legenda")`: o *alt* guarda a proporção e a legenda vai no *título*. Ao renderizar, usar o título como texto alternativo.
