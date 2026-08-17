import { Section } from "@/components/ui/section";
import { engineering } from "@/data/site";

export function Engineering() {
  return (
    <Section
      id="engenharia"
      index="06"
      label={engineering.eyebrow}
      title={engineering.title}
      tone="deep"
    >
      <div className="max-w-[62ch] space-y-6 text-ink-muted">
        {engineering.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <dl className="mt-14 grid gap-x-12 sm:grid-cols-2">
        {engineering.concerns.map((concern) => (
          <div key={concern.title} className="border-t border-line-strong py-5">
            <dt className="flex items-center gap-3 text-[0.95rem] font-medium text-ink">
              <span aria-hidden className="size-1.5 shrink-0 bg-blue" />
              {concern.title}
            </dt>
            <dd className="ml-[1.125rem] mt-1 text-sm leading-relaxed text-ink-muted">
              {concern.description}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
