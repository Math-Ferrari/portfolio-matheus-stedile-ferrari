import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseView } from "@/components/projects/case/case-view";
import { getProject } from "@/data/content";
import { projectSlugs } from "@/data/projects";
import { OG_LOCALE, localizedAlternates, toLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

/**
 * Só os slugs — o Next cruza automaticamente com os `locale` que
 * `app/[locale]/layout.tsx` já declara, gerando as 2×3 combinações estáticas.
 */
export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);
  const project = getProject(slug, locale);

  if (!project) {
    return {};
  }

  const { canonical, languages } = localizedAlternates(`/projetos/${project.slug}`, locale);

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical, languages },
    openGraph: {
      type: "article",
      locale: OG_LOCALE[locale],
      title: `${project.name} — ${project.kind}`,
      description: project.summary,
      url: canonical,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  /* A validação do slug fica no servidor (é ela que produz o 404 real); a
     resolução do conteúdo por idioma acontece em `CaseView`. */
  if (!projectSlugs.includes(slug)) {
    notFound();
  }

  return <CaseView slug={slug} />;
}
