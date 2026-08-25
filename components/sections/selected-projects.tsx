import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ScreenshotFrame } from "@/components/projects/screenshot";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getProject, selectedProjects } from "@/data/projects";
import type { Project } from "@/lib/types";
import { cn, toIndexLabel } from "@/lib/utils";

type Showcase = (typeof selectedProjects)[number];

/**
 * Card = módulo editorial horizontal, não card de dashboard em coluna. Um
 * único `<Link>` cobre o card inteiro (ver nota de acessibilidade abaixo) e
 * é um grid de 12 colunas a partir do tablet (`md`, 768px) — conteúdo à
 * esquerda, imagem à direita — o MESMO eixo que `about-intro.tsx` já usa na
 * hero (texto à esquerda, retrato à direita), para os dois lugares lerem
 * como o mesmo produto. Nenhum card inverte esse lado: alternar por linha
 * criaria um zigue-zague que não existe em nenhum outro lugar do site.
 *
 * O split é 6/6 no tablet (`md`, menos largura disponível) e 5/7 no desktop
 * (`lg`+, imagem ganha mais protagonismo) — abaixo de `md` (celular) o card
 * empilha (imagem no topo, conteúdo embaixo), único breakpoint onde ele
 * deixa de ser horizontal.
 *
 * A imagem não tem proporção fixa a partir do tablet (`md:aspect-auto`) —
 * ela preenche a altura que o grid resolve a partir do conteúdo (CSS Grid
 * `align-items: stretch`, o padrão), então a screenshot participa da
 * composição horizontal em vez de ser um topo de card com altura própria.
 * No mobile, sem uma linha para esticar contra, ela volta a ter proporção
 * própria (`aspect-[4/3]`) para não colapsar a 0px de altura.
 *
 * Fundo/borda/hover reaproveitam exatamente o sistema da iteração anterior
 * (opacidade fracionária de `--surface` sobre `bg-tone-navy`, mesma técnica
 * da cápsula do `SiteHeader`) — só a topologia do card mudou, não a
 * linguagem de cor/motion.
 */
function ProjectCard({
  showcase,
  project,
  index,
  principal = false,
  delay = 0,
}: {
  showcase: Showcase;
  project: Project;
  index: number;
  principal?: boolean;
  delay?: number;
}) {
  const href = `/projetos/${showcase.slug}`;
  const indexLabel = toIndexLabel(index);

  return (
    <Reveal delay={delay}>
      <Link
        href={href}
        aria-label={`${showcase.cta}: ${project.name}`}
        className={cn(
          "group grid grid-cols-1 overflow-hidden rounded-lg border transition-[transform,background-color,border-color] duration-300 ease-out hover:-translate-y-1 focus-visible:-translate-y-1 md:grid-cols-12 md:items-stretch md:min-h-[22rem] lg:min-h-[27rem]",
          principal
            ? "border-border bg-surface/[0.65] hover:border-foreground/25 hover:bg-surface/[0.92]"
            : "border-border/70 bg-surface/[0.45] hover:border-foreground/20 hover:bg-surface/[0.8]",
        )}
      >
        <div className="order-2 flex flex-col justify-center p-6 sm:p-8 md:order-1 md:col-span-6 lg:col-span-5 lg:p-11 xl:p-12">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="nums-tabular text-[0.68rem] font-medium uppercase tracking-[0.2em] text-foreground/40 transition-colors duration-300 ease-out group-hover:text-foreground/60 group-focus-visible:text-foreground/60">
              {indexLabel} / {showcase.category}
            </span>
            {principal ? (
              <span className="ml-auto shrink-0 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-accent">
                Case principal
              </span>
            ) : null}
          </div>

          <h3
            className={cn(
              "mt-4 leading-snug text-foreground",
              principal ? "text-heading-xl font-medium" : "text-heading-lg font-medium",
            )}
          >
            {project.name}
          </h3>

          <p className="mt-4 line-clamp-3 max-w-[46ch] text-sm leading-relaxed text-muted sm:text-base">
            {showcase.description}
          </p>

          <p className="mt-5 line-clamp-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted/70">
            {showcase.keywords.join(" · ")}
          </p>

          <span className="mt-7 inline-flex w-fit items-center gap-2 text-[0.95rem] font-medium text-foreground transition-colors duration-300 ease-out group-hover:text-accent group-focus-visible:text-accent">
            <span className="border-b border-border pb-0.5 transition-colors duration-300 ease-out group-hover:border-accent group-focus-visible:border-accent">
              {showcase.cta}
            </span>
            <ArrowUpRight
              aria-hidden
              className="size-4 text-muted transition-[transform,color] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-1 group-hover:text-accent-strong group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-1 group-focus-visible:text-accent-strong"
              strokeWidth={1.75}
            />
          </span>
        </div>

        <div className="relative order-1 overflow-hidden md:order-2 md:col-span-6 lg:col-span-7">
          <ScreenshotFrame
            screenshot={project.cover}
            tone="elevated"
            bare
            priority={principal}
            aspectClassName="aspect-[4/3] md:aspect-auto"
            className="h-full"
            sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw"
          />
          {/* Mobile: imagem no topo, fade na base pra dentro do conteúdo. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-tone-navy/80 to-transparent md:hidden"
          />
          {/* Tablet/desktop: imagem à direita, fade na borda interna
              (esquerda) pra dentro do conteúdo — mesma ideia, direção que
              muda com o eixo do card. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-tone-navy/70 to-transparent md:block"
          />
        </div>
      </Link>
    </Reveal>
  );
}

/**
 * Projetos selecionados — três módulos horizontais empilhados (uma "vitrine
 * de cases" editorial) em vez do grid de 3 colunas anterior. Cabeçalho
 * (título + índice "01—03" + filete) inalterado — já funcionava. O Sistema
 * de Gestão PlatoTruck continua primeiro e ganha destaque só por ordem,
 * rótulo "Case principal" e um heading um degrau maior — nunca por um card
 * de proporções diferentes dos outros dois.
 *
 * Sem `h-full`/grid-stretch entre os TRÊS cards (diferente da versão
 * anterior): cada linha tem sua própria altura natural, o que é esperado
 * numa lista editorial — não é mais uma grade onde os três precisam ocupar
 * exatamente a mesma caixa.
 */
export function SelectedProjects() {
  return (
    <section id="projetos" className="bg-tone-navy">
      <Container className="py-section">
        <Reveal>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-4 border-b border-border pb-6 sm:gap-x-6 sm:pb-8">
            <h2 className="text-balance-title min-w-0 text-heading-xl font-medium text-foreground">
              Projetos selecionados
            </h2>
            <span
              aria-hidden
              className="nums-tabular pb-0.5 text-caption font-medium uppercase tracking-[0.2em] text-muted"
            >
              01—03
            </span>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col gap-6 sm:mt-12 md:gap-7 lg:gap-8">
          {selectedProjects.map((showcase, index) => {
            const project = getProject(showcase.slug);
            if (!project) {
              return null;
            }

            return (
              <ProjectCard
                key={showcase.slug}
                showcase={showcase}
                project={project}
                index={index}
                principal={project.featured}
                delay={index * 80}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
