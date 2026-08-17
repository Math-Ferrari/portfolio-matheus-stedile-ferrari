import { Section } from "@/components/ui/section";
import { techGroups } from "@/data/site";

export function Tech() {
  return (
    <Section
      id="tecnologias"
      index="05"
      label="Tecnologias"
      title="As ferramentas vêm depois do problema."
      lead="Stack que uso com mais frequência no dia a dia."
    >
      <dl className="border-t border-line">
        {techGroups.map((group) => (
          <div
            key={group.label}
            className="grid gap-2 border-b border-line py-5 sm:grid-cols-[11rem_1fr] sm:gap-8"
          >
            <dt className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-blue">
              {group.label}
            </dt>
            <dd className="flex flex-wrap gap-x-7 gap-y-2 text-ink">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
