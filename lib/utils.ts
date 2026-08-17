type ClassValue = string | false | null | undefined;

/** Concatena classes, ignorando valores falsos. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

/** "01", "02", ... a partir de um índice zero-based. */
export function toIndexLabel(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/**
 * Separa um texto em [antes, destaque, depois] para colorir só um trecho.
 * Se o trecho não existir no texto, devolve tudo em `before`.
 */
export function splitHighlight(
  text: string,
  highlight: string,
): { before: string; match: string; after: string } {
  const start = text.indexOf(highlight);

  if (start === -1) {
    return { before: text, match: "", after: "" };
  }

  return {
    before: text.slice(0, start),
    match: highlight,
    after: text.slice(start + highlight.length),
  };
}
