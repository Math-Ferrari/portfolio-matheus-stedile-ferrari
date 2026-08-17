import type { Metadata } from "next";

import { FeaturedProject } from "@/components/projects/featured-project";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { Transformation } from "@/components/sections/transformation";
import { Container } from "@/components/ui/container";
import { featuredProject, secondaryProjects } from "@/data/projects";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Projetos",
  description: `Sistemas internos, plataformas web e sites desenvolvidos por ${site.name} — problema, solução e o que foi construído.`,
  alternates: { canonical: "/projetos" },
};

export default function ProjectsPage() {
  return (
    <>
      <Container className="pb-14 pt-14 md:pb-16 md:pt-20">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-12">
          <div className="lg:col-span-3 xl:col-span-2">
            <p className="rise rise-1 flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-ink-subtle">
              <span aria-hidden className="h-px w-6 bg-blue" />
              Projetos
            </p>
          </div>

          <div className="lg:col-span-9 xl:col-span-6">
            <h1 className="reveal-title rise-2 text-balance-title max-w-[16ch] text-title font-medium text-ink">
              Problema, solução e o que foi construído.
            </h1>
          </div>

          <div className="lg:col-span-9 lg:col-start-4 xl:col-span-4 xl:col-start-auto xl:pt-2">
            <p className="rise rise-3 max-w-[46ch] text-lead text-ink-muted">
              Cada projeto aqui resolve uma necessidade concreta. As tecnologias aparecem depois
              da história — primeiro o que precisava ser resolvido.
            </p>
          </div>
        </div>
      </Container>

      <FeaturedProject project={featuredProject} as="h2" />

      <Transformation />

      <Container className="border-t border-line pb-section pt-16 md:pt-20">
        <ProjectExplorer projects={secondaryProjects} />
      </Container>
    </>
  );
}
