/**
 * Tons de seção.
 *
 * A página é majoritariamente bege. `surface` e `deep` quebram o ritmo de forma
 * discreta; `navy` é a faixa de contraste e aparece poucas vezes no site.
 */
export type Tone = "paper" | "surface" | "deep" | "navy";

type ToneStyles = {
  section: string;
  border: string;
  title: string;
  lead: string;
  label: string;
  index: string;
  line: string;
  body: string;
};

export const tones: Record<Tone, ToneStyles> = {
  paper: {
    section: "bg-paper",
    border: "border-line",
    title: "text-ink",
    lead: "text-ink-muted",
    label: "text-ink-subtle",
    index: "text-blue",
    line: "border-line",
    body: "text-ink-muted",
  },
  surface: {
    section: "bg-surface",
    border: "border-line",
    title: "text-ink",
    lead: "text-ink-muted",
    label: "text-ink-subtle",
    index: "text-blue",
    line: "border-line",
    body: "text-ink-muted",
  },
  deep: {
    section: "bg-paper-deep",
    border: "border-line-strong",
    title: "text-ink",
    lead: "text-ink-muted",
    label: "text-ink-subtle",
    index: "text-blue",
    line: "border-line-strong",
    body: "text-ink-muted",
  },
  navy: {
    section: "on-navy bg-navy",
    border: "border-line-navy",
    title: "text-on-navy",
    lead: "text-on-navy-muted",
    label: "text-on-navy-muted",
    index: "text-blue-light",
    line: "border-line-navy",
    body: "text-on-navy-muted",
  },
};
