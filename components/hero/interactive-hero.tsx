import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ThemedFloatingLines } from "@/components/hero/themed-floating-lines";
import { site } from "@/data/site";

/**
 * Capa do portfólio: nome como protagonista, duas linhas curtas de contexto e
 * um único CTA — o FloatingLines carrega a paleta (azul claro/azul/vermelho,
 * referência à linha M), como um elemento gráfico que enquadra o nome em vez
 * de um gradiente ocupando a viewport inteira.
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
 */
export function InteractiveHero() {
  const [firstName, ...restName] = site.name.split(" ");

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      /* A margem negativa puxa a capa para debaixo do header sticky, que passa
         a flutuar sobre o escuro em vez de empurrar a capa para baixo. O valor
         é a caixa inteira do header: 4rem de altura + 1px do filete inferior.
         Sem isso a dobra somaria 100svh + 65px. */
      className="hero-cover relative isolate -mt-[calc(4rem+1px)] flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-background"
    >
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <ThemedFloatingLines />
      </div>

      <div className="hero-scroll-fade flex flex-col items-center px-6 text-center">
        <h1
          id="hero-title"
          /* O drop-shadow na cor do próprio `--background` garante legibilidade
             onde alguma linha passa atrás das letras nos dois temas — sem ele,
             uma linha bem posicionada por trás de uma letra reduziria o
             contraste. */
          className="text-hero font-bold text-foreground drop-shadow-[0_4px_28px_var(--background)]"
        >
          {/* O espaço entre os spans é intencional: sem ele o nome acessível
              vira "MatheusStedile Ferrari". Entre caixas de bloco ele não
              renderiza nada. */}
          <span className="hero-fade-blur hero-d2 block">{firstName}</span>{" "}
          <span className="hero-fade-blur hero-d3 block">{restName.join(" ")}</span>
        </h1>

        <div className="hero-fade-blur hero-d4 mt-6 flex flex-col gap-1.5 drop-shadow-[0_2px_16px_var(--background)]">
          {/* Único texto do hero com a paleta da identidade — degradê discreto
              via `bg-clip-text`, sem glow/sombra colorida. Nenhum outro texto
              da hero recebe esse tratamento. As cores do degradê acompanham
              o par claro/azul/vermelho recalibrado por tema via variáveis
              CSS — mesma identidade, intensidade ajustada por fundo. */}
          <p className="bg-gradient-to-r from-accent-blue-light via-accent-blue to-accent-red bg-clip-text text-[1.05rem] font-medium text-transparent md:text-[1.15rem]">
            {site.positioning}
          </p>
          <p className="text-[0.95rem] text-foreground/70 md:text-base">{site.summary}</p>
        </div>

        {/* Só "Ver projetos" — "Vamos conversar" já vive no header, repeti-lo
            aqui era redundante. */}
        <Link
          href="/#projetos"
          className="hero-fade-blur hero-d5 group mt-9 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-foreground transition-colors duration-200 hover:text-muted"
        >
          Ver projetos
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
            strokeWidth={2}
          />
        </Link>
      </div>
    </section>
  );
}
