"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { getContent, type Content } from "@/data/content";

/**
 * O conteúdo do site já resolvido para o idioma ativo.
 *
 * É a única porta de entrada de texto nos componentes: `const c = useContent()`
 * e depois `c.profile.body`, `c.ui.case.toc` etc. — sempre strings comuns,
 * nunca um par `{ pt, en }` e nunca um `locale === "pt" ? … : …` espalhado
 * pelo JSX.
 *
 * `getContent` memoriza por idioma no módulo, então isto não recalcula a
 * árvore a cada render — é só um lookup em Map.
 */
export function useContent(): Content {
  const { locale } = useLanguage();
  return getContent(locale);
}
