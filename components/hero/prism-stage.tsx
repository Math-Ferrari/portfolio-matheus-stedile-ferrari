"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type PrismStageProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Envolve o `<Prism />` com o tamanho/posição da composição do hero e uma
 * camada de interação de ponteiro MUITO sutil — nada disso toca no shader.
 *
 * `animationType="rotate"` (o modo escolhido para o hero) não lê o ponteiro:
 * o wobble é só do shader, via `iTime`. Esta é a camada que adiciona a
 * resposta ao cursor pedida nas rodadas anteriores — um tilt 3D pequeno via
 * CSS (`--prism-px`/`--prism-py`, lidas em `.prism-object` em globals.css),
 * com inércia e retorno suave. Em repouso os valores são 0, então o objeto
 * fica visualmente idêntico ao demo original do React Bits; a interação é
 * só um acréscimo.
 */
export function PrismStage({ children, className }: PrismStageProps) {
  const objectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const object = objectRef.current;
    if (!object || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const section = object.closest("section");
    if (!section) {
      return;
    }

    let rect = section.getBoundingClientRect();
    let rafId = 0;

    const refreshRect = () => {
      rect = section.getBoundingClientRect();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        object.style.setProperty("--prism-px", px.toFixed(4));
        object.style.setProperty("--prism-py", py.toFixed(4));
      });
    };

    const onPointerLeave = () => {
      object.style.setProperty("--prism-px", "0");
      object.style.setProperty("--prism-py", "0");
    };

    const resizeObserver = new ResizeObserver(refreshRect);
    resizeObserver.observe(section);

    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div className={cn("prism-wrap", className)}>
      <div ref={objectRef} className="prism-object">
        {children}
      </div>
    </div>
  );
}
