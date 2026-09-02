"use client";

import { useContent } from "@/components/i18n/use-content";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { getFeaturedBeforeAfter, getFeaturedProject } from "@/data/content";
import { useLanguage } from "@/components/i18n/language-provider";

/**
 * Versão-teaser do antes/depois do case principal, lida direto do bloco
 * `beforeAfter` do case (mesma fonte, sem duplicar texto). Tratamento
 * tipográfico — sem caixas, sem ícones, sem aparência de infográfico.
 */
export function Transformation() {
  const { locale } = useLanguage();
  const { ui } = useContent();
  const featuredProject = getFeaturedProject(locale);
  const block = getFeaturedBeforeAfter(locale);

  if (!block) {
    return null;
  }

  const before = block.before.items.slice(0, 4);
  const after = block.after.items.slice(0, 4);

  return (
    <div className="border-t border-border bg-background">
      <Container className="py-16 md:py-20">
        <Eyebrow>
          {featuredProject.name} {ui.transformation.suffix}
        </Eyebrow>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10">
          <Reveal>
            <p className="text-caption font-medium uppercase tracking-[0.18em] text-muted">
              {block.before.label}
            </p>
            <ul className="mt-5 space-y-3.5">
              {before.map((item) => (
                <li
                  key={item}
                  className="text-lg leading-snug text-muted decoration-border decoration-1 line-through"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <div aria-hidden className="hidden text-2xl text-muted md:block">
            →
          </div>

          <Reveal delay={110}>
            <p className="text-caption font-medium uppercase tracking-[0.18em] text-accent">
              {block.after.label}
            </p>
            <ul className="mt-5 space-y-3.5">
              {after.map((item) => (
                <li key={item} className="text-lg font-medium leading-snug text-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
