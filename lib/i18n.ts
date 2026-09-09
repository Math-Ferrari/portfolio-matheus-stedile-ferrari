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

/** Chave de `alternates.languages` (hreflang) para cada idioma. */
export const HREFLANG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
};

/** Valor de `openGraph.locale` (formato `pt_BR`) para cada idioma. */
export const OG_LOCALE: Record<Locale, string> = {
  pt: "pt_BR",
  en: "en_US",
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

/** Normaliza qualquer entrada (ex.: `params.locale` de uma rota) para um `Locale`. */
export function toLocale(value: unknown): Locale {
  return value === "en" ? "en" : "pt";
}

/** `true` quando o valor é um dos segmentos de idioma válidos na URL. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * ────────────────────────────────────────────────────────────────────────────
 * O idioma agora é o primeiro segmento da URL (`/pt/...`, `/en/...`), não mais
 * um valor em `localStorage`. As duas funções abaixo são o único lugar que
 * conhece esse formato — nenhum componente monta ou lê o prefixo à mão.
 * ────────────────────────────────────────────────────────────────────────────
 */

/**
 * Prefixa um href interno (sempre começando por `/`, na forma escrita nos
 * arquivos de `data/`, ex.: `/`, `/#projetos`, `/projetos/${slug}`) com o
 * idioma ativo. Preserva um fragmento (`#...`) depois do prefixo, para que
 * `/#projetos` vire `/pt#projetos` e não `/pt/#projetos`.
 *
 * Hrefs externos (`http…`, `mailto:`, `tel:`) e protocol-relative (`//…`)
 * passam intactos: só o que é navegação DENTRO do site ganha prefixo.
 */
export function withLocale(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) {
    return href;
  }
  const hashIndex = href.indexOf("#");
  const path = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : href.slice(hashIndex);
  const localizedPath = path === "/" ? `/${locale}` : `/${locale}${path}`;
  return `${localizedPath}${hash}`;
}

/**
 * Troca o primeiro segmento de um pathname já resolvido (`usePathname()`,
 * sempre `/pt/...` ou `/en/...`) pelo outro idioma, mantendo o resto da
 * rota — é o que faz o `LanguageToggle` ir para a MESMA página no outro
 * idioma em vez de voltar para a home.
 */
export function replaceLocaleInPath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/");
  segments[1] = locale;
  return segments.join("/") || `/${locale}`;
}

/**
 * Monta o `alternates` de uma página (canonical + hreflang pt-BR/en/x-default)
 * a partir do seu caminho SEM idioma — a mesma forma que `withLocale()`
 * espera (`/`, `/projetos`, `/projetos/${slug}`). Usado nos três
 * `generateMetadata` do site (home, lista de projetos, case) para não repetir
 * o mapeamento de hreflang em cada um.
 */
export function localizedAlternates(
  path: string,
  locale: Locale,
): { canonical: string; languages: Record<string, string> } {
  const languages: Record<string, string> = {
    "x-default": withLocale(path, DEFAULT_LOCALE),
  };
  for (const candidate of LOCALES) {
    languages[HREFLANG[candidate]] = withLocale(path, candidate);
  }
  return { canonical: withLocale(path, locale), languages };
}
