import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { activeContacts, site } from "@/data/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
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
 * `jobTitle` acompanha o posicionamento profissional do site (`site.role`,
 * "Engenheiro de Software"). Não há `alumniOf` nem campo de titulação — a
 * graduação em `site.degree` está em andamento e não é declarada aqui como
 * credencial obtida.
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${sourceSerif.variable}`}
      /* O script no <head> escreve `data-theme` antes do React montar — sem
         isto o React reclamaria de um `<html>` que "mudou" entre o HTML do
         servidor e o que ele encontrou no primeiro render no cliente. */
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* Sem JavaScript não há IntersectionObserver: o conteúdo entra já visível. */}
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>

        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent-strong focus:px-5 focus:py-2 focus:text-sm focus:text-white"
        >
          Pular para o conteúdo
        </a>

        <ThemeProvider>
          <SmoothScroll>
            <SiteHeader />
            <main id="conteudo">{children}</main>
            <SiteFooter />
          </SmoothScroll>
        </ThemeProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
