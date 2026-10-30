// Leitura tolerante dos campos customizados do Ademiro: ausente ou com tipo errado vira vazio.

/** Campos de escopo "blog" combinados com o Ademiro (`settings`). */
export interface BlogSettings {
  autor: string;
  /** Só URL https. */
  linkedin: string;
}

/** Campos de escopo "post" combinados com o Ademiro (`custom`). */
export interface PostCustom {
  nivel: string[];
  stack: string[];
}

function text(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

/** Aceita string única ou lista (campo "lista" ou "tags"); descarta o que não for texto. */
function list(v: unknown): string[] {
  return (Array.isArray(v) ? v : [v]).map(text).filter(Boolean);
}

export function readSettings(raw: unknown): BlogSettings {
  const s = (raw ?? {}) as Record<string, unknown>;
  const linkedin = text(s['linkedin']);
  return { autor: text(s['autor']), linkedin: linkedin.startsWith('https://') ? linkedin : '' };
}

export function readCustom(raw: unknown): PostCustom {
  const c = (raw ?? {}) as Record<string, unknown>;
  return { nivel: list(c['nivel']), stack: list(c['stack']) };
}

/** Chave estável do nível (sem acento, minúscula) para o CSS escolher a cor: "Intermediário" → "intermediario". */
export function nivelKey(nivel: string): string {
  return nivel
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}
