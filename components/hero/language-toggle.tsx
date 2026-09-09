"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/components/i18n/language-provider";
import { useContent } from "@/components/i18n/use-content";
import { replaceLocaleInPath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Alterna PT ⇄ EN. O rótulo mostra o idioma ATIVO (PT quando o site está em
 * português), enquanto o `aria-label` diz o que o clique vai fazer — um
 * leitor de tela que anunciasse só "PT" não informaria se aquilo é o estado
 * atual ou o destino.
 *
 * É um `<Link>` de verdade, não um `onClick` que muda estado: o destino é a
 * MESMA rota, só com o primeiro segmento trocado (`replaceLocaleInPath`, em
 * `lib/i18n.ts`) — é isso que resolve o requisito "abrir em `/pt/projetos/x`,
 * clicar em EN, cair em `/en/projetos/x`". Usa `next/link` direto (não o
 * wrapper de `components/i18n/locale-link.tsx`): o href aqui já é a URL final,
 * prefixá-lo de novo duplicaria o segmento de idioma.
 *
 * `scroll={false}` — e o motivo é estrutural, não um remendo pontual:
 *
 * O layout raiz do site vive dentro do segmento `[locale]`, e o App Router
 * renderiza cada segmento com uma `key` derivada do VALOR do parâmetro. Trocar
 * `/pt` por `/en` muda essa key, então, para o Next, isto não é "a mesma
 * página noutro idioma": é uma rota nova, com a raiz inteira montada do zero.
 * É por isso que ele executa aqui toda a rotina de scroll/foco de uma
 * navegação normal — inclusive consumir o alvo pendente em `focusAndScrollRef`
 * (um estado ÚNICO do router, não algo por-link), que pode ser o `#projetos`
 * de um link do menu. Resultado sem este flag: a página salta para a seção de
 * projetos depois de trocar o idioma.
 *
 * Trocar de idioma não é ir para outro lugar — é reescrever o que já está na
 * tela. `scroll={false}` diz exatamente isso ao Next: não gerencie scroll
 * nenhum nesta navegação (nem topo, nem hash pendente), preserve a posição.
 * O mesmo remount é o que apagava o tema; ver `components/theme/theme-provider.tsx`.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const pathname = usePathname();
  const { locale } = useLanguage();
  const { ui } = useContent();
  const otherLocale: Locale = locale === "pt" ? "en" : "pt";
  const href = replaceLocaleInPath(pathname, otherLocale);

  return (
    <Link
      href={href}
      scroll={false}
      aria-label={locale === "pt" ? ui.header.languageToEn : ui.header.languageToPt}
      className={cn(
        "inline-flex min-h-11 items-center px-1 text-[0.7rem] font-semibold tracking-[0.04em] text-foreground transition-colors duration-200 hover:text-accent focus-visible:text-accent",
        className,
      )}
    >
      {locale === "pt" ? "PT" : "EN"}
    </Link>
  );
}
