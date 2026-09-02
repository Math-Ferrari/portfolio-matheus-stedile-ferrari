"use client";

import { useLanguage } from "@/components/i18n/language-provider";
import { FeaturedProject } from "@/components/projects/featured-project";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { Transformation } from "@/components/sections/transformation";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { getFeaturedProject, getSecondaryProjects } from "@/data/content";
import { useContent } from "@/components/i18n/use-content";

/**
 * Hierarquia da seção: cabeçalho em bege → faixa navy de largura total com o
 * case principal → teaser do antes/depois → os outros dois projetos em uma
 * lista com preview (não um grid de cards iguais).
 */
export function FeaturedWork() {
  const { locale } = useLanguage();
  const { ui } = useContent();
  const featuredProject = getFeaturedProject(locale);
  const secondaryProjects = getSecondaryProjects(locale);

  return (
    <section id="projetos" className="border-t border-line bg-paper">
      <Container className="pb-14 pt-section md:pb-16">
        <SectionHeader
          index="01"
          label={ui.projects.eyebrow}
          title={ui.projects.pageTitle}
          lead={ui.projects.pageLead}
        />
      </Container>

      <FeaturedProject project={featuredProject} />

      <Transformation />

      <Container className="border-t border-line pb-section pt-16 md:pt-20">
        <ProjectExplorer projects={secondaryProjects} />
      </Container>
    </section>
  );
}
