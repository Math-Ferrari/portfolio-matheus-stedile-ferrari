import { ScreenshotGroup } from "@/components/projects/screenshot";
import { CaseSection } from "@/components/projects/case/case-section";
import { Reveal } from "@/components/ui/reveal";
import type { CaseBlock } from "@/lib/types";
import { toIndexLabel } from "@/lib/utils";

/** Renderiza o conteúdo de um bloco, sem o cabeçalho da seção. */
function BlockBody({ block }: { block: CaseBlock }) {
  switch (block.kind) {
    case "prose":
      return (
        <div className="max-w-[65ch] space-y-5 text-ink-muted">
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      );

    case "list": {
      const numbered = block.variant === "numbered";
      const List = numbered ? "ol" : "ul";

      return (
        <List className="grid gap-x-12 sm:grid-cols-2">
          {block.items.map((item, index) => (
            <li key={item.title} className="border-t border-line py-4">
              {numbered ? (
                <span
                  aria-hidden
                  className="nums-tabular text-[0.72rem] font-medium tracking-[0.16em] text-ink-subtle"
                >
                  {toIndexLabel(index)}
                </span>
              ) : null}
              <p className="mt-1 text-[0.98rem] font-medium text-ink">{item.title}</p>
              {item.description ? (
                <p className="mt-1.5 max-w-[46ch] text-sm leading-relaxed text-ink-muted">
                  {item.description}
                </p>
              ) : null}
            </li>
          ))}
        </List>
      );
    }

    case "groups":
      return (
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {block.groups.map((group) => (
            <div key={group.label}>
              <p className="border-t-2 border-blue pt-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-blue">
                {group.label}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "beforeAfter":
      return (
        <div className="grid gap-8 md:grid-cols-2">
          {[block.before, block.after].map((column, index) => (
            <div
              key={column.label}
              className={
                index === 1
                  ? "rounded-md border border-line border-l-2 border-l-blue bg-surface p-6"
                  : "rounded-md border border-line bg-paper-deep p-6"
              }
            >
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-subtle">
                {column.label}
              </p>
              <ul className="mt-4 flex flex-col">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-line py-3 text-sm leading-relaxed text-ink first:border-0 first:pt-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "screenshots":
      return <ScreenshotGroup layout={block.layout} items={block.items} />;

    case "tech":
      return (
        <dl className="border-t border-line">
          {block.groups.map((group) => (
            <div
              key={group.label}
              className="grid gap-2 border-b border-line py-4 sm:grid-cols-[9rem_1fr] sm:gap-8"
            >
              <dt className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-blue">
                {group.label}
              </dt>
              <dd className="flex flex-wrap gap-x-6 gap-y-2 text-ink">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      );

    case "pending":
      return (
        <div className="max-w-[62ch] rounded-md border border-dashed border-line-strong bg-paper-deep p-6">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-ink-subtle">
            Seção em preparação
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{block.note}</p>
        </div>
      );
  }
}

type CaseBlocksProps = {
  blocks: CaseBlock[];
};

export function CaseBlocks({ blocks }: CaseBlocksProps) {
  return (
    <div className="flex flex-col gap-20">
      {blocks.map((block, index) => (
        <Reveal key={block.id}>
          <CaseSection
            id={block.id}
            index={toIndexLabel(index)}
            title={block.title}
            intro={"intro" in block ? block.intro : undefined}
          >
            <BlockBody block={block} />
          </CaseSection>
        </Reveal>
      ))}
    </div>
  );
}
