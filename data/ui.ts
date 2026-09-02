import type { L } from "@/lib/i18n";

/**
 * ────────────────────────────────────────────────────────────────────────────
 * Microcopy da interface.
 *
 * Tudo que antes estava escrito direto no JSX — rótulos de botão, títulos de
 * seção fixos, `aria-label`, textos de leitor de tela, 404. O critério para
 * morar aqui em vez de em `site.ts`/`projects.ts` é simples: isto é texto da
 * INTERFACE (ele existiria em qualquer portfólio), não conteúdo editorial
 * sobre o Matheus ou sobre um projeto.
 * ────────────────────────────────────────────────────────────────────────────
 */
export const ui = {
  header: {
    nav: { pt: "Navegação principal", en: "Main navigation" },
    navMobile: { pt: "Navegação principal (mobile)", en: "Main navigation (mobile)" },
    cta: { pt: "Vamos conversar", en: "Let's talk" },
    home: { pt: "ir para a página inicial", en: "go to the home page" },
    openMenu: { pt: "Abrir menu", en: "Open menu" },
    closeMenu: { pt: "Fechar menu", en: "Close menu" },
    themeToLight: { pt: "Ativar tema claro", en: "Switch to light theme" },
    themeToDark: { pt: "Ativar tema escuro", en: "Switch to dark theme" },
    /** O botão mostra o idioma ATIVO; o rótulo diz o que o clique faz. */
    languageToPt: { pt: "Mudar para português", en: "Switch to Portuguese" },
    languageToEn: { pt: "Mudar para inglês", en: "Switch to English" },
    skipToContent: { pt: "Pular para o conteúdo", en: "Skip to content" },
  },

  footer: {
    label: { pt: "Rodapé", en: "Footer" },
    navigation: { pt: "Navegação", en: "Navigation" },
    contact: { pt: "Contato", en: "Contact" },
  },

  profile: {
    specialties: { pt: "Especialidades", en: "Specialties" },
  },

  sections: {
    selectedProjects: { pt: "Projetos selecionados", en: "Selected projects" },
    featuredCase: { pt: "Case principal", en: "Featured case" },
  },

  projects: {
    eyebrow: { pt: "Projetos", en: "Projects" },
    pageTitle: {
      pt: "Problema, solução e o que foi construído.",
      en: "Problem, solution, and what was built.",
    },
    pageLead: {
      pt: "Cada projeto aqui resolve uma necessidade concreta. As tecnologias aparecem depois da história — primeiro o que precisava ser resolvido.",
      en: "Every project here solves a concrete need. The technologies come after the story — first, what had to be solved.",
    },
    viewCase: { pt: "Ver case completo", en: "View full case" },
    viewProject: { pt: "Ver projeto", en: "View project" },
    exploreCase: { pt: "Explorar case", en: "Explore case" },
    exploreProject: { pt: "Explorar projeto", en: "Explore project" },
    visitProject: { pt: "Visitar projeto", en: "Visit project" },
    liveProject: { pt: "Projeto em produção", en: "Live project" },
  },

  transformation: {
    /** Sufixo do eyebrow: "<nome do projeto> — a transformação". */
    suffix: { pt: "— a transformação", en: "— the transformation" },
  },

  case: {
    toc: { pt: "Sumário", en: "Contents" },
    tocLabel: { pt: "Sumário do case", en: "Case contents" },
    nextProject: { pt: "Próximo projeto", en: "Next project" },
    allProjects: { pt: "Todos os projetos", en: "All projects" },
    keepBrowsing: { pt: "Continuar navegando", en: "Keep browsing" },
    pending: { pt: "Seção em preparação", en: "Section in progress" },
  },

  media: {
    placeholder: { pt: "Placeholder de desenvolvimento", en: "Development placeholder" },
    professionalPhoto: { pt: "Foto profissional", en: "Professional photo" },
    /** `alt` do retrato: só o prefixo é traduzido; o nome é próprio. */
    portraitOf: { pt: "Retrato de", en: "Portrait of" },
    lightbox: { pt: "Visualização ampliada de screenshots", en: "Enlarged screenshot view" },
    lightboxClose: { pt: "Fechar visualização ampliada", en: "Close enlarged view" },
    lightboxPrev: { pt: "Screenshot anterior", en: "Previous screenshot" },
    lightboxNext: { pt: "Próxima screenshot", en: "Next screenshot" },
  },

  notFound: {
    code: { pt: "Erro 404", en: "Error 404" },
    title: { pt: "Esta página não existe.", en: "This page does not exist." },
    lead: {
      pt: "O endereço pode ter mudado ou o conteúdo ainda não foi publicado.",
      en: "The address may have changed, or the content has not been published yet.",
    },
    home: { pt: "Voltar ao início", en: "Back to home" },
    projects: { pt: "Ver projetos", en: "View projects" },
  },
} satisfies Record<string, Record<string, L | Record<string, L>>>;
