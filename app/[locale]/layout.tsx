import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { LanguageProvider } from "@/components/i18n/language-provider";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getContent } from "@/data/content";
import { activeContacts } from "@/data/site";
import { HTML_LANG, LOCALES, isLocale, type Locale } from "@/lib/i18n";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

import "../globals.css";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** As duas únicas páginas estáticas do segmento `[locale]`. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/** Qualquer valor fora de `LOCALES` (ex.: `/fr`) é 404 — nunca um terceiro idioma "solto". */
export const dynamicParams = false;

/**
 * O script de tema (`THEME_INIT_SCRIPT`, em `lib/theme.ts`) roda antes de
 * qualquer coisa do React, direto no `<head>`: decide o tema e escreve
 * `data-theme` em `<html>` já no primeiro paint. Sem ele, a página nasceria no
 * padrão do CSS (`:root`, que é o escuro) e só corrigiria depois que o React
 * montasse — o "pisca" que a tarefa pede para evitar.
 *
 * Ele cobre o primeiro carregamento. Manter o atributo correto DEPOIS disso é
 * responsabilidade do `ThemeProvider`, que o reafirma a cada mount — inclusive
 * no remount causado por uma troca de idioma, quando o React re-adquire
 * `<html>` e apaga os atributos que não vieram do JSX.
 *
 * O idioma não precisa de um script equivalente: ele vem do próprio segmento
 * de rota (`params.locale`), então o servidor já sabe o valor certo no
 * primeiro render — não há "escolha salva" para reaplicar no cliente.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

/**
 * Metadata comum às duas versões do site — o que cada página sobrescreve
 * (title, description, canonical) vive em cada `generateMetadata` daquele
 * segmento (`page.tsx` de home, `/projetos` e `/projetos/[slug]`). Como o
 * locale agora é a própria URL, esta função roda uma vez por idioma no
 * build, sem precisar de estado do cliente.
 */
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = toLocaleOrNotFound(rawLocale);
  const { site } = getContent(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: site.title,
      template: `%s — ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    authors: [{ name: site.name }],
    creator: site.name,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export const viewport: Viewport = {
  /* Um valor por esquema — o navegador escolhe pela preferência do SISTEMA
     operacional, via media query nativa. Isso cobre a barra de UI (endereço
     no mobile, etc.) antes mesmo do JS rodar; não tenta acompanhar a troca
     manual em runtime, que exigiria reescrever a tag a cada clique — o tipo
     de complicação que a tarefa pediu para evitar se não for essencial. */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2efe8" },
    { media: "(prefers-color-scheme: dark)", color: "#11100e" },
  ],
  colorScheme: "light dark",
};

/** `params.locale` já é validado por `dynamicParams = false`; isto só estreita o tipo. */
function toLocaleOrNotFound(value: string): Locale {
  if (!isLocale(value)) {
    notFound();
  }
  return value;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale: rawLocale } = await params;
  const locale = toLocaleOrNotFound(rawLocale);
  const { site } = getContent(locale);

  /**
   * Identidade em dados estruturados, montada a partir do conteúdo já
   * resolvido para este idioma. `jobTitle` acompanha o posicionamento
   * profissional do site (`site.role`). Não há `alumniOf` nem campo de
   * titulação — a graduação em `site.degree` está em andamento e não é
   * declarada aqui como credencial obtida.
   */
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.initials,
    url: site.url,
    jobTitle: site.role,
    knowsAbout: site.degree,
    description: site.description,
    ...(activeContacts.some((contact) => contact.href.startsWith("mailto:"))
      ? {
          email: activeContacts
            .find((contact) => contact.href.startsWith("mailto:"))
            ?.href.replace("mailto:", ""),
        }
      : {}),
    ...(activeContacts.some((contact) => contact.href.startsWith("http"))
      ? {
          sameAs: activeContacts
            .filter((contact) => contact.href.startsWith("http"))
            .map((contact) => contact.href),
        }
      : {}),
  };

  return (
    <html
      lang={HTML_LANG[locale]}
      className={`${inter.variable} ${sourceSerif.variable}`}
      /* O script no <head> escreve `data-theme` antes do React montar — sem
         isto o React reclamaria de um `<html>` que "mudou" entre o HTML do
         servidor e o que ele encontrou no primeiro render no cliente. `lang`
         não precisa dessa proteção: já chega certo do servidor, via
         `params.locale`, e nunca é reescrito no cliente. */
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* Sem JavaScript não há IntersectionObserver: o conteúdo entra já visível. */}
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>

        <ThemeProvider>
          <LanguageProvider locale={locale}>
            <SkipLink />
            <SmoothScroll>
              <SiteHeader />
              <main id="conteudo">{children}</main>
              <SiteFooter />
            </SmoothScroll>
          </LanguageProvider>
        </ThemeProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
