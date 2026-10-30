import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  // Fase 3: Prerender com getPrerenderParams (um HTML por post). Até lá, renderiza no navegador.
  { path: ':slug', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
];
