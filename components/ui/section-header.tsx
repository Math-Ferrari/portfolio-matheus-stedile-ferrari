import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { type Tone, tones } from "@/components/ui/tone";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  index: string;
  label: string;
  title?: string;
  lead?: string;
  tone?: Tone;
  /** Nível do cabeçalho. `h1` só nas páginas em que a seção abre a página. */
  as?: "h1" | "h2";
  className?: string;
};

/**
 * Cabeçalho padrão: rótulo numerado, título e texto de apoio.
 * Em telas grandes o texto de apoio ocupa uma coluna própria, à direita.
 */
export function SectionHeader({
  index,
  label,
  title,
  lead,
  tone = "paper",
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  const style = tones[tone];

  return (
    <Reveal className={cn("grid gap-x-10 gap-y-7 lg:grid-cols-12", className)}>
      <div className="lg:col-span-3 xl:col-span-2">
        <Eyebrow index={index} tone={tone}>
          {label}
        </Eyebrow>
      </div>

      {title ? (
        <div className="lg:col-span-9 xl:col-span-6">
          <Heading
            className={cn(
              "text-balance-title max-w-[18ch] text-title font-medium",
              style.title,
            )}
          >
            {title}
          </Heading>
        </div>
      ) : null}

      {lead ? (
        <div className="lg:col-span-9 lg:col-start-4 xl:col-span-4 xl:col-start-auto xl:pt-2">
          <p className={cn("max-w-[46ch] text-lead", style.lead)}>{lead}</p>
        </div>
      ) : null}
    </Reveal>
  );
}
