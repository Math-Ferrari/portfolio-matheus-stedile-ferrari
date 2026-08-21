/**
 * Tons de seção — cada um é uma "cena" da mesma identidade dark/light, não
 * uma paleta própria. Seis papéis, cada um com par escuro/claro definido em
 * `app/globals.css` (`--tone-*`, `--surface-elevated`): `base` é a cor da
 * capa (quase preto / off-white); `graphite`/`navy`/`slate`/`petrol` são
 * variações sutis de matiz para seções abaixo dela nunca empilharem o mesmo
 * fundo repetido; `elevated` é a superfície mais alta do tema, para o fecho
 * de página e cards que precisam se destacar de qualquer cena.
 *
 * Nenhum dos seis fixa cor de texto própria: dentro de um mesmo tema, os
 * tons ficam próximos o bastante para o mesmo par `foreground`/`muted`
 * servir a todos — a diferença é só o fundo.
 */
export type Tone = "base" | "graphite" | "navy" | "slate" | "petrol" | "elevated";

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

const shared = {
  border: "border-border",
  title: "text-foreground",
  lead: "text-muted",
  label: "text-muted",
  index: "text-accent",
  line: "border-border",
  body: "text-muted",
} as const;

export const tones: Record<Tone, ToneStyles> = {
  base: { ...shared, section: "bg-background" },
  graphite: { ...shared, section: "bg-tone-graphite" },
  navy: { ...shared, section: "bg-tone-navy" },
  slate: { ...shared, section: "bg-tone-slate" },
  petrol: { ...shared, section: "bg-tone-petrol" },
  elevated: { ...shared, section: "bg-surface-elevated" },
};
