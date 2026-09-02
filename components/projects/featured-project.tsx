"use client";

import Link from "next/link";

import { useContent } from "@/components/i18n/use-content";
import { FramedVisual } from "@/components/projects/framed-visual";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import type { Project } from "@/lib/types";
import { splitHighlight } from "@/lib/utils";

type FeaturedProjectProps = {
  project: Project;
  /** Nível do título dentro da hierarquia da página. */
  as?: "h2" | "h3";
};

/**
 * Faixa de largura total com o case principal, em `bg-tone-slate` — o mesmo
 * papel usado por `PlatoTruckShowcase` na home, para o case principal ler
 * como a mesma "cena" em qualquer página.
 */
export function FeaturedProject({ project, as: Heading = "h3" }: FeaturedProjectProps) {
  const { ui } = useContent();
  const href = `/projetos/${project.slug}`;
  const { before, match, after } = splitHighlight(
    project.tagline,
    project.taglineHighlight ?? "",
  );

  return (
    <div className="bg-tone-slate">
      <Container className="py-16 md:py-20 lg:py-24">
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <Eyebrow>{ui.sections.featuredCase}</Eyebrow>

            <Heading className="text-balance-title mt-7 text-heading-xl font-medium text-foreground">
              <Link href={href} className="transition-colors duration-200 hover:text-accent">
                {before}
                {match ? <span className="text-accent">{match}</span> : null}
                {after}
              </Link>
            </Heading>

            <p className="mt-6 text-caption font-medium uppercase tracking-[0.16em] text-accent">
              {project.name} — {project.kind}
            </p>

            <p className="mt-6 max-w-[46ch] text-muted">{project.summary}</p>

            <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="border-t border-border py-3 text-sm text-foreground">
                  {highlight}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <ActionLink href={href} variant="quiet" className="text-lg">
                {ui.projects.viewCase}
              </ActionLink>
            </div>
          </Reveal>

          <Reveal delay={110} from="right" className="lg:col-span-7">
            <FramedVisual screenshot={project.cover} sizes="(min-width: 1024px) 54vw, 100vw" />
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
