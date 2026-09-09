import type { Metadata } from "next";

import { ProjectsView } from "@/components/projects/projects-view";
import { getContent } from "@/data/content";
import { OG_LOCALE, localizedAlternates, toLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const { site } = getContent(locale);
  const { canonical, languages } = localizedAlternates("/projetos", locale);

  const title = locale === "pt" ? "Projetos" : "Projects";
  const description =
    locale === "pt"
      ? `Sistemas internos, plataformas web e sites desenvolvidos por ${site.name} — problema, solução e o que foi construído.`
      : `Internal systems, web platforms, and websites built by ${site.name} — problem, solution, and what was built.`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: canonical,
      siteName: site.name,
      title,
      description,
    },
  };
}

export default function ProjectsPage() {
  return <ProjectsView />;
}
