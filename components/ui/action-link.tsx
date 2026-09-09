import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Link } from "@/components/i18n/locale-link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "quiet" | "accentOutline" | "primaryDark" | "secondaryDark";

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
  primary: `${solid} bg-accent-strong text-white hover:opacity-90`,
  secondary: `${solid} border border-border text-foreground hover:border-foreground/40 hover:bg-surface`,
  quiet:
    "text-foreground underline decoration-border decoration-1 underline-offset-[6px] hover:text-accent hover:decoration-accent",
  /**
   * Meio-termo entre `quiet` (link sublinhado) e `primary` (botão sólido) —
   * um botão contornado na cor de marca. Existe para dar a UM card de
   * destaque (ex.: o projeto principal em "Projetos selecionados") um CTA
   * "um pouco mais evidente" sem crescer o card nem repetir o botão sólido
   * do `primary`, que é reservado à ação mais importante da página.
   */
  accentOutline: `${solid} border border-accent/40 text-accent hover:border-accent hover:bg-accent/10`,
  primaryDark: `${solid} bg-accent-strong text-white hover:opacity-90`,
  secondaryDark: `${solid} border border-border text-foreground hover:border-foreground/40 hover:bg-surface`,
};

/**
 * Link de ação com seta que desloca no hover. `external` abre em nova aba.
 *
 * Na variante `quiet` (a linguagem padrão de "Ver case →"/"Ver projeto →"
 * pelo site), a seta ganha uma cor própria — o verde mais profundo da
 * identidade, dissociada do texto (que segue para o verde médio) — em vez
 * de herdar `currentColor`. Um detalhe raro, só no hover, só na seta, nunca
 * no texto ou no fundo.
 *
 * `bg-accent` (o verde médio, calibrado para LEITURA sobre o fundo do tema)
 * não garante contraste suficiente para texto branco em cima em ambos os
 * temas — só `bg-accent-strong` (o verde mais fundo) sustenta isso nos dois.
 * Ver auditoria de contraste no relatório de recoloração.
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
          variant === "quiet" ? "text-muted group-hover:text-accent-strong" : undefined,
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
