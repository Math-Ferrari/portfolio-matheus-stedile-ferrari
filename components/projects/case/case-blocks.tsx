import { ScreenshotGroup } from "@/components/projects/screenshot";
import { CaseSection } from "@/components/projects/case/case-section";
import type { Tone } from "@/components/ui/tone";
import { Reveal } from "@/components/ui/reveal";
import type { CaseBlock } from "@/lib/types";
import { toIndexLabel } from "@/lib/utils";

/** Molduras de screenshot alternam entre estes dois tons — cada bloco de
    telas do case lê como uma cena própria, não a mesma superfície repetida
    (ver §21/§16 do redesign: ritmo também nos frames, já que o grid
    sumário+conteúdo não permite alternar o fundo da seção inteira). */
const SCREENSHOT_TONES: Tone[] = ["elevated", "slate"];

/** Renderiza o conteúdo de um bloco, sem o cabeçalho da seção. */
function BlockBody({ block, screenshotTone }: { block: CaseBlock; screenshotTone: Tone }) {
  switch (block.kind) {
    case "prose":
      return (
        <div className="max-w-[65ch] space-y-5 text-muted">
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
            <li key={item.title} className="border-t border-border py-4">
              {numbered ? (
                <span
                  aria-hidden
                  className="nums-tabular text-caption font-medium tracking-[0.16em] text-muted"
                >
                  {toIndexLabel(index)}
                </span>
              ) : null}
              <p className="mt-1 text-body font-medium text-foreground">{item.title}</p>
              {item.description ? (
                <p className="mt-1.5 max-w-[46ch] text-sm leading-relaxed text-muted">
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
              <p className="border-t-2 border-accent pt-3 text-caption font-medium uppercase tracking-[0.16em] text-accent">
                {group.label}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-foreground">
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
                  ? "rounded-md border border-border border-l-2 border-l-accent bg-surface p-6"
                  : "rounded-md border border-border bg-surface-secondary p-6"
              }
            >
              <p className="text-caption font-medium uppercase tracking-[0.16em] text-muted">
                {column.label}
              </p>
              <ul className="mt-4 flex flex-col">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="border-t border-border py-3 text-sm leading-relaxed text-foreground first:border-0 first:pt-0"
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
      return <ScreenshotGroup layout={block.layout} items={block.items} tone={screenshotTone} />;

    case "tech":
      return (
        <dl className="border-t border-border">
          {block.groups.map((group) => (
            <div
              key={group.label}
              className="grid gap-2 border-b border-border py-4 sm:grid-cols-[9rem_1fr] sm:gap-8"
            >
              <dt className="text-caption font-medium uppercase tracking-[0.16em] text-accent">
                {group.label}
              </dt>
              <dd className="flex flex-wrap gap-x-6 gap-y-2 text-foreground">
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
        <div className="max-w-[62ch] rounded-md border border-dashed border-border bg-surface-elevated p-6">
          <p className="text-caption font-medium uppercase tracking-[0.2em] text-muted">
            Seção em preparação
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{block.note}</p>
        </div>
      );
  }
}

type CaseBlocksProps = {
  blocks: CaseBlock[];
};

export function CaseBlocks({ blocks }: CaseBlocksProps) {
  /* Índice só entre os blocos "screenshots" (não a posição no array inteiro),
     derivado funcionalmente — nenhuma variável mutada durante o render. */
  const screenshotToneByBlockIndex = blocks.reduce<{ count: number; indices: number[] }>(
    (acc, block) =>
      block.kind === "screenshots"
        ? { count: acc.count + 1, indices: [...acc.indices, acc.count] }
        : { count: acc.count, indices: [...acc.indices, -1] },
    { count: 0, indices: [] },
  ).indices;

  return (
    <div className="flex flex-col gap-20">
      {blocks.map((block, index) => {
        const screenshotOrdinal = screenshotToneByBlockIndex[index] ?? -1;
        const screenshotTone =
          SCREENSHOT_TONES[screenshotOrdinal % SCREENSHOT_TONES.length] ?? "elevated";

        return (
          <Reveal key={block.id}>
            <CaseSection
              id={block.id}
              index={toIndexLabel(index)}
              title={block.title}
              intro={"intro" in block ? block.intro : undefined}
            >
              <BlockBody block={block} screenshotTone={screenshotTone} />
            </CaseSection>
          </Reveal>
        );
      })}
    </div>
  );
}
