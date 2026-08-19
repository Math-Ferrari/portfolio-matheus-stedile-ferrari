import Link from "next/link";

import { FramedVisual } from "@/components/projects/framed-visual";
import { ScreenshotFrame } from "@/components/projects/screenshot";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getProject, selectedProjects } from "@/data/projects";
import { cn } from "@/lib/utils";

type Showcase = (typeof selectedProjects)[number];

/**
 * Bloco de texto compartilhado pelos três projetos — mesma ordem de leitura
 * (categoria → nome → descrição → palavras-chave → CTA) em todos, para a
 * seção ler como um sistema. O que muda entre eles é a ESCALA e a
 * composição ao redor, não a estrutura da informação.
 */
function ProjectCopy({
  showcase,
  name,
  size,
}: {
  showcase: Showcase;
  name: string;
  size: "lg" | "md" | "sm";
}) {
  const href = `/projetos/${showcase.slug}`;

  return (
    <div>
      <p className="text-caption font-medium uppercase tracking-[0.18em] text-accent-blue">
        {showcase.category}
      </p>

      <h3
        className={cn(
          "text-balance-title mt-4 font-medium text-foreground",
          size === "lg" && "text-heading-xl",
          size === "md" && "text-heading-lg",
          size === "sm" && "text-heading-md",
        )}
      >
        <Link href={href} className="transition-colors duration-200 hover:text-accent-blue">
          {name}
        </Link>
      </h3>

      <p
        className={cn(
          "mt-5 text-muted",
          size === "lg" ? "max-w-[46ch] text-body-lg" : "max-w-[44ch]",
        )}
      >
        {showcase.description}
      </p>

      {/* Palavras-chave: no projeto principal viram um grid tipográfico de
          duas colunas (oito itens leem melhor alinhados que numa linha
          corrida); nos outros dois, uma linha separada por "·". Nunca
          pills. */}
      {size === "lg" ? (
        <ul className="mt-8 grid max-w-[30rem] grid-cols-2 gap-x-8 gap-y-2.5 text-sm text-muted">
          {showcase.keywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 max-w-[44ch] text-sm text-muted">{showcase.keywords.join(" · ")}</p>
      )}

      <ActionLink href={href} variant="quiet" className={size === "lg" ? "mt-10" : "mt-7"}>
        {showcase.slug === "sistema-platotruck" ? "Ver case" : "Ver projeto"}
      </ActionLink>
    </div>
  );
}

/**
 * Projetos selecionados — três projetos, três pesos visuais explícitos. A
 * hierarquia é a mensagem: o primeiro ocupa a largura inteira com o preview
 * grande ao lado do texto; os outros dois dividem a linha seguinte em 7/12 e
 * 5/12, com previews proporcionais. Ninguém precisa ler para saber qual é o
 * projeto principal.
 *
 * Cada projeto é uma unidade por superfície + respiro + escala (não por
 * linha divisória nem por três cards iguais): a mesma `bg-surface` com borda
 * mínima, mas composição interna diferente em cada um.
 */
export function SelectedProjects() {
  const [featured, wide, narrow] = selectedProjects;
  const featuredProject = getProject(featured.slug);
  const wideProject = getProject(wide.slug);
  const narrowProject = getProject(narrow.slug);

  return (
    <section id="projetos" className="bg-tone-navy">
      <Container className="py-section">
        <Reveal>
          <h2 className="text-heading-xl font-medium text-foreground">Projetos selecionados</h2>
        </Reveal>

        {/* 1º — largura inteira, texto e preview lado a lado. */}
        {featuredProject ? (
          <Reveal
            delay={80}
            className="mt-14 grid items-center gap-10 rounded-lg border border-border bg-surface p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12"
          >
            <div className="lg:col-span-5">
              <ProjectCopy showcase={featured} name={featuredProject.name} size="lg" />
            </div>

            <Link
              href={`/projetos/${featured.slug}`}
              aria-label={`Ver case: ${featuredProject.name}`}
              className="lg:col-span-7"
            >
              <FramedVisual
                screenshot={featuredProject.cover}
                tone="elevated"
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
              />
            </Link>
          </Reveal>
        ) : null}

        {/* 2º e 3º — mesma linha, larguras deliberadamente desiguais.
            `items-start` (em vez do stretch padrão do grid) deixa cada um com
            a altura do próprio conteúdo: o terceiro fica visivelmente menor
            também na vertical, em vez de esticar e sobrar espaço morto. */}
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
          {wideProject ? (
            <Reveal className="rounded-lg border border-border bg-surface p-6 sm:p-10 lg:col-span-7">
              <Link
                href={`/projetos/${wide.slug}`}
                aria-label={`Ver projeto: ${wideProject.name}`}
                className="group block"
              >
                <ScreenshotFrame
                  screenshot={wideProject.cover}
                  tone="elevated"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </Link>

              <div className="mt-8">
                <ProjectCopy showcase={wide} name={wideProject.name} size="md" />
              </div>
            </Reveal>
          ) : null}

          {narrowProject ? (
            <Reveal
              delay={80}
              className="rounded-lg border border-border bg-surface p-6 sm:p-10 lg:col-span-5"
            >
              <Link
                href={`/projetos/${narrow.slug}`}
                aria-label={`Ver projeto: ${narrowProject.name}`}
                className="group block"
              >
                <ScreenshotFrame
                  screenshot={narrowProject.cover}
                  tone="elevated"
                  sizes="(min-width: 1024px) 28vw, 100vw"
                />
              </Link>

              <div className="mt-8">
                <ProjectCopy showcase={narrow} name={narrowProject.name} size="sm" />
              </div>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
