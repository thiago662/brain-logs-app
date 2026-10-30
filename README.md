# 🧠 Brain Logs

Blog técnico sobre tecnologia, estudos e carreira em desenvolvimento de software.

O conteúdo é gerenciado no [Ademiro de Blogs](https://github.com/thiago662/ademiro-de-blogs) e lido do Firestore. Este repositório é só o site público: as páginas são geradas no build (prerender) e publicadas no GitHub Pages.

Plano e andamento em [PLAN.md](PLAN.md).

## Rodando localmente

**Requisitos:** Node.js 24.15+.

```bash
npm install
cp src/environments/firebase.config.example.ts src/environments/firebase.config.ts
# preencha com o firebaseConfig do projeto Firebase do Ademiro
npm start          # http://localhost:4200
```

O blog só lê posts **publicados** — as Security Rules do Ademiro não liberam rascunhos.

## Deploy

1. **Settings → Pages → Source:** `GitHub Actions`.
2. **Settings → Secrets and variables → Actions → New repository secret** `FIREBASE_CONFIG` com o objeto do console (só o `{ ... }`).
3. Push na `main` publica em `https://<usuario>.github.io/brain-logs-app/`.
