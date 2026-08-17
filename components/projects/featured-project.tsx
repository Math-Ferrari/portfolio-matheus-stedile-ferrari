import Link from "next/link";

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
 * Faixa navy de largura total com o case principal. É o único bloco escuro do
 * meio da página — a chamada vem antes do nome do projeto.
 */
export function FeaturedProject({ project, as: Heading = "h3" }: FeaturedProjectProps) {
  const href = `/projetos/${project.slug}`;
  const { before, match, after } = splitHighlight(
    project.tagline,
    project.taglineHighlight ?? "",
  );

  return (
    <div className="on-navy bg-navy">
      <Container className="py-16 md:py-20 lg:py-24">
        <div className="grid gap-x-12 gap-y-14 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-5">
            <Eyebrow tone="navy">Case principal</Eyebrow>

            <Heading className="text-balance-title mt-7 font-serif text-statement font-medium text-on-navy">
              <Link
                href={href}
                className="transition-colors duration-200 hover:text-blue-light"
              >
                {before}
                {match ? <span className="text-blue-light">{match}</span> : null}
                {after}
              </Link>
            </Heading>

            <p className="mt-6 text-[0.76rem] font-medium uppercase tracking-[0.16em] text-blue-light">
              {project.name} — {project.kind}
            </p>

            <p className="mt-6 max-w-[46ch] text-on-navy-muted">{project.summary}</p>

            <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="border-t border-line-navy py-3 text-sm text-on-navy"
                >
                  {highlight}
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <ActionLink href={href} variant="primaryDark">
                Ver case completo
              </ActionLink>
            </div>
          </Reveal>

          <Reveal delay={110} from="right" className="lg:col-span-7">
            <FramedVisual
              screenshot={project.cover}
              tone="dark"
              sizes="(min-width: 1024px) 54vw, 100vw"
            />
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
