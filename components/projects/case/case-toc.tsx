import type { CaseBlock } from "@/lib/types";
import { toIndexLabel } from "@/lib/utils";

type CaseTocProps = {
  blocks: CaseBlock[];
};

/** Sumário fixo do case. Oculto abaixo de lg, onde a leitura é linear. */
export function CaseToc({ blocks }: CaseTocProps) {
  return (
    <nav aria-label="Sumário do case" className="sticky top-24 hidden lg:block">
      <p className="flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-subtle">
        <span aria-hidden className="h-px w-6 bg-blue" />
        Sumário
      </p>
      <ol className="mt-5 flex flex-col gap-2.5">
        {blocks.map((block, index) => (
          <li key={block.id}>
            <a
              href={`#${block.id}`}
              className="flex gap-3 text-sm leading-snug text-ink-muted transition-colors duration-200 hover:text-blue"
            >
              <span aria-hidden className="nums-tabular pt-px text-xs text-ink-subtle">
                {toIndexLabel(index)}
              </span>
              {block.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
