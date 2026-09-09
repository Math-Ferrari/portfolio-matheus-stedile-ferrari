"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { Link } from "@/components/i18n/locale-link";
import { ScreenshotFrame } from "@/components/projects/screenshot";
import type { Project } from "@/lib/types";
import { cn, toIndexLabel } from "@/lib/utils";

type ProjectExplorerProps = {
  projects: Project[];
};

/**
 * Lista numerada + preview grande, unificando duas ideias em um componente só:
 * o preview interativo (passar o mouse troca a imagem à direita) e a galeria
 * de exploração (números, screenshot grande, transição entre projetos).
 *
 * Desktop: lista de texto à esquerda, painel de screenshot fixo à direita —
 * hover/foco em uma linha troca o painel (crossfade em opacity, sem JS de
 * posição de cursor). Mobile: cada linha já mostra sua própria screenshot
 * inline — não depende de hover, que não existe em touch.
 */
export function ProjectExplorer({ projects }: ProjectExplorerProps) {
  const [active, setActive] = useState(0);
  const activeProject = projects[active] ?? projects[0];

  if (!activeProject) {
    return null;
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-12">
      <div className="lg:col-span-5">
        <ul className="border-t border-border">
          {projects.map((project, index) => (
            <li key={project.slug} className="border-b border-border">
              <Link
                href={`/projetos/${project.slug}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={cn(
                  "group flex items-baseline justify-between gap-6 py-6 transition-colors duration-200",
                  index === active ? "text-accent" : "text-foreground hover:text-accent",
                )}
              >
                <span className="flex items-baseline gap-5">
                  <span className="nums-tabular text-xs text-muted">{toIndexLabel(index)}</span>
                  <span className="text-heading-lg font-medium -tracking-[0.02em]">
                    {project.name}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="size-5 shrink-0 text-accent-strong opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  strokeWidth={1.75}
                />
              </Link>

              <div className="pb-7 lg:hidden">
                <ScreenshotFrame screenshot={project.cover} sizes="100vw" />
                <p className="mt-3 text-sm leading-relaxed text-muted">{project.tagline}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-24">
          <div aria-hidden className="relative aspect-[16/10] w-full">
            {projects.map((project, index) => (
              <div
                key={project.slug}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500 ease-out",
                  index === active ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <ScreenshotFrame
                  screenshot={project.cover}
                  priority={index === 0}
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />
              </div>
            ))}
          </div>

          <p className="mt-6 text-body-lg font-medium text-foreground">{activeProject.tagline}</p>
          <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-muted">
            {activeProject.summary}
          </p>
        </div>
      </div>
    </div>
  );
}
