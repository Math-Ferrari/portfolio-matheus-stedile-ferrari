/**
 * Tipos do conteúdo do site.
 *
 * Todo o conteúdo editorial vive em `data/`. Estes tipos existem para que o
 * TypeScript avise caso algum campo obrigatório fique faltando ao editar.
 */

/** Uma imagem de tela do projeto. Sem `src`, o componente exibe um placeholder. */
export type Screenshot = {
  /** Caminho em /public, ex.: "/screenshots/platotruck/estoque.png". Vazio = placeholder. */
  src?: string;
  /** Texto alternativo. Obrigatório mesmo em placeholders (acessibilidade + lembrete). */
  alt: string;
  /** Legenda curta: o que aquela tela resolve. */
  caption?: string;
  /** Define a proporção reservada para a imagem. */
  frame?: "desktop" | "mobile";
  width?: number;
  height?: number;
};

export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type TechGroup = {
  label: string;
  items: string[];
};

export type ListEntry = {
  title: string;
  description?: string;
};

export type ResultEntry = {
  label: string;
  title: string;
  description: string;
};

export type ListGroup = {
  label: string;
  items: string[];
};

/** Blocos que compõem uma página de case. A ordem no array é a ordem na página. */
export type CaseBlock =
  | {
      kind: "prose";
      id: string;
      title: string;
      paragraphs: string[];
    }
  | {
      kind: "list";
      id: string;
      title: string;
      intro?: string;
      /** `numbered` numera os itens; `plain` usa marcadores discretos. */
      variant?: "numbered" | "plain";
      items: ListEntry[];
    }
  | {
      kind: "groups";
      id: string;
      title: string;
      intro?: string;
      groups: ListGroup[];
    }
  | {
      kind: "beforeAfter";
      id: string;
      title: string;
      intro?: string;
      before: { label: string; items: string[] };
      after: { label: string; items: string[] };
    }
  | {
      kind: "screenshots";
      id: string;
      title: string;
      intro?: string;
      /** `single`: uma imagem larga. `pair`: duas lado a lado. `device`: desktop + mobile. */
      layout: "single" | "pair" | "device";
      items: Screenshot[];
    }
  | {
      kind: "tech";
      id: string;
      title: string;
      intro?: string;
      groups: TechGroup[];
    }
  | {
      /** Resultados qualitativos apresentados como uma lista editorial vertical. */
      kind: "results";
      id: string;
      title: string;
      /** Reserva mais espaço para labels editoriais longos no desktop. */
      wideLabels?: boolean;
      items: ResultEntry[];
    }
  | {
      /** Seção estruturada, mas ainda sem conteúdo confirmado. */
      kind: "pending";
      id: string;
      title: string;
      note: string;
    };

export type CaseStudy = {
  /** Parágrafos de abertura, antes do sumário. */
  intro: string[];
  blocks: CaseBlock[];
};

export type Project = {
  slug: string;
  /** Nome exibido. */
  name: string;
  /** Ex.: "Sistema interno", "Plataforma web". */
  kind: string;
  /** Ex.: "Desenvolvimento Full Stack". */
  role: string;
  /** Chamada principal, usada no card e no topo do case. */
  tagline: string;
  /** Trecho da chamada destacado em verde. Precisa aparecer dentro de `tagline`. */
  taglineHighlight?: string;
  /** Resumo de uma ou duas frases. */
  summary: string;
  featured: boolean;
  problem: string;
  solution: string;
  /** Resultado qualitativo. Nunca métrica não comprovada. */
  outcome: string;
  /** Destaques curtos do que foi construído (usado no card em destaque). */
  highlights: string[];
  /**
   * 3–6 palavras-chave curtas para a apresentação enxuta de home (teaser).
   * Cada uma precisa ser rastreável a algo real em `case.blocks` — não é um
   * resumo de marketing, é a versão mais curta possível dos mesmos fatos.
   */
  tags?: string[];
  tech: string[];
  links: LinkItem[];
  cover: Screenshot;
  case: CaseStudy | null;
};

export type ContactLink = {
  label: string;
  /** Vazio = ainda não configurado; o item não é renderizado. */
  href: string;
  /** Texto exibido junto ao rótulo, ex.: "@matheus". */
  display?: string;
};
