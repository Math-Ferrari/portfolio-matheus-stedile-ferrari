/**
 * ────────────────────────────────────────────────────────────────────────────
 * Tema — claro e escuro.
 *
 * O tema é uma preferência do VISITANTE: ele não existe no servidor e não
 * aparece na URL (diferente do idioma, ver `lib/i18n.ts`). Isso obriga a
 * decidi-lo no cliente, e a decisão é sempre a mesma, em duas ordens:
 *
 *   1. escolha manual salva em `localStorage`;
 *   2. na ausência dela, `prefers-color-scheme` do sistema.
 *
 * Essa resolução precisa existir DUAS vezes: como script inline no `<head>`
 * (para acertar o `<html>` antes do primeiro paint, sem flash) e em TypeScript
 * (para o `ThemeProvider`). Elas moram lado a lado aqui de propósito — quando
 * a lógica estava duplicada entre uma string solta no layout e o provider, as
 * duas podiam divergir sem ninguém perceber.
 *
 * `:root` (sem `data-theme`) é o tema ESCURO — ver `app/globals.css`. Logo, um
 * `data-theme` ausente não é um estado neutro: é o site inteiro em dark.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** A escolha manual salva, se houver uma e for válida. */
export function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    // Modo privado ou storage bloqueado: trata como "sem escolha salva".
    return null;
  }
}

/** Escolha manual → preferência do sistema. A MESMA ordem de `THEME_INIT_SCRIPT`. */
export function resolveTheme(): Theme {
  const stored = readStoredTheme();
  if (stored) {
    return stored;
  }
  try {
    return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
  } catch {
    return "dark";
  }
}

/** O tema atualmente escrito em `<html>`, ou `null` se o atributo não estiver lá. */
export function readThemeAttribute(): Theme | null {
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : null;
}

export function writeThemeAttribute(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

export function persistTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Modo privado ou storage bloqueado: a escolha só vale pela sessão.
  }
}

/**
 * A mesma resolução acima, como texto puro para o `<head>`.
 *
 * Roda antes de qualquer coisa do React — é o que evita o flash de tema no
 * primeiro carregamento. Texto puro (nunca uma função serializada) para
 * funcionar também sob CSP que bloqueia `unsafe-eval`.
 *
 * Ele cobre o primeiro paint; quem mantém o atributo correto DEPOIS disso é o
 * `ThemeProvider` — inclusive quando o React apaga o atributo ao re-adquirir
 * `<html>` numa troca de idioma (ver o comentário daquele arquivo).
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var t=s==="light"||s==="dark"?s:(window.matchMedia(${JSON.stringify(
  DARK_QUERY,
)}).matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
