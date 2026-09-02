import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { LanguageProvider } from "@/components/i18n/language-provider";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { defaultContent } from "@/data/content";
import { activeContacts } from "@/data/site";

import "./globals.css";

/**
 * Roda antes de qualquer coisa do React, direto no `<head>`, como texto puro
 * (nunca uma função serializada) — assim funciona também com CSP que bloqueia
 * `unsafe-eval`. Decide o tema e já escreve `data-theme` em `<html>` no
 * primeiro paint: sem isso, a página nasceria no tema padrão do CSS e só
 * corrigiria depois que o React montasse — o "pisca" que a tarefa pede para
 * evitar. `ThemeProvider` (client) só sincroniza o estado do React com o que
 * este script já deixou pronto; não decide o tema de novo.
 */
const themeInitScript = `(function(){try{var s=localStorage.getItem("theme");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

/**
 * Mesma ideia para o idioma: lê a escolha salva e já escreve `lang` e
 * `data-lang` em `<html>` antes do primeiro paint, para que o navegador e os
 * leitores de tela nunca anunciem o idioma errado. `LanguageProvider`
 * (client) só sincroniza o React com o que este script deixou pronto — ver o
 * comentário daquele arquivo sobre o par de snapshots que evita erro de
 * hidratação.
 */
const languageInitScript = `(function(){try{var s=localStorage.getItem("portfolio-language");var l=s==="en"?"en":"pt";document.documentElement.setAttribute("data-lang",l);document.documentElement.setAttribute("lang",l==="en"?"en":"pt-BR");}catch(e){}})();`;

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
 * A metadata é gerada no SERVIDOR, e o idioma escolhido vive no
 * `localStorage` (cliente) — aqui não há como sabê-lo. Ela fica em português,
 * o idioma padrão do site, de propósito: é também o que mantém as previews já
 * indexadas (LinkedIn, buscadores) exatamente como estão hoje. Traduzir a
 * metadata exigiria mover o idioma para a URL ou para um cookie lido no
 * servidor — ver a nota no relatório desta tarefa.
 *
 * O mesmo vale para o JSON-LD abaixo, o sitemap e a imagem de Open Graph.
 */
const defaultSite = defaultContent.site;

export const metadata: Metadata = {
  metadataBase: new URL(defaultSite.url),
  title: {
    default: defaultSite.title,
    template: `%s — ${defaultSite.name}`,
  },
  description: defaultSite.description,
  applicationName: defaultSite.name,
  authors: [{ name: defaultSite.name }],
  creator: defaultSite.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: defaultSite.url,
    siteName: defaultSite.name,
    title: defaultSite.title,
    description: defaultSite.description,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSite.title,
    description: defaultSite.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

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

/**
 * Identidade em dados estruturados, montada a partir de `data/site.ts`.
 *
 * `jobTitle` acompanha o posicionamento profissional do site (`defaultSite.role`,
 * "Engenheiro de Software"). Não há `alumniOf` nem campo de titulação — a
 * graduação em `defaultSite.degree` está em andamento e não é declarada aqui como
 * credencial obtida.
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: defaultSite.name,
  alternateName: defaultSite.initials,
  url: defaultSite.url,
  jobTitle: defaultSite.role,
  knowsAbout: defaultSite.degree,
  description: defaultSite.description,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      /* Valor do idioma PADRÃO. O script no <head> reescreve para "en" antes
         do primeiro paint quando essa for a escolha salva, e o
         `LanguageProvider` mantém em dia a cada troca. */
      lang="pt-BR"
      className={`${inter.variable} ${sourceSerif.variable}`}
      /* Os scripts no <head> escrevem `data-theme` e `data-lang` antes do
         React montar — sem isto o React reclamaria de um `<html>` que
         "mudou" entre o HTML do servidor e o que ele encontrou no primeiro
         render no cliente. */
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: languageInitScript }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* Sem JavaScript não há IntersectionObserver: o conteúdo entra já visível. */}
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>

        <ThemeProvider>
          <LanguageProvider>
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
