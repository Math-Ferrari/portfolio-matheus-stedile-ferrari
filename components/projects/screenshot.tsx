import Image from "next/image";
import { ImageIcon } from "lucide-react";

import type { Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";

const frameAspect = {
  desktop: "aspect-[16/10]",
  mobile: "aspect-[9/17]",
} as const;

/** Sobre navy o placeholder precisa de outra borda e outro texto. */
const surfaceTone = {
  light: {
    frame: "border-line bg-surface-soft",
    icon: "text-ink-subtle",
    label: "text-ink-subtle",
    text: "text-ink-muted",
  },
  dark: {
    frame: "border-line-navy bg-navy-deep",
    icon: "text-on-navy-muted",
    label: "text-on-navy-muted",
    text: "text-on-navy-muted",
  },
} as const;

type FrameProps = {
  screenshot: Screenshot;
  priority?: boolean;
  sizes?: string;
  tone?: keyof typeof surfaceTone;
  /** Sem borda e sem cantos próprios — para preencher a área de um card. */
  bare?: boolean;
  className?: string;
};

/**
 * Área reservada para uma screenshot. Sem `src`, mostra um placeholder
 * explicitamente identificado como pendente — nunca uma interface fictícia.
 */
export function ScreenshotFrame({
  screenshot,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  tone = "light",
  bare = false,
  className,
}: FrameProps) {
  const frame = screenshot.frame ?? "desktop";
  const style = surfaceTone[tone];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        bare ? "rounded-none" : "rounded-md border",
        style.frame,
        frameAspect[frame],
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
          <ImageIcon aria-hidden className={cn("size-5", style.icon)} strokeWidth={1.5} />
          <p
            className={cn(
              "text-[0.68rem] font-medium uppercase tracking-[0.2em]",
              style.label,
            )}
          >
            Placeholder de desenvolvimento
          </p>
          <p className={cn("max-w-[36ch] text-sm", style.text)}>{screenshot.alt}</p>
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
  tone = "light",
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
        <figcaption
          className={cn(
            "mt-4 border-t pt-3 text-sm",
            tone === "dark"
              ? "border-line-navy text-on-navy-muted"
              : "border-line text-ink-muted",
          )}
        >
          {screenshot.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

type GroupProps = {
  layout: "single" | "pair" | "device";
  items: Screenshot[];
  tone?: keyof typeof surfaceTone;
};

/** Composições de screenshots: uma grande, duas lado a lado, ou desktop + mobile. */
export function ScreenshotGroup({ layout, items, tone = "light" }: GroupProps) {
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
