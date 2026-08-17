type MarqueeProps = {
  items: readonly string[];
};

/**
 * Faixa de capacidades em loop lento e contínuo.
 *
 * Puro CSS (`@keyframes marquee` em globals.css) — sem JS, sem observer.
 * Pausa no hover/foco e para completamente sob `prefers-reduced-motion`
 * (ver a regra dedicada em globals.css: `animation-duration` sozinho não
 * bastaria para um loop infinito). Decorativo — o conteúdo já existe em texto
 * real em outras seções, então a faixa toda fica `aria-hidden`.
 */
export function Marquee({ items }: MarqueeProps) {
  const track = (
    <span className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-10">
          <span className="text-2xl font-medium -tracking-[0.02em] text-ink md:text-3xl">
            {item}
          </span>
          <span className="text-blue">✦</span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-line bg-paper-deep py-7 md:py-8"
    >
      <div className="marquee-track flex w-max">
        {track}
        {track}
      </div>
    </div>
  );
}
