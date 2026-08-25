import type { CaseBlock, Project } from "@/lib/types";

/**
 * ────────────────────────────────────────────────────────────────────────────
 * Projetos e cases.
 *
 * Regra de conteúdo: nada de métrica não comprovada. Enquanto não houver
 * número real, o texto descreve o que foi construído e o resultado qualitativo.
 * Seções marcadas como `pending` estão estruturadas e aguardando informação.
 * ────────────────────────────────────────────────────────────────────────────
 */

export const projects: Project[] = [
  /* ── 1. Sistema de Gestão PlatoTruck ─────────────────────────────────── */
  {
    slug: "sistema-platotruck",
    name: "Sistema de Gestão PlatoTruck",
    kind: "Sistema interno de gestão",
    role: "Desenvolvimento do sistema",
    tagline:
      "De planilhas e processos manuais para uma operação de estoque centralizada e multiempresa.",
    taglineHighlight: "centralizada e multiempresa",
    summary:
      "Sistema web interno que centraliza estoque, movimentações, permissões e acompanhamento da operação de um grupo com cinco CNPJs relacionados.",
    featured: true,
    problem:
      "Parte importante do controle operacional e de estoque era feita em planilhas e processos manuais, com contagens manuais, informação descentralizada e divergências de estoque.",
    solution:
      "Um sistema web interno onde estoque, movimentações e acessos ficam em um único lugar, com escopo por empresa e histórico do que foi feito.",
    outcome:
      "O controle de estoque deixou de depender de planilhas paralelas: as movimentações passaram a ser registradas no sistema, com histórico e acesso por perfil.",
    highlights: [
      "Estoque, inventário, locais e saldos",
      "Entradas, retiradas e transferências com histórico",
      "Retirada por scanner",
      "Operação multiempresa (5 CNPJs)",
      "Permissões e níveis de acesso",
      "Dashboards e área comercial",
    ],
    /* Cada palavra vem de um grupo real em `case.blocks` (id "funcionalidades"):
       Multiempresa e Estoque são labels de grupo; Inventário e Scanner são
       itens dentro deles; Permissões vem do grupo "Acesso e usuários". */
    tags: ["Multiempresa", "Estoque", "Inventário", "Scanner", "Permissões"],
    tech: [],
    links: [],
    cover: {
      src: "/1.png",
      alt: "Painel de visão geral do Sistema de Gestão PlatoTruck",
      caption: "Painel — visão geral da operação da empresa selecionada.",
      frame: "desktop",
      width: 1906,
      height: 947,
    },
    case: {
      intro: [
        "O Sistema de Gestão PlatoTruck é um sistema web interno desenvolvido para centralizar o controle operacional e de estoque de um grupo de empresas relacionadas.",
        "É o projeto em que a transformação aparece de forma mais clara: a operação saiu de planilhas e conferências manuais para um sistema único, com registro de movimentações, escopo por empresa e acesso controlado por perfil.",
      ],
      blocks: [
        {
          kind: "prose",
          id: "contexto",
          title: "Contexto",
          paragraphs: [
            "A operação envolve cinco CNPJs relacionados, que compartilham rotinas de estoque e precisam ser acompanhados tanto separadamente quanto no conjunto.",
            "Esse arranjo é comum e raramente cabe em um software genérico: cada empresa tem seus próprios produtos, saldos e movimentações, mas as pessoas transitam entre elas no dia a dia. Qualquer solução precisava tratar a empresa como parte do contexto de uso, e não como um filtro opcional.",
          ],
        },
        {
          kind: "list",
          id: "problema",
          title: "O problema",
          intro:
            "Antes do sistema, o controle acontecia principalmente em planilhas e processos manuais. Isso trazia um conjunto de problemas conhecidos:",
          variant: "plain",
          items: [
            {
              title: "Contagens manuais",
              description: "Conferência de estoque dependente de trabalho repetido e sujeito a erro.",
            },
            {
              title: "Divergências de estoque",
              description: "O que estava registrado nem sempre correspondia ao que existia fisicamente.",
            },
            {
              title: "Informação descentralizada",
              description: "Dados em arquivos e lugares diferentes, sem uma fonte única de consulta.",
            },
            {
              title: "Movimentações difíceis de acompanhar",
              description: "Sem histórico consolidado, reconstruir o que aconteceu exigia investigação.",
            },
            {
              title: "Operação com múltiplas empresas",
              description: "Controlar CNPJs diferentes em planilhas separadas multiplica o trabalho e o risco.",
            },
          ],
        },
        {
          kind: "beforeAfter",
          id: "antes-e-depois",
          title: "Como funcionava antes",
          intro:
            "A comparação abaixo descreve a mudança de forma de trabalho — não resultados numéricos, que serão adicionados quando houver medição.",
          before: {
            label: "Antes",
            items: [
              "Controle apoiado em planilhas e processos manuais",
              "Contagem e conferência manuais",
              "Informação espalhada entre arquivos e responsáveis",
              "Movimentações sem histórico consolidado",
              "Cada empresa controlada separadamente",
              "Acesso à informação sem distinção de perfil",
            ],
          },
          after: {
            label: "Com o sistema",
            items: [
              "Estoque e movimentações registrados em um sistema único",
              "Entradas, retiradas e transferências com registro",
              "Consulta centralizada de produtos, locais e saldos",
              "Histórico de movimentações disponível para conferência",
              "Empresa selecionada dentro do próprio sistema, com escopo aplicado aos dados",
              "Permissões e níveis de acesso por usuário",
            ],
          },
        },
        {
          kind: "prose",
          id: "solucao",
          title: "A solução",
          paragraphs: [
            "Foi desenvolvido um sistema web interno para concentrar a operação: cadastro de produtos, locais de estoque, saldos, movimentações e os acessos de quem usa o sistema.",
            "A ideia central é simples: toda alteração de estoque acontece dentro do sistema e fica registrada. A partir disso, deixa de existir a etapa de reconciliar planilhas — a consulta e o histórico saem do mesmo lugar em que a operação é executada.",
            "Sobre essa base foram construídas as funcionalidades que o dia a dia exigia: inventário, transferência entre locais, retirada rápida por scanner, dashboards e a área comercial.",
          ],
        },
        {
          kind: "groups",
          id: "funcionalidades",
          title: "Principais funcionalidades",
          intro: "O sistema conta atualmente, entre outras funcionalidades, com:",
          groups: [
            {
              label: "Acesso e usuários",
              items: [
                "Autenticação",
                "Cadastro e gestão de usuários",
                "Sistema de permissões",
                "Diferentes níveis de acesso",
              ],
            },
            {
              label: "Estoque",
              items: [
                "Cadastro de produtos",
                "Locais de estoque",
                "Saldos",
                "Inventário",
                "Gestão de estoque",
              ],
            },
            {
              label: "Movimentação",
              items: [
                "Entradas e retiradas",
                "Transferência de estoque",
                "Scanner para retirada rápida de produtos",
                "Histórico de movimentações",
              ],
            },
            {
              label: "Multiempresa",
              items: [
                "Operação com 5 CNPJs relacionados",
                "Seleção de empresa dentro do sistema",
                "Dados e funcionalidades no escopo da empresa selecionada",
              ],
            },
            {
              label: "Acompanhamento",
              items: [
                "Dashboards",
                "Funcionalidades comerciais",
                "Área de competição e acompanhamento de vendedores",
              ],
            },
          ],
        },
        {
          kind: "screenshots",
          id: "tela-sistema",
          title: "O sistema",
          layout: "single",
          items: [
            {
              src: "/screenshots/sistema/06.png",
              alt: "Dashboard do Sistema de Gestão PlatoTruck",
              caption: "Dashboard — visão geral da operação da empresa selecionada.",
              frame: "desktop",
              width: 1891,
              height: 953,
            },
          ],
        },
        {
          kind: "prose",
          id: "multiempresa",
          title: "Multiempresa",
          paragraphs: [
            "A operação envolve cinco CNPJs relacionados. Em vez de manter um ambiente separado por empresa, o sistema trabalha com seleção de empresa: o usuário escolhe dentro do próprio sistema com qual empresa está operando.",
            "A empresa selecionada define o escopo do que é exibido e do que pode ser feito — dados e funcionalidades respeitam esse contexto. Isso mantém a operação separada onde precisa ser separada, sem obrigar a pessoa a trocar de sistema para trabalhar.",
          ],
        },
        {
          kind: "screenshots",
          id: "tela-multiempresa",
          title: "Seleção de empresa",
          layout: "device",
          items: [
            {
              src: "/screenshots/sistema/08.png",
              alt: "Seletor de empresa no Sistema de Gestão PlatoTruck",
              caption: "Troca de empresa dentro do sistema, sem precisar sair para outro ambiente.",
              frame: "mobile",
              width: 253,
              height: 495,
            },
          ],
        },
        {
          kind: "prose",
          id: "estoque",
          title: "Estoque e operação",
          paragraphs: [
            "O estoque é organizado por produto, local e saldo, e é alterado por movimentações registradas: entradas, retiradas e transferências entre locais. O inventário apoia a conferência do que está registrado contra o que existe fisicamente.",
            "Cada movimentação alimenta o histórico, que permite acompanhar o que foi movimentado, por quem e em qual empresa.",
          ],
        },
        {
          kind: "screenshots",
          id: "tela-estoque",
          title: "Produtos e movimentações",
          layout: "single",
          items: [
            {
              src: "/screenshots/sistema/10.png",
              alt: "Tela de cadastro de produtos e inventário",
              caption: "Produtos e inventário — saldos por local.",
              frame: "desktop",
              width: 1887,
              height: 944,
            },
            {
              src: "/screenshots/sistema/10.1.png",
              alt: "Tela de histórico de movimentações, entradas e transferências",
              caption: "Movimentações — entradas, retiradas e transferências entre locais.",
              frame: "desktop",
              width: 1889,
              height: 933,
            },
          ],
        },
        {
          kind: "prose",
          id: "scanner",
          title: "Scanner",
          paragraphs: [
            "Para a retirada de produtos existe um fluxo com scanner, pensado para o uso no dia a dia: a leitura do código identifica o produto e evita a digitação manual dos itens durante a operação.",
          ],
        },
        {
          kind: "screenshots",
          id: "tela-scanner",
          title: "Retirada por scanner",
          layout: "single",
          items: [
            {
              src: "/screenshots/sistema/12.png",
              alt: "Tela de retirada rápida de produtos por QR Code",
              caption: "Retirada rápida — leitura por QR Code ou busca manual antes de finalizar.",
              frame: "desktop",
              width: 1904,
              height: 944,
            },
          ],
        },
        {
          kind: "prose",
          id: "usuarios-e-permissoes",
          title: "Usuários e permissões",
          paragraphs: [
            "O sistema tem autenticação, cadastro de usuários e um sistema de permissões com diferentes níveis de acesso. Nem todo mundo que usa o sistema precisa — ou deve — enxergar tudo.",
            "As permissões trabalham junto com o contexto de empresa: o que um usuário acessa depende do seu nível e da empresa selecionada. É esse par que define o recorte de dados e de funcionalidades disponíveis.",
          ],
        },
        {
          kind: "screenshots",
          id: "tela-permissoes",
          title: "Níveis de acesso",
          layout: "single",
          items: [
            {
              src: "/screenshots/sistema/14.png",
              alt: "Tela de criação de usuário, perfis e empresas permitidas",
              caption: "Criação de usuário — perfis, setores e empresas permitidas.",
              frame: "desktop",
              width: 1885,
              height: 942,
            },
          ],
        },
        {
          kind: "prose",
          id: "seguranca",
          title: "Segurança",
          paragraphs: [
            "O sistema aplica controles de segurança no frontend, no backend e no banco de dados, com a validação de acesso e de regras acontecendo no servidor — a interface esconde o que não deve aparecer, mas não é ela que autoriza a operação.",
            "Uma descrição detalhada e verificada dos controles será publicada aqui após uma auditoria técnica específica do sistema. Até lá, prefiro não listar garantias que ainda não foram revisadas item a item.",
          ],
        },
        {
          kind: "list",
          id: "decisoes-tecnicas",
          title: "Decisões técnicas",
          variant: "plain",
          intro:
            "O sistema foi construído para atender uma operação real, com múltiplas empresas, diferentes perfis de acesso e movimentações de estoque que precisam manter consistência e rastreabilidade.",
          items: [
            {
              title: "Arquitetura multiempresa",
              description:
                "O acesso aos dados é condicionado às empresas liberadas para cada usuário. A empresa selecionada define o escopo das operações, evitando que informações de unidades diferentes sejam misturadas durante consultas e movimentações.",
            },
            {
              title: "Autorização em múltiplas camadas",
              description:
                "As permissões não dependem apenas da interface. Regras de acesso também são validadas no servidor e no banco de dados, reduzindo o risco de uma ação ser executada apenas por manipulação do frontend.",
            },
            {
              title: "Estoque baseado em movimentações",
              description:
                "Em vez de tratar o estoque apenas como um número editável, entradas, retiradas e transferências são registradas como movimentações. Isso permite manter histórico, origem, destino e rastreabilidade das alterações de saldo.",
            },
            {
              title: "Operações críticas com comportamento fail-closed",
              description:
                "Funcionalidades que ainda não estavam prontas para uso real foram bloqueadas por padrão. A decisão foi liberar módulos gradualmente, evitando que partes incompletas do sistema fossem utilizadas na operação.",
            },
            {
              title: "Processamento próximo ao banco",
              description:
                "Consultas mais pesadas, como filtros e indicadores do inventário, foram movidas para operações otimizadas no PostgreSQL através de RPCs e consultas específicas, reduzindo processamento desnecessário no cliente e melhorando o tempo de resposta.",
            },
            {
              title: "Evolução sem perder rastreabilidade",
              description:
                "Alterações importantes de estoque, migrações de saldos e ajustes operacionais foram estruturados para preservar histórico e permitir validação dos dados antes e depois das mudanças.",
            },
          ],
        },
        {
          kind: "list",
          id: "tecnologias",
          title: "Tecnologias",
          variant: "plain",
          items: [
            {
              title: "Next.js",
              description:
                "Estrutura principal da aplicação web, utilizando App Router para organização das páginas e fluxos do sistema.",
            },
            {
              title: "React",
              description:
                "Construção das interfaces e componentes utilizados nos módulos operacionais.",
            },
            {
              title: "TypeScript",
              description:
                "Tipagem da aplicação e dos principais fluxos de dados, reduzindo inconsistências durante o desenvolvimento.",
            },
            {
              title: "Supabase",
              description:
                "Infraestrutura de backend utilizada para autenticação, banco de dados e integração entre a aplicação e os dados operacionais.",
            },
            {
              title: "PostgreSQL",
              description:
                "Banco relacional responsável pelos produtos, saldos, movimentações, usuários, empresas, permissões e demais dados do sistema.",
            },
            {
              title: "Row Level Security",
              description:
                "Políticas de segurança no banco utilizadas como uma camada adicional de controle de acesso aos dados.",
            },
            {
              title: "PostgreSQL RPC",
              description:
                "Funções utilizadas para operações e consultas que exigem maior controle, consistência ou desempenho diretamente no banco.",
            },
            {
              title: "Vercel",
              description:
                "Hospedagem e entrega da aplicação web em produção.",
            },
          ],
        },
        {
          kind: "list",
          id: "resultados",
          title: "Resultados",
          intro:
            "Resultados descritos de forma qualitativa. Números só entram aqui quando houver medição real da operação.",
          variant: "plain",
          items: [
            {
              title: "Controle fora das planilhas",
              description:
                "O estoque passou a ser controlado dentro do sistema, no mesmo lugar em que a operação acontece.",
            },
            {
              title: "Movimentações registradas",
              description:
                "Entradas, retiradas e transferências ficam registradas e podem ser consultadas no histórico.",
            },
            {
              title: "Informação centralizada",
              description:
                "Produtos, locais e saldos deixaram de estar espalhados entre arquivos e responsáveis.",
            },
            {
              title: "Operação multiempresa em um só ambiente",
              description:
                "Os cinco CNPJs são operados no mesmo sistema, com dados e funcionalidades no escopo da empresa selecionada.",
            },
            {
              title: "Menos digitação na retirada",
              description:
                "A retirada por scanner identifica o produto pela leitura do código, sem digitação manual dos itens.",
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
    kind: "Plataforma web",
    role: "Desenvolvimento Full Stack",
    tagline: "Plataforma e marketplace digital do setor náutico.",
    summary:
      "Atuação Full Stack em uma plataforma que conecta usuários e empresas do setor náutico: cadastro, catálogo de prestadores, buscas, avaliações, chat e pagamentos.",
    featured: false,
    problem:
      "Conectar usuários e prestadores do setor náutico em uma plataforma única, com cadastro, busca, comunicação e pagamento.",
    solution:
      "Desenvolvimento Full Stack da plataforma, do modelo de dados e das permissões até as telas de catálogo, busca e chat.",
    outcome:
      "Plataforma com cadastro de usuários e empresas, catálogo de prestadores, buscas e filtros, avaliações, chat, integrações com APIs e pagamentos.",
    highlights: [
      "Cadastro de usuários e empresas",
      "Catálogo de prestadores",
      "Buscas e filtros",
      "Avaliações e chat",
      "Integrações e pagamentos",
    ],
    tech: ["React", "Next.js", "TypeScript", "Node.js", "NestJS", "PostgreSQL", "Supabase"],
    links: [], // TODO: adicionar link público, se houver.
    cover: {
      src: "/5.png",
      alt: "Página inicial da plataforma tudoPrabarco",
      caption: "Página inicial — busca e categorias de serviços náuticos.",
      frame: "desktop",
      width: 1904,
      height: 945,
    },
    case: {
      intro: [
        "tudoPrabarco é uma plataforma e marketplace digital do setor náutico, onde usuários e empresas se encontram, se comunicam e fecham serviços.",
        "Minha atuação foi end-to-end, acompanhando a construção do produto da experiência e das interfaces às funcionalidades, integrações e camadas de dados que sustentam seus fluxos.",
      ],
      blocks: [
        {
          kind: "prose",
          id: "contexto",
          title: "Contexto",
          paragraphs: [
            "A plataforma reúne, em um mesmo produto, cadastro e gestão de usuários e empresas, um catálogo de prestadores e as funcionalidades que sustentam a relação entre as duas pontas: busca, avaliação, conversa e pagamento.",
            "Um produto com esse formato exige atenção a permissões desde o início: usuário, empresa e prestador acessam coisas diferentes, e as regras precisam valer no servidor e na camada de dados.",
          ],
        },
        {
          kind: "prose",
          id: "atuacao-no-projeto",
          title: "Atuação no projeto",
          paragraphs: [
            "Participei da construção do tudoPrabarco como produto, não apenas de telas isoladas. O trabalho atravessou a definição e implementação dos fluxos usados por usuários e empresas, a construção das interfaces e as integrações necessárias para que cadastro, descoberta, comunicação e operação funcionassem de ponta a ponta.",
          ],
        },
        {
          kind: "groups",
          id: "atuacao",
          title: "Áreas em que atuei",
          groups: [
            {
              label: "Produto",
              items: [
                "Cadastro e gestão de usuários e empresas",
                "Catálogo de prestadores",
                "Buscas e filtros",
                "Avaliações",
                "Chat",
              ],
            },
            {
              label: "Plataforma",
              items: [
                "Autenticação",
                "Permissões",
                "Row Level Security (RLS)",
                "Integrações com APIs",
                "Pagamentos",
              ],
            },
            {
              label: "Desenvolvimento",
              items: [
                "Desenvolvimento Full Stack",
                "Diagnóstico e correção de problemas",
                "Versionamento com Git",
              ],
            },
          ],
        },
        {
          kind: "screenshots",
          id: "explorar-plataforma",
          title: "Explorar a plataforma",
          intro:
            "A descoberta reúne busca, filtros e catálogo de empresas em um mesmo fluxo, ajudando o usuário a navegar pela oferta de serviços náuticos.",
          layout: "single",
          items: [
            {
              src: "/screenshots/tudoprabarco/05.png",
              alt: "Tela de busca de empresas náuticas com filtros e catálogo de prestadores",
              caption: "Explorar — busca, filtros e catálogo de empresas náuticas.",
              frame: "desktop",
              width: 1891,
              height: 940,
            },
          ],
        },
        {
          kind: "screenshots",
          id: "categorias-e-descoberta",
          title: "Categorias e descoberta",
          intro:
            "As categorias organizam a navegação por necessidade e dão continuidade ao fluxo de descoberta iniciado na busca.",
          layout: "single",
          items: [
            {
              src: "/screenshots/tudoprabarco/05.01.png",
              alt: "Tela com categorias de serviços náuticos organizadas em uma grade visual",
              caption: "Categorias — serviços organizados por necessidade da embarcação.",
              frame: "desktop",
              width: 1887,
              height: 940,
            },
          ],
        },
        {
          kind: "screenshots",
          id: "acesso-a-plataforma",
          title: "Acesso à plataforma",
          intro:
            "O fluxo de entrada também faz parte do produto, com criação de conta por e-mail ou autenticação pelo Google.",
          layout: "single",
          items: [
            {
              src: "/screenshots/tudoprabarco/1.png",
              alt: "Tela de criação de conta do tudoPrabarco com cadastro por e-mail e Google",
              caption: "Criar conta — cadastro por e-mail ou autenticação pelo Google.",
              frame: "desktop",
              width: 1900,
              height: 942,
            },
          ],
        },
        {
          kind: "prose",
          id: "dados-e-acesso",
          title: "Dados e controle de acesso",
          paragraphs: [
            "A base de dados é PostgreSQL, com Supabase na autenticação e no acesso aos dados. Parte do controle de acesso é aplicada com RLS, mantendo a restrição na própria camada de dados além das verificações da aplicação.",
            "Esse arranjo é útil em um produto com perfis distintos: o registro de um usuário não fica acessível apenas porque uma tela deixou de filtrar corretamente.",
          ],
        },
        {
          kind: "tech",
          id: "tecnologias",
          title: "Tecnologias",
          groups: [
            { label: "Frontend", items: ["React", "Next.js", "TypeScript"] },
            { label: "Backend", items: ["Node.js", "NestJS"] },
            { label: "Dados", items: ["PostgreSQL", "Supabase", "RLS"] },
            { label: "Ferramentas", items: ["Git / GitHub"] },
          ],
        },

        {
          kind: "results",
          id: "resultados",
          title: "Resultados",
          items: [
            {
              label: "Plataforma completa",
              title: "Plataforma construída de ponta a ponta",
              description:
                "O projeto evoluiu para uma plataforma web completa, conectando usuários, empresas e prestadores de serviços dentro de uma mesma experiência digital.",
            },
            {
              label: "Jornada integrada",
              title: "Jornada integrada do usuário",
              description:
                "Fluxos de cadastro, autenticação, descoberta por categorias, busca e navegação foram estruturados para funcionar como partes de um único produto, e não como páginas isoladas.",
            },
            {
              label: "Base para evolução",
              title: "Base técnica para evolução do produto",
              description:
                "A aplicação foi estruturada com frontend, backend, banco de dados e controle de acesso integrados, permitindo que novas funcionalidades fossem incorporadas sem reconstruir a base do sistema.",
            },
            {
              label: "Atuação end-to-end",
              title: "Participação end-to-end",
              description:
                "Atuei nas diferentes camadas da plataforma, desde interfaces e experiência do usuário até regras de negócio, APIs, dados e integrações, acompanhando a evolução do produto de forma ampla.",
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
    kind: "Site institucional",
    role: "Desenvolvimento web",
    tagline: "Site institucional da PlatoTruck.",
    summary:
      "Site institucional desenvolvido para a PlatoTruck, com foco em apresentação da empresa e comportamento responsivo.",
    featured: false,
    problem:
      "Dar à PlatoTruck uma presença institucional própria na web, com apresentação clara da empresa.",
    solution:
      "Desenvolvimento do site institucional, com estrutura de conteúdo e layout responsivo.",
    outcome:
      "Site institucional em funcionamento, adaptado a diferentes tamanhos de tela.",
    highlights: ["Site institucional", "Layout responsivo", "Estrutura de conteúdo"],
    tech: [],
    links: [], // TODO: adicionar a URL do site.
    cover: {
      src: "/4.png",
      alt: "Página inicial do site PlatoTruck.com",
      caption: "Home do site institucional.",
      frame: "desktop",
      width: 1893,
      height: 938,
    },
    case: {
      intro: [
        "PlatoTruck.com é o site institucional da PlatoTruck — a presença pública da mesma empresa para a qual desenvolvi o sistema interno de gestão.",
        "É um projeto menor em escopo do que um sistema, mas com uma exigência própria: representar uma empresa real, funcionar bem em qualquer tela e sustentar o conteúdo institucional sem depender de manutenção constante.",
      ],
      blocks: [
        {
          kind: "prose",
          id: "escopo",
          title: "Escopo",
          paragraphs: [
            "Desenvolvimento do site institucional da empresa, com organização do conteúdo em páginas e seções e layout adaptado a desktop e mobile.",
          ],
        },
        {
          kind: "screenshots",
          id: "telas",
          title: "Telas",
          layout: "device",
          items: [
            {
              src: "/screenshots/platotruck/02.png",
              alt: "Página inicial do site PlatoTruck.com em desktop",
              caption: "Home — versão desktop.",
              frame: "desktop",
              width: 1889,
              height: 937,
            },
            {
              src: "/screenshots/platotruck/02.1.png",
              alt: "Página inicial do site PlatoTruck.com em mobile",
              caption: "Home — versão mobile.",
              frame: "mobile",
              width: 386,
              height: 844,
            },
          ],
        },
        {
          kind: "tech",
          id: "tecnologias",
          title: "Tecnologias",
          groups: [
            { label: "Frontend", items: ["Next.js", "React", "TypeScript"] },
            { label: "Interface", items: ["Tailwind CSS"] },
            { label: "Entrega", items: ["Vercel"] },
          ],
        },
        {
          kind: "results",
          id: "resultados",
          title: "Resultados",
          wideLabels: true,
          items: [
            {
              label: "Presença digital",
              title: "Presença institucional estruturada",
              description:
                "A empresa passou a contar com um site próprio para apresentar sua atuação, seus produtos e sua especialização no mercado de embreagens para linha pesada.",
            },
            {
              label: "Organização da informação",
              title: "Conteúdo organizado para o cliente",
              description:
                "Produtos, informações institucionais e principais áreas da empresa foram estruturados em uma navegação clara, facilitando o entendimento sobre o que a PlatoTruck oferece.",
            },
            {
              label: "Experiência responsiva",
              title: "Experiência adaptada a diferentes telas",
              description:
                "A interface foi desenvolvida para funcionar de forma consistente em desktop e dispositivos móveis, preservando hierarquia, conteúdo e facilidade de navegação.",
            },
            {
              label: "Base para evolução",
              title: "Base digital preparada para evolução",
              description:
                "O projeto criou uma estrutura própria para a presença digital da empresa, permitindo que novas páginas, produtos e conteúdos possam ser incorporados conforme o site evolui.",
            },
          ],
        },
      ],
    },
  },
];

export const featuredProject: Project =
  projects.find((project) => project.featured) ?? (projects[0] as Project);

export const secondaryProjects: Project[] = projects.filter(
  (project) => project.slug !== featuredProject.slug,
);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Próximo projeto na ordem da lista, para navegação no fim do case. */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  const next = projects[(index + 1) % projects.length];
  return next as Project;
}

/**
 * Copy curta de "Projetos selecionados" na home — independente da copy do
 * case completo (mesmo raciocínio de `heroProjects`): um texto próprio para
 * "bater o olho", com `slug` ligando ao projeto real em `projects`. As
 * palavras-chave vêm de funcionalidades já documentadas no case de cada
 * projeto — nenhuma nova aqui. `cta` é o texto do link do card (varia por
 * natureza do projeto: "Explorar" para os dois cases, "Visitar" para o site
 * institucional, que é navegável de verdade).
 *
 * A ORDEM deste array é a ordem de leitura da seção: PlatoTruck (projeto
 * principal) → PlatoTruck.com → tudoPrabarco. Os três cards têm o MESMO
 * tamanho base (grid de 3 colunas iguais, ver `selected-projects.tsx`); o
 * destaque do principal vem de tratamento visual (contraste de borda/fundo,
 * rótulo "Case principal"), não de um card maior — por isso não existe um
 * campo `span` aqui.
 */
export const selectedProjects = [
  {
    slug: "sistema-platotruck",
    category: "Sistema interno",
    description:
      "Sistema interno multiempresa para centralizar estoque, usuários, permissões e processos operacionais.",
    keywords: ["Multiempresa", "Estoque", "Segurança", "Dashboards"],
    cta: "Explorar case",
  },
  {
    slug: "platotruck-site",
    category: "Site institucional",
    description: "Site institucional desenvolvido para apresentar a empresa, seus produtos e sua atuação.",
    keywords: ["Next.js", "Responsivo", "Produtos"],
    cta: "Visitar projeto",
  },
  {
    slug: "tudoprabarco",
    category: "Marketplace",
    description: "Marketplace náutico conectando proprietários, empresas e prestadores de serviços.",
    keywords: ["Full Stack", "Marketplace", "Busca", "Avaliações"],
    cta: "Explorar projeto",
  },
] as const;

/**
 * NÃO RENDERIZADO. Era o aprofundamento do case principal na home, logo
 * depois de "Projetos selecionados" — removido de lá porque duplicava o que
 * a própria página `/projetos/sistema-platotruck` já faz, com mais
 * profundidade (ver `projects[0].case.blocks` e o comentário em
 * `app/page.tsx`). O componente que consumia isto,
 * `components/sections/platotruck-case.tsx`, foi apagado (confirmado sem
 * outro importador antes de apagar).
 *
 * Mantido aqui só como MATÉRIA-PRIMA para expandir o case de verdade mais
 * tarde — a maior parte do texto abaixo já é paráfrase do que já existe em
 * `case.blocks` (contexto, problema, antes-e-depois, solução,
 * funcionalidades, multiempresa, estoque, scanner, usuarios-e-permissoes,
 * seguranca), então não adiciona fato novo. As duas partes que NÃO têm
 * equivalente ainda em `case.blocks` e valem a pena migrar quando o case for
 * trabalhado:
 *
 *   - `porque` ("Por que um sistema interno") — o raciocínio de por que um
 *     software genérico não bastava; hoje só implícito no bloco `solucao`.
 *   - `engenharia.points` — a lista curta de controles (regras no servidor,
 *     autorização por nível + empresa, validação antes de persistir,
 *     controles no banco, histórico) é mais específica que o texto livre do
 *     bloco `seguranca` e serviria de base para o bloco `decisoes-tecnicas`
 *     (hoje `pending`).
 *
 * Se este objeto ficar obsoleto por completo (ex.: o case for reescrito do
 * zero), pode ser apagado — não precisa sobreviver indefinidamente só por
 * este comentário.
 */
export const platotruckCase = {
  eyebrow: "Case em destaque",
  name: "Sistema de Gestão PlatoTruck",
  intro: "O sistema começou com um problema operacional, não com uma lista de funcionalidades.",
  contexto: {
    label: "Contexto",
    body: "A operação envolve cinco CNPJs relacionados, que compartilham rotinas de estoque e precisam ser acompanhados separadamente e em conjunto — um arranjo que raramente cabe em um software genérico.",
  },
  problema: {
    label: "Problema",
    body: "O controle acontecia em planilhas e processos manuais: contagens repetidas e sujeitas a erro, divergências entre o que estava registrado e o que existia fisicamente, informação espalhada entre arquivos e responsáveis, e nenhum histórico consolidado das movimentações.",
  },
  porque: {
    label: "Por que um sistema interno",
    body: "Um software genérico não bastava: cada empresa precisa manter seus próprios produtos e saldos, mas as pessoas transitam entre elas no dia a dia. A solução precisava tratar a empresa como parte do contexto de uso — não como um filtro opcional — e reunir estoque, movimentações e acessos em um único lugar.",
  },
  building: {
    label: "Como construí",
    lead: "A partir daí, cada funcionalidade nasceu de uma decisão concreta:",
    decisions: [
      {
        title: "Multiempresa",
        problem: "Diferentes empresas precisavam operar sem misturar informações.",
        decision:
          "O sistema passou a trabalhar com seleção de empresa: o usuário escolhe com qual empresa está operando, e dados e funcionalidades respeitam esse escopo.",
      },
      {
        title: "Usuários, permissões e controle de acesso",
        problem:
          "A operação envolve diferentes funções e empresas — acesso não podia ser apenas \"logado ou deslogado\".",
        decision:
          "O sistema passou a controlar o que cada usuário pode visualizar e executar, combinando autenticação, perfil de acesso e as empresas permitidas para aquele usuário.",
        screenshot: {
          src: "/2.png",
          alt: "Tela de cadastro de usuário com perfis de acesso e empresas permitidas",
          caption: "Usuários e permissões — perfis de acesso e empresas permitidas por usuário.",
          width: 1896,
          height: 947,
        },
      },
      {
        title: "Estoque e inventário",
        problem: "Contagens manuais e divergências entre o registrado e o que existia fisicamente.",
        decision:
          "O inventário deixou de ser uma contagem pontual: produtos, saldos e locais ficam organizados no sistema, com filtros para consulta e conferência a qualquer momento.",
        screenshot: {
          src: "/3.png",
          alt: "Tela de inventário com filtros e lista de saldos por produto",
          caption: "Inventário — saldos, locais e status de estoque por produto.",
          width: 1895,
          height: 941,
        },
      },
      {
        title: "Movimentações e transferências",
        problem: "Sem histórico consolidado, reconstruir o que tinha acontecido exigia investigação.",
        decision:
          "Entradas, retiradas e transferências entre locais passaram a ser registradas, com histórico consultável por produto, empresa e usuário.",
      },
      {
        title: "Scanner",
        problem: "A retirada de produtos dependia de digitação manual, item por item.",
        decision:
          "Um fluxo de retirada por leitura de código, que identifica o produto sem digitação durante a operação.",
      },
      {
        title: "Dashboards",
        problem: "Acompanhar a operação e a área comercial exigia montar relatórios à parte.",
        decision:
          "Dashboards e funcionalidades comerciais dentro do próprio sistema, no escopo da empresa selecionada.",
      },
    ],
  },
  engenharia: {
    label: "Engenharia",
    lead: "Não foi só interface.",
    points: [
      "Regras de acesso e de negócio validadas no servidor, não só escondidas na tela",
      "Autorização por nível de usuário, combinada com a empresa selecionada",
      "Validação de dados antes de persistir",
      "Controles também na camada de banco de dados, além da aplicação",
      "Histórico de movimentações por produto, empresa e usuário",
    ],
  },
  mudanca: {
    label: "Mudança operacional",
    before: "Controles manuais e informações espalhadas.",
    after: "Uma operação centralizada, com histórico e acesso estruturado.",
  },
  cta: "Explorar o case completo",
} as const;

type BeforeAfterBlock = Extract<CaseBlock, { kind: "beforeAfter" }>;

/**
 * Bloco antes/depois do case principal, para a versão-teaser exibida na home.
 * Lido direto do case (fonte única) — nunca duplicado em texto solto.
 */
export function getFeaturedBeforeAfter(): BeforeAfterBlock | null {
  const block = featuredProject.case?.blocks.find(
    (candidate): candidate is BeforeAfterBlock => candidate.kind === "beforeAfter",
  );
  return block ?? null;
}
