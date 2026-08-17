"use client";

import { ReactLenis } from "lenis/react";

/**
 * Smooth scroll do site inteiro.
 *
 * `root` monta a instância sem wrapper/div extra — preserva `position: sticky`
 * (header, sumário do case) e o `IntersectionObserver` do `Reveal` sem
 * qualquer ajuste. `anchors: true` deixa a própria Lenis tratar os links de
 * âncora (`#projetos`, `/#contato`): ela só intercepta cliques cujo destino
 * seja a MESMA página (por `pathname`), então navegação entre páginas segue
 * normalmente pelo Next `<Link>`. Não passamos `offset` — a lib já lê o
 * `scroll-margin-top` definido em `globals.css`, então o recuo do header fica
 * igual ao do scroll nativo.
 *
 * `syncTouch` não é habilitado, então o toque no mobile usa o scroll nativo do
 * sistema — só o wheel/trackpad do desktop é suavizado. `respectReducedMotion`
 * (padrão da biblioteca) desliga a suavização sozinho sob
 * `prefers-reduced-motion: reduce`, sem lógica extra aqui.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ anchors: true }}>
      {children}
    </ReactLenis>
  );
}
