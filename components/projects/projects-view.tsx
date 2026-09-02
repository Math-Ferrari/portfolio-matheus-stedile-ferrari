"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { useContent } from "@/components/i18n/use-content";
import { FeaturedProject } from "@/components/projects/featured-project";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { Transformation } from "@/components/sections/transformation";
import { Container } from "@/components/ui/container";
import { getFeaturedProject, getSecondaryProjects } from "@/data/content";

/**
 * Corpo da rota `/projetos`. Mesmo motivo de `CaseView`: a página continua um
 * Server Component por causa da `metadata`, e a resolução por idioma acontece
 * aqui. O markup é exatamente o que estava na página — nada de layout mudou.
 */
export function ProjectsView() {
  const { locale } = useLanguage();
  const { ui } = useContent();
  const featuredProject = getFeaturedProject(locale);
  const secondaryProjects = getSecondaryProjects(locale);

  return (
    <>
      <Container className="pb-14 pt-14 md:pb-16 md:pt-20">
        <div className="grid gap-x-10 gap-y-7 lg:grid-cols-12">
          <div className="lg:col-span-3 xl:col-span-2">
            <p className="rise rise-1 flex items-center gap-3 text-caption font-medium uppercase tracking-[0.18em] text-muted">
              <span aria-hidden className="h-px w-6 bg-accent" />
              {ui.projects.eyebrow}
            </p>
          </div>

          <div className="lg:col-span-9 xl:col-span-6">
            <h1 className="reveal-title rise-2 text-balance-title max-w-[16ch] text-heading-xl font-medium text-foreground">
              {ui.projects.pageTitle}
            </h1>
          </div>

          <div className="lg:col-span-9 lg:col-start-4 xl:col-span-4 xl:col-start-auto xl:pt-2">
            <p className="rise rise-3 max-w-[46ch] text-body-lg text-muted">
              {ui.projects.pageLead}
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
