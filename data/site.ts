import type { L } from "@/lib/i18n";
import type { LinkItem, Screenshot } from "@/lib/types";

/**
 * ────────────────────────────────────────────────────────────────────────────
 * Informações pessoais, contatos e textos de topo.
 * Este é o arquivo para editar primeiro. Nada aqui está espalhado em componentes.
 *
 * ── Idiomas ────────────────────────────────────────────────────────────────
 * Todo texto de LEITURA é um par `{ pt, en }` (ver `lib/i18n.ts`). O que não
 * é texto — href, slug, caminho de imagem, nome próprio, nome de tecnologia —
 * continua sendo escrito uma vez só. Quem consome recebe o objeto já
 * resolvido para um idioma via `getContent()` (`data/content.ts`) e enxerga
 * strings comuns, exatamente como antes.
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
 * `name` e `initials` são nome próprio: nunca traduzidos.
 */
const name = "Matheus Stedile Ferrari";
const initials = "MSF";

const role: L = { pt: "Engenheiro de Software", en: "Software Engineer" };
const practice: L = { pt: "Desenvolvimento Full Stack", en: "Full Stack Development" };
const degree: L = { pt: "Engenharia de Software", en: "Software Engineering" };

export const site = {
  name,
  initials,
  role,
  practice,
  degree,
  /** Posicionamento + atuação em uma linha, para rodapé e afins. */
  positioning: {
    pt: `${role.pt} · ${practice.pt}`,
    en: `${role.en} · ${practice.en}`,
  },
  /** O que construo, em uma frase curta. */
  summary: {
    pt: "Sistemas internos, aplicações web e integrações.",
    en: "Internal systems, web applications, and integrations.",
  },
  /** Usado em <title>, Open Graph e sitemap. */
  title: {
    pt: `${name} — ${role.pt}`,
    en: `${name} — ${role.en}`,
  },
  description: {
    pt: "Desenvolvo sistemas internos, aplicações web e integrações para organizar operações, reduzir trabalho manual e deixar a informação acessível para quem decide.",
    en: "I build internal systems, web applications, and integrations that organise operations, cut manual work, and put information within reach of the people who decide.",
  },
  /** Locale do Open Graph. A metadata é servida sempre em PT — ver `app/layout.tsx`. */
  locale: "pt-BR",
  /**
   * Domínio final do site. Defina NEXT_PUBLIC_SITE_URL no ambiente (ex.: Vercel)
   * quando o domínio existir — sitemap, robots e Open Graph usam este valor.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // A imagem de Open Graph é gerada em app/opengraph-image.tsx.
  location: { pt: "Brasil", en: "Brazil" },
};

export const nav: LinkItem<L>[] = [
  { label: { pt: "Projetos", en: "Projects" }, href: "/#projetos" },
  { label: { pt: "Como trabalho", en: "How I work" }, href: "/#como-trabalho" },
  { label: { pt: "Stack", en: "Stack" }, href: "/#stack" },
  { label: { pt: "Contato", en: "Contact" }, href: "/#contato" },
];

/** Endereço público, escrito uma vez só: `contacts` (rodapé e JSON-LD) e a
    seção de contato leem daqui, nunca redigitam o e-mail. */
const email = "mathstedileferrari@gmail.com";

/**
 * Contatos. Deixe `href` vazio enquanto não tiver o link — itens sem href
 * simplesmente não aparecem no site, sem quebrar o layout.
 */
export const contacts = [
  {
    label: { pt: "E-mail", en: "Email" },
    href: `mailto:${email}`,
    display: email,
  },
  {
    label: { pt: "LinkedIn", en: "LinkedIn" },
    href: "", // TODO: https://linkedin.com/in/...
    display: "",
  },
  {
    label: { pt: "GitHub", en: "GitHub" },
    href: "", // TODO: https://github.com/...
    display: "",
  },
  {
    label: { pt: "WhatsApp", en: "WhatsApp" },
    href: "", // TODO: https://wa.me/55...
    display: "",
  },
];

/** Contatos prontos para render — os que já têm link. */
export const activeContacts = contacts.filter((contact) => contact.href.length > 0);

/**
 * Linhas do título do hero. `hero.title` é derivado daqui, então a versão em
 * uma linha (usada no <title>, na imagem OG e no hero estável) e a composição
 * em três linhas do hero experimental nunca podem divergir.
 */
const heroLines: L<string[]> = {
  pt: ["Transformo", "problemas de negócio", "em software."],
  en: ["I turn", "business problems", "into software."],
};

export const hero = {
  eyebrow: { pt: `${name} — ${role.pt}`, en: `${name} — ${role.en}` },
  lines: heroLines,
  title: { pt: heroLines.pt.join(" "), en: heroLines.en.join(" ") },
  /** Trecho do título destacado em verde. Precisa aparecer dentro de `title`. */
  highlight: { pt: "software", en: "software" },
  lead: {
    pt: "Desenvolvo sistemas internos, aplicações web e integrações para organizar operações, reduzir trabalho manual e deixar a informação acessível para quem precisa decidir.",
    en: "I build internal systems, web applications, and integrations that organise operations, cut manual work, and keep information within reach of the people who need to decide.",
  },
  primaryCta: { label: { pt: "Ver projetos", en: "View projects" }, href: "#projetos" },
  secondaryCta: { label: { pt: "Entrar em contato", en: "Get in touch" }, href: "#contato" },
  /** Linha discreta no fim da primeira dobra. */
  disciplines: {
    pt: ["Sistemas internos", "Aplicações web", "Integrações", "Dados e dashboards"],
    en: ["Internal systems", "Web applications", "Integrations", "Data and dashboards"],
  },
};

/**
 * Teasers da primeira dobra: dois projetos como elementos de navegação, não
 * como cards completos. `name` é nome próprio — nunca traduzido.
 */
export const heroProjects = [
  {
    slug: "sistema-platotruck",
    label: { pt: "Sistema interno", en: "Internal system" },
    name: "Sistema de Gestão PlatoTruck",
    teaser: {
      pt: "Operação multiempresa e gestão de estoque.",
      en: "Multi-company operation and inventory management.",
    },
  },
  {
    slug: "tudoprabarco",
    label: { pt: "Plataforma web", en: "Web platform" },
    name: "tudoPrabarco",
    teaser: {
      pt: "Marketplace digital do setor náutico.",
      en: "Digital marketplace for the boating industry.",
    },
  },
];

/**
 * Imagem da primeira dobra. Assim que houver uma screenshot real de um dos
 * sistemas, preencha `src` — o placeholder some sozinho.
 *
 * NOTA: o hero atual (capa dark com Aurora) não consome mais este objeto. Ele
 * continua aqui porque `components/sections/hero.tsx` (hero estável) o usa.
 */
export const heroVisual: Screenshot<L> = {
  src: "", // TODO: "/screenshots/platotruck/dashboard.png"
  alt: {
    pt: "Tela do Sistema de Gestão PlatoTruck",
    en: "PlatoTruck Management System screen",
  },
  caption: {
    pt: "Espaço reservado para uma screenshot real do sistema.",
    en: "Placeholder for a real screenshot of the system.",
  },
  frame: "desktop",
};

/**
 * Apresentação — a ÚNICA vez que o posicionamento é declarado no corpo da
 * home (dentro da própria cena da hero, ver `about-intro.tsx`). `eyebrow`
 * reaproveita `site.positioning`; `heading` e `highlight` preservam a quebra
 * editorial em duas linhas da headline; `body` é a única frase de apoio;
 * `keywords` alimenta a lista de especialidades.
 */
export const profile = {
  eyebrow: site.positioning,
  heading: { pt: "Construo software para", en: "I build software for" },
  highlight: { pt: "operações reais.", en: "real-world operations." },
  body: {
    pt: "Transformo regras de negócio, processos e necessidades operacionais em sistemas internos, aplicações web e integrações.",
    en: "I turn business rules, processes, and operational needs into internal systems, web applications, and integrations.",
  },
  keywords: {
    pt: [
      "Sistemas sob medida",
      "Aplicações web",
      "Full Stack",
      "Integrações e automações",
      "Regras de negócio",
    ],
    en: [
      "Custom systems",
      "Web applications",
      "Full Stack",
      "Integrations & automation",
      "Business logic",
    ],
  },
};

/**
 * "Como trabalho" — fusão de `approach` (como penso) e `capabilities` (o que
 * construo) numa seção só. As descrições foram encurtadas para uma linha:
 * na home o objetivo é sinalizar o método, não documentá-lo.
 */
export const howIWork = {
  title: { pt: "Do problema ao software.", en: "From problem to software." },
  lead: {
    pt: "Muita coisa que parece faltar é, na verdade, uma regra de negócio que ninguém tinha escrito. Boa parte do trabalho é transformar essas regras em algo que o software garanta.",
    en: "A lot of what looks like a missing feature is really a business rule nobody had written down. Much of the work is turning those rules into something the software enforces.",
  },
  thinkingLabel: { pt: "Como penso", en: "How I think" },
  buildingLabel: { pt: "O que construo", en: "What I build" },
  thinking: [
    {
      title: { pt: "Entender", en: "Understand" },
      description: {
        pt: "Como a operação funciona hoje, quais são as exceções e onde existe atrito.",
        en: "How the operation runs today, where the exceptions are, and where the friction sits.",
      },
    },
    {
      title: { pt: "Definir", en: "Define" },
      description: {
        pt: "Recortar o problema em algo construível, priorizando o que trava o dia a dia.",
        en: "Cut the problem down to something buildable, starting with what blocks day-to-day work.",
      },
    },
    {
      title: { pt: "Construir", en: "Build" },
      description: {
        pt: "Entregar em partes utilizáveis e ajustar com base no uso real.",
        en: "Ship in usable pieces and adjust based on how they are actually used.",
      },
    },
  ],
  building: [
    {
      title: { pt: "Sistemas internos", en: "Internal systems" },
      description: {
        pt: "Ferramentas feitas para os processos de uma empresa específica.",
        en: "Tools built around one company's specific processes.",
      },
    },
    {
      title: { pt: "Aplicações web", en: "Web applications" },
      description: {
        pt: "Plataformas e portais, do cadastro às telas de uso diário.",
        en: "Platforms and portals, from sign-up to the screens used every day.",
      },
    },
    {
      title: { pt: "Integrações e automações", en: "Integrations and automation" },
      description: {
        pt: "Conexão entre sistemas e APIs, menos trabalho repetido.",
        en: "Connecting systems and APIs so less work has to be repeated.",
      },
    },
    {
      title: { pt: "Dados e dashboards", en: "Data and dashboards" },
      description: {
        pt: "Organizar o que a operação já produz e torná-lo consultável.",
        en: "Organising what the operation already produces and making it queryable.",
      },
    },
  ],
};

export const about = {
  eyebrow: { pt: "Sobre", en: "About" },
  title: name,
  paragraphs: {
    pt: [
      "Sou engenheiro de software, com atuação principal em desenvolvimento Full Stack e aplicações web. Estou no último semestre da graduação em Engenharia de Software, que venho concluindo em paralelo com o trabalho profissional.",
      "O que construo não fica em exercício de faculdade: são sistemas usados no dia a dia de empresas reais, com as regras, exceções e restrições que só aparecem quando alguém depende daquilo para trabalhar.",
      "Meu interesse maior está em entender processos empresariais e transformar problemas operacionais em sistemas úteis — o tipo de trabalho em que a parte difícil raramente é a tecnologia, e sim entender o que a operação realmente precisa.",
      "Hoje trabalho em sistemas de gestão interna, plataformas web e integrações, com atenção a controle de acesso, consistência dos dados e qualidade do que vai para produção.",
    ],
    en: [
      "I am a software engineer working mainly in Full Stack development and web applications. I am in the final semester of a Software Engineering degree, which I have been completing alongside professional work.",
      "What I build does not stay in coursework: these are systems used daily by real companies, with the rules, exceptions, and constraints that only surface once someone depends on them to do their job.",
      "My main interest is understanding business processes and turning operational problems into useful systems — the kind of work where the hard part is rarely the technology, but understanding what the operation actually needs.",
      "Today I work on internal management systems, web platforms, and integrations, with attention to access control, data consistency, and the quality of what reaches production.",
    ],
  },
  /** Foto profissional: adicione o arquivo em /public e informe o caminho aqui. */
  photo: {
    src: "", // TODO: "/matheus-stedile-ferrari.jpg"
    alt: name,
  },
};

/** Nomes de tecnologia nunca são traduzidos — só os rótulos de categoria. */
export const techGroups = [
  { label: { pt: "Frontend", en: "Frontend" }, items: ["React", "Next.js", "TypeScript"] },
  { label: { pt: "Backend", en: "Backend" }, items: ["Node.js", "NestJS"] },
  { label: { pt: "Dados", en: "Data" }, items: ["PostgreSQL", "Supabase"] },
  {
    label: { pt: "Cloud e ferramentas", en: "Cloud and tooling" },
    items: ["AWS", "Vercel", "Git / GitHub"],
  },
];

/**
 * Engenharia na home: só a sinalização de que o assunto é tratado — a lista
 * é de princípios, sem um parágrafo explicando cada conceito.
 */
export const engineering = {
  heading: { pt: "Engenharia", en: "Engineering" },
  stackHeading: { pt: "Stack", en: "Stack" },
  title: {
    pt: "Segurança como parte do desenvolvimento, não como ajuste posterior.",
    en: "Security as part of development, not a later adjustment.",
  },
  lead: {
    pt: "Nem todo projeto exige o mesmo conjunto de controles. É o que avalio ao construir.",
    en: "Not every project calls for the same set of controls. That is what I weigh while building.",
  },
  principles: {
    pt: [
      "Autenticação e autorização",
      "Regras no servidor",
      "Validação de entrada",
      "Controle de acesso",
      "Políticas no banco",
      "Auditoria",
    ],
    en: [
      "Authentication and authorisation",
      "Server-side rules",
      "Input validation",
      "Access control",
      "Database policies",
      "Auditing",
    ],
  },
};

/**
 * Encerramento. Um único CTA com peso — o WhatsApp, canal de resposta mais
 * rápida — e, abaixo dele, os demais canais como linha discreta.
 *
 * `secondary` vive AQUI, e não em `contacts`: aquele array alimenta o rodapé
 * e o JSON-LD (`activeContacts`), e preencher os itens vazios de lá mudaria
 * o rodapé junto.
 */
export const contact = {
  title: {
    pt: "Tem algo que vale a pena construir?",
    en: "Have something worth building?",
  },
  lead: {
    pt: "Vamos conversar sobre projetos, oportunidades ou ideias.",
    en: "Let's talk about projects, opportunities, or ideas.",
  },
  cta: {
    label: { pt: "Falar no WhatsApp", en: "Message me on WhatsApp" },
    href: "https://wa.me/5541995322264",
  },
  secondary: [
    { label: { pt: "E-mail", en: "Email" }, href: `mailto:${email}` },
    {
      label: { pt: "LinkedIn", en: "LinkedIn" },
      href: "https://www.linkedin.com/in/matheus-stedile-ferrari-0b8178282/",
    },
    { label: { pt: "GitHub", en: "GitHub" }, href: "https://github.com/Math-Ferrari" },
  ],
};
