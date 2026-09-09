"use client";

import { ArrowRight } from "lucide-react";

import { Link } from "@/components/i18n/locale-link";
import { useContent } from "@/components/i18n/use-content";

import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { Project } from "@/lib/types";

type CaseNavProps = {
  next: Project;
};

/**
 * Fim do case: próximo projeto e volta para a lista. Tom `base`, não
 * `elevated` — o rodapé logo abaixo já é `elevated`; se os dois fossem
 * iguais, a transição desapareceria (o mesmo problema que o resto desta
 * auditoria corrigiu na home).
 */
export function CaseNav({ next }: CaseNavProps) {
  const { ui } = useContent();

  return (
    <section
      aria-label={ui.case.keepBrowsing}
      className="border-t border-border bg-background"
    >
      <Container className="py-16">
        <Reveal className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.18em] text-muted">
              <span aria-hidden className="h-px w-6 bg-accent" />
              {ui.case.nextProject}
            </p>
            <h2 className="mt-5 text-heading-lg font-medium -tracking-[0.03em] text-foreground">
              <Link
                href={`/projetos/${next.slug}`}
                className="group inline-flex items-center gap-4 transition-colors duration-200 hover:text-accent"
              >
                {next.name}
                <ArrowRight
                  aria-hidden
                  className="size-6 text-foreground transition-[color,transform] duration-200 ease-out group-hover:translate-x-1.5 group-hover:text-accent-strong"
                  strokeWidth={1.5}
                />
              </Link>
            </h2>
            <p className="mt-3 max-w-[42ch] text-muted">{next.tagline}</p>
          </div>

          <ActionLink href="/projetos" variant="secondary">
            {ui.case.allProjects}
          </ActionLink>
        </Reveal>
      </Container>
    </section>
  );
}
