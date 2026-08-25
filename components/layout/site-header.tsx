"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";

import { LanguageToggle } from "@/components/hero/language-toggle";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Container } from "@/components/ui/container";
import { nav, site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Altura do header — usada para recortar a faixa observada sobre a capa. */
const HEADER_HEIGHT = 56;

/**
 * Header único e global — o mesmo componente, os mesmos links, na mesma
 * posição, em toda rota e todo estado de rolagem. Nada aqui troca de marca,
 * de estrutura ou de cor "hardcoded": só a SUPERFÍCIE (fundo/blur/filete) e,
 * sobre a capa da home, a transparência dela mudam. O texto usa sempre
 * `text-foreground`/`text-muted` — os mesmos tokens do restante do site —
 * porque o fundo por trás do header, nos dois estados e nos dois temas, é
 * sempre uma variação do próprio `--background` (a capa usa o FloatingLines,
 * cujo "vazio" já é pintado com a cor do tema, não um degradê saturado que
 * precisasse de um branco fixo por cima para não desaparecer).
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [coverVisible, setCoverVisible] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  /** A capa só existe na home; este estado serve apenas ao reforço de contraste. */
  const hasCover = pathname === "/";

  /**
   * Já na home, `href="/"` não dispara navegação (mesma URL) — sem isto o
   * clique não faria nada. Fora dela, deixamos o `<Link>` navegar normal:
   * ele já entra no topo da página seguinte.
   */
  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") {
      return;
    }
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Observa a capa para aplicar um reforço tipográfico sutil enquanto o vidro
   * mais transparente estiver sobre o Floating Lines. Quem escreve o estado é
   * sempre o callback do observer — o caso "não há capa" é resolvido por
   * `hasCover`, não por um reset dentro do efeito.
   *
   * A dependência em `pathname` existe porque a navegação do Next é client
   * side: sem ela, o observer continuaria apontando para o elemento da página
   * anterior depois de uma transição.
   */
  useEffect(() => {
    const cover = document.getElementById("hero");
    if (!cover) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setCoverVisible(entry?.isIntersecting ?? false),
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(cover);

    return () => observer.disconnect();
  }, [pathname]);

  const overHero = hasCover && coverVisible;
  // A superfície ganha um pouco mais de presença ao rolar ou com o menu
  // aberto, sem deixar de revelar o conteúdo que passa atrás dela.
  const hasSurface = scrolled || open;

  /** Sombra sutil na cor do próprio `--background`: mais difusa sobre a
      capa e menor após scroll, quando imagens claras ou escuras podem passar
      sob os links muted. Não é uma cor fixa e acompanha o tema. */
  const heroLegibility =
    overHero && !hasSurface
      ? "drop-shadow-[0_1px_8px_var(--background)]"
      : hasSurface
        ? "drop-shadow-[0_1px_4px_var(--background)]"
        : "";

  return (
    <header
      className={cn(
        "fixed inset-x-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-50 overflow-hidden rounded-2xl border backdrop-blur-[14px] backdrop-saturate-[1.2] transition-[background-color,border-color,backdrop-filter] duration-300 ease-out md:inset-x-[1.125rem] md:top-[calc(env(safe-area-inset-top)+0.875rem)]",
        hasSurface
          ? "border-border/70 bg-background/[0.5]"
          : "border-border/50 bg-background/[0.18]",
      )}
    >
      <div className="grid h-14 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-[clamp(0.75rem,1.2vw,1.25rem)] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6">
        <div className="min-w-0 justify-self-start">
          <Link
            href="/"
            onClick={handleHomeClick}
            aria-label={`${site.name}, ir para a página inicial`}
            aria-current={pathname === "/" ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap text-[clamp(0.72rem,0.64rem+0.28vw,0.9rem)] font-medium tracking-[-0.015em] text-foreground/80 transition-colors duration-200 hover:text-foreground focus-visible:text-foreground",
              heroLegibility,
            )}
          >
            {site.name}
          </Link>
        </div>

        {/* A coluna central tem largura própria entre duas colunas flexíveis
            iguais. Assim a navegação permanece no centro geométrico da
            viewport, independentemente da largura do nome e dos controles. */}
        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative text-sm text-muted transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:text-foreground hover:after:scale-x-100 focus-visible:text-foreground",
                    heroLegibility,
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Só os controles compactos ocupam o extremo direito. O CTA continua
            disponível no menu responsivo, sem competir com "Contato" nem
            deslocar visualmente a navegação central. */}
        <div className="flex shrink-0 items-center justify-self-end gap-1">
          <div className={cn("flex items-center gap-1", heroLegibility)}>
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className={cn(
              "inline-flex size-11 items-center justify-center text-foreground transition-colors duration-200 hover:text-foreground/70 focus-visible:text-foreground lg:hidden",
              heroLegibility,
            )}
          >
            {open ? (
              <X aria-hidden className="size-5" strokeWidth={1.75} />
            ) : (
              <Menu aria-hidden className="size-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-border/60 bg-transparent lg:hidden"
      >
        <Container>
          <nav aria-label="Navegação principal (mobile)" className="py-3">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href} className="border-b border-border last:border-0">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3.5 text-[0.95rem] text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link
                  href="/#contato"
                  onClick={() => setOpen(false)}
                  className="inline-flex rounded-lg border border-border/70 bg-foreground/[0.05] px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-foreground/[0.09]"
                >
                  Vamos conversar
                </Link>
              </li>
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}
