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
            <p className="rise rise-1 flex items-center gap-3 text-caption font-medium uppercase tracking-[0.18em] text-muted">
              <span aria-hidden className="h-px w-6 bg-accent" />
              Projetos
            </p>
          </div>

          <div className="lg:col-span-9 xl:col-span-6">
            <h1 className="reveal-title rise-2 text-balance-title max-w-[16ch] text-heading-xl font-medium text-foreground">
              Problema, solução e o que foi construído.
            </h1>
          </div>

          <div className="lg:col-span-9 lg:col-start-4 xl:col-span-4 xl:col-start-auto xl:pt-2">
            <p className="rise rise-3 max-w-[46ch] text-body-lg text-muted">
              Cada projeto aqui resolve uma necessidade concreta. As tecnologias aparecem depois
              da história — primeiro o que precisava ser resolvido.
            </p>
          </div>
        </div>
      </Container>

      <FeaturedProject project={featuredProject} as="h2" />

      <Transformation />

      <div className="border-t border-border bg-tone-petrol">
        <Container className="pb-section pt-16 md:pt-20">
          <ProjectExplorer projects={secondaryProjects} />
        </Container>
      </div>
    </>
  );
}
