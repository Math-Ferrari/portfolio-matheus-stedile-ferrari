"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import type { Screenshot } from "@/lib/types";
import { cn } from "@/lib/utils";

type HeroVisualProps = {
  screenshot: Screenshot;
  /** Marca grande e translúcida no fundo do placeholder (ex.: iniciais). */
  mark?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Visual principal do hero: um painel grande, único, que carrega o peso
 * visual da primeira dobra. Sem `screenshot.src` mostra uma composição
 * autoral (grade fina + marca + selo) em vez de um placeholder de wireframe —
 * assim que a imagem real existir, ela substitui a composição automaticamente.
 *
 * A interação de mouse é toda local ao painel (não ao viewport inteiro) e
 * expressa por variáveis CSS (`--hv-x`/`--hv-y`) lidas pelo `globals.css`:
 * um brilho segue o cursor com leve atraso e os blocos de acento se deslocam
 * poucos pixels. Sem hover, um drift lentíssimo em CSS puro mantém o painel
 * vivo — nada disso depende de WebGL.
 */
export function HeroVisual({ screenshot, mark, priority, className }: HeroVisualProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rect = panel.getBoundingClientRect();
    let rafId = 0;

    const refreshRect = () => {
      rect = panel.getBoundingClientRect();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        panel.style.setProperty("--hv-x", String(Math.min(Math.max(x, 0), 1)));
        panel.style.setProperty("--hv-y", String(Math.min(Math.max(y, 0), 1)));
      });
    };

    const onPointerEnter = () => {
      refreshRect();
      panel.dataset.hover = "true";
    };

    const onPointerLeave = () => {
      panel.dataset.hover = "false";
    };

    const resizeObserver = new ResizeObserver(refreshRect);
    resizeObserver.observe(panel);

    panel.addEventListener("pointermove", onPointerMove);
    panel.addEventListener("pointerenter", onPointerEnter);
    panel.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      panel.removeEventListener("pointermove", onPointerMove);
      panel.removeEventListener("pointerenter", onPointerEnter);
      panel.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={panelRef} data-hover="false" className={cn("hero-visual group relative h-full", className)}>
      <div aria-hidden className="hero-visual-accent absolute left-0 top-0 size-16 bg-blue md:size-24" />
      <div
        aria-hidden
        className="hero-visual-accent hero-visual-accent-b absolute bottom-0 right-0 h-2/3 w-2/3 bg-navy"
      />

      <div className="hero-visual-frame absolute inset-5 overflow-hidden rounded-md border border-line-navy bg-navy-deep md:inset-7">
        {screenshot.src ? (
          <Image
            src={screenshot.src}
            alt={screenshot.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 68vw, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0">
            <div aria-hidden className="hero-visual-grid absolute inset-0" />
            <div aria-hidden className="hero-visual-glow absolute inset-0" />
            {mark ? (
              <span
                aria-hidden
                className="hero-visual-mark pointer-events-none absolute -bottom-[6%] -right-[2%] select-none font-serif text-[26vw] font-medium leading-none text-white/[0.06] md:text-[13rem]"
              >
                {mark}
              </span>
            ) : null}
            <span aria-hidden className="hero-visual-corner absolute left-4 top-4" />
            <span aria-hidden className="hero-visual-corner absolute bottom-4 right-4 rotate-180" />
            {screenshot.caption ? (
              <p className="absolute bottom-5 left-5 right-14 max-w-[30ch] text-[0.66rem] font-medium uppercase tracking-[0.2em] text-on-navy-muted">
                {screenshot.caption}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
