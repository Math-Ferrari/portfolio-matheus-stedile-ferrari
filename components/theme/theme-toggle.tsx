"use client";

import { Moon, Sun } from "lucide-react";

import { useContent } from "@/components/i18n/use-content";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

/**
 * Um único ícone (sol no claro, lua no escuro) — não um switch grande. Mesmo
 * tamanho/alinhamento do `LanguageToggle` ao lado, para os dois lerem como
 * parte do mesmo controle, não como um adicionado depois do outro.
 *
 * `aria-label` muda com o estado (di a ação que o clique vai fazer, não o
 * estado atual — "Ativar tema claro" é mais claro por teclado/leitor de tela
 * do que "Tema: escuro"), e o ícone é só decorativo.
 *
 * Sempre nos tokens de tema (`text-foreground`) — o header é um componente
 * único e global, e o fundo atrás dele (capa ou página) já é sempre uma
 * variação do próprio `--background`, então não precisa de uma cor fixa por
 * cima para continuar legível.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { ui } = useContent();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? ui.header.themeToLight : ui.header.themeToDark}
      className={cn(
        "inline-flex size-11 items-center justify-center text-foreground/70 transition-colors duration-200 hover:text-foreground focus-visible:text-foreground",
        className,
      )}
    >
      {isDark ? (
        <Sun aria-hidden className="size-[0.95rem]" strokeWidth={1.75} />
      ) : (
        <Moon aria-hidden className="size-[0.95rem]" strokeWidth={1.75} />
      )}
    </button>
  );
}
