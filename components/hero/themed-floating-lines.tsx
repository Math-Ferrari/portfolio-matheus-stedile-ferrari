"use client";

import FloatingLines from "@/components/hero/floating-lines";
import { useTheme } from "@/components/theme/theme-provider";

/**
 * Profundidade em vez de matiz: os três stops são o MESMO verde
 * (~155° em OKLCH — musgo/floresta), variando só claridade/saturação —
 * sálvia luminosa → verde médio vivo → verde profundo mineral. Como não há
 * mais uma segunda família de cor no gradiente (era azul + vermelho antes),
 * a antiga regra de "nenhum wave pode interpolar entre dois stops de matizes
 * diferentes" deixou de ser necessária: misturar dois verdes entre si nunca
 * produz uma cor fora da família (não existe o equivalente do rosa que saía
 * de azul+vermelho se somando). `lineCount`/`lineDistance`/posição de cada
 * wave abaixo continuam as mesmas de antes — só a cor mudou.
 */
const DARK_GRADIENT = ["#8fd89e", "#10ae65", "#006738"];
/**
 * Cores puras e saturadas — não as mesmas (mais fundas) de `--accent-*` no
 * light mode em `globals.css`. Aquelas foram calibradas para texto/botões
 * sobre off-white (precisam de contraste de LEITURA); estas são para o
 * NÚCLEO do glow, que já teve seu próprio problema de saturação resolvido
 * via `uColorBoost` (ver floating-lines.tsx) — verdes desbotados aqui
 * combinados com o boost ainda saturariam pouco. Mesmo matiz do escuro
 * acima, com claridade recalibrada para não lavar sobre o fundo off-white.
 */
const LIGHT_GRADIENT = ["#82c38f", "#249057", "#00532d"];

/** Mesmos hex de `--background` em `app/globals.css`, para o shader compor
    exatamente o fundo do tema onde não há linha (ver `uBaseColor`). */
const DARK_BASE = "#11100e";
const LIGHT_BASE = "#f2efe8";

/**
 * Só o tema claro precisa: sobre `--background` quase preto, misturar pouco
 * com a base já lê como "cor escurecida", nunca lava o matiz — sobre
 * off-white o mesmo mix baixo lê como pastel (um verde pouco saturado sobre
 * branco lava para um verde-acinzentado sem vida). O boost aproxima mais do
 * traço de glowMask = 1 (cor cheia) sem estourar além dela — ver
 * `uColorBoost`. Calibrado para o núcleo virar cor sólida e só a borda/halo
 * continuar suave, não para "gritar": revisite visualmente se ainda ler
 * apagado.
 */
const LIGHT_COLOR_BOOST = 1.6;

/**
 * Extra só do `top` (o wave mais fraco, peso 0.1 — ver `uTopBoost` no
 * shader). Sem isto ele nunca sai do pastel mesmo com `LIGHT_COLOR_BOOST`: a
 * 2.4x seu pico mal passa de 20% de saturação sobre um fundo tão claro.
 * Multiplica-se a `LIGHT_COLOR_BOOST` (total ~2.4 × 3 = 7.2 só no `top`), não
 * o substitui.
 */
const LIGHT_TOP_BOOST = 1.8;

/**
 * A composição (posição/rotação das três famílias de linhas, contagem,
 * espaçamento, velocidade, resposta ao ponteiro) é a mesma nos dois temas —
 * só a cor muda, via `linesGradient` + `baseColor`. O `baseColor` é composto
 * dentro do próprio shader (`uBaseColor`), não por mix-blend-mode/opacity por
 * fora — essas alternativas ou lavam a cor das linhas (escuro→claro sobre um
 * fundo já claro) ou escurecem a tela inteira de forma uniforme; compor
 * dentro do shader evita as duas coisas.
 */
type ThemedFloatingLinesProps = {
  /**
   * Repassado direto ao `progress` de `FloatingLines` — ver o comentário
   * daquele prop. `ThemedFloatingLines` não sabe (nem precisa saber) que
   * existe uma transição de scroll; só encaminha o ref. Ausente = 0 sempre,
   * comportamento idêntico ao atual.
   */
  progressRef?: React.RefObject<number>;
  /** Repassado direto ao `linesFade` de `FloatingLines` — ver o comentário
      daquele prop. Ausente = 1 sempre (sem fade), idêntico ao atual. */
  linesFadeRef?: React.RefObject<number>;
  /** Repassado direto ao `linesExit` de `FloatingLines`. Ausente = 0 sempre
      (sem espalhamento lateral), idêntico ao atual. */
  linesExitRef?: React.RefObject<number>;
  /** Repassado direto ao `baseColorMorph` de `FloatingLines` — o quanto
      migrar de `baseColor` (a própria hero) para a superfície da PRÓXIMA
      seção (ver `nextSurface` abaixo). Ausente = shader nunca recalcula
      `uBaseColor` por frame, idêntico ao atual. */
  baseColorMorphRef?: React.RefObject<number>;
};

export function ThemedFloatingLines({
  progressRef,
  linesFadeRef,
  linesExitRef,
  baseColorMorphRef,
}: ThemedFloatingLinesProps = {}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* Alvo do morph de `uBaseColor` — a mesma superfície (`--tone-graphite`)
     que `Profile` (a seção seguinte) usa como `bg-tone-graphite`, lida ao
     vivo do token do tema (não um hex duplicado aqui): a hero só precisa
     terminar com a MESMA cor que o CSS já vai desenhar em seguida, então
     "hardcoded" aqui seria exatamente o tipo de duplicação que quebra na
     primeira vez que alguém recalibrar os tokens em `globals.css`. Lido
     direto no corpo do render (mesmo espírito de `getSnapshot` em
     `theme-provider.tsx`) — não em efeito/estado: já é reativo a `theme`
     porque este componente inteiro re-renderiza quando o contexto muda, e
     `getComputedStyle` é síncrono, então não há um frame "atrasado" com o
     valor antigo. No servidor (`document` inexistente) cai no fallback —
     a própria `baseColor` do tema, sem diferença, sem morph visível até o
     cliente montar. */
  const nextSurface =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue("--tone-graphite").trim() ||
        (isDark ? DARK_BASE : LIGHT_BASE)
      : isDark
        ? DARK_BASE
        : LIGHT_BASE;

  return (
    <FloatingLines
      linesGradient={isDark ? DARK_GRADIENT : LIGHT_GRADIENT}
      baseColor={isDark ? DARK_BASE : LIGHT_BASE}
      baseColorTo={nextSurface}
      colorBoost={isDark ? 1 : LIGHT_COLOR_BOOST}
      topBoost={isDark ? 1 : LIGHT_TOP_BOOST}
      progress={progressRef}
      linesFade={linesFadeRef}
      linesExit={linesExitRef}
      baseColorMorph={baseColorMorphRef}
      mixBlendMode="normal"
      enabledWaves={["top", "middle", "bottom"]}
      lineCount={[3, 1, 2]}
      lineDistance={[45, 30, 30]}
      topWavePosition={{ x: 3, y: 0.1, rotate: 0.3 }}
      middleWavePosition={{ x: 2, y: -1.5, rotate: 0.15 }}
      bottomWavePosition={{ x: -2, y: 0.6, rotate: -0.6 }}
      animationSpeed={0.3}
      interactive
      bendRadius={6}
      bendStrength={-0.3}
      mouseDamping={0.045}
      parallax={false}
    />
  );
}
