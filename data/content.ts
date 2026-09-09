import { DEFAULT_LOCALE, localize, type Locale, type Localized } from "@/lib/i18n";
import type { CaseBlock, Project } from "@/lib/types";

import { projects, selectedProjects } from "./projects";
import {
  about,
  contact,
  contacts,
  engineering,
  hero,
  heroProjects,
  heroVisual,
  howIWork,
  nav,
  profile,
  site,
  techGroups,
} from "./site";
import { ui } from "./ui";

/**
 * ────────────────────────────────────────────────────────────────────────────
 * Ponto único de leitura do conteúdo.
 *
 * `source` é a árvore com os pares `{ pt, en }`; `getContent(locale)` devolve
 * a mesma árvore já resolvida para um idioma. Nenhum componente importa
 * `data/site.ts` ou `data/projects.ts` diretamente para renderizar — todos
 * passam por aqui (no cliente, via `useContent()`), então não existe um só
 * lugar onde o idioma possa "vazar".
 *
 * A resolução é feita uma vez por idioma e memorizada no módulo: `localize()`
 * percorre a árvore inteira, e repetir isso a cada render seria desperdício
 * puro. O conteúdo é estático, então o cache nunca invalida.
 * ────────────────────────────────────────────────────────────────────────────
 */
const source = {
  site,
  nav,
  contacts,
  hero,
  heroProjects,
  heroVisual,
  profile,
  howIWork,
  about,
  techGroups,
  engineering,
  contact,
  projects,
  selectedProjects,
  ui,
};

export type Content = Localized<typeof source>;

const cache = new Map<Locale, Content>();

export function getContent(locale: Locale): Content {
  const cached = cache.get(locale);
  if (cached) {
    return cached;
  }
  const resolved = localize(source, locale) as Content;
  cache.set(locale, resolved);
  return resolved;
}

/**
 * Conteúdo em português, para o pouco que roda fora do segmento `[locale]`
 * (`app/sitemap.ts`, `app/robots.ts`) e para valores que não variam por
 * idioma (`site.url`, `site.name` no `alt` de `app/[locale]/opengraph-image.tsx`).
 * Toda página e metadata DENTRO de `app/[locale]/` usa `getContent(locale)`
 * com o locale da própria rota — não este valor fixo.
 */
export const defaultContent = getContent(DEFAULT_LOCALE);

/* ── Derivações de projeto ──────────────────────────────────────────────
   As mesmas de antes, agora recebendo a lista já resolvida. Ficam aqui, e
   não em `projects.ts`, porque só fazem sentido sobre o conteúdo de UM
   idioma. */

export function getFeaturedProject(locale: Locale): Project {
  const list = getContent(locale).projects;
  return list.find((project) => project.featured) ?? list[0]!;
}

export function getSecondaryProjects(locale: Locale): Project[] {
  const featured = getFeaturedProject(locale);
  return getContent(locale).projects.filter((project) => project.slug !== featured.slug);
}

export function getProject(slug: string, locale: Locale): Project | undefined {
  return getContent(locale).projects.find((project) => project.slug === slug);
}

/** Próximo projeto na ordem da lista, para navegação no fim do case. */
export function getNextProject(slug: string, locale: Locale): Project {
  const list = getContent(locale).projects;
  const index = list.findIndex((project) => project.slug === slug);
  return list[(index + 1) % list.length]!;
}

type BeforeAfterBlock = Extract<CaseBlock, { kind: "beforeAfter" }>;

/**
 * Bloco antes/depois do case principal, para a versão-teaser exibida na home.
 * Lido direto do case (fonte única) — nunca duplicado em texto solto.
 */
export function getFeaturedBeforeAfter(locale: Locale): BeforeAfterBlock | null {
  const block = getFeaturedProject(locale).case?.blocks.find(
    (candidate): candidate is BeforeAfterBlock => candidate.kind === "beforeAfter",
  );
  return block ?? null;
}
