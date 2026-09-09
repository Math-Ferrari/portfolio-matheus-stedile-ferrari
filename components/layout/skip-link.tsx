"use client";

import { useContent } from "@/components/i18n/use-content";

/**
 * Atalho de teclado para pular a navegação. Virou componente próprio só
 * porque o texto precisa acompanhar o idioma, e `app/[locale]/layout.tsx` é um Server
 * Component — as classes e o comportamento são exatamente os de antes.
 */
export function SkipLink() {
  const { ui } = useContent();

  return (
    <a
      href="#conteudo"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent-strong focus:px-5 focus:py-2 focus:text-sm focus:text-white"
    >
      {ui.header.skipToContent}
    </a>
  );
}
