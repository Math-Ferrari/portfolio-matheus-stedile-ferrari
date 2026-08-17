import { Section } from "@/components/ui/section";
import { approach } from "@/data/site";
import { toIndexLabel } from "@/lib/utils";

export function Approach() {
  return (
    <Section id="abordagem" index="02" label={approach.eyebrow} title={approach.title}>
      <div className="max-w-[62ch] space-y-6 text-ink-muted">
        {approach.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <ol className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-3">
        {approach.steps.map((step, index) => (
          <li key={step.title} className="border-t-2 border-blue pt-5">
            <span
              aria-hidden
              className="nums-tabular text-sm font-semibold tracking-[0.08em] text-blue"
            >
              {toIndexLabel(index)}
            </span>
            <h3 className="mt-3 text-[1.02rem] font-medium -tracking-[0.01em] text-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
