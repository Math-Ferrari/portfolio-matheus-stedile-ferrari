import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { featuredProject, getFeaturedBeforeAfter } from "@/data/projects";

/**
 * Versão-teaser do antes/depois do case principal, lida direto do bloco
 * `beforeAfter` do case (mesma fonte, sem duplicar texto). Tratamento
 * tipográfico — sem caixas, sem ícones, sem aparência de infográfico.
 */
export function Transformation() {
  const block = getFeaturedBeforeAfter();

  if (!block) {
    return null;
  }

  const before = block.before.items.slice(0, 4);
  const after = block.after.items.slice(0, 4);

  return (
    <div className="border-t border-line bg-paper">
      <Container className="py-16 md:py-20">
        <Eyebrow>{featuredProject.name} — a transformação</Eyebrow>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10">
          <Reveal>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-ink-subtle">
              {block.before.label}
            </p>
            <ul className="mt-5 space-y-3.5">
              {before.map((item) => (
                <li
                  key={item}
                  className="text-lg leading-snug text-ink-subtle decoration-line-strong decoration-1 line-through"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <div aria-hidden className="hidden text-2xl text-ink-subtle md:block">
            →
          </div>

          <Reveal delay={110}>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-blue">
              {block.after.label}
            </p>
            <ul className="mt-5 space-y-3.5">
              {after.map((item) => (
                <li key={item} className="text-lg font-medium leading-snug text-ink">
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
