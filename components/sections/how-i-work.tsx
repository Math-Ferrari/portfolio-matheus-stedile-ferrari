import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { howIWork } from "@/data/site";

/**
 * Fusão de "Abordagem" e "O que faço" — as duas diziam a mesma coisa por
 * ângulos diferentes (como penso / o que construo) e juntas ocupavam duas
 * telas com sete caixas. Aqui viram dois blocos de uma seção só, resolvidos
 * por grid e tipografia: nenhum card, nenhuma numeração decorativa.
 */
export function HowIWork() {
  return (
    <section id="como-trabalho" className="bg-background">
      <Container className="py-section">
        <Reveal className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
          <h2 className="text-balance-title max-w-[16ch] text-heading-xl font-medium text-foreground lg:col-span-6">
            {howIWork.title}
          </h2>
          <p className="max-w-[48ch] text-muted lg:col-span-6 lg:pt-2">{howIWork.lead}</p>
        </Reveal>

        {/* Como penso — três etapas, tipográficas, sem caixa. */}
        <Reveal delay={80} className="mt-20">
          <p className="text-caption font-medium uppercase tracking-[0.18em] text-muted">
            Como penso
          </p>
          <ol className="mt-8 grid gap-x-12 gap-y-10 sm:grid-cols-3">
            {howIWork.thinking.map((step) => (
              <li key={step.title} className="border-t border-border pt-5">
                <h3 className="text-heading-md font-medium text-foreground">{step.title}</h3>
                <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* O que construo — quatro frentes, uma linha cada. */}
        <Reveal delay={80} className="mt-20">
          <p className="text-caption font-medium uppercase tracking-[0.18em] text-muted">
            O que construo
          </p>
          <dl className="mt-8 border-t border-border">
            {howIWork.building.map((item) => (
              <div
                key={item.title}
                className="grid gap-1 border-b border-border py-5 sm:grid-cols-[16rem_1fr] sm:gap-8"
              >
                <dt className="font-medium text-foreground">{item.title}</dt>
                <dd className="max-w-[52ch] text-muted">{item.description}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
