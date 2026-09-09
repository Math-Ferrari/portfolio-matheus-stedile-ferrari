"use client";

import NextLink from "next/link";
import { forwardRef } from "react";

import { useLanguage } from "@/components/i18n/language-provider";
import { withLocale } from "@/lib/i18n";

type NextLinkProps = React.ComponentProps<typeof NextLink>;

/**
 * `next/link`, mas com o `href` interno (o que os arquivos de `data/`
 * escrevem: `/`, `/#projetos`, `/projetos/${slug}`) sempre prefixado com o
 * idioma ATIVO — via `withLocale()` (`lib/i18n.ts`), a única função que
 * conhece o formato `/pt/...`/`/en/...`.
 *
 * É o único lugar que precisa saber disso: todo componente que navega
 * internamente importa este `Link` no lugar de `next/link` e continua
 * escrevendo hrefs exatamente como antes (`href="/projetos"`), sem `${locale}`
 * espalhado pelo JSX.
 *
 * Hrefs já resolvidos para uma URL final (ex.: o `LanguageToggle`, que troca
 * só o primeiro segmento da rota atual) usam `next/link` diretamente — prefixar
 * de novo aqui duplicaria o segmento de idioma.
 */
export const Link = forwardRef<HTMLAnchorElement, NextLinkProps>(function Link(
  { href, ...props },
  ref,
) {
  const { locale } = useLanguage();
  const localizedHref = typeof href === "string" ? withLocale(href, locale) : href;

  return <NextLink ref={ref} href={localizedHref} {...props} />;
});
