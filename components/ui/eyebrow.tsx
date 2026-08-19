import { type Tone, tones } from "@/components/ui/tone";
import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: React.ReactNode;
  /** Número da seção, ex.: "01". */
  index?: string;
  tone?: Tone;
  className?: string;
};

/** Rótulo pequeno em caixa alta, com um traço azul, no topo de cada seção. */
export function Eyebrow({ children, index, tone = "base", className }: EyebrowProps) {
  const style = tones[tone];

  return (
    <p
      className={cn(
        "flex items-center gap-3 text-caption font-medium uppercase tracking-[0.18em]",
        style.label,
        className,
      )}
    >
      {index ? (
        <span aria-hidden className={cn("nums-tabular font-semibold", style.index)}>
          {index}
        </span>
      ) : (
        <span aria-hidden className="h-px w-6 bg-accent-blue" />
      )}
      <span>{children}</span>
    </p>
  );
}
