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
| Dados | Firestore do ademiro, leitura pública só de posts `published` | rules do ademiro já garantem isso |
| Config | `src/environments/firebase.config.ts` ignorado pelo git + secret `FIREBASE_CONFIG` | mesmo modelo do ademiro e do scrum-truco |
| Conteúdo | Markdown → HTML **sanitizado** (também no build, em Node) | conteúdo vem de outro sistema; nunca inserir HTML sem limpar |
| Rotas | `/` lista, `/:slug` post | é o formato do botão "Ver no blog" do ademiro |
| Atualização | deploy manual + agendado (ex.: a cada 6h) | posts novos só aparecem após novo build |

---

## Fases

### Fase 0 — Base
- [ ] `git init` + commit do projeto atual (preservar o que existe)
- [ ] Projeto novo com `ng new` + SSR/prerender, Bootstrap
- [ ] Config do Firebase no modelo `firebase.config.ts` / `firebase.config.example.ts`
- [ ] Repositório `brain-logs-app` no GitHub + workflow de deploy no Pages

### Fase 1 — Dados
- [ ] Service: blog pelo slug `brain-logs` + posts publicados (ordem por `publishedAt`) + post por slug
- [ ] Tipos próprios do blog (campos fixos + `custom.nivel`, `custom.stack`, `settings.autor`, `settings.linkedin`)
- [ ] Markdown → HTML com sanitização que funcione no navegador e no build

### Fase 2 — Páginas
- [ ] `/` lista de posts
- [ ] `/:slug` página do post
- [ ] 404
- [ ] Título + meta tags Open Graph por página (título, resumo, capa)

### Fase 3 — Prerender e publicação
- [ ] No build, listar os slugs publicados no Firestore e gerar uma página por post
- [ ] Workflow de deploy manual + agendado
- [ ] No ademiro: preencher URL pública e URL do deploy do Brain Logs ("Ver no blog" / "Republicar site")

### Fase 4 — Visual
- [ ] Trazer os cards com capa do projeto antigo
- [ ] Autor e LinkedIn (valores do blog); nível e stack (campos do post)

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
