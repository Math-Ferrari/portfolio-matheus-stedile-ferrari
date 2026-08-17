import { ScreenshotFrame } from "@/components/projects/screenshot";
import type { Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";

type FramedVisualProps = {
  screenshot: Screenshot;
  /** `light` sobre bege, `dark` sobre navy. */
  tone?: "light" | "dark";
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
  tone = "light",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
}: FramedVisualProps) {
  const isDark = tone === "dark";

  return (
    <div className={cn("group relative", className)}>
      <div
        aria-hidden
        className={cn(
          "absolute left-0 top-0 size-20 md:size-28",
          isDark ? "bg-navy-soft" : "bg-blue",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "absolute bottom-0 right-0 h-2/3 w-2/3 rounded-sm",
          isDark ? "bg-blue" : "bg-navy",
        )}
      />

      <figure
        className={cn(
          "relative m-5 rounded-md border p-2 md:m-7",
          isDark ? "border-line-navy bg-navy-deep" : "border-line bg-surface",
        )}
      >
        <ScreenshotFrame
          screenshot={screenshot}
          tone={tone}
          priority={priority}
          sizes={sizes}
        />
        {screenshot.caption ? (
          <figcaption
            className={cn(
              "px-1 pb-1 pt-3 text-xs",
              isDark ? "text-on-navy-muted" : "text-ink-subtle",
            )}
          >
            {screenshot.caption}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}
