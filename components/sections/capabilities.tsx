import { Section } from "@/components/ui/section";
import { capabilities } from "@/data/site";
import { toIndexLabel } from "@/lib/utils";

export function Capabilities() {
  return (
    <Section
      id="o-que-faco"
      index="03"
      label="O que faço"
      title="Quatro frentes de trabalho."
      lead="Na prática, um projeto quase sempre combina mais de uma delas."
      tone="surface"
    >
      <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {capabilities.map((capability, index) => (
          <div key={capability.title} className="border-t border-line pt-5">
            <span
              aria-hidden
              className="nums-tabular text-sm font-semibold tracking-[0.08em] text-blue"
            >
              {toIndexLabel(index)}
            </span>
            <dt className="mt-3 text-[1.15rem] font-medium -tracking-[0.02em] text-ink">
              {capability.title}
            </dt>
            <dd className="mt-3 max-w-[44ch] text-sm leading-relaxed text-ink-muted">
              {capability.description}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
