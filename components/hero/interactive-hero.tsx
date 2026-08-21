import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AboutIntro } from "@/components/hero/about-intro";
import { ThemedFloatingLines } from "@/components/hero/themed-floating-lines";
import { site } from "@/data/site";

type InteractiveHeroProps = {
  /** Ver `ThemedFloatingLines`/`FloatingLines` — só repassado adiante. */
  progressRef?: React.RefObject<number>;
  linesFadeRef?: React.RefObject<number>;
  linesExitRef?: React.RefObject<number>;
  baseColorMorphRef?: React.RefObject<number>;
};

/**
 * Capa do portfólio: nome como protagonista, duas linhas curtas de contexto e
 * um único CTA — o FloatingLines carrega a identidade verde musgo/floresta,
 * como um elemento gráfico que enquadra o nome em vez de um gradiente
 * ocupando a viewport inteira.
 *
 * "Portfólio — 2026" e o seletor PT/EN não vivem mais aqui: agora fazem parte
 * da própria linha do `SiteHeader` (no lugar da marca, só no modo capa), não
 * de uma faixa solta por cima da hero — ver `site-header.tsx`.
 *
 * `site.positioning`/`site.summary` (data/site.ts) são reaproveitados aqui em
 * vez de copy nova: já existem exatamente para "quem sou e o que faço em uma
 * frase curta" e já são usados em outros pontos do site — reescrever um texto
 * diferente aqui criaria duas versões da mesma informação.
 *
 * A Aurora não está mais em uso — substituída pelo FloatingLines. Continua em
 * `components/hero/aurora.tsx`/`themed-aurora.tsx`. O Prism, por sua vez, já
 * não estava em uso antes disso — `components/hero/prism.tsx`/`prism-stage.tsx`.
 *
 * Este componente é sempre renderizado dentro de `<HeroTransition>`
 * (`hero-transition.tsx`), que é quem dá o tamanho/posição da seção (sticky,
 * 100svh, a margem negativa sob o header) — aqui só preenche esse espaço.
 * `AboutIntro` (o conteúdo real de "Software para operações reais.", ver
 * `about-intro.tsx`) mora AQUI DENTRO, não numa seção separada mais abaixo —
 * os dois blocos ocupam a mesma célula, mas a coreografia não é um crossfade
 * de duas interfaces: suporte, nome, headline, retrato e detalhes recebem
 * fases próprias e ordenadas. As custom properties são escritas no mesmo
 * frame do Lenis e consumidas sem re-render React.
 */
export function InteractiveHero({ progressRef, linesFadeRef, linesExitRef, baseColorMorphRef }: InteractiveHeroProps) {
  const [firstName, ...restName] = site.name.split(" ");

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative flex h-full w-full flex-col items-center justify-center">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <ThemedFloatingLines
          progressRef={progressRef}
          linesFadeRef={linesFadeRef}
          linesExitRef={linesExitRef}
          baseColorMorphRef={baseColorMorphRef}
        />
      </div>

      {/* A célula compartilhada preserva continuidade espacial. Em movimento
          reduzido, ela volta a ser uma coluna normal via globals.css. */}
      <div className="hero-stage grid w-full place-items-center px-6 text-center">
        <div
          className="hero-primary-layer col-start-1 row-start-1 flex flex-col items-center"
          style={{
            opacity: "var(--tp-hero-opacity, 1)",
            transform:
              "translate3d(0, calc(-8vh * var(--tp-hero-recede, 0)), 0) scale(calc(1 - 0.14 * var(--tp-hero-recede, 0)))",
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
        >
          <h1 id="hero-title" className="text-hero font-bold text-foreground">
            {/* O espaço entre os spans é intencional: sem ele o nome acessível
                vira "MatheusStedile Ferrari". Entre caixas de bloco ele não
                renderiza nada. */}
            <span className="hero-rise hero-d2 block">{firstName}</span>{" "}
            <span className="hero-rise hero-d3 block">
              {restName.join(" ")}
            </span>
          </h1>

          {/* A entrada inicial vive no filho; a saída por scroll vive neste
              pai. Assim as transforms compõem sem disputar a cascata. */}
          <div
            style={{
              transform:
                "translate3d(0, calc(-16px * (1 - var(--tp-supporting, 1))), 0)",
              opacity: "var(--tp-supporting, 1)",
              willChange: "transform, opacity",
            }}
          >
            <div className="hero-rise hero-d4 mt-6 flex flex-col gap-1.5">
            {/* Texto em `--foreground`, igual ao resto da hero — o gradiente
                de marca anterior virou texto de leitura comum. O único
                detalhe de cor é o separador entre cargo e atuação, em
                `--accent`: uma marca discreta em vez de pintar a linha
                inteira (ver seção 8 do pedido de recoloração). */}
            <p className="text-[1.05rem] font-medium text-foreground md:text-[1.15rem]">
              {site.role} <span className="text-accent">·</span> {site.practice}
            </p>
            <p className="text-[0.95rem] text-foreground/70 md:text-base">{site.summary}</p>
            </div>
          </div>

          {/* O CTA acompanha a saída do texto de suporte. */}
          <div
            className="hero-transition-cta"
            style={{
              transform:
                "translate3d(0, calc(-12px * (1 - var(--tp-supporting, 1))), 0)",
              opacity: "var(--tp-supporting, 1)",
              willChange: "transform, opacity",
            }}
          >
          <Link
            href="/#projetos"
            className="hero-rise hero-d5 group mt-9 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-foreground transition-colors duration-200 hover:text-muted"
          >
            Ver projetos
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
          </div>
        </div>

        <div className="hero-profile-layer pointer-events-none col-start-1 row-start-1">
          <AboutIntro />
        </div>
      </div>
    </section>
  );
}
