import { cn } from "@/lib/utils";

/**
 * Indicador do idioma atual. A versão anterior oferecia PT/EN como dois
 * botões, mas apenas alterava o estado visual: nenhum conteúdo era traduzido.
 * Até existir uma rota inglesa real, mostrar somente o idioma disponível é
 * mais honesto e reduz a carga do header estreito.
 */
export function LanguageToggle({ className }: { className?: string }) {
  return (
    <span
      aria-label="Idioma atual: Português"
      className={cn(
        "inline-flex min-h-11 items-center px-1 text-[0.7rem] font-semibold tracking-[0.04em] text-foreground",
        className,
      )}
    >
      PT
    </span>
  );
}
