import type { L } from "@/lib/i18n";
import type { CaseBlock, Project } from "@/lib/types";

/**
 * ────────────────────────────────────────────────────────────────────────────
 * Projetos e cases.
 *
 * Regra de conteúdo: nada de métrica não comprovada. Enquanto não houver
 * número real, o texto descreve o que foi construído e o resultado qualitativo.
 *
 * ── Idiomas ────────────────────────────────────────────────────────────────
 * Texto de leitura é um par `{ pt, en }` (ver `lib/i18n.ts`). NÃO são
 * traduzidos: `slug`, `id` de bloco, `src`/dimensão de screenshot, `href`,
 * nomes próprios (PlatoTruck, tudoPrabarco) e nomes de tecnologia (Next.js,
 * PostgreSQL, Row Level Security…). Consumo sempre via `getContent()`
 * (`data/content.ts`), que devolve tudo já resolvido para um idioma.
 * ────────────────────────────────────────────────────────────────────────────
 */

export const projects: Project<L>[] = [
  /* ── 1. Sistema de Gestão PlatoTruck ─────────────────────────────────── */
  {
    slug: "sistema-platotruck",
    name: "Sistema de Gestão PlatoTruck",
    kind: { pt: "Sistema interno de gestão", en: "Internal management system" },
    role: { pt: "Desenvolvimento do sistema", en: "System development" },
    tagline: {
      pt: "De planilhas e processos manuais para uma operação de estoque centralizada e multiempresa.",
      en: "From spreadsheets and manual processes to a centralised, multi-company inventory operation.",
    },
    taglineHighlight: {
      pt: "centralizada e multiempresa",
      en: "centralised, multi-company",
    },
    summary: {
      pt: "Sistema web interno que centraliza estoque, movimentações, permissões e acompanhamento da operação de um grupo com cinco CNPJs relacionados.",
      en: "Internal web system that centralises inventory, stock movements, permissions, and operational tracking for a group of five related legal entities.",
    },
    featured: true,
    problem: {
      pt: "Parte importante do controle operacional e de estoque era feita em planilhas e processos manuais, com contagens manuais, informação descentralizada e divergências de estoque.",
      en: "A significant part of operational and inventory control ran on spreadsheets and manual processes, with manual counts, scattered information, and stock discrepancies.",
    },
    solution: {
      pt: "Um sistema web interno onde estoque, movimentações e acessos ficam em um único lugar, com escopo por empresa e histórico do que foi feito.",
      en: "An internal web system where inventory, stock movements, and access all live in one place, scoped by company and with a record of what was done.",
    },
    outcome: {
      pt: "O controle de estoque deixou de depender de planilhas paralelas: as movimentações passaram a ser registradas no sistema, com histórico e acesso por perfil.",
      en: "Inventory control no longer depends on parallel spreadsheets: movements are now recorded in the system, with history and role-based access.",
    },
    highlights: [
      { pt: "Estoque, inventário, locais e saldos", en: "Inventory, stock counts, locations, and balances" },
      { pt: "Entradas, retiradas e transferências com histórico", en: "Inbound, outbound, and transfers with history" },
      { pt: "Retirada por scanner", en: "Scanner-based picking" },
      { pt: "Operação multiempresa (5 CNPJs)", en: "Multi-company operation (5 legal entities)" },
      { pt: "Permissões e níveis de acesso", en: "Permissions and access levels" },
      { pt: "Dashboards e área comercial", en: "Dashboards and sales area" },
    ],
    /* Cada palavra vem de um grupo real em `case.blocks` (id "funcionalidades"). */
    tags: [
      { pt: "Multiempresa", en: "Multi-company" },
      { pt: "Estoque", en: "Inventory" },
      { pt: "Inventário", en: "Stock counts" },
      { pt: "Scanner", en: "Scanner" },
      { pt: "Permissões", en: "Permissions" },
    ],
    tech: [],
    links: [],
    cover: {
      src: "/1.png",
      alt: {
        pt: "Painel de visão geral do Sistema de Gestão PlatoTruck",
        en: "Overview dashboard of the PlatoTruck Management System",
      },
      caption: {
        pt: "Painel — visão geral da operação da empresa selecionada.",
        en: "Dashboard — overview of the selected company's operation.",
      },
      frame: "desktop",
      width: 1906,
      height: 947,
    },
    case: {
      intro: [
        {
          pt: "O Sistema de Gestão PlatoTruck é um sistema web interno desenvolvido para centralizar o controle operacional e de estoque de um grupo de empresas relacionadas.",
          en: "The PlatoTruck Management System is an internal web system built to centralise operational and inventory control for a group of related companies.",
        },
        {
          pt: "É o projeto em que a transformação aparece de forma mais clara: a operação saiu de planilhas e conferências manuais para um sistema único, com registro de movimentações, escopo por empresa e acesso controlado por perfil.",
          en: "It is the project where the shift is clearest: the operation moved from spreadsheets and manual checks to a single system, with recorded movements, company-level scoping, and role-controlled access.",
        },
      ],
      blocks: [
        {
          kind: "prose",
          id: "contexto",
          title: { pt: "Contexto", en: "Context" },
          paragraphs: [
            {
              pt: "A operação envolve cinco CNPJs relacionados, que compartilham rotinas de estoque e precisam ser acompanhados tanto separadamente quanto no conjunto.",
              en: "The operation spans five related legal entities that share inventory routines and need to be tracked both separately and as a whole.",
            },
            {
              pt: "Esse arranjo é comum e raramente cabe em um software genérico: cada empresa tem seus próprios produtos, saldos e movimentações, mas as pessoas transitam entre elas no dia a dia. Qualquer solução precisava tratar a empresa como parte do contexto de uso, e não como um filtro opcional.",
              en: "This arrangement is common and rarely fits off-the-shelf software: each company has its own products, balances, and movements, yet people move between them daily. Any solution had to treat the company as part of the working context, not as an optional filter.",
            },
          ],
        },
        {
          kind: "list",
          id: "problema",
          title: { pt: "O problema", en: "The problem" },
          intro: {
            pt: "Antes do sistema, o controle acontecia principalmente em planilhas e processos manuais. Isso trazia um conjunto de problemas conhecidos:",
            en: "Before the system, control ran mostly on spreadsheets and manual processes. That brought a familiar set of problems:",
          },
          variant: "plain",
          items: [
            {
              title: { pt: "Contagens manuais", en: "Manual counts" },
              description: {
                pt: "Conferência de estoque dependente de trabalho repetido e sujeito a erro.",
                en: "Stock checks depending on repeated, error-prone work.",
              },
            },
            {
              title: { pt: "Divergências de estoque", en: "Stock discrepancies" },
              description: {
                pt: "O que estava registrado nem sempre correspondia ao que existia fisicamente.",
                en: "What was recorded did not always match what was physically there.",
              },
            },
            {
              title: { pt: "Informação descentralizada", en: "Scattered information" },
              description: {
                pt: "Dados em arquivos e lugares diferentes, sem uma fonte única de consulta.",
                en: "Data across different files and places, with no single source to consult.",
              },
            },
            {
              title: { pt: "Movimentações difíceis de acompanhar", en: "Movements hard to track" },
              description: {
                pt: "Sem histórico consolidado, reconstruir o que aconteceu exigia investigação.",
                en: "With no consolidated history, reconstructing what happened took investigation.",
              },
            },
            {
              title: { pt: "Operação com múltiplas empresas", en: "Multi-company operation" },
              description: {
                pt: "Controlar CNPJs diferentes em planilhas separadas multiplica o trabalho e o risco.",
                en: "Controlling separate entities in separate spreadsheets multiplies both work and risk.",
              },
            },
          ],
        },
        {
          kind: "beforeAfter",
          id: "antes-e-depois",
          title: { pt: "Como funcionava antes", en: "How it worked before" },
          intro: {
            pt: "A comparação abaixo descreve a mudança de forma de trabalho — não resultados numéricos, que serão adicionados quando houver medição.",
            en: "The comparison below describes a change in how the work is done — not numeric results, which will be added once there is measurement.",
          },
          before: {
            label: { pt: "Antes", en: "Before" },
            items: [
              { pt: "Controle apoiado em planilhas e processos manuais", en: "Control resting on spreadsheets and manual processes" },
              { pt: "Contagem e conferência manuais", en: "Manual counting and checking" },
              { pt: "Informação espalhada entre arquivos e responsáveis", en: "Information scattered across files and people" },
              { pt: "Movimentações sem histórico consolidado", en: "Movements with no consolidated history" },
              { pt: "Cada empresa controlada separadamente", en: "Each company controlled separately" },
              { pt: "Acesso à informação sem distinção de perfil", en: "Access to information with no role distinction" },
            ],
          },
          after: {
            label: { pt: "Com o sistema", en: "With the system" },
            items: [
              { pt: "Estoque e movimentações registrados em um sistema único", en: "Inventory and movements recorded in a single system" },
              { pt: "Entradas, retiradas e transferências com registro", en: "Inbound, outbound, and transfers all recorded" },
              { pt: "Consulta centralizada de produtos, locais e saldos", en: "Centralised lookup of products, locations, and balances" },
              { pt: "Histórico de movimentações disponível para conferência", en: "Movement history available for review" },
              { pt: "Empresa selecionada dentro do próprio sistema, com escopo aplicado aos dados", en: "Company selected inside the system, with scoping applied to the data" },
              { pt: "Permissões e níveis de acesso por usuário", en: "Per-user permissions and access levels" },
            ],
          },
        },
        {
          kind: "prose",
          id: "solucao",
          title: { pt: "A solução", en: "The solution" },
          paragraphs: [
            {
              pt: "Foi desenvolvido um sistema web interno para concentrar a operação: cadastro de produtos, locais de estoque, saldos, movimentações e os acessos de quem usa o sistema.",
              en: "An internal web system was built to bring the operation together: product records, stock locations, balances, movements, and the access rights of everyone who uses it.",
            },
            {
              pt: "A ideia central é simples: toda alteração de estoque acontece dentro do sistema e fica registrada. A partir disso, deixa de existir a etapa de reconciliar planilhas — a consulta e o histórico saem do mesmo lugar em que a operação é executada.",
              en: "The core idea is simple: every stock change happens inside the system and is recorded. From there, the step of reconciling spreadsheets disappears — lookups and history come from the same place where the work is done.",
            },
            {
              pt: "Sobre essa base foram construídas as funcionalidades que o dia a dia exigia: inventário, transferência entre locais, retirada rápida por scanner, dashboards e a área comercial.",
              en: "On that base came the features daily work demanded: stock counts, transfers between locations, fast scanner-based picking, dashboards, and the sales area.",
            },
          ],
        },
        {
          kind: "groups",
          id: "funcionalidades",
          title: { pt: "Principais funcionalidades", en: "Key features" },
          intro: {
            pt: "O sistema conta atualmente, entre outras funcionalidades, com:",
            en: "The system currently includes, among other features:",
          },
          groups: [
            {
              label: { pt: "Acesso e usuários", en: "Access and users" },
              items: [
                { pt: "Autenticação", en: "Authentication" },
                { pt: "Cadastro e gestão de usuários", en: "User records and management" },
                { pt: "Sistema de permissões", en: "Permission system" },
                { pt: "Diferentes níveis de acesso", en: "Multiple access levels" },
              ],
            },
            {
              label: { pt: "Estoque", en: "Inventory" },
              items: [
                { pt: "Cadastro de produtos", en: "Product records" },
                { pt: "Locais de estoque", en: "Stock locations" },
                { pt: "Saldos", en: "Balances" },
                { pt: "Inventário", en: "Stock counts" },
                { pt: "Gestão de estoque", en: "Inventory management" },
              ],
            },
            {
              label: { pt: "Movimentação", en: "Stock movement" },
              items: [
                { pt: "Entradas e retiradas", en: "Inbound and outbound" },
                { pt: "Transferência de estoque", en: "Stock transfers" },
                { pt: "Scanner para retirada rápida de produtos", en: "Scanner for fast product picking" },
                { pt: "Histórico de movimentações", en: "Movement history" },
              ],
            },
            {
              label: { pt: "Multiempresa", en: "Multi-company" },
              items: [
                { pt: "Operação com 5 CNPJs relacionados", en: "Operation across 5 related legal entities" },
                { pt: "Seleção de empresa dentro do sistema", en: "Company selection inside the system" },
                { pt: "Dados e funcionalidades no escopo da empresa selecionada", en: "Data and features scoped to the selected company" },
              ],
            },
            {
              label: { pt: "Acompanhamento", en: "Tracking" },
              items: [
                { pt: "Dashboards", en: "Dashboards" },
                { pt: "Funcionalidades comerciais", en: "Sales features" },
                { pt: "Área de competição e acompanhamento de vendedores", en: "Sales-team leaderboard and tracking area" },
              ],
            },
          ],
        },
        {
          kind: "screenshots",
          id: "tela-sistema",
          title: { pt: "O sistema", en: "The system" },
          layout: "single",
          items: [
            {
              src: "/screenshots/sistema/06.png",
              alt: {
                pt: "Dashboard do Sistema de Gestão PlatoTruck",
                en: "Dashboard of the PlatoTruck Management System",
              },
              caption: {
                pt: "Dashboard — visão geral da operação da empresa selecionada.",
                en: "Dashboard — overview of the selected company's operation.",
              },
              frame: "desktop",
              width: 1891,
              height: 953,
            },
          ],
        },
        {
          kind: "prose",
          id: "multiempresa",
          title: { pt: "Multiempresa", en: "Multi-company" },
          paragraphs: [
            {
              pt: "A operação envolve cinco CNPJs relacionados. Em vez de manter um ambiente separado por empresa, o sistema trabalha com seleção de empresa: o usuário escolhe dentro do próprio sistema com qual empresa está operando.",
              en: "The operation spans five related legal entities. Rather than keeping a separate environment per company, the system works with company selection: the user chooses, inside the system, which company they are working in.",
            },
            {
              pt: "A empresa selecionada define o escopo do que é exibido e do que pode ser feito — dados e funcionalidades respeitam esse contexto. Isso mantém a operação separada onde precisa ser separada, sem obrigar a pessoa a trocar de sistema para trabalhar.",
              en: "The selected company defines the scope of what is shown and what can be done — data and features honour that context. It keeps the operation separate where separation matters, without forcing anyone to switch systems to get work done.",
            },
          ],
        },
        {
          kind: "screenshots",
          id: "tela-multiempresa",
          title: { pt: "Seleção de empresa", en: "Company selection" },
          layout: "device",
          items: [
            {
              src: "/screenshots/sistema/08.png",
              alt: {
                pt: "Seletor de empresa no Sistema de Gestão PlatoTruck",
                en: "Company selector in the PlatoTruck Management System",
              },
              caption: {
                pt: "Troca de empresa dentro do sistema, sem precisar sair para outro ambiente.",
                en: "Switching companies inside the system, without leaving for another environment.",
              },
              frame: "mobile",
              width: 253,
              height: 495,
            },
          ],
        },
        {
          kind: "prose",
          id: "estoque",
          title: { pt: "Estoque e operação", en: "Inventory and operation" },
          paragraphs: [
            {
              pt: "O estoque é organizado por produto, local e saldo, e é alterado por movimentações registradas: entradas, retiradas e transferências entre locais. O inventário apoia a conferência do que está registrado contra o que existe fisicamente.",
              en: "Inventory is organised by product, location, and balance, and changes only through recorded movements: inbound, outbound, and transfers between locations. Stock counts support checking what is recorded against what is physically there.",
            },
            {
              pt: "Cada movimentação alimenta o histórico, que permite acompanhar o que foi movimentado, por quem e em qual empresa.",
              en: "Every movement feeds the history, which makes it possible to trace what moved, who moved it, and in which company.",
            },
          ],
        },
        {
          kind: "screenshots",
          id: "tela-estoque",
          title: { pt: "Produtos e movimentações", en: "Products and movements" },
          layout: "single",
          items: [
            {
              src: "/screenshots/sistema/10.png",
              alt: {
                pt: "Tela de cadastro de produtos e inventário",
                en: "Product records and stock count screen",
              },
              caption: {
                pt: "Produtos e inventário — saldos por local.",
                en: "Products and stock counts — balances by location.",
              },
              frame: "desktop",
              width: 1887,
              height: 944,
            },
            {
              src: "/screenshots/sistema/10.1.png",
              alt: {
                pt: "Tela de histórico de movimentações, entradas e transferências",
                en: "Movement history screen with inbound and transfers",
              },
              caption: {
                pt: "Movimentações — entradas, retiradas e transferências entre locais.",
                en: "Movements — inbound, outbound, and transfers between locations.",
              },
              frame: "desktop",
              width: 1889,
              height: 933,
            },
          ],
        },
        {
          kind: "prose",
          id: "scanner",
          title: { pt: "Scanner", en: "Scanner" },
          paragraphs: [
            {
              pt: "Para a retirada de produtos existe um fluxo com scanner, pensado para o uso no dia a dia: a leitura do código identifica o produto e evita a digitação manual dos itens durante a operação.",
              en: "Product picking has a scanner flow built for everyday use: reading the code identifies the product and removes manual typing of items during the operation.",
            },
          ],
        },
        {
          kind: "screenshots",
          id: "tela-scanner",
          title: { pt: "Retirada por scanner", en: "Scanner-based picking" },
          layout: "single",
          items: [
            {
              src: "/screenshots/sistema/12.png",
              alt: {
                pt: "Tela de retirada rápida de produtos por QR Code",
                en: "Fast product picking screen using QR codes",
              },
              caption: {
                pt: "Retirada rápida — leitura por QR Code ou busca manual antes de finalizar.",
                en: "Fast picking — QR code scan or manual search before confirming.",
              },
              frame: "desktop",
              width: 1904,
              height: 944,
            },
          ],
        },
        {
          kind: "prose",
          id: "usuarios-e-permissoes",
          title: { pt: "Usuários e permissões", en: "Users and permissions" },
          paragraphs: [
            {
              pt: "O sistema tem autenticação, cadastro de usuários e um sistema de permissões com diferentes níveis de acesso. Nem todo mundo que usa o sistema precisa — ou deve — enxergar tudo.",
              en: "The system has authentication, user records, and a permission system with multiple access levels. Not everyone who uses it needs — or should — see everything.",
            },
            {
              pt: "As permissões trabalham junto com o contexto de empresa: o que um usuário acessa depende do seu nível e da empresa selecionada. É esse par que define o recorte de dados e de funcionalidades disponíveis.",
              en: "Permissions work together with the company context: what a user reaches depends on both their level and the selected company. That pair is what defines the slice of data and features available.",
            },
          ],
        },
        {
          kind: "screenshots",
          id: "tela-permissoes",
          title: { pt: "Níveis de acesso", en: "Access levels" },
          layout: "single",
          items: [
            {
              src: "/screenshots/sistema/14.png",
              alt: {
                pt: "Tela de criação de usuário, perfis e empresas permitidas",
                en: "User creation screen with roles and permitted companies",
              },
              caption: {
                pt: "Criação de usuário — perfis, setores e empresas permitidas.",
                en: "User creation — roles, departments, and permitted companies.",
              },
              frame: "desktop",
              width: 1885,
              height: 942,
            },
          ],
        },
        {
          kind: "prose",
          id: "seguranca",
          title: { pt: "Segurança", en: "Security" },
          paragraphs: [
            {
              pt: "O sistema aplica controles de segurança no frontend, no backend e no banco de dados, com a validação de acesso e de regras acontecendo no servidor — a interface esconde o que não deve aparecer, mas não é ela que autoriza a operação.",
              en: "The system applies security controls in the frontend, the backend, and the database, with access and rule validation happening on the server — the interface hides what should not appear, but it is not what authorises the operation.",
            },
            {
              pt: "Uma descrição detalhada e verificada dos controles será publicada aqui após uma auditoria técnica específica do sistema. Até lá, prefiro não listar garantias que ainda não foram revisadas item a item.",
              en: "A detailed, verified description of these controls will be published here after a dedicated technical audit of the system. Until then, I would rather not list guarantees that have not been reviewed item by item.",
            },
          ],
        },
        {
          kind: "list",
          id: "decisoes-tecnicas",
          title: { pt: "Decisões técnicas", en: "Technical decisions" },
          variant: "plain",
          intro: {
            pt: "O sistema foi construído para atender uma operação real, com múltiplas empresas, diferentes perfis de acesso e movimentações de estoque que precisam manter consistência e rastreabilidade.",
            en: "The system was built for a real operation, with multiple companies, different access profiles, and stock movements that must stay consistent and traceable.",
          },
          items: [
            {
              title: { pt: "Arquitetura multiempresa", en: "Multi-company architecture" },
              description: {
                pt: "O acesso aos dados é condicionado às empresas liberadas para cada usuário. A empresa selecionada define o escopo das operações, evitando que informações de unidades diferentes sejam misturadas durante consultas e movimentações.",
                en: "Data access is conditioned on the companies each user is cleared for. The selected company defines the scope of operations, preventing information from different units mixing during lookups and movements.",
              },
            },
            {
              title: { pt: "Autorização em múltiplas camadas", en: "Multi-layer authorisation" },
              description: {
                pt: "As permissões não dependem apenas da interface. Regras de acesso também são validadas no servidor e no banco de dados, reduzindo o risco de uma ação ser executada apenas por manipulação do frontend.",
                en: "Permissions do not rest on the interface alone. Access rules are also validated on the server and in the database, reducing the risk of an action going through purely by manipulating the frontend.",
              },
            },
            {
              title: { pt: "Estoque baseado em movimentações", en: "Movement-based inventory" },
              description: {
                pt: "Em vez de tratar o estoque apenas como um número editável, entradas, retiradas e transferências são registradas como movimentações. Isso permite manter histórico, origem, destino e rastreabilidade das alterações de saldo.",
                en: "Instead of treating stock as an editable number, inbound, outbound, and transfers are recorded as movements. That preserves history, origin, destination, and traceability for every balance change.",
              },
            },
            {
              title: { pt: "Operações críticas com comportamento fail-closed", en: "Fail-closed behaviour on critical operations" },
              description: {
                pt: "Funcionalidades que ainda não estavam prontas para uso real foram bloqueadas por padrão. A decisão foi liberar módulos gradualmente, evitando que partes incompletas do sistema fossem utilizadas na operação.",
                en: "Features not yet ready for real use were blocked by default. The decision was to release modules gradually, keeping incomplete parts of the system out of live operation.",
              },
            },
            {
              title: { pt: "Processamento próximo ao banco", en: "Processing close to the database" },
              description: {
                pt: "Consultas mais pesadas, como filtros e indicadores do inventário, foram movidas para operações otimizadas no PostgreSQL através de RPCs e consultas específicas, reduzindo processamento desnecessário no cliente e melhorando o tempo de resposta.",
                en: "Heavier queries, such as stock-count filters and indicators, were moved into optimised PostgreSQL operations through RPCs and purpose-built queries, cutting unnecessary client-side work and improving response time.",
              },
            },
            {
              title: { pt: "Evolução sem perder rastreabilidade", en: "Evolving without losing traceability" },
              description: {
                pt: "Alterações importantes de estoque, migrações de saldos e ajustes operacionais foram estruturados para preservar histórico e permitir validação dos dados antes e depois das mudanças.",
                en: "Major stock changes, balance migrations, and operational adjustments were structured to preserve history and allow the data to be validated before and after each change.",
              },
            },
          ],
        },
        {
          kind: "list",
          id: "tecnologias",
          title: { pt: "Tecnologias", en: "Technologies" },
          variant: "plain",
          items: [
            {
              title: { pt: "Next.js", en: "Next.js" },
              description: {
                pt: "Estrutura principal da aplicação web, utilizando App Router para organização das páginas e fluxos do sistema.",
                en: "Main structure of the web application, using the App Router to organise the system's pages and flows.",
              },
            },
            {
              title: { pt: "React", en: "React" },
              description: {
                pt: "Construção das interfaces e componentes utilizados nos módulos operacionais.",
                en: "Building the interfaces and components used across the operational modules.",
              },
            },
            {
              title: { pt: "TypeScript", en: "TypeScript" },
              description: {
                pt: "Tipagem da aplicação e dos principais fluxos de dados, reduzindo inconsistências durante o desenvolvimento.",
                en: "Typing the application and its main data flows, reducing inconsistencies during development.",
              },
            },
            {
              title: { pt: "Supabase", en: "Supabase" },
              description: {
                pt: "Infraestrutura de backend utilizada para autenticação, banco de dados e integração entre a aplicação e os dados operacionais.",
                en: "Backend infrastructure for authentication, database, and the link between the application and operational data.",
              },
            },
            {
              title: { pt: "PostgreSQL", en: "PostgreSQL" },
              description: {
                pt: "Banco relacional responsável pelos produtos, saldos, movimentações, usuários, empresas, permissões e demais dados do sistema.",
                en: "Relational database holding products, balances, movements, users, companies, permissions, and the rest of the system's data.",
              },
            },
            {
              title: { pt: "Row Level Security", en: "Row Level Security" },
              description: {
                pt: "Políticas de segurança no banco utilizadas como uma camada adicional de controle de acesso aos dados.",
                en: "Database-level security policies used as an additional layer of data access control.",
              },
            },
            {
              title: { pt: "PostgreSQL RPC", en: "PostgreSQL RPC" },
              description: {
                pt: "Funções utilizadas para operações e consultas que exigem maior controle, consistência ou desempenho diretamente no banco.",
                en: "Functions used for operations and queries that need tighter control, consistency, or performance directly in the database.",
              },
            },
            {
              title: { pt: "Vercel", en: "Vercel" },
              description: {
                pt: "Hospedagem e entrega da aplicação web em produção.",
                en: "Hosting and delivery of the web application in production.",
              },
            },
          ],
        },
        {
          kind: "list",
          id: "resultados",
          title: { pt: "Resultados", en: "Results" },
          intro: {
            pt: "Resultados descritos de forma qualitativa. Números só entram aqui quando houver medição real da operação.",
            en: "Results described qualitatively. Numbers only appear here once the operation has been properly measured.",
          },
          variant: "plain",
          items: [
            {
              title: { pt: "Controle fora das planilhas", en: "Control out of spreadsheets" },
              description: {
                pt: "O estoque passou a ser controlado dentro do sistema, no mesmo lugar em que a operação acontece.",
                en: "Inventory is now controlled inside the system, in the same place the work happens.",
              },
            },
            {
              title: { pt: "Movimentações registradas", en: "Movements on record" },
              description: {
                pt: "Entradas, retiradas e transferências ficam registradas e podem ser consultadas no histórico.",
                en: "Inbound, outbound, and transfers are recorded and can be looked up in the history.",
              },
            },
            {
              title: { pt: "Informação centralizada", en: "Centralised information" },
              description: {
                pt: "Produtos, locais e saldos deixaram de estar espalhados entre arquivos e responsáveis.",
                en: "Products, locations, and balances are no longer scattered across files and people.",
              },
            },
            {
              title: { pt: "Operação multiempresa em um só ambiente", en: "Multi-company operation in one environment" },
              description: {
                pt: "Os cinco CNPJs são operados no mesmo sistema, com dados e funcionalidades no escopo da empresa selecionada.",
                en: "All five entities are run in the same system, with data and features scoped to the selected company.",
              },
            },
            {
              title: { pt: "Menos digitação na retirada", en: "Less typing when picking" },
              description: {
                pt: "A retirada por scanner identifica o produto pela leitura do código, sem digitação manual dos itens.",
                en: "Scanner-based picking identifies the product by reading its code, with no manual entry of items.",
              },
            },
          ],
        },
      ],
    },
  },

  /* ── 2. tudoPrabarco ─────────────────────────────────────────────────── */
  {
    slug: "tudoprabarco",
    name: "tudoPrabarco",
    kind: { pt: "Plataforma web", en: "Web platform" },
    role: { pt: "Desenvolvimento Full Stack", en: "Full Stack Development" },
    tagline: {
      pt: "Plataforma e marketplace digital do setor náutico.",
      en: "Digital platform and marketplace for the boating industry.",
    },
    summary: {
      pt: "Atuação Full Stack em uma plataforma que conecta usuários e empresas do setor náutico: cadastro, catálogo de prestadores, buscas, avaliações, chat e pagamentos.",
      en: "Full Stack work on a platform connecting users and companies in the boating industry: sign-up, service-provider directory, search, reviews, chat, and payments.",
    },
    featured: false,
    problem: {
      pt: "Conectar usuários e prestadores do setor náutico em uma plataforma única, com cadastro, busca, comunicação e pagamento.",
      en: "Connecting users and service providers in the boating industry on a single platform, with sign-up, search, messaging, and payment.",
    },
    solution: {
      pt: "Desenvolvimento Full Stack da plataforma, do modelo de dados e das permissões até as telas de catálogo, busca e chat.",
      en: "Full Stack development of the platform, from the data model and permissions through to the directory, search, and chat screens.",
    },
    outcome: {
      pt: "Plataforma com cadastro de usuários e empresas, catálogo de prestadores, buscas e filtros, avaliações, chat, integrações com APIs e pagamentos.",
      en: "A platform with user and company sign-up, a service-provider directory, search and filters, reviews, chat, API integrations, and payments.",
    },
    highlights: [
      { pt: "Cadastro de usuários e empresas", en: "User and company sign-up" },
      { pt: "Catálogo de prestadores", en: "Service-provider directory" },
      { pt: "Buscas e filtros", en: "Search and filters" },
      { pt: "Avaliações e chat", en: "Reviews and chat" },
      { pt: "Integrações e pagamentos", en: "Integrations and payments" },
    ],
    tech: ["React", "Next.js", "TypeScript", "Node.js", "NestJS", "PostgreSQL", "Supabase"],
    links: [], // TODO: adicionar link público, se houver.
    cover: {
      src: "/5.png",
      alt: {
        pt: "Página inicial da plataforma tudoPrabarco",
        en: "tudoPrabarco platform home page",
      },
      caption: {
        pt: "Página inicial — busca e categorias de serviços náuticos.",
        en: "Home page — search and categories of boating services.",
      },
      frame: "desktop",
      width: 1904,
      height: 945,
    },
    case: {
      intro: [
        {
          pt: "tudoPrabarco é uma plataforma e marketplace digital do setor náutico, onde usuários e empresas se encontram, se comunicam e fecham serviços.",
          en: "tudoPrabarco is a digital platform and marketplace for the boating industry, where users and companies find each other, talk, and close on services.",
        },
        {
          pt: "Minha atuação foi end-to-end, acompanhando a construção do produto da experiência e das interfaces às funcionalidades, integrações e camadas de dados que sustentam seus fluxos.",
          en: "My involvement was end-to-end, following the product from experience and interfaces through to the features, integrations, and data layers that hold its flows together.",
        },
      ],
      blocks: [
        {
          kind: "prose",
          id: "contexto",
          title: { pt: "Contexto", en: "Context" },
          paragraphs: [
            {
              pt: "A plataforma reúne, em um mesmo produto, cadastro e gestão de usuários e empresas, um catálogo de prestadores e as funcionalidades que sustentam a relação entre as duas pontas: busca, avaliação, conversa e pagamento.",
              en: "The platform brings together, in one product, user and company registration and management, a service-provider directory, and the features that hold both sides together: search, reviews, messaging, and payment.",
            },
            {
              pt: "Um produto com esse formato exige atenção a permissões desde o início: usuário, empresa e prestador acessam coisas diferentes, e as regras precisam valer no servidor e na camada de dados.",
              en: "A product shaped like this demands attention to permissions from the start: users, companies, and providers reach different things, and the rules have to hold on the server and in the data layer.",
            },
          ],
        },
        {
          kind: "prose",
          id: "atuacao-no-projeto",
          title: { pt: "Atuação no projeto", en: "My role on the project" },
          paragraphs: [
            {
              pt: "Participei da construção do tudoPrabarco como produto, não apenas de telas isoladas. O trabalho atravessou a definição e implementação dos fluxos usados por usuários e empresas, a construção das interfaces e as integrações necessárias para que cadastro, descoberta, comunicação e operação funcionassem de ponta a ponta.",
              en: "I worked on tudoPrabarco as a product, not as a set of isolated screens. The work ran across defining and implementing the flows used by users and companies, building the interfaces, and wiring the integrations needed for sign-up, discovery, messaging, and day-to-day operation to work end to end.",
            },
          ],
        },
        {
          kind: "groups",
          id: "atuacao",
          title: { pt: "Áreas em que atuei", en: "Areas I worked on" },
          groups: [
            {
              label: { pt: "Produto", en: "Product" },
              items: [
                { pt: "Cadastro e gestão de usuários e empresas", en: "User and company registration and management" },
                { pt: "Catálogo de prestadores", en: "Service-provider directory" },
                { pt: "Buscas e filtros", en: "Search and filters" },
                { pt: "Avaliações", en: "Reviews" },
                { pt: "Chat", en: "Chat" },
              ],
            },
            {
              label: { pt: "Plataforma", en: "Platform" },
              items: [
                { pt: "Autenticação", en: "Authentication" },
                { pt: "Permissões", en: "Permissions" },
                { pt: "Row Level Security (RLS)", en: "Row Level Security (RLS)" },
                { pt: "Integrações com APIs", en: "API integrations" },
                { pt: "Pagamentos", en: "Payments" },
              ],
            },
            {
              label: { pt: "Desenvolvimento", en: "Development" },
              items: [
                { pt: "Desenvolvimento Full Stack", en: "Full Stack development" },
                { pt: "Diagnóstico e correção de problemas", en: "Diagnosing and fixing issues" },
                { pt: "Versionamento com Git", en: "Version control with Git" },
              ],
            },
          ],
        },
        {
          kind: "screenshots",
          id: "explorar-plataforma",
          title: { pt: "Explorar a plataforma", en: "Exploring the platform" },
          intro: {
            pt: "A descoberta reúne busca, filtros e catálogo de empresas em um mesmo fluxo, ajudando o usuário a navegar pela oferta de serviços náuticos.",
            en: "Discovery brings search, filters, and the company directory into a single flow, helping users navigate the range of boating services on offer.",
          },
          layout: "single",
          items: [
            {
              src: "/screenshots/tudoprabarco/05.png",
              alt: {
                pt: "Tela de busca de empresas náuticas com filtros e catálogo de prestadores",
                en: "Search screen for boating companies with filters and provider directory",
              },
              caption: {
                pt: "Explorar — busca, filtros e catálogo de empresas náuticas.",
                en: "Explore — search, filters, and directory of boating companies.",
              },
              frame: "desktop",
              width: 1891,
              height: 940,
            },
          ],
        },
        {
          kind: "screenshots",
          id: "categorias-e-descoberta",
          title: { pt: "Categorias e descoberta", en: "Categories and discovery" },
          intro: {
            pt: "As categorias organizam a navegação por necessidade e dão continuidade ao fluxo de descoberta iniciado na busca.",
            en: "Categories organise browsing by need and carry on the discovery flow that starts with search.",
          },
          layout: "single",
          items: [
            {
              src: "/screenshots/tudoprabarco/05.01.png",
              alt: {
                pt: "Tela com categorias de serviços náuticos organizadas em uma grade visual",
                en: "Screen showing boating service categories laid out in a visual grid",
              },
              caption: {
                pt: "Categorias — serviços organizados por necessidade da embarcação.",
                en: "Categories — services organised by what the boat needs.",
              },
              frame: "desktop",
              width: 1887,
              height: 940,
            },
          ],
        },
        {
          kind: "screenshots",
          id: "acesso-a-plataforma",
          title: { pt: "Acesso à plataforma", en: "Getting into the platform" },
          intro: {
            pt: "O fluxo de entrada também faz parte do produto, com criação de conta por e-mail ou autenticação pelo Google.",
            en: "The entry flow is part of the product too, with account creation by email or authentication through Google.",
          },
          layout: "single",
          items: [
            {
              src: "/screenshots/tudoprabarco/1.png",
              alt: {
                pt: "Tela de criação de conta do tudoPrabarco com cadastro por e-mail e Google",
                en: "tudoPrabarco account creation screen with email and Google sign-up",
              },
              caption: {
                pt: "Criar conta — cadastro por e-mail ou autenticação pelo Google.",
                en: "Create account — sign up by email or authenticate with Google.",
              },
              frame: "desktop",
              width: 1900,
              height: 942,
            },
          ],
        },
        {
          kind: "prose",
          id: "dados-e-acesso",
          title: { pt: "Dados e controle de acesso", en: "Data and access control" },
          paragraphs: [
            {
              pt: "A base de dados é PostgreSQL, com Supabase na autenticação e no acesso aos dados. Parte do controle de acesso é aplicada com RLS, mantendo a restrição na própria camada de dados além das verificações da aplicação.",
              en: "The database is PostgreSQL, with Supabase handling authentication and data access. Part of the access control is applied with RLS, keeping the restriction in the data layer itself on top of the application's own checks.",
            },
            {
              pt: "Esse arranjo é útil em um produto com perfis distintos: o registro de um usuário não fica acessível apenas porque uma tela deixou de filtrar corretamente.",
              en: "That arrangement pays off in a product with distinct roles: a user's record does not become reachable just because a screen failed to filter properly.",
            },
          ],
        },
        {
          kind: "tech",
          id: "tecnologias",
          title: { pt: "Tecnologias", en: "Technologies" },
          groups: [
            { label: { pt: "Frontend", en: "Frontend" }, items: ["React", "Next.js", "TypeScript"] },
            { label: { pt: "Backend", en: "Backend" }, items: ["Node.js", "NestJS"] },
            { label: { pt: "Dados", en: "Data" }, items: ["PostgreSQL", "Supabase", "RLS"] },
            { label: { pt: "Ferramentas", en: "Tooling" }, items: ["Git / GitHub"] },
          ],
        },

        {
          kind: "results",
          id: "resultados",
          title: { pt: "Resultados", en: "Results" },
          items: [
            {
              label: { pt: "Plataforma completa", en: "Complete platform" },
              title: {
                pt: "Plataforma construída de ponta a ponta",
                en: "A platform built end to end",
              },
              description: {
                pt: "O projeto evoluiu para uma plataforma web completa, conectando usuários, empresas e prestadores de serviços dentro de uma mesma experiência digital.",
                en: "The project grew into a complete web platform, connecting users, companies, and service providers inside a single digital experience.",
              },
            },
            {
              label: { pt: "Jornada integrada", en: "Integrated journey" },
              title: {
                pt: "Jornada integrada do usuário",
                en: "An integrated user journey",
              },
              description: {
                pt: "Fluxos de cadastro, autenticação, descoberta por categorias, busca e navegação foram estruturados para funcionar como partes de um único produto, e não como páginas isoladas.",
                en: "Sign-up, authentication, category discovery, search, and browsing were structured to work as parts of one product rather than as isolated pages.",
              },
            },
            {
              label: { pt: "Base para evolução", en: "Base for growth" },
              title: {
                pt: "Base técnica para evolução do produto",
                en: "A technical base the product can grow on",
              },
              description: {
                pt: "A aplicação foi estruturada com frontend, backend, banco de dados e controle de acesso integrados, permitindo que novas funcionalidades fossem incorporadas sem reconstruir a base do sistema.",
                en: "The application was structured with frontend, backend, database, and access control integrated, so new features could be added without rebuilding the system's foundation.",
              },
            },
            {
              label: { pt: "Atuação end-to-end", en: "End-to-end involvement" },
              title: {
                pt: "Participação end-to-end",
                en: "End-to-end participation",
              },
              description: {
                pt: "Atuei nas diferentes camadas da plataforma, desde interfaces e experiência do usuário até regras de negócio, APIs, dados e integrações, acompanhando a evolução do produto de forma ampla.",
                en: "I worked across the platform's layers, from interfaces and user experience through to business rules, APIs, data, and integrations, following the product's evolution broadly.",
              },
            },
          ],
        },
      ],
    },
  },

  /* ── 3. PlatoTruck.com ───────────────────────────────────────────────── */
  {
    slug: "platotruck-site",
    name: "PlatoTruck.com",
    kind: { pt: "Site institucional", en: "Company website" },
    role: { pt: "Desenvolvimento web", en: "Web development" },
    tagline: {
      pt: "Site institucional da PlatoTruck.",
      en: "PlatoTruck's company website.",
    },
    summary: {
      pt: "Site institucional desenvolvido para a PlatoTruck, com foco em apresentação da empresa e comportamento responsivo.",
      en: "Company website built for PlatoTruck, focused on presenting the business and behaving well at every screen size.",
    },
    featured: false,
    problem: {
      pt: "Dar à PlatoTruck uma presença institucional própria na web, com apresentação clara da empresa.",
      en: "Giving PlatoTruck a web presence of its own, with a clear presentation of the business.",
    },
    solution: {
      pt: "Desenvolvimento do site institucional, com estrutura de conteúdo e layout responsivo.",
      en: "Development of the company website, with a content structure and a responsive layout.",
    },
    outcome: {
      pt: "Site institucional em funcionamento, adaptado a diferentes tamanhos de tela.",
      en: "A live company website that adapts to different screen sizes.",
    },
    highlights: [
      { pt: "Site institucional", en: "Company website" },
      { pt: "Layout responsivo", en: "Responsive layout" },
      { pt: "Estrutura de conteúdo", en: "Content structure" },
    ],
    tech: [],
    links: [], // TODO: adicionar a URL do site.
    cover: {
      src: "/4.png",
      alt: {
        pt: "Página inicial do site PlatoTruck.com",
        en: "Home page of the PlatoTruck.com website",
      },
      caption: { pt: "Home do site institucional.", en: "Home page of the company website." },
      frame: "desktop",
      width: 1893,
      height: 938,
    },
    case: {
      intro: [
        {
          pt: "PlatoTruck.com é o site institucional da PlatoTruck — a presença pública da mesma empresa para a qual desenvolvi o sistema interno de gestão.",
          en: "PlatoTruck.com is PlatoTruck's company website — the public face of the same business I built the internal management system for.",
        },
        {
          pt: "É um projeto menor em escopo do que um sistema, mas com uma exigência própria: representar uma empresa real, funcionar bem em qualquer tela e sustentar o conteúdo institucional sem depender de manutenção constante.",
          en: "It is smaller in scope than a system, but it carries its own demand: representing a real company, working well on any screen, and holding the company's content without constant maintenance.",
        },
      ],
      blocks: [
        {
          kind: "prose",
          id: "escopo",
          title: { pt: "Escopo", en: "Scope" },
          paragraphs: [
            {
              pt: "Desenvolvimento do site institucional da empresa, com organização do conteúdo em páginas e seções e layout adaptado a desktop e mobile.",
              en: "Development of the company website, organising the content into pages and sections with a layout adapted to desktop and mobile.",
            },
          ],
        },
        {
          kind: "screenshots",
          id: "telas",
          title: { pt: "Telas", en: "Screens" },
          layout: "device",
          items: [
            {
              src: "/screenshots/platotruck/02.png",
              alt: {
                pt: "Página inicial do site PlatoTruck.com em desktop",
                en: "PlatoTruck.com home page on desktop",
              },
              caption: { pt: "Home — versão desktop.", en: "Home — desktop version." },
              frame: "desktop",
              width: 1889,
              height: 937,
            },
            {
              src: "/screenshots/platotruck/02.1.png",
              alt: {
                pt: "Página inicial do site PlatoTruck.com em mobile",
                en: "PlatoTruck.com home page on mobile",
              },
              caption: { pt: "Home — versão mobile.", en: "Home — mobile version." },
              frame: "mobile",
              width: 386,
              height: 844,
            },
          ],
        },
        {
          kind: "tech",
          id: "tecnologias",
          title: { pt: "Tecnologias", en: "Technologies" },
          groups: [
            { label: { pt: "Frontend", en: "Frontend" }, items: ["Next.js", "React", "TypeScript"] },
            { label: { pt: "Interface", en: "Interface" }, items: ["Tailwind CSS"] },
            { label: { pt: "Entrega", en: "Delivery" }, items: ["Vercel"] },
          ],
        },
        {
          kind: "results",
          id: "resultados",
          title: { pt: "Resultados", en: "Results" },
          wideLabels: true,
          items: [
            {
              label: { pt: "Presença digital", en: "Digital presence" },
              title: {
                pt: "Presença institucional estruturada",
                en: "A structured company presence",
              },
              description: {
                pt: "A empresa passou a contar com um site próprio para apresentar sua atuação, seus produtos e sua especialização no mercado de embreagens para linha pesada.",
                en: "The company now has a site of its own to present what it does, its products, and its specialisation in the heavy-duty clutch market.",
              },
            },
            {
              label: { pt: "Organização da informação", en: "Information architecture" },
              title: {
                pt: "Conteúdo organizado para o cliente",
                en: "Content organised for the customer",
              },
              description: {
                pt: "Produtos, informações institucionais e principais áreas da empresa foram estruturados em uma navegação clara, facilitando o entendimento sobre o que a PlatoTruck oferece.",
                en: "Products, company information, and the main areas of the business were structured into clear navigation, making it easier to understand what PlatoTruck offers.",
              },
            },
            {
              label: { pt: "Experiência responsiva", en: "Responsive experience" },
              title: {
                pt: "Experiência adaptada a diferentes telas",
                en: "An experience adapted to different screens",
              },
              description: {
                pt: "A interface foi desenvolvida para funcionar de forma consistente em desktop e dispositivos móveis, preservando hierarquia, conteúdo e facilidade de navegação.",
                en: "The interface was built to behave consistently on desktop and mobile, preserving hierarchy, content, and ease of navigation.",
              },
            },
            {
              label: { pt: "Base para evolução", en: "Base for growth" },
              title: {
                pt: "Base digital preparada para evolução",
                en: "A digital base ready to grow",
              },
              description: {
                pt: "O projeto criou uma estrutura própria para a presença digital da empresa, permitindo que novas páginas, produtos e conteúdos possam ser incorporados conforme o site evolui.",
                en: "The project created a structure of its own for the company's digital presence, so new pages, products, and content can be added as the site evolves.",
              },
            },
          ],
        },
      ],
    },
  },
];

/** Slugs para `generateStaticParams` — não depende de idioma. */
export const projectSlugs = projects.map((project) => project.slug);

/**
 * Copy curta de "Projetos selecionados" na home — independente da copy do
 * case completo (mesmo raciocínio de `heroProjects`): um texto próprio para
 * "bater o olho", com `slug` ligando ao projeto real em `projects`.
 *
 * A ORDEM deste array é a ordem de leitura da seção: PlatoTruck (projeto
 * principal) → PlatoTruck.com → tudoPrabarco.
 */
export const selectedProjects = [
  {
    slug: "sistema-platotruck",
    category: { pt: "Sistema interno", en: "Internal system" },
    description: {
      pt: "Sistema interno multiempresa para centralizar estoque, usuários, permissões e processos operacionais.",
      en: "Multi-company internal system centralising inventory, users, permissions, and operational processes.",
    },
    keywords: [
      { pt: "Multiempresa", en: "Multi-company" },
      { pt: "Estoque", en: "Inventory" },
      { pt: "Segurança", en: "Security" },
      { pt: "Dashboards", en: "Dashboards" },
    ],
    cta: { pt: "Explorar case", en: "Explore case" },
  },
  {
    slug: "platotruck-site",
    category: { pt: "Site institucional", en: "Company website" },
    description: {
      pt: "Site institucional desenvolvido para apresentar a empresa, seus produtos e sua atuação.",
      en: "Company website built to present the business, its products, and what it does.",
    },
    keywords: [
      { pt: "Next.js", en: "Next.js" },
      { pt: "Responsivo", en: "Responsive" },
      { pt: "Produtos", en: "Products" },
    ],
    cta: { pt: "Visitar projeto", en: "Visit project" },
  },
  {
    slug: "tudoprabarco",
    category: { pt: "Marketplace", en: "Marketplace" },
    description: {
      pt: "Marketplace náutico conectando proprietários, empresas e prestadores de serviços.",
      en: "Boating marketplace connecting owners, companies, and service providers.",
    },
    keywords: [
      { pt: "Full Stack", en: "Full Stack" },
      { pt: "Marketplace", en: "Marketplace" },
      { pt: "Busca", en: "Search" },
      { pt: "Avaliações", en: "Reviews" },
    ],
    cta: { pt: "Explorar projeto", en: "Explore project" },
  },
];

export type BeforeAfterBlock = Extract<CaseBlock, { kind: "beforeAfter" }>;
