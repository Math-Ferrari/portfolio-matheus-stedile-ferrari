import { PhotoFrame } from "@/components/ui/photo-frame";
import { Section } from "@/components/ui/section";
import { about } from "@/data/site";

export function About() {
  return (
    <Section id="sobre" index="04" label={about.eyebrow} title={about.title}>
      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_19rem] md:gap-14">
        <div className="max-w-[62ch] space-y-6 text-ink-muted">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="relative w-full max-w-[19rem] md:sticky md:top-24">
          <div aria-hidden className="absolute bottom-0 right-0 h-3/5 w-3/5 bg-blue" />
          <PhotoFrame
            src={about.photo.src || undefined}
            alt={about.photo.alt}
            className="relative mb-5 mr-5"
          />
        </div>
      </div>
    </Section>
  );
}
