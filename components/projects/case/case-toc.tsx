"use client";

import { useContent } from "@/components/i18n/use-content";
import type { CaseBlock } from "@/lib/types";
import { toIndexLabel } from "@/lib/utils";

type CaseTocProps = {
  blocks: CaseBlock[];
};

/** Sumário fixo do case. Oculto abaixo de lg, onde a leitura é linear. */
export function CaseToc({ blocks }: CaseTocProps) {
  const { ui } = useContent();

  return (
    <nav aria-label={ui.case.tocLabel} className="sticky top-24 hidden lg:block">
      <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.18em] text-muted">
        <span aria-hidden className="h-px w-6 bg-accent" />
        {ui.case.toc}
      </p>
      <ol className="mt-5 flex flex-col gap-2.5">
        {blocks.map((block, index) => (
          <li key={block.id}>
            <a
              href={`#${block.id}`}
              className="flex gap-3 text-sm leading-snug text-muted transition-colors duration-200 hover:text-accent"
            >
              <span aria-hidden className="nums-tabular pt-px text-xs text-muted">
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
