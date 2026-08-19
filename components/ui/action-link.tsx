import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "quiet" | "primaryDark" | "secondaryDark";

type ActionLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
};

const base =
  "group inline-flex items-center gap-2.5 text-[0.95rem] font-medium transition-[background-color,color,border-color] duration-200 ease-out";

const solid = "rounded-md px-6 py-3";

/**
 * As variantes `*Dark` existiam para telas sempre-escuras (contato, o case em
 * destaque) num site que era, fora delas, sempre bege. Com tema claro/escuro
 * cobrindo o site inteiro, essa distinção não faz mais sentido — os tokens
 * semânticos já respondem ao tema ativo sozinhos. Mantidas como aliases só
 * para não obrigar os poucos consumidores a trocar a prop.
 */
const variants: Record<Variant, string> = {
  primary: `${solid} bg-accent-blue text-white hover:opacity-90`,
  secondary: `${solid} border border-border text-foreground hover:border-foreground/40 hover:bg-surface`,
  quiet:
    "text-foreground underline decoration-border decoration-1 underline-offset-[6px] hover:text-accent-blue hover:decoration-accent-blue",
  primaryDark: `${solid} bg-accent-blue text-white hover:opacity-90`,
  secondaryDark: `${solid} border border-border text-foreground hover:border-foreground/40 hover:bg-surface`,
};

/**
 * Link de ação com seta que desloca no hover. `external` abre em nova aba.
 *
 * Na variante `quiet` (a linguagem padrão de "Ver case →"/"Ver projeto →"
 * pelo site), a seta ganha uma cor própria — vermelho no hover, dissociada
 * do texto (que segue para azul) — em vez de herdar `currentColor`. É o
 * único lugar onde o vermelho da identidade aparece de forma recorrente:
 * um detalhe raro, só no hover, só na seta, nunca no texto ou no fundo.
 */
export function ActionLink({
  href,
  children,
  variant = "primary",
  external = false,
  className,
}: ActionLinkProps) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      <span>{children}</span>
      <Icon
        aria-hidden
        className={cn(
          "size-4 transition-[transform,color] duration-200 ease-out group-hover:translate-x-1",
          variant === "quiet" ? "text-muted group-hover:text-accent-red" : undefined,
        )}
        strokeWidth={1.75}
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(base, variants[variant], className)}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {content}
    </Link>
  );
}
