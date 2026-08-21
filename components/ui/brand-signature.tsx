import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type BrandSignatureProps = {
  /** Ajuste de tamanho pelo `font-size` — as iniciais e o filete acompanham. */
  className?: string;
};

/**
 * Assinatura tipográfica: iniciais em serifa verde, filete e nome completo.
 *
 * As iniciais são decorativas (`aria-hidden`) — leitores de tela leem só o nome
 * completo, sem repetir "MSF Matheus Stedile Ferrari". Header e rodapé usam
 * este mesmo componente para a assinatura não divergir entre eles.
 */
export function BrandSignature({ className }: BrandSignatureProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-3 text-[0.95rem] font-medium -tracking-[0.01em] text-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className="font-serif text-[1.15em] font-semibold tracking-[0.04em] text-accent transition-colors duration-200 group-hover:text-accent-soft"
      >
        {site.initials}
      </span>
      <span aria-hidden className="h-[1.15em] w-px shrink-0 bg-border" />
      {site.name}
    </span>
  );
}
