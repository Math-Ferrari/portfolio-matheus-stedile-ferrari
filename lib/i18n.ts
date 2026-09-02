/**
 * ────────────────────────────────────────────────────────────────────────────
 * Internacionalização — PT (padrão) e EN.
 *
 * A escolha central: NÃO existem dois arquivos de conteúdo paralelos. A
 * estrutura (slug, id de bloco, caminho de imagem, nome de tecnologia, href,
 * dimensão de screenshot) é escrita UMA vez; só o que é texto de leitura vira
 * um par `{ pt, en }`. Isso evita o problema clássico de bundles espelhados:
 * alguém adiciona um bloco no PT e esquece o EN, e a versão inglesa silencia
 * um pedaço do site. Aqui, um `en` faltando é erro de compilação.
 *
 * No consumo, `localize()` devolve o objeto já resolvido para um idioma — com
 * exatamente a mesma forma que os componentes sempre receberam. Nenhum
 * componente precisa saber que existe tradução: ele continua lendo
 * `project.summary` como string.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type Locale = "pt" | "en";

export const LOCALES: readonly Locale[] = ["pt", "en"];

/** Idioma padrão do site. */
export const DEFAULT_LOCALE: Locale = "pt";

/** Valor de `<html lang>` para cada idioma. */
export const HTML_LANG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

/** Um valor que existe nos dois idiomas. `L<string>` é o caso comum. */
export type L<T = string> = { readonly pt: T; readonly en: T };

/**
 * Substitui, recursivamente, todo `L<T>` da árvore pelo `T` correspondente.
 * `Localized<{ title: L<string>; slug: string }>` = `{ title: string; slug: string }`.
 */
export type Localized<T> = T extends L<infer V>
  ? Localized<V>
  : T extends readonly (infer E)[]
    ? Localized<E>[]
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;

/**
 * Um par de idioma é reconhecido pela forma: objeto simples com exatamente as
 * chaves `pt` e `en`. Nenhum objeto de conteúdo do site usa esse par de chaves
 * para outra finalidade, então não há colisão.
 */
function isLocalePair(value: unknown): value is L<unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const keys = Object.keys(value);
  return keys.length === 2 && keys.includes("pt") && keys.includes("en");
}

/** Resolve uma árvore de conteúdo para um idioma. */
export function localize<T>(node: T, locale: Locale): Localized<T> {
  if (isLocalePair(node)) {
    return localize(node[locale], locale) as Localized<T>;
  }

  if (Array.isArray(node)) {
    return node.map((item) => localize(item, locale)) as Localized<T>;
  }

  if (typeof node === "object" && node !== null) {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] = localize(value, locale);
    }
    return out as Localized<T>;
  }

  return node as Localized<T>;
}

/** Normaliza qualquer entrada (localStorage, atributo do DOM) para um `Locale`. */
export function toLocale(value: unknown): Locale {
  return value === "en" ? "en" : "pt";
}
