import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type BrandSignatureProps = {
  /** `light` sobre bege, `dark` sobre navy. */
  tone?: "light" | "dark";
  /** Ajuste de tamanho pelo `font-size` — as iniciais e o filete acompanham. */
  className?: string;
};

/**
 * Assinatura tipográfica: iniciais em serifa azul, filete e nome completo.
 *
 * As iniciais são decorativas (`aria-hidden`) — leitores de tela leem só o nome
 * completo, sem repetir "MSF Matheus Stedile Ferrari". Header e rodapé usam
 * este mesmo componente para a assinatura não divergir entre eles.
 */
export function BrandSignature({ tone = "light", className }: BrandSignatureProps) {
  const isDark = tone === "dark";

  return (
    <span
      className={cn(
        "flex items-center gap-3 text-[0.95rem] font-medium -tracking-[0.01em]",
        isDark ? "text-on-navy" : "text-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "font-serif text-[1.15em] font-semibold tracking-[0.04em] transition-colors duration-200",
          isDark ? "text-blue-light" : "text-blue group-hover:text-blue-deep",
        )}
      >
        {site.initials}
      </span>
      <span
        aria-hidden
        className={cn("h-[1.15em] w-px shrink-0", isDark ? "bg-line-navy" : "bg-line-strong")}
      />
      {site.name}
    </span>
  );
}
