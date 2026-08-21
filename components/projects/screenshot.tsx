import Image from "next/image";
import { ImageIcon } from "lucide-react";

import type { Tone } from "@/components/ui/tone";
import type { Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";

const frameAspect = {
  desktop: "aspect-[16/10]",
  mobile: "aspect-[9/17]",
} as const;

/**
 * A moldura usa os mesmos seis tons de `components/ui/tone.ts` — quem chama
 * escolhe a cena (ex.: alternar `elevated`/`slate` entre screenshots
 * consecutivas de um case, para dar ritmo sem depender de fundo de seção).
 * Texto/ícone do placeholder são sempre `text-muted`: os seis fundos ficam
 * próximos o bastante em luminosidade para não precisarem de um par próprio.
 */
const frameByTone: Record<Tone, string> = {
  base: "border-border bg-background",
  graphite: "border-border bg-tone-graphite",
  navy: "border-border bg-tone-navy",
  slate: "border-border bg-tone-slate",
  petrol: "border-border bg-tone-petrol",
  elevated: "border-border bg-surface-elevated",
};

type FrameProps = {
  screenshot: Screenshot;
  priority?: boolean;
  sizes?: string;
  tone?: Tone;
  /** Sem borda e sem cantos próprios — para preencher a área de um card. */
  bare?: boolean;
  className?: string;
  /**
   * Força proporção fixa (`object-cover`) mesmo quando a screenshot tem
   * `width`/`height` reais — para grids onde todos os cards precisam da
   * MESMA altura de imagem (ex.: "Projetos selecionados"), independente da
   * proporção nativa de cada captura. Sem isto (o padrão), uma screenshot
   * com dimensão conhecida usa sua PRÓPRIA proporção — o certo para cases,
   * onde a imagem é o conteúdo principal e não pode cortar nada.
   */
  aspectClassName?: string;
};

/**
 * Área reservada para uma screenshot. Sem `src`, mostra um placeholder
 * explicitamente identificado como pendente — nunca uma interface fictícia.
 *
 * Com `width`/`height` reais (screenshots verdadeiras, não placeholder), a
 * imagem usa sua PRÓPRIA proporção — `next/image` com dimensão intrínseca e
 * `h-auto w-full`, nunca `fill`/`object-cover` — para nunca cortar conteúdo
 * da interface só para caber numa caixa 16:10 arbitrária. Sem `width`/
 * `height` (placeholder, ou screenshot ainda sem dimensão conhecida), cai no
 * comportamento original: caixa de proporção fixa por `frame`.
 */
export function ScreenshotFrame({
  screenshot,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  tone = "elevated",
  bare = false,
  className,
  aspectClassName,
}: FrameProps) {
  const frame = screenshot.frame ?? "desktop";
  const hasNaturalSize =
    Boolean(screenshot.src && screenshot.width && screenshot.height) && !aspectClassName;

  if (hasNaturalSize) {
    return (
      <div
        className={cn(
          "overflow-hidden",
          bare ? "rounded-none" : "rounded-md border",
          frameByTone[tone],
          className,
        )}
      >
        <Image
          src={screenshot.src!}
          alt={screenshot.alt}
          width={screenshot.width}
          height={screenshot.height}
          sizes={sizes}
          priority={priority}
          className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.01]"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        bare ? "rounded-none" : "rounded-md border",
        frameByTone[tone],
        aspectClassName ?? frameAspect[frame],
        className,
      )}
    >
      {screenshot.src ? (
        <Image
          src={screenshot.src}
          alt={screenshot.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <ImageIcon aria-hidden className="size-5 text-muted" strokeWidth={1.5} />
          <p className="text-caption font-medium uppercase tracking-[0.2em] text-muted">
            Placeholder de desenvolvimento
          </p>
          <p className="max-w-[36ch] text-sm text-muted">{screenshot.alt}</p>
        </div>
      )}
    </div>
  );
}

type FigureProps = FrameProps;

/** Screenshot com legenda curta explicando o que aquela tela resolve. */
export function ScreenshotFigure({
  screenshot,
  priority,
  sizes,
  tone = "elevated",
  className,
}: FigureProps) {
  return (
    <figure className={cn("group flex flex-col", className)}>
      <ScreenshotFrame
        screenshot={screenshot}
        priority={priority}
        sizes={sizes}
        tone={tone}
      />
      {screenshot.caption ? (
        <figcaption className="mt-4 border-t border-border pt-3 text-sm text-muted">
          {screenshot.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

type GroupProps = {
  layout: "single" | "pair" | "device";
  items: Screenshot[];
  tone?: Tone;
};

/** Composições de screenshots: uma grande, duas lado a lado, ou desktop + mobile. */
export function ScreenshotGroup({ layout, items, tone = "elevated" }: GroupProps) {
  if (layout === "device") {
    const desktop = items.find((item) => item.frame !== "mobile");
    const mobile = items.find((item) => item.frame === "mobile");

    return (
      <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-start">
        {desktop ? (
          <ScreenshotFigure
            screenshot={desktop}
            tone={tone}
            sizes="(min-width: 768px) 60vw, 100vw"
          />
        ) : null}
        {mobile ? (
          <ScreenshotFigure
            screenshot={mobile}
            tone={tone}
            sizes="(min-width: 768px) 30vw, 100vw"
            className="mx-auto w-full max-w-[17rem] md:mx-0"
          />
        ) : null}
      </div>
    );
  }

  if (layout === "pair") {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        {items.map((item) => (
          <ScreenshotFigure
            key={item.alt}
            screenshot={item}
            tone={tone}
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {items.map((item, index) => (
        <ScreenshotFigure
          key={item.alt}
          screenshot={item}
          tone={tone}
          priority={index === 0}
          sizes="(min-width: 1024px) 70vw, 100vw"
        />
      ))}
    </div>
  );
}
