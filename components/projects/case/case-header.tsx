import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { FramedVisual } from "@/components/projects/framed-visual";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { Project } from "@/lib/types";
import { splitHighlight } from "@/lib/utils";

type CaseHeaderProps = {
  project: Project;
};

export function CaseHeader({ project }: CaseHeaderProps) {
  const { before, match, after } = splitHighlight(
    project.tagline,
    project.taglineHighlight ?? "",
  );

  return (
    <header className="bg-tone-slate">
      <Container className="pb-14 pt-8 md:pt-12">
        <Link
          href="/projetos"
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-accent"
        >
          <ArrowLeft
            aria-hidden
            className="size-4 transition-transform duration-200 ease-out group-hover:-translate-x-1"
            strokeWidth={1.75}
          />
          Projetos
        </Link>

        <div className="mt-10 grid min-w-0 grid-cols-[minmax(0,1fr)] items-center gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-6">
            <p className="rise rise-1 flex min-w-0 flex-wrap items-center gap-3 text-caption font-medium uppercase leading-relaxed tracking-[0.18em] text-muted">
              <span aria-hidden className="h-px w-6 bg-accent" />
              {project.kind} — {project.role}
            </p>

            <h1 className="reveal-title rise-2 text-balance-title mt-7 max-w-[20ch] text-heading-xl font-medium text-foreground">
              {project.name}
            </h1>

            <p className="rise rise-3 mt-6 max-w-[44ch] text-body-lg text-foreground">
              {before}
              {match ? <span className="text-accent">{match}</span> : null}
              {after}
            </p>

            {project.links.length > 0 ? (
              <div className="rise rise-4 mt-8 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <ActionLink key={link.href} href={link.href} variant="secondary" external>
                    {link.label}
                  </ActionLink>
                ))}
              </div>
            ) : null}
          </div>

          <div className="min-w-0 lg:col-span-6">
            <FramedVisual
              screenshot={project.cover}
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="rise-visual mx-auto w-full min-w-0 max-w-[34rem] lg:max-w-none"
            />
          </div>
        </div>

        {project.case ? (
          <Reveal className="mt-16 grid gap-x-10 lg:grid-cols-12">
            <div className="border-t border-border pt-8 lg:col-span-8 lg:col-start-4">
              <div className="max-w-[62ch] space-y-5 text-body-lg text-muted">
                {project.case.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}
      </Container>
    </header>
  );
}
