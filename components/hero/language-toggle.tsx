"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type Language = "PT" | "EN";

const LANGUAGES: Language[] = ["PT", "EN"];

/**
 * Seletor de idioma — só a interface, por enquanto.
 *
 * Troca o estado ativo/inativo localmente (`useState`), sem tocar em conteúdo
 * nenhum da página: nenhum texto do site é traduzido. É a estrutura visual e
 * de interação (estado ativo, hover, foco, teclado) pronta para quando a
 * internacionalização real existir — nesse dia, o `onClick` troca de "marcar
 * este botão como ativo" para "navegar para a rota traduzida".
 *
 * Vive no header (ver `site-header.tsx`), que é um componente único e
 * global — por isso os tokens de tema (`text-foreground`/`text-muted`), não
 * uma cor fixa: o fundo atrás dele, capa ou página, já é sempre uma variação
 * do próprio `--background`.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const [active, setActive] = useState<Language>("PT");

  return (
    <div
      role="group"
      aria-label="Idioma (em breve)"
      className={cn("flex items-center text-[0.7rem] font-medium tracking-[0.02em]", className)}
    >
      {LANGUAGES.map((lang, index) => (
        <div key={lang} className="flex items-center">
          {index > 0 ? <span aria-hidden className="-mx-1 text-muted">/</span> : null}
          <button
            type="button"
            onClick={() => setActive(lang)}
            aria-pressed={active === lang}
            className={cn(
              "inline-flex min-h-11 min-w-8 items-center justify-center transition-colors duration-200",
              active === lang ? "text-foreground" : "text-muted hover:text-foreground/80",
            )}
          >
            {lang}
          </button>
        </div>
      ))}
    </div>
  );
}
