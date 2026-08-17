import { FeaturedProject } from "@/components/projects/featured-project";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { Transformation } from "@/components/sections/transformation";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { featuredProject, secondaryProjects } from "@/data/projects";

/**
 * Hierarquia da seção: cabeçalho em bege → faixa navy de largura total com o
 * case principal → teaser do antes/depois → os outros dois projetos em uma
 * lista com preview (não um grid de cards iguais).
 */
export function FeaturedWork() {
  return (
    <section id="projetos" className="border-t border-line bg-paper">
      <Container className="pb-14 pt-section md:pb-16">
        <SectionHeader
          index="01"
          label="Projetos"
          title="Problema, solução e o que foi construído."
          lead="O sistema de gestão da PlatoTruck é o principal case. Os outros dois mostram a mesma atuação em contextos diferentes."
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
