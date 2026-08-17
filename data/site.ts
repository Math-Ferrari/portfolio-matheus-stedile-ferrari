import type { Capability, ContactLink, LinkItem, Screenshot, TechGroup } from "@/lib/types";

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
  { label: "O que faço", href: "/#o-que-faco" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Tecnologias", href: "/#tecnologias" },
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

export const hero = {
  eyebrow: `${site.name} — ${site.role}`,
  title: "Transformo problemas de negócio em software.",
  /** Trecho do título destacado em azul. Precisa aparecer dentro de `title`. */
  highlight: "software",
  lead: "Desenvolvo sistemas internos, aplicações web e integrações para organizar operações, reduzir trabalho manual e deixar a informação acessível para quem precisa decidir.",
  primaryCta: { label: "Ver projetos", href: "#projetos" },
  secondaryCta: { label: "Entrar em contato", href: "#contato" },
  /** Linha discreta no fim da primeira dobra. */
  disciplines: ["Sistemas internos", "Aplicações web", "Integrações", "Dados e dashboards"],
} as const;

/**
 * Imagem da primeira dobra. Assim que houver uma screenshot real de um dos
 * sistemas, preencha `src` — o placeholder some sozinho.
 */
export const heroVisual: Screenshot = {
  src: "", // TODO: "/screenshots/platotruck/dashboard.png"
  alt: "Tela do Sistema de Gestão PlatoTruck",
  caption: "Espaço reservado para uma screenshot real do sistema.",
  frame: "desktop",
};

export const approach = {
  eyebrow: "Abordagem",
  title: "Software começa pelo problema.",
  paragraphs: [
    "Antes de escrever funcionalidades, procuro entender como a operação funciona hoje: quem executa cada etapa, quais regras existem de fato, onde a informação se perde e o que já é resolvido fora do sistema.",
    "Isso costuma mudar o que precisa ser construído. Muita coisa que parece faltar é, na verdade, uma regra de negócio que ninguém tinha escrito — e boa parte do trabalho é transformar essas regras em algo que o software consiga garantir.",
  ],
  steps: [
    {
      title: "Entender a operação",
      description:
        "Como o processo acontece hoje, quais são as exceções e o que depende de controle manual.",
    },
    {
      title: "Definir o que resolve",
      description:
        "Recortar o problema em algo construível, com prioridade no que trava o dia a dia.",
    },
    {
      title: "Construir e ajustar",
      description:
        "Entregar em partes utilizáveis e corrigir a rota com base no uso real, não em suposição.",
    },
  ],
} as const;

/** Faixa em movimento entre a seção de projetos e "Como trabalho". */
export const marqueeItems = [
  "Sistemas internos",
  "Aplicações web",
  "Integrações",
  "Automações",
  "Dashboards",
  "APIs",
  "Sistemas multiempresa",
] as const;

export const capabilities: Capability[] = [
  {
    title: "Sistemas internos",
    description:
      "Ferramentas construídas de acordo com os processos e as regras específicas de uma empresa, no lugar de adaptar a operação a um software genérico.",
  },
  {
    title: "Aplicações web",
    description:
      "Plataformas, marketplaces, portais e sistemas web — do cadastro e das permissões até as telas que sustentam o uso diário.",
  },
  {
    title: "Integrações e automações",
    description:
      "Conexão entre sistemas e APIs, troca de dados entre serviços e redução de tarefas repetidas manualmente.",
  },
  {
    title: "Dados e dashboards",
    description:
      "Organização das informações que a operação já produz e indicadores para acompanhar o que está acontecendo.",
  },
];

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

export const engineering = {
  eyebrow: "Engenharia",
  title: "Segurança tratada como parte do desenvolvimento.",
  paragraphs: [
    "Sistemas internos lidam com dados de operação, estoque e pessoas. Por isso trato controle de acesso e validação como parte do que está sendo construído, e não como um ajuste posterior.",
    "Nem todo projeto exige o mesmo conjunto de controles, e nem todos os itens abaixo estão presentes em todos os projetos. É a forma como avalio o assunto e o que considero ao desenvolver.",
  ],
  concerns: [
    { title: "Autenticação", description: "Identificação de quem está usando o sistema." },
    { title: "Autorização", description: "Perfis e níveis de acesso por funcionalidade." },
    { title: "Validação", description: "Verificação dos dados de entrada antes de persistir." },
    { title: "Regras no servidor", description: "Decisões críticas fora do controle do cliente." },
    { title: "Controle de acesso", description: "Escopo do que cada usuário enxerga e altera." },
    { title: "Políticas no banco", description: "Restrições na camada de dados, não só na aplicação." },
    { title: "Auditoria", description: "Registro do que foi feito, por quem e quando." },
    { title: "Segurança por camadas", description: "Frontend, backend e banco com responsabilidades próprias." },
  ],
} as const;

export const contact = {
  eyebrow: "Contato",
  title: "Tem um problema que pode ser resolvido com software?",
  subtitle: "Vamos conversar.",
  lead: "Me conte o que está travando a operação hoje — respondo com o que dá para fazer e como eu abordaria.",
} as const;
