import { ScreenshotFrame } from "@/components/projects/screenshot";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { featuredProject, getFeaturedScreenshot, platotruckCase } from "@/data/projects";

/**
 * Aprofundamento do case principal — muda de função em relação ao card de
 * "Projetos selecionados" logo acima: não repete nome, funcionalidades,
 * preview nem CTA, conta como o sistema foi pensado. Contexto → problema →
 * por que um sistema interno → decisões (problema→solução, uma por
 * funcionalidade) → engenharia → mudança operacional, com uma screenshot
 * grande entre os blocos mais técnicos. Um único CTA, no fim.
 */
export function PlatoTruckCase() {
  const { contexto, problema, porque, building, engenharia, mudanca } = platotruckCase;
  const systemShot = getFeaturedScreenshot("tela-sistema");
  const permissionsShot = getFeaturedScreenshot("tela-permissoes");

  return (
    <section id="case-platotruck" className="bg-tone-slate">
      <Container className="py-section">
        <Reveal>
          <p className="text-caption font-medium uppercase tracking-[0.18em] text-accent-blue">
            {platotruckCase.eyebrow}
          </p>
          <h2 className="mt-4 text-heading-xl font-medium text-foreground">
            {platotruckCase.name}
          </h2>
          <p className="mt-5 max-w-[56ch] text-body-lg text-muted">{platotruckCase.intro}</p>
        </Reveal>

        {/* Contexto / Problema / Por que — um triptych curto, não três
            parágrafos empilhados. */}
        <Reveal delay={80} className="mt-16 grid gap-10 border-t border-border pt-10 sm:grid-cols-3">
          {[contexto, problema, porque].map((block) => (
            <div key={block.label}>
              <p className="text-caption font-medium uppercase tracking-[0.16em] text-muted">
                {block.label}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{block.body}</p>
            </div>
          ))}
        </Reveal>

        {/* Como construí — a screenshot do sistema entra logo no início do
            bloco: aqui está o resultado das decisões que seguem. */}
        <Reveal delay={80} className="mt-20">
          <p className="text-caption font-medium uppercase tracking-[0.18em] text-accent-blue">
            {building.label}
          </p>
          <p className="mt-4 max-w-[52ch] text-heading-md font-medium text-foreground">
            {building.lead}
          </p>
        </Reveal>

        {systemShot ? (
          <Reveal delay={80} className="mt-10">
            <ScreenshotFrame screenshot={systemShot} tone="elevated" sizes="(min-width: 1024px) 78rem, 100vw" className="rounded-lg" />
          </Reveal>
        ) : null}

        <Reveal delay={80} className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {building.decisions.map((item) => (
            <div key={item.title} className="border-t border-border pt-5">
              <h3 className="font-medium text-foreground">{item.title}</h3>
              <p className="mt-3 max-w-[40ch] text-sm text-muted">{item.problem}</p>
              <p className="mt-2 max-w-[40ch] text-sm text-foreground">↓ {item.decision}</p>
            </div>
          ))}
        </Reveal>

        {/* Engenharia — a screenshot de permissões faz a ponte entre "como
            construí" (interface) e "não foi só interface" (regras por trás
            dela). */}
        {permissionsShot ? (
          <Reveal delay={80} className="mt-20">
            <ScreenshotFrame
              screenshot={permissionsShot}
              tone="elevated"
              sizes="(min-width: 1024px) 78rem, 100vw"
              className="rounded-lg"
            />
          </Reveal>
        ) : null}

        <Reveal delay={80} className="mt-14 grid gap-x-12 gap-y-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-caption font-medium uppercase tracking-[0.18em] text-accent-blue">
              {engenharia.label}
            </p>
            <p className="mt-4 text-heading-md font-medium text-foreground">{engenharia.lead}</p>
          </div>

          <ul className="grid gap-x-10 gap-y-3 text-sm text-foreground sm:grid-cols-2 lg:col-span-8">
            {engenharia.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden className="mt-[0.5em] size-1.5 shrink-0 bg-accent-blue" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Mudança operacional + CTA único da seção. */}
        <Reveal delay={80} className="mt-20 border-t border-border pt-10">
          <p className="text-caption font-medium uppercase tracking-[0.18em] text-muted">
            {mudanca.label}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-heading-md text-muted">{mudanca.before}</p>
            <span aria-hidden className="hidden text-muted sm:block">
              →
            </span>
            <p className="text-heading-md font-medium text-foreground">{mudanca.after}</p>
          </div>

          <ActionLink
            href={`/projetos/${featuredProject.slug}`}
            variant="quiet"
            className="mt-10 text-lg"
          >
            {platotruckCase.cta}
          </ActionLink>
        </Reveal>
      </Container>
    </section>
  );
}
