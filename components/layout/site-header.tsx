"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { BrandSignature } from "@/components/ui/brand-signature";
import { Container } from "@/components/ui/container";
import { nav } from "@/data/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300 ease-out",
        solid ? "border-line bg-paper/95 backdrop-blur-[3px]" : "border-transparent bg-paper",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="group shrink-0">
            <BrandSignature />
          </Link>

          <nav aria-label="Navegação principal" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative text-sm text-ink-muted transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-blue after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:text-ink hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/#contato"
            className="hidden shrink-0 rounded-md bg-blue px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-deep md:inline-flex"
          >
            Vamos conversar
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="-mr-2 inline-flex size-10 items-center justify-center rounded-md text-ink transition-colors duration-200 hover:bg-paper-deep md:hidden"
          >
            {open ? (
              <X aria-hidden className="size-5" strokeWidth={1.75} />
            ) : (
              <Menu aria-hidden className="size-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </Container>

      <div id="menu-mobile" hidden={!open} className="border-t border-line bg-paper md:hidden">
        <Container>
          <nav aria-label="Navegação principal (mobile)" className="py-3">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href} className="border-b border-line last:border-0">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3.5 text-[0.95rem] text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link
                  href="/#contato"
                  onClick={() => setOpen(false)}
                  className="inline-flex rounded-md bg-blue px-5 py-2.5 text-sm font-medium text-white"
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
