import type { ContactLink, LinkItem, Screenshot, TechGroup } from "@/lib/types";

/**
 * ────────────────────────────────────────────────────────────────────────────
 * Informações pessoais, contatos e textos de topo.
 * Este é o arquivo para editar primeiro. Nada aqui está espalhado em componentes.
 * ────────────────────────────────────────────────────────────────────────────
 */

/**
 * ── Identidade ──────────────────────────────────────────────────────────────
 *
 * Fonte única de verdade. Regra semântica aplicada em todo o site:
 *
 *   name     → identidade completa .......... "Matheus Stedile Ferrari"
 *   initials → assinatura visual ............ "MSF" (ver BrandSignature)
 *   role     → posicionamento profissional .. "Engenheiro de Software"
 *   practice → atuação detalhada ............ "Desenvolvimento Full Stack"
 *   degree   → formação / curso ............. "Engenharia de Software"
 *
 * `role` é o posicionamento profissional adotado em todo o site — hero,
 * header, footer, metadata e JSON-LD (`jobTitle`) usam este campo.
 *
 * `degree` só aparece quando o texto fala especificamente da graduação (seção
 * Sobre). A graduação está em andamento (último semestre): esse contexto deve
 * deixar isso transparente, mas não limita `role` — "Engenheiro de Software"
 * é o rótulo profissional usado no restante do site.
 */
const name = "Matheus Stedile Ferrari";
const initials = "MSF";
const role = "Engenheiro de Software";
const practice = "Desenvolvimento Full Stack";
const degree = "Engenharia de Software";

export const site = {
  name,
  initials,
  role,
  practice,
  degree,
  /** Posicionamento + atuação em uma linha, para rodapé e afins. */
  positioning: `${role} · ${practice}`,
  /** O que construo, em uma frase curta. */
  summary: "Sistemas internos, aplicações web e integrações.",
  /** Usado em <title>, Open Graph e sitemap. */
  title: `${name} — ${role}`,
  description:
    "Desenvolvo sistemas internos, aplicações web e integrações para organizar operações, reduzir trabalho manual e deixar a informação acessível para quem decide.",
  locale: "pt-BR",
  /**
   * Domínio final do site. Defina NEXT_PUBLIC_SITE_URL no ambiente (ex.: Vercel)
   * quando o domínio existir — sitemap, robots e Open Graph usam este valor.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // A imagem de Open Graph é gerada em app/opengraph-image.tsx.
  location: "Brasil",
} as const;

export const nav: LinkItem[] = [
  { label: "Projetos", href: "/#projetos" },
  { label: "Como trabalho", href: "/#como-trabalho" },
  { label: "Stack", href: "/#stack" },
  { label: "Contato", href: "/#contato" },
];

/**
 * Contatos. Deixe `href` vazio enquanto não tiver o link — itens sem href
 * simplesmente não aparecem no site, sem quebrar o layout.
 */
export const contacts: ContactLink[] = [
  {
    label: "E-mail",
    // TODO: confirme qual e-mail deve ficar público.
    href: "mailto:mathstedileferrari@gmail.com",
    display: "mathstedileferrari@gmail.com",
  },
  {
    label: "LinkedIn",
    href: "", // TODO: https://linkedin.com/in/...
    display: "",
  },
  {
    label: "GitHub",
    href: "", // TODO: https://github.com/...
    display: "",
  },
  {
    label: "WhatsApp",
    href: "", // TODO: https://wa.me/55...
    display: "",
  },
];

/** Contatos prontos para render — os que já têm link. */
export const activeContacts = contacts.filter((contact) => contact.href.length > 0);

/** Contato usado no botão principal da seção de contato. */
export const primaryContact = activeContacts[0];

/**
 * Linhas do título do hero. `hero.title` é derivado daqui, então a versão em
 * uma linha (usada no <title>, na imagem OG e no hero estável) e a composição
 * em três linhas do hero experimental nunca podem divergir.
 */
const heroLines = ["Transformo", "problemas de negócio", "em software."] as const;

export const hero = {
  eyebrow: `${site.name} — ${site.role}`,
  lines: heroLines,
  title: heroLines.join(" "),
  /** Trecho do título destacado em verde. Precisa aparecer dentro de `title`. */
  highlight: "software",
  lead: "Desenvolvo sistemas internos, aplicações web e integrações para organizar operações, reduzir trabalho manual e deixar a informação acessível para quem precisa decidir.",
  primaryCta: { label: "Ver projetos", href: "#projetos" },
  secondaryCta: { label: "Entrar em contato", href: "#contato" },
  /** Linha discreta no fim da primeira dobra. */
  disciplines: ["Sistemas internos", "Aplicações web", "Integrações", "Dados e dashboards"],
} as const;

/**
 * Teasers da primeira dobra: dois projetos como elementos de navegação, não
 * como cards completos. A copy aqui é curta de propósito e independe da de
 * `data/projects.ts` — o card do hero mostra menos que o card da seção de
 * projetos, e `slug` é o que liga os dois.
 */
export const heroProjects = [
  {
    slug: "sistema-platotruck",
    label: "Sistema interno",
    name: "Sistema de Gestão PlatoTruck",
    teaser: "Operação multiempresa e gestão de estoque.",
  },
  {
    slug: "tudoprabarco",
    label: "Plataforma web",
    name: "tudoPrabarco",
    teaser: "Marketplace digital do setor náutico.",
  },
] as const;

/**
 * Imagem da primeira dobra. Assim que houver uma screenshot real de um dos
 * sistemas, preencha `src` — o placeholder some sozinho.
 *
 * NOTA: o hero atual (capa dark com Aurora) não consome mais este objeto. Ele
 * continua aqui porque `components/sections/hero.tsx` (hero estável) o usa.
 */
export const heroVisual: Screenshot = {
  src: "", // TODO: "/screenshots/platotruck/dashboard.png"
  alt: "Tela do Sistema de Gestão PlatoTruck",
  caption: "Espaço reservado para uma screenshot real do sistema.",
  frame: "desktop",
};

/**
 * Apresentação — a ÚNICA vez que o posicionamento é declarado no corpo da
 * home (dentro da própria cena da hero, ver `about-intro.tsx`).
 * `headingLines` e `highlight` preservam as quebras editoriais da headline;
 * `intro` e `body` formam as duas camadas de texto; `keywords` alimenta
 * a lista numerada de especialidades.
 */
export const profile = {
  eyebrow: "Engenharia aplicada ao cotidiano",
  headingLines: ["Construo", "software para"],
  highlight: "operações reais.",
  intro: "Sou Engenheiro de Software e Desenvolvedor Full Stack. Atuo do frontend ao backend, criando sistemas internos, aplicações web e integrações voltadas a problemas reais de operação.",
  body: "Transformo regras de negócio, processos e necessidades operacionais em software útil — com atenção à estrutura, usabilidade, consistência e implementação prática.",
  keywords: [
    "Sistemas sob medida",
    "Aplicações web",
    "Full Stack",
    "Integrações e automações",
    "Regras de negócio",
  ],
} as const;

/**
 * "Como trabalho" — fusão de `approach` (como penso) e `capabilities` (o que
 * construo) numa seção só. As descrições foram encurtadas para uma linha:
 * na home o objetivo é sinalizar o método, não documentá-lo.
 */
export const howIWork = {
  title: "Do problema ao software.",
  lead: "Muita coisa que parece faltar é, na verdade, uma regra de negócio que ninguém tinha escrito. Boa parte do trabalho é transformar essas regras em algo que o software garanta.",
  thinking: [
    {
      title: "Entender",
      description: "Como a operação funciona hoje, quais são as exceções e onde existe atrito.",
    },
    {
      title: "Definir",
      description: "Recortar o problema em algo construível, priorizando o que trava o dia a dia.",
    },
    {
      title: "Construir",
      description: "Entregar em partes utilizáveis e ajustar com base no uso real.",
    },
  ],
  building: [
    { title: "Sistemas internos", description: "Ferramentas feitas para os processos de uma empresa específica." },
    { title: "Aplicações web", description: "Plataformas e portais, do cadastro às telas de uso diário." },
    { title: "Integrações e automações", description: "Conexão entre sistemas e APIs, menos trabalho repetido." },
    { title: "Dados e dashboards", description: "Organizar o que a operação já produz e torná-lo consultável." },
  ],
} as const;

export const about = {
  eyebrow: "Sobre",
  title: site.name,
  paragraphs: [
    "Sou engenheiro de software, com atuação principal em desenvolvimento Full Stack e aplicações web. Estou no último semestre da graduação em Engenharia de Software, que venho concluindo em paralelo com o trabalho profissional.",
    "O que construo não fica em exercício de faculdade: são sistemas usados no dia a dia de empresas reais, com as regras, exceções e restrições que só aparecem quando alguém depende daquilo para trabalhar.",
    "Meu interesse maior está em entender processos empresariais e transformar problemas operacionais em sistemas úteis — o tipo de trabalho em que a parte difícil raramente é a tecnologia, e sim entender o que a operação realmente precisa.",
    "Hoje trabalho em sistemas de gestão interna, plataformas web e integrações, com atenção a controle de acesso, consistência dos dados e qualidade do que vai para produção.",
  ],
  /** Foto profissional: adicione o arquivo em /public e informe o caminho aqui. */
  photo: {
    src: "", // TODO: "/matheus-stedile-ferrari.jpg"
    alt: site.name,
  },
} as const;

export const techGroups: TechGroup[] = [
  { label: "Frontend", items: ["React", "Next.js", "TypeScript"] },
  { label: "Backend", items: ["Node.js", "NestJS"] },
  { label: "Dados", items: ["PostgreSQL", "Supabase"] },
  { label: "Cloud e ferramentas", items: ["AWS", "Vercel", "Git / GitHub"] },
];

/**
 * Engenharia na home: só a sinalização de que o assunto é tratado — a lista
 * é de princípios, sem um parágrafo explicando cada conceito. O "como foi
 * implementado" mora nos cases (ver o bloco `seguranca` em
 * `data/projects.ts`), não aqui.
 */
export const engineering = {
  title: "Segurança como parte do desenvolvimento, não como ajuste posterior.",
  lead: "Nem todo projeto exige o mesmo conjunto de controles. É o que avalio ao construir.",
  principles: [
    "Autenticação e autorização",
    "Regras no servidor",
    "Validação de entrada",
    "Controle de acesso",
    "Políticas no banco",
    "Auditoria",
  ],
} as const;

export const contact = {
  title: "Tem algo que vale a pena construir?",
  cta: "Vamos conversar",
} as const;
