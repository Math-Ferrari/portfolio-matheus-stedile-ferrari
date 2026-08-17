import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { type Tone, tones } from "@/components/ui/tone";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  index: string;
  label: string;
  title?: string;
  lead?: string;
  children: React.ReactNode;
  tone?: Tone;
  /** Conteúdo ocupa as 12 colunas em vez de alinhar com a coluna do título. */
  wide?: boolean;
  className?: string;
};

/** Seção da home: cabeçalho padronizado + conteúdo alinhado ao mesmo grid. */
export function Section({
  id,
  index,
  label,
  title,
  lead,
  children,
  tone = "paper",
  wide = false,
  className,
}: SectionProps) {
  const style = tones[tone];

  return (
    <section id={id} className={cn("border-t", style.border, style.section, className)}>
      <Container className="py-section">
        <SectionHeader index={index} label={label} title={title} lead={lead} tone={tone} />

        <div className="mt-14 grid lg:mt-16 lg:grid-cols-12">
          <Reveal
            delay={80}
            className={wide ? "lg:col-span-12" : "lg:col-span-9 lg:col-start-4"}
          >
            {children}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
