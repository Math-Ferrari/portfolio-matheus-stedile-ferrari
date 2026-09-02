import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseView } from "@/components/projects/case/case-view";
import { getProject } from "@/data/content";
import { projectSlugs } from "@/data/projects";
import { DEFAULT_LOCALE } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

/**
 * Metadata em português — o idioma do visitante vive no `localStorage` e não
 * chega ao servidor. Ver a nota em `app/layout.tsx`.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug, DEFAULT_LOCALE);

  if (!project) {
    return {};
  }

  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: {
      type: "article",
      title: `${project.name} — ${project.kind}`,
      description: project.summary,
      url: `/projetos/${project.slug}`,
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
