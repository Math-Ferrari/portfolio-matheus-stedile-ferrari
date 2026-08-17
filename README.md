# Portfólio — Matheus Stedile Ferrari

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4.

```bash
npm run dev        # desenvolvimento
npm run build      # build de produção
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Onde editar o conteúdo

Todo o texto do site está em `data/`. Nenhum componente precisa ser aberto para
mudar conteúdo.

| Arquivo            | O que contém                                                        |
| ------------------ | ------------------------------------------------------------------- |
| `data/site.ts`     | Nome, descrição, menu, contatos, hero, abordagem, o que faço, sobre, tecnologias, engenharia, contato |
| `data/projects.ts` | Os três projetos e o conteúdo completo das páginas de case          |
| `lib/types.ts`     | Tipos do conteúdo — o TypeScript avisa se faltar algum campo         |

### Identidade

O bloco no topo de `data/site.ts` é a fonte única. Nada de nome, formação ou
atuação é escrito direto em componente. A regra semântica:

| Campo      | Significa                  | Valor                       |
| ---------- | --------------------------- | --------------------------- |
| `name`     | identidade completa         | Matheus Stedile Ferrari     |
| `initials` | assinatura visual            | MSF                         |
| `role`     | posicionamento profissional | Engenheiro de Software      |
| `practice` | atuação (detalhe)           | Desenvolvimento Full Stack  |
| `degree`   | formação / curso            | Engenharia de Software      |

Derivados: `positioning` (`role · practice`), `title` (`name — role`).

`role` é o rótulo usado em todo o site — hero, header, footer, metadata e
`jobTitle` do JSON-LD. `degree` só aparece quando o texto fala especificamente
da graduação (seção Sobre), onde fica transparente que **a graduação está em
andamento** (último semestre) — sem afirmar conclusão.

A assinatura `MSF | Matheus Stedile Ferrari` vive em
`components/ui/brand-signature.tsx` e é usada por header e rodapé.

### Contatos

Em `data/site.ts`, no array `contacts`. Itens com `href` vazio **não aparecem**
no site — basta preencher o link para o canal passar a ser exibido. O mesmo
array alimenta o rodapé, a seção de contato e o JSON-LD do layout.

### Domínio

Defina `NEXT_PUBLIC_SITE_URL` no ambiente (ver `.env.example`) quando o domínio
existir. Metadata, Open Graph, `sitemap.xml` e `robots.txt` usam esse valor.

## Screenshots

1. Coloque a imagem em `public/screenshots/<projeto>/<nome>.png`.
2. Preencha o campo `src` correspondente:
   - **hero da home** → `heroVisual` em `data/site.ts`;
   - **capa de um projeto** (card, faixa navy e topo do case) → `cover` em `data/projects.ts`;
   - **telas dentro de um case** → itens de um bloco `screenshots` em `data/projects.ts`.

Enquanto `src` estiver vazio, o site mostra um placeholder identificado como
_placeholder de desenvolvimento_ — nunca uma interface fictícia.

Composições disponíveis no bloco `screenshots` (campo `layout`):

- `single` — uma imagem larga por vez (empilhadas, se houver mais de uma);
- `pair` — duas lado a lado;
- `device` — desktop + mobile (usa `frame: "mobile"` para identificar a segunda).

A `caption` de cada screenshot deve explicar, em uma linha, o que aquela tela
resolve.

A foto profissional segue a mesma lógica: `about.photo.src` em `data/site.ts`.

## Páginas de case

Cada case é um array de blocos tipados (`data/projects.ts` → `case.blocks`).
A ordem do array é a ordem da página, e o sumário lateral é gerado a partir dela.

Tipos de bloco (`lib/types.ts` → `CaseBlock`):

| `kind`         | Uso                                                       |
| -------------- | --------------------------------------------------------- |
| `prose`        | Parágrafos corridos                                       |
| `list`         | Itens com título e descrição (`variant: "numbered"` numera)|
| `groups`       | Listas curtas agrupadas por rótulo                        |
| `beforeAfter`  | Comparação "antes / com o sistema"                        |
| `screenshots`  | Composições de imagens                                    |
| `tech`         | Stack por categoria                                       |
| `pending`      | Seção estruturada, aguardando informação confirmada       |

Para adicionar um projeto: acrescente um objeto ao array `projects`. A rota
`/projetos/<slug>`, o sitemap e a navegação "próximo projeto" passam a existir
automaticamente.

## Regra de conteúdo

Nenhuma métrica sem medição real. Onde falta informação confirmada, o bloco
`pending` deixa a seção estruturada e explicitamente marcada como pendente, em
vez de preencher com número ou afirmação inventada. Os `// TODO` em `data/`
apontam o que ainda precisa ser preenchido.

## Identidade visual e movimento

Os tokens de cor, tipografia e ritmo estão em `app/globals.css`, no bloco
`@theme`. Alterar um token muda o site inteiro.

- **Tons de seção** — `components/ui/tone.ts` define `paper`, `surface`, `deep` e
  `navy`. O `Section` recebe `tone` e aplica fundo, filete e cores de texto
  coerentes. O navy é a faixa de contraste e aparece poucas vezes de propósito.
- **Serif** — reservada aos títulos "de voz" (hero, chamada do case principal,
  contato, título do case). Todos os demais títulos são sans.
- **Entrada do hero** — classes `.rise` + `.rise-1..4` (CSS puro, escalonado).
- **Entrada no scroll** — `components/ui/reveal.tsx`, com IntersectionObserver.
  Envolva **grupos** (seção, grade), nunca textos soltos.
- `prefers-reduced-motion: reduce` anula ambas as animações no CSS, e sem
  JavaScript o `<noscript>` do layout mantém tudo visível.

## Estrutura

```
app/                     rotas, metadata, sitemap, robots, ícone, imagem OG
components/layout/       header e footer
components/sections/     seções da home
components/projects/     cards, screenshots e componentes de case
components/ui/           container, seção, rótulo, link de ação, foto
data/                    conteúdo
lib/                     tipos e utilitários
public/screenshots/      imagens dos projetos
```
