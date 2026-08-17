import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { activeContacts, site } from "@/data/site";

import "./globals.css";

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
  themeColor: "#f3efe7",
  colorScheme: "light",
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
    <html lang="pt-BR" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="min-h-dvh antialiased">
        {/* Sem JavaScript não há IntersectionObserver: o conteúdo entra já visível. */}
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>

        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-blue focus:px-5 focus:py-2 focus:text-sm focus:text-white"
        >
          Pular para o conteúdo
        </a>

        <SmoothScroll>
          <SiteHeader />
          <main id="conteudo">{children}</main>
          <SiteFooter />
        </SmoothScroll>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
