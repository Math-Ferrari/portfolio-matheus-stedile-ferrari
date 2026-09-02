import type { Metadata } from "next";

import { ProjectsView } from "@/components/projects/projects-view";
import { defaultContent } from "@/data/content";

/**
 * Metadata em português — ver a nota em `app/layout.tsx` sobre por que ela
 * não acompanha o idioma escolhido.
 */
export const metadata: Metadata = {
  title: "Projetos",
  description: `Sistemas internos, plataformas web e sites desenvolvidos por ${defaultContent.site.name} — problema, solução e o que foi construído.`,
  alternates: { canonical: "/projetos" },
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
