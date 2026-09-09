import type { MetadataRoute } from "next";

import { defaultContent } from "@/data/content";
import { projectSlugs } from "@/data/projects";
import { HREFLANG, LOCALES, localizedAlternates } from "@/lib/i18n";

/**
 * Cada página existe duas vezes (uma por idioma) — o `alternates.languages`
 * de cada entrada é o que diz ao Google que `/pt/x` e `/en/x` são a MESMA
 * página em idiomas diferentes, não conteúdo duplicado. `localizedAlternates`
 * (`lib/i18n.ts`) é a mesma função usada em `generateMetadata` de cada rota —
 * o mapeamento de hreflang não é escrito duas vezes.
 */
function entriesFor(path: string, priority: number): MetadataRoute.Sitemap {
  const { site } = defaultContent;
  const lastModified = new Date();
  const { languages } = localizedAlternates(path, "pt");
  const absoluteLanguages = Object.fromEntries(
    Object.entries(languages).map(([hreflang, href]) => [hreflang, `${site.url}${href}`]),
  );

  return LOCALES.map((locale) => ({
    url: absoluteLanguages[HREFLANG[locale]]!,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
    alternates: { languages: absoluteLanguages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entriesFor("/", 1),
    ...entriesFor("/projetos", 0.8),
    ...projectSlugs.flatMap((slug) => entriesFor(`/projetos/${slug}`, 0.7)),
  ];
}
