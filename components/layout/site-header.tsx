"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { LanguageToggle } from "@/components/hero/language-toggle";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Container } from "@/components/ui/container";
import { nav } from "@/data/site";
import { cn } from "@/lib/utils";

/** Altura do header — usada para recortar a faixa observada sobre a capa. */
const HEADER_HEIGHT = 64;

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

  /** A capa só existe na home; nas demais rotas o header já nasce com fundo. */
  const hasCover = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Só importa para decidir se o header começa transparente (sobre a capa) ou
   * já nasce com o fundo da página (rotas sem capa). Quem escreve o estado é
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
  // A superfície (fundo translúcido + blur + filete) entra ao rolar ou com o
  // menu aberto — parado no topo da capa o header fica transparente.
  const hasSurface = scrolled || open;

  /** Sombra sutil na cor do próprio `--background`, só enquanto flutua
      transparente sobre a capa: reforço de contraste caso alguma linha do
      FloatingLines passe atrás do texto naquele instante — não é uma cor
      fixa, acompanha o tema. */
  const heroLegibility = overHero && !hasSurface ? "drop-shadow-[0_1px_8px_var(--background)]" : "";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300 ease-out",
        hasSurface
          ? "border-border/60 bg-background/80 backdrop-blur-md"
          : overHero
            ? "border-transparent bg-transparent"
            : "border-transparent bg-background",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <span
            className={cn(
              "shrink-0 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-foreground/70",
              heroLegibility,
            )}
          >
            Portfólio — 2026
          </span>

          {/* `lg` e não `md`: com cinco itens + assinatura + CTA, a barra
              completa não cabe em larguras de tablet (~820px) — em `md` a
              navegação quebrava em várias linhas e o CTA saía da tela. */}
          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative text-sm text-muted transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent-blue after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:text-foreground hover:after:scale-x-100",
                      heroLegibility,
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA, PT/EN, tema e o botão do menu ficam juntos à direita — cada
              um com sua própria regra de visibilidade: CTA some no mobile
              (como já era); PT/EN e o tema ficam sempre visíveis, com o mesmo
              tamanho e alinhamento, para lerem como um único controle. */}
          <div className="flex shrink-0 items-center gap-5">
            <Link
              href="/#contato"
              className={cn(
                "hidden rounded-md bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-opacity duration-200 hover:opacity-90 lg:inline-flex",
                heroLegibility,
              )}
            >
              Vamos conversar
            </Link>

            <div className={cn("flex items-center gap-3", heroLegibility)}>
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
                "-mr-2 inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors duration-200 hover:bg-foreground/10 lg:hidden",
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
      </Container>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-border bg-background lg:hidden"
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
                  className="inline-flex rounded-md bg-accent-blue px-5 py-2.5 text-sm font-medium text-white"
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
