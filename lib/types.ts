/**
 * Tipos do conteúdo do site.
 *
 * Todo o conteúdo editorial vive em `data/`. Estes tipos existem para que o
 * TypeScript avise caso algum campo obrigatório fique faltando ao editar.
 *
 * ── Sobre o parâmetro `T` ──────────────────────────────────────────────────
 * Cada tipo é genérico no que representa um TEXTO DE LEITURA. Com o padrão
 * (`T = string`) eles descrevem o conteúdo já resolvido para um idioma — que
 * é o que todo componente recebe. Nos arquivos de `data/`, os mesmos tipos
 * são usados como `Project<L>`, `Screenshot<L>` etc., onde cada texto é o par
 * `{ pt, en }` de `lib/i18n.ts`. Um só conjunto de tipos cobre as duas
 * pontas, então a forma da fonte e a forma consumida nunca divergem.
 *
 * Campos que NÃO são texto de leitura (src, href, slug, id, dimensões, nomes
 * de tecnologia, nomes próprios) permanecem `string` nos dois lados.
 */

/** Uma imagem de tela do projeto. Sem `src`, o componente exibe um placeholder. */
export type Screenshot<T = string> = {
  /** Caminho em /public, ex.: "/screenshots/platotruck/estoque.png". Vazio = placeholder. */
  src?: string;
  /** Texto alternativo. Obrigatório mesmo em placeholders (acessibilidade + lembrete). */
  alt: T;
  /** Legenda curta: o que aquela tela resolve. */
  caption?: T;
  /** Define a proporção reservada para a imagem. */
  frame?: "desktop" | "mobile";
  width?: number;
  height?: number;
};

export type LinkItem<T = string> = {
  label: T;
  href: string;
  external?: boolean;
};

export type TechGroup<T = string> = {
  label: T;
  /** Nomes de tecnologia: nunca traduzidos. */
  items: string[];
};

export type ListEntry<T = string> = {
  title: T;
  description?: T;
};

export type ResultEntry<T = string> = {
  label: T;
  title: T;
  description: T;
};

export type ListGroup<T = string> = {
  label: T;
  items: T[];
};

/** Blocos que compõem uma página de case. A ordem no array é a ordem na página. */
export type CaseBlock<T = string> =
  | {
      kind: "prose";
      id: string;
      title: T;
      paragraphs: T[];
    }
  | {
      kind: "list";
      id: string;
      title: T;
      intro?: T;
      /** `numbered` numera os itens; `plain` usa marcadores discretos. */
      variant?: "numbered" | "plain";
      items: ListEntry<T>[];
    }
  | {
      kind: "groups";
      id: string;
      title: T;
      intro?: T;
      groups: ListGroup<T>[];
    }
  | {
      kind: "beforeAfter";
      id: string;
      title: T;
      intro?: T;
      before: { label: T; items: T[] };
      after: { label: T; items: T[] };
    }
  | {
      kind: "screenshots";
      id: string;
      title: T;
      intro?: T;
      /** `single`: uma imagem larga. `pair`: duas lado a lado. `device`: desktop + mobile. */
      layout: "single" | "pair" | "device";
      items: Screenshot<T>[];
    }
  | {
      kind: "tech";
      id: string;
      title: T;
      intro?: T;
      groups: TechGroup<T>[];
    }
  | {
      /** Resultados qualitativos apresentados como uma lista editorial vertical. */
      kind: "results";
      id: string;
      title: T;
      /** Reserva mais espaço para labels editoriais longos no desktop. */
      wideLabels?: boolean;
      items: ResultEntry<T>[];
    }
  | {
      /** Seção estruturada, mas ainda sem conteúdo confirmado. */
      kind: "pending";
      id: string;
      title: T;
      note: T;
    };

export type CaseStudy<T = string> = {
  /** Parágrafos de abertura, antes do sumário. */
  intro: T[];
  blocks: CaseBlock<T>[];
};

export type Project<T = string> = {
  slug: string;
  /** Nome exibido. Nome próprio: nunca traduzido. */
  name: string;
  /** Ex.: "Sistema interno", "Plataforma web". */
  kind: T;
  /** Ex.: "Desenvolvimento Full Stack". */
  role: T;
  /** Chamada principal, usada no card e no topo do case. */
  tagline: T;
  /** Trecho da chamada destacado em verde. Precisa aparecer dentro de `tagline`. */
  taglineHighlight?: T;
  /** Resumo de uma ou duas frases. */
  summary: T;
  featured: boolean;
  problem: T;
  solution: T;
  /** Resultado qualitativo. Nunca métrica não comprovada. */
  outcome: T;
  /** Destaques curtos do que foi construído (usado no card em destaque). */
  highlights: T[];
  /**
   * 3–6 palavras-chave curtas para a apresentação enxuta de home (teaser).
   * Cada uma precisa ser rastreável a algo real em `case.blocks`.
   */
  tags?: T[];
  /** Nomes de tecnologia: nunca traduzidos. */
  tech: string[];
  links: LinkItem<T>[];
  cover: Screenshot<T>;
  case: CaseStudy<T> | null;
};

export type ContactLink<T = string> = {
  label: T;
  /** Vazio = ainda não configurado; o item não é renderizado. */
  href: string;
  /** Texto exibido junto ao rótulo, ex.: "@matheus". */
  display?: string;
};
