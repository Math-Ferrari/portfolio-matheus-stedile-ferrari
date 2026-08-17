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

const variants: Record<Variant, string> = {
  primary: `${solid} bg-blue text-white hover:bg-blue-deep`,
  secondary: `${solid} border border-line-strong text-ink hover:border-ink hover:bg-surface`,
  quiet:
    "text-ink underline decoration-line-strong decoration-1 underline-offset-[6px] hover:text-blue hover:decoration-blue",
  primaryDark: `${solid} bg-blue text-white hover:bg-white hover:text-navy`,
  secondaryDark: `${solid} border border-line-navy text-on-navy hover:border-on-navy-muted hover:bg-navy-soft`,
};

/** Link de ação com seta que desloca no hover. `external` abre em nova aba. */
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
        className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
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
