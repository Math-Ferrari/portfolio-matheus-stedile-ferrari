import { ArrowDown } from "lucide-react";

import { FluidCanvas } from "@/components/hero/fluid-canvas";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { hero, site } from "@/data/site";
import { splitHighlight } from "@/lib/utils";

/** Id consumido pelo canvas para localizar a palavra que organiza o campo. */
const STRUCTURE_ID = "hero-software";

/**
 * Hero experimental: o campo de fluido WebGL é o elemento visual da primeira
 * dobra — não há mais placeholder de screenshot aqui.
 *
 * O conteúdo é HTML de verdade e renderizado no servidor; o canvas é apenas
 * uma camada de fundo `aria-hidden`. Se o WebGL não iniciar, a composição
 * estática atrás dele assume e nada na página quebra.
 */
export function InteractiveHero() {
  const [lineOne, lineTwo, lineThree] = hero.lines;
  const { before, match, after } = splitHighlight(lineThree, hero.highlight);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-paper"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        {/* Base estática: é o que aparece sob reduced-motion, sem WebGL2 ou
            se o contexto se perder. Fica sempre atrás do canvas. */}
        <div className="hero-static-field absolute inset-0" />
        <FluidCanvas structureSelector={`#${STRUCTURE_ID}`} />
      </div>

      <Container className="relative flex flex-1 flex-col justify-center pb-10 pt-20 md:pt-24">
        <p className="reveal-title hero-d1 flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-ink-subtle">
          <span aria-hidden className="h-px w-8 bg-blue" />
          {hero.eyebrow}
        </p>

        <h1
          id="hero-title"
          className="mt-8 font-serif text-[clamp(2.6rem,1rem+6.2vw,6.75rem)] font-medium leading-[0.97] -tracking-[0.035em] text-ink"
        >
          {/* Os espaços entre os spans são intencionais: sem eles o texto
              acessível vira "Transformoproblemas de negócioem software.".
              Entre caixas de bloco eles não renderizam nada. */}
          <span className="reveal-title hero-d2 block">{lineOne}</span>{" "}
          <span className="reveal-title hero-d3 block">{lineTwo}</span>{" "}
          <span className="block">
            <span className="reveal-title hero-d4 inline-block">{before.trim()}</span>{" "}
            <span
              id={STRUCTURE_ID}
              className="reveal-title hero-d5 inline-block text-blue"
            >
              {match}
              {after}
            </span>
          </span>
        </h1>

        <p className="rise hero-d6 mt-9 max-w-[46ch] text-lead text-ink-muted">{hero.lead}</p>

        <div className="rise hero-d7 mt-10 flex flex-wrap items-center gap-3">
          <ActionLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ActionLink>
          <ActionLink href={hero.secondaryCta.href} variant="secondary">
            {hero.secondaryCta.label}
          </ActionLink>
        </div>
      </Container>

      <Container className="rise hero-d7 relative pb-8">
        <div className="flex items-end justify-between gap-6 border-t border-line pt-5">
          <p
            aria-hidden
            className="nums-tabular font-serif text-sm font-semibold tracking-[0.22em] text-blue"
          >
            {site.initials}
          </p>

          <a
            href={hero.primaryCta.href}
            className="group flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-subtle transition-colors duration-200 hover:text-blue"
          >
            Role para ver os projetos
            <ArrowDown
              aria-hidden
              className="size-4 transition-transform duration-300 ease-out group-hover:translate-y-1"
              strokeWidth={1.75}
            />
          </a>
        </div>
      </Container>
    </section>
  );
}
