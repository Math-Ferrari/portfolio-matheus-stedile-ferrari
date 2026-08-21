import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { engineering, techGroups } from "@/data/site";

/**
 * Stack + Engenharia numa composição dividida — antes eram duas seções
 * inteiras, a segunda com oito blocos explicando conceitos básicos de
 * segurança. Na home o objetivo é sinalizar que o assunto é tratado; o
 * "como foi implementado" pertence aos cases.
 *
 * O ponto no verde mais profundo antes do último princípio é o detalhe
 * cromático raro da seção — um só, no fecho da lista.
 */
export function StackEngineering() {
  const lastIndex = engineering.principles.length - 1;

  return (
    <section id="stack" className="bg-tone-graphite">
      <Container className="py-section">
        <div className="grid gap-x-16 gap-y-20 lg:grid-cols-12">
          {/* Stack */}
          <Reveal className="lg:col-span-7">
            <h2 className="text-heading-xl font-medium text-foreground">Stack</h2>

            <dl className="mt-10 border-t border-border">
              {techGroups.map((group) => (
                <div
                  key={group.label}
                  className="grid gap-2 border-b border-border py-5 sm:grid-cols-[9rem_1fr] sm:gap-8"
                >
                  <dt className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
                    {group.label}
                  </dt>
                  <dd className="text-foreground">{group.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Engenharia — princípios, sem um parágrafo por item. */}
          <Reveal delay={80} className="lg:col-span-5">
            <h2 className="text-heading-xl font-medium text-foreground">Engenharia</h2>

            <p className="mt-6 max-w-[40ch] text-muted">{engineering.title}</p>
            <p className="mt-4 max-w-[40ch] text-sm text-muted">{engineering.lead}</p>

            <ul className="mt-10 flex flex-col gap-3.5">
              {engineering.principles.map((principle, index) => (
                <li key={principle} className="flex items-center gap-3 text-foreground">
                  <span
                    aria-hidden
                    className={
                      index === lastIndex
                        ? "size-1.5 shrink-0 bg-accent-strong"
                        : "size-1.5 shrink-0 bg-accent"
                    }
                  />
                  {principle}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
