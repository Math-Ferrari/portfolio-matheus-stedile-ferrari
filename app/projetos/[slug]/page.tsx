import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseBlocks } from "@/components/projects/case/case-blocks";
import { CaseHeader } from "@/components/projects/case/case-header";
import { CaseNav } from "@/components/projects/case/case-nav";
import { CaseToc } from "@/components/projects/case/case-toc";
import { Container } from "@/components/ui/container";
import { getNextProject, getProject, projects } from "@/data/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

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
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const next = getNextProject(project.slug);

  return (
    <article>
      <CaseHeader project={project} />

      {project.case ? (
        <Container className="pb-section pt-8">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <CaseToc blocks={project.case.blocks} />
            </div>
            <div className="min-w-0 lg:col-span-8 lg:col-start-5">
              <CaseBlocks blocks={project.case.blocks} />
            </div>
          </div>
        </Container>
      ) : null}

      <CaseNav next={next} />
    </article>
  );
}
