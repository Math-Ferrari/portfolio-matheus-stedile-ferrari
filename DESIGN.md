---
name: Matheus Stedile Ferrari — Portfólio
description: Portfólio editorial de engenharia de software, base neutra (grafite/off-white) com verde musgo reservado a acentos pontuais, dark e light.
colors:
  background-dark: "#11100e"
  surface-dark: "#1d1c1a"
  surface-secondary-dark: "#262523"
  surface-elevated-dark: "#33312f"
  foreground-dark: "#f3f1eb"
  muted-dark: "#a09e9b"
  background-light: "#f2efe8"
  surface-light: "#ebe9e5"
  surface-secondary-light: "#e6e2dd"
  surface-elevated-light: "#dad8d2"
  foreground-light: "#111315"
  muted-light: "#595854"
  accent-soft-dark: "#a1caac"
  accent-dark: "#78ad8a"
  accent-strong-dark: "#2a7449"
  accent-soft-light: "#559770"
  accent-light: "#1b683e"
  accent-strong-light: "#085630"
typography:
  hero:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "clamp(2.75rem, 1rem + 7vw, 7rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 1.45rem + 3.6vw, 4.35rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  heading-xl:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.25rem + 1.7vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.16em"
  signature:
    fontFamily: "'Source Serif 4', ui-serif, Georgia, 'Times New Roman', serif"
    fontWeight: 600
rounded:
  sm: "2px"
  md: "6px"
  lg: "8px"
  pill: "16px"
spacing:
  section: "clamp(4.5rem, 3rem + 5.5vw, 8rem)"
  gutter: "clamp(1.25rem, 0.6rem + 2.4vw, 4rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent-strong-dark}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-strong-dark}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.foreground-dark}"
    rounded: "{rounded.md}"
  link-quiet:
    textColor: "{colors.foreground-dark}"
    typography: "{typography.body}"
---

# Design System: Matheus Stedile Ferrari — Portfólio

## Overview

**Creative North Star: "The Field Notebook Executive"**

Um portfólio editorial: grafite quase preto ou off-white quente como base, tipografia como protagonista, e um verde musgo/floresta como a única voz cromática de marca. A sensação é premium, contemporânea e levemente natural sem nunca virar tema de sustentabilidade — verde é identidade visual, não ícone ecológico. É tecnológico sem parecer "cyber": o WebGL da hero (FloatingLines) usa a mesma família de verde do resto do site, não um neon isolado.

A hierarquia é: neutros dominam (~80–90% da composição), verde cria pontuação e identidade (~10–20%). Nenhuma seção é "toda verde"; o verde aparece em labels, links, estados, pequenos detalhes e um destaque raro de headline. Fotografia (o retrato na seção de perfil) permanece com tratamento fotográfico natural — nunca recebe overlay colorido de marca; o design se adapta à foto, não o contrário. Capturas de tela de produtos (PlatoTruck, tudoPrabarco) são conteúdo externo real e nunca são recoloridas.

Vermelho e azul não fazem parte da identidade. Vermelho não é usado em lugar nenhum do site hoje (nem como branding, nem como semântico — não há estados de erro implementados); azul não é accent de marca — só pode aparecer dentro de uma captura de tela real de um produto.

**Key Characteristics:**
- Verde musgo/floresta (~155° em OKLCH) como única família de accent de marca, em três papéis: soft/accent/strong.
- Neutros levemente relacionados ao verde (off-white e grafite com um traço de matiz verde, nunca cinza/bege puros).
- Dark e light usam a MESMA identidade — o claro não é o escuro invertido, é recalibrado (luminância abaixa, saturação se mantém) para não lavar sobre um fundo tão claro.
- Fotografia e capturas de produto nunca são tingidas pela marca.
- Um só detalhe cromático "raro" por composição (o destaque de headline, o hover de uma seta, o ponto final de uma lista) em vez de espalhar cor.

## Colors

Hierarquia de três camadas — a base é neutra, o contraste é texto claro/escuro, o destaque é uma família de verde só, usada em pequenas doses:

1. **Base** — neutra (`background`/`surface-*`/`tone-*`): domina a composição inteira.
2. **Contraste** — `foreground`/`muted`: quase branco no escuro, quase preto no claro.
3. **Destaque** — `accent-soft`/`accent`/`accent-strong`: o verde, reservado a acentos pontuais.

### Primary
- **Verde Musgo** (`accent-strong-dark` #2a7449 / `accent-strong-light` #085630): o verde mais profundo da identidade. Usado com parcimônia — destaque de headline (ex.: "operações reais." na seção de perfil), badge "Case principal", fundo de botão sólido com texto branco em cima, hover raro de ícone/seta, `::selection`. Nunca decoração de fundo.
- **Verde Médio** (`accent-dark` #78ad8a / `accent-light` #1b683e): o accent principal — links, labels em caixa alta, sublinhado de navegação, estado ativo, ícones de card. Calibrado para ≥4.5:1 de contraste como texto sobre `background` e `surface-elevated` nos dois temas.
- **Verde Sálvia** (`accent-soft-dark` #a1caac / `accent-soft-light` #559770): o papel decorativo — divisores finos, glows radiais atrás de seções, halo do FloatingLines. Mais claro/suave que os outros dois; não carrega texto de leitura no light mode.

Fora da hero (onde o FloatingLines é o protagonista) e de microdetalhes pontuais (badge, filete de borda, hover, CTA, a assinatura "MSF" no rodapé), o verde não aparece — nunca como fundo de seção ou de card inteiro.

### Neutral
- **Carvão** (`background-dark` #11100e): fundo principal do tema escuro — a base do site, quase preto.
- **Grafite** (`surface-dark` #1d1c1a → `surface-secondary-dark` #262523 → `surface-elevated-dark` #33312f): três degraus de superfície acima do fundo, cada um um pouco mais claro — usados por cards, rodapé e a superfície mais alta do tema. Chroma baixíssimo de propósito (~0.004–0.005 em OKLCH): a diferença entre os degraus é só luminância, não matiz.
- **Papel** (`background-light` #f2efe8): fundo principal do tema claro, off-white quente.
- **Areia clara** (`surface-light` #ebe9e5 → `surface-secondary-light` #e6e2dd → `surface-elevated-light` #dad8d2): três degraus do claro, mesma lógica do escuro — quase acromáticos, só um degrau de luminância entre eles.
- **Texto** (`foreground-dark` #f3f1eb / `foreground-light` #111315): quase branco no escuro, quase preto no claro. Nunca branco/preto puro.
- **Texto Secundário** (`muted-dark` #a09e9b / `muted-light` #595854): cinza neutro, para legendas, corpo secundário e datas.
- **Cenas** (`--tone-graphite` / `--tone-navy` / `--tone-slate` / `--tone-petrol`, definidos em `app/globals.css`): quatro variações de fundo quase idênticas ao `background`, usadas por seção (ver `components/ui/tone.ts`) para nenhuma seção empilhar exatamente o mesmo fundo que a anterior. Chroma quase zero — a diferença é praticamente só luminância (e um calor/frescor imperceptível), nunca um matiz reconhecível. Os nomes (graphite/navy/slate/petrol) são só identificadores de cena herdados; não descrevem mais a cor em si.

### Named Rules
**The One Family Rule.** Todo accent do site vem do mesmo matiz (~155° OKLCH). Não existe um segundo hue de marca — nem azul, nem um verde diferente ("mint", "teal", "lime") disfarçado de acento.

**The Neutral Base Rule.** `background`, `surface-*` e `tone-*` são a base do site e ficam neutros (chroma ≲0.01 em OKLCH) em qualquer contexto — mesmo em seções que citam o projeto principal ou o case em destaque. Verde nunca é fundo de seção ou de card inteiro; se uma superfície está lendo como "verde-acinzentado"/"lavada de verde", é regressão, não estilo. (Histórico: a primeira versão da identidade verde deixou `surface-*`/`tone-*` com chroma alto o bastante para isso acontecer — corrigido nesta revisão.)

**The No Brand Tint Rule.** Fotografia (o retrato de perfil) e capturas de tela de produto nunca recebem overlay, gradiente ou mix-blend-mode com a cor de marca. Tratamento de legibilidade (ex.: gradiente preto neutro atrás de uma legenda) é permitido; tingir a imagem com verde não é.

**The Rare Strong Rule.** `accent-strong` (o verde mais profundo) aparece no máximo uma vez por composição — um destaque de headline OU um hover de ícone OU um botão sólido, nunca vários ao mesmo tempo na mesma tela.

## Typography

**Display/Body Font:** Inter (com fallback `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`)
**Assinatura:** Source Serif 4 (itálico/serifado, só na assinatura tipográfica "MSF" do header/rodapé e no destaque de headline "operações reais.")

**Character:** Inter carrega praticamente todo o texto do site — uma família só, sem mistura de pesos "decorativos". A serifa é usada em duas exceções muito específicas e raras (a assinatura "MSF" e o destaque itálico de uma headline), nunca em heading de seção.

### Hierarchy
- **Hero** (700, `clamp(2.75rem, 1rem + 7vw, 7rem)`, line-height 0.94): nome na capa, `<h1>` único da home.
- **Display** (500, `clamp(2.5rem, 1.45rem + 3.6vw, 4.35rem)`, line-height 1.04): telas de frase única (estatística de abertura, CTA final).
- **Heading XL/LG/MD** (500, de `clamp(1.35rem,...,1.7rem)` a `clamp(1.75rem,...,2.5rem)`): títulos de seção, em ordem decrescente de peso visual.
- **Body / Body LG** (400, 1rem–`clamp(1.05rem,...,1.25rem)`, line-height 1.55–1.6): parágrafo corrido, medida de leitura confortável.
- **Caption** (500, 0.75rem, tracking 0.16–0.22em, caixa alta): rótulo pequeno — é o principal lugar onde `accent` aparece como texto (labels de categoria, eyebrows).

### Named Rules
**The One Family Rule (Typography).** Inter cobre hero, display, headings, corpo e caption. A serifa é reservada à assinatura e a um único destaque editorial por página — nunca um heading de seção inteiro.

## Layout

Ritmo vertical em duas escalas fluidas: `--spacing-section` (`clamp(4.5rem, 3rem + 5.5vw, 8rem)`) entre seções e `--spacing-gutter` (`clamp(1.25rem, 0.6rem + 2.4vw, 4rem)`) para respiro lateral/interno. A hero usa uma composição sticky de rolagem única (ver `hero-transition.tsx`) que funde a capa e a apresentação de perfil na mesma cena — não são duas seções cortadas, é uma coreografia com fases de opacidade/transform amarradas ao progresso de scroll. Abaixo da hero, o layout é editorial padrão: container centralizado, grid de 12 colunas no desktop, coluna única no mobile.

## Elevation & Depth

Sem sombras (`box-shadow`) como vocabulário — a profundidade vem de camadas tonais: `background` → `surface` → `surface-secondary` → `surface-elevated`, cada degrau um pouco mais claro (e com um traço maior de verde) que o anterior. Cards usam `border` sutil (`--border`, preto/branco a 10% de opacidade) em vez de sombra para se destacar do fundo. A navbar fixa é a exceção: usa `backdrop-blur` + fundo semitransparente (`bg-background/[0.18–0.5]`) para ganhar presença sobre o conteúdo que passa atrás dela durante o scroll.

### Named Rules
**The Tonal-Not-Shadow Rule.** Hierarquia visual vem de qual `surface-*`/`tone-*` uma seção usa, não de `box-shadow`. Se algo precisa se destacar, suba um degrau de superfície ou adicione uma borda — não adicione sombra.

## Shapes

Cantos suaves e discretos, nunca angulares nem excessivamente arredondados. `rounded-md` (6px) é o padrão para cards, molduras de screenshot e botões. `rounded-lg` (8px) para blocos maiores (cards de projeto, CTA do menu mobile). `rounded-2xl` (16px) só na cápsula da navbar fixa. Bordas são sempre 1px, na cor semântica `--border` (preto ou branco a 10%), nunca coloridas exceto o detalhe raro de `border-l-2 border-l-accent` em um bloco de destaque de case.

## Components

### Buttons (`ActionLink`, `components/ui/action-link.tsx`)
- **Shape:** `rounded-md` (6px), padding `12px 24px`.
- **Primary:** fundo `accent-strong` (verde musgo profundo) + texto branco — o único botão sólido do sistema. `accent-strong` foi escolhido em vez de `accent` (o verde médio) especificamente porque garante ≥4.5:1 de contraste para texto branco em cima, nos dois temas.
- **Secondary:** borda `--border`, texto `--foreground`, hover troca a borda para `foreground/40` e o fundo para `--surface`.
- **Quiet (link "Ver case →"):** sublinhado tracejado em `--border`, texto sempre `--foreground`; no hover, o texto vira `accent` e a seta (`lucide-react` ArrowRight) vira `accent-strong` — o único lugar do site onde o verde mais forte aparece de forma recorrente, e só na seta, nunca no texto ou no fundo.

### Cards / Containers
- **Corner Style:** `rounded-lg` (8px).
- **Background:** `--surface` (light: bege claro / dark: verde-grafite), às vezes `--surface-secondary` ou `--surface-elevated` para variar o degrau tonal.
- **Border:** 1px `--border`.
- **Shadow Strategy:** nenhuma — ver Elevation & Depth.

### Navigation (`SiteHeader`, `components/layout/site-header.tsx`)
- Cápsula fixa (`rounded-2xl`), fundo `background` semitransparente com `backdrop-blur`, sempre a mesma estrutura em toda rota.
- Links: `text-muted`, sublinhado que cresce da esquerda no hover/foco (`after:bg-accent`), nunca cápsula ou fundo colorido.
- Sobre a hero (capa transparente), ganha `drop-shadow` na cor do próprio `--background` para legibilidade — não uma cor fixa.

### FloatingLines (assinatura visual da hero, `components/hero/floating-lines.tsx` + `themed-floating-lines.tsx`)
Shader WebGL de linhas onduladas com glow, único elemento verdadeiramente "gráfico" do site. Usa um degradê de três paradas — sálvia clara → verde médio vivo → verde profundo mineral — todas do mesmo matiz (~150–160°), para dar profundidade sem introduzir uma segunda cor. No light mode, o núcleo do glow é escalado (`uColorBoost`/`uTopBoost`) para não lavar para pastel sobre o fundo off-white; no dark mode as cores já nascem com presença ("mineral/esmeralda"), sem boost adicional. `uBaseColor` compõe exatamente o fundo do tema por trás das linhas, então o canvas nunca "corta" visualmente do CSS ao redor.

## Do's and Don'ts

### Do:
- **Do** manter verde (~155° OKLCH) como a única família de accent de marca, em light e dark.
- **Do** usar `accent-strong` só uma vez por composição (Named Rule: The Rare Strong Rule).
- **Do** manter neutros dominantes — verde é pontuação (~10–20%), nunca preenchimento de seção inteira.
- **Do** recalibrar luminância entre temas mantendo o mesmo matiz — light mais escuro que dark, nunca a mesma cor "invertida" mecanicamente.
- **Do** tratar fotografia e capturas de produto como conteúdo externo: nunca recolorir, só ajustar legibilidade com overlays neutros (preto/branco).

### Don't:
- **Don't** introduzir vermelho como cor de marca. Vermelho só pode existir no futuro como token `--destructive` separado, para erro/alerta crítico de interface — nunca reaproveitando `--accent-*`.
- **Don't** usar azul como accent de marca. Azul só pode aparecer dentro do conteúdo real de uma captura de tela de produto.
- **Don't** usar gradiente de texto (`bg-clip-text`) como tratamento decorativo — emphasis vem de peso/tamanho ou de um detalhe verde pontual (ex.: o "·" entre cargo e atuação na hero), não de um degradê ocupando o texto inteiro.
- **Don't** usar `accent-soft` como cor de corpo de texto no light mode — não tem contraste suficiente sobre um fundo tão claro; é reservado a decoração (divisores, glows, ícones).
- **Don't** adicionar sombra (`box-shadow`) para criar hierarquia — suba um degrau de `surface-*`/`tone-*` em vez disso.
- **Don't** usar verde como fundo de seção ou de card — nem para o projeto/case principal. Destaque nesse caso vem de um filete de borda, uma badge de texto, um anel fino na imagem e/ou um CTA contornado (ver "Projetos selecionados" em `selected-projects.tsx`), nunca de `bg-accent*` ou de um `surface-*`/`tone-*` com chroma alto o bastante para ler como verde.
