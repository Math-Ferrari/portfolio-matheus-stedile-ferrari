"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { useContent } from "@/components/i18n/use-content";
import { cn } from "@/lib/utils";

/**
 * Alterna PT ⇄ EN. O rótulo mostra o idioma ATIVO (PT quando o site está em
 * português), enquanto o `aria-label` diz o que o clique vai fazer — um
 * leitor de tela que anunciasse só "PT" não informaria se aquilo é o estado
 * atual ou o destino.
 *
 * O `<span>` anterior virou `<button>` porque agora existe uma ação; as
 * classes de aparência (tamanho, peso, tracking, cor, altura mínima) são as
 * mesmas, então a linha do header não muda de desenho.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, toggleLocale } = useLanguage();
  const { ui } = useContent();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={locale === "pt" ? ui.header.languageToEn : ui.header.languageToPt}
      className={cn(
        "inline-flex min-h-11 items-center px-1 text-[0.7rem] font-semibold tracking-[0.04em] text-foreground transition-colors duration-200 hover:text-accent focus-visible:text-accent",
        className,
      )}
    >
      {locale === "pt" ? "PT" : "EN"}
    </button>
  );
}
