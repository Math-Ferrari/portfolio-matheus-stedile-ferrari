import { ScreenshotFrame } from "@/components/projects/screenshot";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { featuredProject, platotruckCase } from "@/data/projects";

/**
 * Aprofundamento do case principal — muda de função em relação ao card de
 * "Projetos selecionados" logo acima: não repete nome, funcionalidades,
 * preview nem CTA, conta como o sistema foi pensado. Contexto → problema →
 * por que um sistema interno → decisões (problema→solução, uma por
 * funcionalidade) → engenharia → mudança operacional.
 *
 * As decisões correm em coluna única, não em grid — a screenshot real de
 * usuários/permissões (`public/2.png`) e de inventário (`public/3.png`)
 * entra dentro da própria decisão a que pertence, não numa galeria à parte.
 * A screenshot de visão geral (`public/1.png`) não reaparece aqui: ela já é
 * a capa do projeto no card logo acima.
 */
export function PlatoTruckCase() {
  const { contexto, problema, porque, building, engenharia, mudanca } = platotruckCase;

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

        {/* Como construí — cada funcionalidade nasceu de uma decisão; as duas
            com screenshot real ficam maiores na sequência, não numa galeria
            separada. */}
        <Reveal delay={80} className="mt-20">
          <p className="text-caption font-medium uppercase tracking-[0.18em] text-accent-blue">
            {building.label}
          </p>
          <p className="mt-4 max-w-[52ch] text-heading-md font-medium text-foreground">
            {building.lead}
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-12">
          {building.decisions.map((item) => (
            <Reveal key={item.title} className="border-t border-border pt-8">
              <h3 className="text-heading-md font-medium text-foreground">{item.title}</h3>
              <p className="mt-3 max-w-[52ch] text-muted">{item.problem}</p>
              <p className="mt-2 max-w-[52ch] text-foreground">↓ {item.decision}</p>

              {"screenshot" in item ? (
                <div className="mt-8">
                  <ScreenshotFrame
                    screenshot={item.screenshot}
                    tone="elevated"
                    sizes="(min-width: 1024px) 78rem, 100vw"
                    className="rounded-lg"
                  />
                </div>
              ) : null}
            </Reveal>
          ))}
        </div>

        {/* Engenharia — reforça, logo depois de usuários/permissões e
            inventário, que o acesso e os dados não dependem só da tela. */}
        <Reveal delay={80} className="mt-20 grid gap-x-12 gap-y-6 border-t border-border pt-10 lg:grid-cols-12">
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
