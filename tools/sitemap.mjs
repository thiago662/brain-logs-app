// Gera sitemap.xml a partir das páginas pré-renderizadas (cada rota vira <rota>/index.html).
// Roda sozinho depois do `npm run build` (script postbuild); não precisa do Firestore.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = 'dist/brain-logs-app/browser';
const siteUrl = readFileSync('src/environments/environment.ts', 'utf8').match(/siteUrl:\s*'([^']+)'/)?.[1];
if (!siteUrl) throw new Error('siteUrl não encontrado em src/environments/environment.ts');

const routes = [];
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(join(dir, e.name));
    else if (e.name === 'index.html') routes.push(relative(dist, dir).replaceAll('\\', '/'));
  }
};
walk(dist);

const urls = routes.sort().map((r) => `  <url><loc>${siteUrl}/${r}</loc></url>`);
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
console.log(`sitemap.xml: ${routes.length} páginas`);
