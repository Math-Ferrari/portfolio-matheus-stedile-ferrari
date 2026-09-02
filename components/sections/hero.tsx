"use client";

import { useContent } from "@/components/i18n/use-content";
import { FramedVisual } from "@/components/projects/framed-visual";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { splitHighlight } from "@/lib/utils";

export function Hero() {
  const { hero, heroVisual } = useContent();
  const { before, match, after } = splitHighlight(hero.title, hero.highlight);

  return (
    <section aria-labelledby="hero-title" className="bg-paper">
      <Container className="pb-section pt-12 md:pt-20">
        <div className="grid items-center gap-x-12 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-6 xl:col-span-6">
            <p className="rise rise-1 flex items-center gap-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-ink-subtle">
              <span aria-hidden className="h-px w-6 bg-blue" />
              {hero.eyebrow}
            </p>

            <h1
              id="hero-title"
              className="reveal-title rise-2 text-balance-title mt-8 max-w-[15ch] font-serif text-display font-medium text-ink"
            >
              {before}
              {match ? <span className="text-blue">{match}</span> : null}
              {after}
            </h1>

            <p className="rise rise-3 mt-8 max-w-[52ch] text-lead text-ink-muted">{hero.lead}</p>

            <div className="rise rise-4 mt-10 flex flex-wrap items-center gap-3">
              <ActionLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ActionLink>
              <ActionLink href={hero.secondaryCta.href} variant="secondary">
                {hero.secondaryCta.label}
              </ActionLink>
            </div>
          </div>

          <div className="lg:col-span-6">
            <FramedVisual
              screenshot={heroVisual}
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="rise-visual mx-auto max-w-[34rem] lg:max-w-none"
            />
          </div>
        </div>

        <ul className="mt-16 grid gap-x-8 gap-y-3 border-t border-line pt-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {hero.disciplines.map((discipline) => (
            <li
              key={discipline}
              className="flex items-center gap-3 text-[0.78rem] font-medium uppercase tracking-[0.14em] text-ink-subtle"
            >
              <span aria-hidden className="size-1.5 shrink-0 bg-blue" />
              {discipline}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
