import { cn } from "@/lib/utils";

type CaseSectionProps = {
  id: string;
  index: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
};

/** Seção numerada dentro de uma página de case. */
export function CaseSection({
  id,
  index,
  title,
  intro,
  children,
  className,
}: CaseSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 border-t border-line pt-7", className)}>
      <p
        aria-hidden
        className="nums-tabular text-[0.78rem] font-semibold tracking-[0.12em] text-blue"
      >
        {index}
      </p>
      <h2 className="mt-3 text-heading font-medium text-ink">{title}</h2>
      {intro ? <p className="mt-5 max-w-[62ch] text-ink-muted">{intro}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}
