import Image from "next/image";
import { User } from "lucide-react";

import { cn } from "@/lib/utils";

type PhotoFrameProps = {
  src?: string;
  alt: string;
  className?: string;
};

/** Espaço reservado para a foto profissional. */
export function PhotoFrame({ src, alt, className }: PhotoFrameProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-md border border-line bg-surface-soft",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 20rem, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <User aria-hidden className="size-5 text-ink-subtle" strokeWidth={1.5} />
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-ink-subtle">
            Foto profissional
          </p>
          <p className="text-sm text-ink-muted">Placeholder de desenvolvimento</p>
        </div>
      )}
    </div>
  );
}
