"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  /** Atraso em ms para escalonar grupos vizinhos. Use pouco: 80–160ms. */
  delay?: number;
  /** `up` sobe o bloco; `right` desliza a partir da direita. */
  from?: "up" | "right";
  className?: string;
};

/**
 * Revela um grupo quando ele entra no viewport.
 *
 * IntersectionObserver + transição CSS, sem biblioteca de animação e sem estado
 * em React — o observer apenas alterna um atributo no elemento, o que evita
 * renderizações em cascata. Envolve seções e grades inteiras, nunca textos
 * individuais. Com `prefers-reduced-motion: reduce` o conteúdo já aparece
 * visível (a transição também é anulada no CSS).
 */
export function Reveal({ children, delay = 0, from = "up", className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const reveal = () => element.setAttribute("data-visible", "true");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible="false"
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", from === "right" && "reveal-x", className)}
    >
      {children}
    </div>
  );
}
