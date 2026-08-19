"use client";

import FloatingLines from "@/components/hero/floating-lines";
import { useTheme } from "@/components/theme/theme-provider";

/**
 * Ordem importa: um "wave" com 1 linha sempre amostra o stop de índice 0 (ver
 * `getLineColor` no shader — para 1 linha, `t = 0` sempre). Com vermelho no
 * meio, um wave de 1 linha nunca o alcança (fica preso ao azul claro), e um
 * wave de 2 linhas soa {0, ~1} = azul claro + quase-azul, pulando o vermelho
 * quase inteiramente (a interpolação só toca o vermelho numa fração
 * infinitesimal, por causa do clamp em 0.9999 do próprio shader). Isso é o
 * que mantém o "bottom" (a fita principal) livre de vermelho por completo.
 */
const DARK_GRADIENT = ["#00aaff", "#ff0000", "#0061ff"];
const LIGHT_GRADIENT = ["#0a84c4", "#c4281e", "#0047c2"];

/** Mesmos hex de `--background` em `app/globals.css`, para o shader compor
    exatamente o fundo do tema onde não há linha (ver `uBaseColor`). */
const DARK_BASE = "#050505";
const LIGHT_BASE = "#f6f2ea";

/**
 * A composição (posição/rotação das três famílias de linhas, contagem,
 * espaçamento, velocidade, resposta ao ponteiro) é a mesma nos dois temas —
 * só a cor muda, via `linesGradient` + `baseColor`. O `baseColor` é composto
 * dentro do próprio shader (`uBaseColor`), não por mix-blend-mode/opacity por
 * fora — essas alternativas ou lavam a cor das linhas (escuro→claro sobre um
 * fundo já claro) ou escurecem a tela inteira de forma uniforme; compor
 * dentro do shader evita as duas coisas.
 *
 * Rosa/magenta é o que sai de azul e vermelho se somando no mesmo pixel — é
 * física de luz aditiva (R+B, sem G), não um bug de cor isolado, e acontece
 * de dois jeitos aqui: (1) interpolação dentro do gradiente de UM wave, e
 * (2) o brilho de duas linhas de cores diferentes se tocando ao se cruzarem.
 * As duas coisas são atacadas separadamente:
 *
 * (1) `getLineColor` interpola linearmente entre stops consecutivos; para um
 * wave com N linhas, `t = índice/(N-1)`, então só N ∈ {1, 2, 3} garante que
 * todo `t` caia exatamente EM CIMA de um stop, nunca entre dois — é por isso
 * que nenhum wave aqui passa de 3 linhas.
 *
 * (2) Com vermelho isolado no `top` (o wave mais apagado, 10% do brilho) e o
 * `bottom` (a fita principal, mais visível) restrito a azul claro + azul via
 * a ordem do gradiente acima, as duas famílias de cor só coexistem dentro do
 * MESMO wave em `top` — nunca entre `top` e `bottom`, que ocupam regiões
 * diferentes da capa. `lineDistance` alto em cada wave afasta as linhas de
 * um mesmo wave entre si, reduzindo a chance de seus brilhos se tocarem.
 */
export function ThemedFloatingLines() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <FloatingLines
      linesGradient={isDark ? DARK_GRADIENT : LIGHT_GRADIENT}
      baseColor={isDark ? DARK_BASE : LIGHT_BASE}
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
