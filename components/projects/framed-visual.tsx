import { ScreenshotFrame } from "@/components/projects/screenshot";
import type { Tone } from "@/components/ui/tone";
import type { Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";

type FramedVisualProps = {
  screenshot: Screenshot;
  /** Tom da moldura interna — o "mat" ao redor (`bg-surface`) e o bloco
      deslocado atrás (`bg-surface-elevated`) são sempre os mesmos dois
      degraus; isto só escolhe o tom da própria tela, para as três camadas
      lerem como profundidade e não como uma cor repetida três vezes. */
  tone?: Tone;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Screenshot apoiada em dois blocos sólidos deslocados — um grande atrás, à
 * direita, e um quadrado de acento no canto superior esquerdo.
 *
 * A profundidade vem da geometria, não de sombra, glow ou gradiente. Os blocos
 * ficam dentro dos limites do elemento, então nada cria rolagem horizontal.
 */
export function FramedVisual({
  screenshot,
  tone = "base",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
}: FramedVisualProps) {
  return (
    <div className={cn("group relative", className)}>
      <div aria-hidden className="absolute left-0 top-0 size-20 bg-accent md:size-28" />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 h-2/3 w-2/3 rounded-sm bg-surface-elevated"
      />

      <figure className="relative m-5 rounded-md border border-border bg-surface p-2 md:m-7">
        <ScreenshotFrame screenshot={screenshot} tone={tone} priority={priority} sizes={sizes} />
        {screenshot.caption ? (
          <figcaption className="px-1 pb-1 pt-3 text-xs text-muted">
            {screenshot.caption}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}
