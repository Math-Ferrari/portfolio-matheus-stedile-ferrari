"use client";

import { useEffect, useRef } from "react";
import {
  Clock,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

import "./floating-lines.css";

/**
 * ────────────────────────────────────────────────────────────────────────────
 * FloatingLines — port TypeScript do componente original do React Bits
 * (reactbits.dev/backgrounds/floating-lines, variante JS + CSS).
 *
 * Fonte de verdade: o source fornecido pelo usuário. Shader, geometria e
 * ciclo de vida do WebGL são transcritos 1:1 — as únicas mudanças em relação
 * ao source original são de tipagem (props, refs, uniforms, mesmo espírito
 * do port já feito para `aurora.tsx`) e a extensão de performance descrita no
 * bloco "Pausa" abaixo, que não altera o algoritmo em si, só quando o loop de
 * animação roda.
 * ────────────────────────────────────────────────────────────────────────────
 */

const vertexShader = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

/**
 * Único acréscimo ao shader original: em vez de compor sempre sobre preto
 * (fragColor = vec4(col, 1.0)), a cor "vazia" agora vem de um uniform.
 * Com uBaseColor = vec3(0.0) (o default) o resultado é visualmente idêntico
 * ao original — o restante do shader (wave/bend/gradiente) não muda em nada.
 * Isso é o que permite ao componente funcionar sobre um fundo claro sem
 * depender de mix-blend-mode/opacity por fora, que lavam a cor ou escurecem a
 * tela inteira (ver themed-floating-lines.tsx).
 */
uniform vec3 uBaseColor;

/**
 * Segundo acréscimo ao shader original (o primeiro é uBaseColor, acima).
 * Antes do glow/mix final, \`col\` (soma vetorial das linhas visíveis num
 * pixel) raramente ultrapassa magnitude 1 no pico de uma linha "fraca" (ex.:
 * o wave \`bottom\`, com peso 0.2) — glowMask = clamp(length(col), 0, 1) fica
 * bem abaixo de 1, então a maior parte do traço nunca chega perto da cor
 * pura e passa a maior parte do tempo misturada com uBaseColor.
 *
 * Sobre preto (dark) isso já lê bem: misturar pouco com preto só escurece a
 * cor, sem lavar o matiz. Sobre off-white (light) o mesmo mix baixo lava
 * qualquer matiz para pastel. uColorBoost escala \`col\` (mesma direção/matiz,
 * já que é um escalar uniforme) só para aproximar mais pixels de glowMask = 1
 * — o NÚCLEO passa a carregar a cor cheia por um raio maior; a cauda (halo)
 * mantém a mesma curva de queda, só cruza o teto de saturação mais cedo.
 * Não pode estourar além da própria cor (glowMask segue clampado em 1), então
 * não vira neon/HDR. Default 1.0 reproduz exatamente o comportamento
 * original — só o tema claro usa um valor maior (ver themed-floating-lines).
 */
uniform float uColorBoost;

/**
 * Multiplicador extra só do wave "top" (soma-se a uColorBoost, não o
 * substitui). Existe porque "top" já nasce com peso 0.1 no acúmulo de col
 * (dez vezes mais fraco que "middle") — mesmo com uColorBoost alto seu pico
 * continua muito abaixo de glowMask = 1, então sobre off-white ele lava para
 * pastel antes de "middle"/"bottom" (mais fortes) saturarem. Default 1.0
 * (sem efeito; dark mode não usa isto — ver themed-floating-lines.tsx).
 */
uniform float uTopBoost;

/**
 * Terceiro acréscimo: 0..1, escrito pelo componente pai a partir do scroll
 * (ver a prop "progress" em hero-transition.tsx) — o shader não lê o DOM nem
 * sabe o que é "scroll", só recebe este número já pronto. Default 0.0
 * reproduz exatamente o comportamento original (sem esta prop, nada muda).
 * Dois efeitos, os dois puramente aditivos:
 *
 * (1) Convergência: em vez de misturar geometria/waves de verdade (exigiria
 * reescrever wave()), cada família desloca seu offset vertical
 * (*WavePosition.y) em direção ao mesmo alvo (CONVERGE_Y) — como as três já
 * têm rotações/amplitudes diferentes, aproximar só a origem já basta para a
 * leitura de "estão sendo puxadas para o mesmo lugar", sem precisar tocar em
 * wave() nem nos gradientes.
 *
 * (2) Impacto: um bump pequeno e temporário de brilho perto do fim do range
 * de convergência (ver "impact" em mainImage) — não estoura além da cor
 * (mesmo clamp de glowMask de sempre), então não vira flash/neon.
 */
uniform float uScrollProgress;

/**
 * Quarto acréscimo: 0..1, também aditivo (default 1.0 = sem efeito). Escala
 * "col" (a soma das linhas) igual uColorBoost, mas para o sentido oposto —
 * BAIXAR a magnitude, não subir. Existe para a transição da hero: conforme a
 * próxima seção nasce e cresce por cima (ver mask em hero-transition.tsx),
 * as linhas precisam ficar progressivamente mais fracas, como se estivessem
 * sendo absorvidas pela nova superfície, não só cobertas por ela. Como
 * glowMask já é clamp(length(col), 0, 1), reduzir a magnitude empurra o
 * pixel de volta para uBaseColor de forma suave — o mesmo mecanismo do
 * boost, invertido.
 */
uniform float uLinesFade;

/**
 * Quinto acréscimo: 0..1, aditivo (default 0.0 = sem efeito). Empurra o
 * offset horizontal de "bottom"/"top" para longe do centro (sentidos
 * opostos) — "middle" fica parado, é o eixo de referência. Junto com
 * uLinesFade (que já cai a zero na mesma janela, escolhida por quem chama),
 * dá a leitura de "as linhas estão saindo pelas laterais enquanto
 * desaparecem", sem precisar reescrever wave()/geometria.
 */
uniform float uLinesExit;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);

  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }

  vec3 gradientColor;

  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);

    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];

    gradientColor = mix(c1, c2, f);
  }

  return gradientColor * 0.5;
}

  float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius); // radial falloff around cursor
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;

  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);

  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  /* Alvo comum de convergência (ver uScrollProgress acima) — centro vertical
     do canvas em baseUv, não uma posição arbitrária. Em uScrollProgress = 0
     cada mix() devolve exatamente *WavePosition.y (sem efeito). */
  const float CONVERGE_Y = 0.0;
  float bottomY = mix(bottomWavePosition.y, CONVERGE_Y, uScrollProgress);
  float middleY = mix(middleWavePosition.y, CONVERGE_Y, uScrollProgress);
  float topY    = mix(topWavePosition.y, CONVERGE_Y, uScrollProgress);

  /* Saída lateral (ver uLinesExit acima) — sentidos opostos para bottom/top
     abrirem para fora; middle fica no eixo, sem deslocamento. */
  const float EXIT_SPREAD = 1.6;
  float bottomX = bottomWavePosition.x - uLinesExit * EXIT_SPREAD;
  float topX    = topWavePosition.x + uLinesExit * EXIT_SPREAD;

  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomX, bottomY),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleY),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topX, topY),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.1 * uTopBoost;
    }
  }

  /* col aponta sempre na mesma direcao ao longo do perfil de uma linha (so
     a magnitude cai com a distancia ate a curva) — dividir por essa
     magnitude da a cor "pura" da linha (lineHue), independente de estar no
     nucleo ou na cauda do brilho. Misturar uBaseColor -> lineHue usando a
     propria magnitude (clampada a 1) como peso reproduz o original de
     forma exata com uBaseColor preto: para magnitude <= 1,
     mix(preto, col/mag, mag) = col; para magnitude > 1 (nucleo bem perto da
     curva), o resultado e o vetor unitario, que e exatamente o que o clamp
     de exibicao do original já fazia. Com uBaseColor claro, a mesma conta
     funciona sem lavar a cor: a cauda (magnitude baixa) fica quase toda
     fundo, o nucleo (magnitude alta) satura na cor cheia da linha. */
  /* Bump de brilho perto do fim da convergência (uScrollProgress -> 1): sobe
     e desce como um triângulo, pico em 0.85 — "momento de impacto" (ver
     hero-transition.tsx), não um estado permanente. clamp() dos dois lados
     garante que nunca fica negativo fora do range. Continua sujeito ao mesmo
     clamp de glowMask abaixo, então não estoura além da própria cor. */
  float impactRise = smoothstep(0.55, 0.85, uScrollProgress);
  float impactFall = smoothstep(0.85, 1.0, uScrollProgress);
  float impact = impactRise * (1.0 - impactFall);
  col *= 1.0 + 0.15 * impact;

  col *= uColorBoost * uLinesFade;
  float glowLength = length(col);
  float glowMask = clamp(glowLength, 0.0, 1.0);
  vec3 lineHue = col / max(glowLength, 1e-5);
  vec3 finalColor = mix(uBaseColor, lineHue, glowMask);

  fragColor = vec4(finalColor, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

function hexToVec3(hex: string): Vector3 {
  let value = hex.trim();

  if (value.startsWith("#")) {
    value = value.slice(1);
  }

  let r = 255;
  let g = 255;
  let b = 255;

  if (value.length === 3) {
    r = parseInt(value[0]! + value[0], 16);
    g = parseInt(value[1]! + value[1], 16);
    b = parseInt(value[2]! + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }

  return new Vector3(r / 255, g / 255, b / 255);
}

export type FloatingLinesWave = "top" | "middle" | "bottom";

export type FloatingLinesWavePosition = {
  x: number;
  y: number;
  rotate: number;
};

export type FloatingLinesProps = {
  linesGradient?: string[];
  enabledWaves?: FloatingLinesWave[];
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: Partial<FloatingLinesWavePosition>;
  middleWavePosition?: Partial<FloatingLinesWavePosition>;
  bottomWavePosition?: Partial<FloatingLinesWavePosition>;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
  /**
   * Cor de fundo composta pelo próprio shader onde não há linha (ver
   * `uBaseColor` no fragment shader acima). Não faz parte do source
   * original — é o único prop novo, default `"#000000"` para reproduzir
   * exatamente o comportamento original.
   */
  baseColor?: string;
  /**
   * Escala a magnitude de `col` antes do glow/mix final (ver `uColorBoost`
   * no shader acima) — só afeta quanto do traço chega a glowMask = 1 (cor
   * cheia), não a posição/forma das linhas. Default `1` reproduz o
   * comportamento original.
   */
  colorBoost?: number;
  /**
   * Multiplicador extra só do wave `top` (ver `uTopBoost` no shader) — o
   * único com peso tão baixo (0.1) que `colorBoost` sozinho não é
   * suficiente para tirá-lo do pastel sobre um fundo claro. Default `1`
   * reproduz o comportamento original.
   */
  topBoost?: number;
  /**
   * 0..1, lido a cada frame do loop de render já existente (ver `uniforms.
   * uScrollProgress.value = progress?.current ?? 0` abaixo) — nunca via prop
   * simples, que forçaria um re-render React por frame. Um `ref` porque só
   * quem chama sabe calcular isto (normalmente a partir do scroll, via
   * `hero-transition.tsx`); o shader não acopla com o DOM/Lenis, só lê o
   * número. Ausente = sempre 0 = comportamento idêntico ao atual.
   */
  progress?: React.RefObject<number>;
  /**
   * 0..1, mesmo mecanismo de `progress` (ref, lido no loop de render, nunca
   * uma prop reativa) — ver `uLinesFade` no shader. `1` (default, também o
   * valor quando a ref está ausente) reproduz o comportamento atual sem
   * nenhum efeito; valores menores apagam as linhas em direção a
   * `baseColor`, para a "absorção" pela próxima seção durante a transição.
   */
  linesFade?: React.RefObject<number>;
  /**
   * 0..1, mesmo mecanismo — ver `uLinesExit` no shader. `0` (default,
   * também o valor quando a ref está ausente) reproduz o comportamento
   * atual; valores maiores abrem "bottom"/"top" para as laterais.
   */
  linesExit?: React.RefObject<number>;
  /**
   * Cor (hex) para onde `uBaseColor` deve migrar ao longo de `baseColorMorph`
   * — pensado para a hero herdar visualmente a superfície da PRÓXIMA seção
   * perto do fim da transição (ver hero-transition.tsx), sem costura entre
   * o canvas (WebGL, sempre opaco onde não há linha) e o CSS ao redor dele.
   * Ausente = `uBaseColor` fica fixo em `baseColor`, exatamente como hoje —
   * só quando os dois props (`baseColorTo` + `baseColorMorph`) existem é que
   * o loop de render passa a recalcular `uBaseColor` a cada frame.
   */
  baseColorTo?: string;
  /** 0..1 — o quanto migrar de `baseColor` para `baseColorTo`. Ver `baseColorTo`. */
  baseColorMorph?: React.RefObject<number>;
};

export default function FloatingLines({
  linesGradient,
  enabledWaves = ["top", "middle", "bottom"],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = "screen",
  baseColor = "#000000",
  colorBoost = 1,
  topBoost = 1,
  progress,
  linesFade,
  linesExit,
  baseColorTo,
  baseColorMorph,
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetMouseRef = useRef(new Vector2(-1000, -1000));
  const currentMouseRef = useRef(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef(0);
  const currentInfluenceRef = useRef(0);
  const targetParallaxRef = useRef(new Vector2(0, 0));
  const currentParallaxRef = useRef(new Vector2(0, 0));

  const getLineCount = (waveType: FloatingLinesWave): number => {
    if (typeof lineCount === "number") return lineCount;
    if (!enabledWaves.includes(waveType)) return 0;
    const index = enabledWaves.indexOf(waveType);
    return lineCount[index] ?? 6;
  };

  const getLineDistance = (waveType: FloatingLinesWave): number => {
    if (typeof lineDistance === "number") return lineDistance;
    if (!enabledWaves.includes(waveType)) return 0.1;
    const index = enabledWaves.indexOf(waveType);
    return lineDistance[index] ?? 0.1;
  };

  const topLineCount = enabledWaves.includes("top") ? getLineCount("top") : 0;
  const middleLineCount = enabledWaves.includes("middle") ? getLineCount("middle") : 0;
  const bottomLineCount = enabledWaves.includes("bottom") ? getLineCount("bottom") : 0;

  const topLineDistance = enabledWaves.includes("top") ? getLineDistance("top") * 0.01 : 0.01;
  const middleLineDistance = enabledWaves.includes("middle") ? getLineDistance("middle") * 0.01 : 0.01;
  const bottomLineDistance = enabledWaves.includes("bottom") ? getLineDistance("bottom") * 0.01 : 0.01;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;

    const scene = new Scene();

    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },

      enableTop: { value: enabledWaves.includes("top") },
      enableMiddle: { value: enabledWaves.includes("middle") },
      enableBottom: { value: enabledWaves.includes("bottom") },

      topLineCount: { value: topLineCount },
      middleLineCount: { value: middleLineCount },
      bottomLineCount: { value: bottomLineCount },

      topLineDistance: { value: topLineDistance },
      middleLineDistance: { value: middleLineDistance },
      bottomLineDistance: { value: bottomLineDistance },

      topWavePosition: {
        value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4),
      },
      middleWavePosition: {
        value: new Vector3(
          middleWavePosition?.x ?? 5.0,
          middleWavePosition?.y ?? 0.0,
          middleWavePosition?.rotate ?? 0.2,
        ),
      },
      bottomWavePosition: {
        value: new Vector3(
          bottomWavePosition?.x ?? 2.0,
          bottomWavePosition?.y ?? -0.7,
          bottomWavePosition?.rotate ?? 0.4,
        ),
      },

      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },

      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },

      lineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)),
      },
      lineGradientCount: { value: 0 },

      uBaseColor: { value: hexToVec3(baseColor) },
      uColorBoost: { value: colorBoost },
      uTopBoost: { value: topBoost },
      uScrollProgress: { value: progress?.current ?? 0 },
      uLinesFade: { value: linesFade?.current ?? 1 },
      uLinesExit: { value: linesExit?.current ?? 0 },
    };

    // Extremos do morph de uBaseColor (ver o comentário de `baseColorTo` na
    // prop) — calculados uma vez aqui, não a cada frame; só `renderLoop`
    // interpola entre eles usando `baseColorMorph.current`.
    const baseColorFromVec = hexToVec3(baseColor);
    const baseColorToVec = baseColorTo ? hexToVec3(baseColorTo) : null;

    if (linesGradient && linesGradient.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      uniforms.lineGradientCount.value = stops.length;

      stops.forEach((hex, i) => {
        const color = hexToVec3(hex);
        uniforms.lineGradient.value[i]?.set(color.x, color.y, color.z);
      });
    }

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();

    const setSize = () => {
      if (!active) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      renderer.setSize(width, height, false);

      const canvasWidth = renderer.domElement.width;
      const canvasHeight = renderer.domElement.height;
      uniforms.iResolution.value.set(canvasWidth, canvasHeight, 1);
    };

    setSize();

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (!active) return;
            setSize();
          })
        : null;

    if (ro) ro.observe(container);

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dpr = renderer.getPixelRatio();

      targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr);
      targetInfluenceRef.current = 1.0;

      if (parallax) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (x - centerX) / rect.width;
        const offsetY = -(y - centerY) / rect.height;
        targetParallaxRef.current.set(offsetX * parallaxStrength, offsetY * parallaxStrength);
      }
    };

    const handlePointerLeave = () => {
      targetInfluenceRef.current = 0.0;
    };

    if (interactive) {
      renderer.domElement.addEventListener("pointermove", handlePointerMove);
      renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    }

    /**
     * ── Pausa (extensão, não presente no source original) ──────────────────
     * O `requestAnimationFrame` original roda incondicionalmente. Aqui ele só
     * dispara quando a seção está de fato visível E a aba está em primeiro
     * plano — sem tocar no shader/matemática da animação, só em quando o
     * loop roda: um `IntersectionObserver` (rolou para fora → pausa) e
     * `visibilitychange` (aba em segundo plano → pausa), ambos convergindo em
     * `startIfNeeded`, a única porta de entrada do loop. Em
     * `prefers-reduced-motion`, o loop nunca inicia: o render inicial abaixo
     * já deixa um frame estático na tela.
     */
    const reducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let inView = true;
    let raf = 0;

    const renderLoop = () => {
      if (!(active && inView && document.visibilityState === "visible")) {
        raf = 0;
        return;
      }

      uniforms.iTime.value = clock.getElapsedTime();
      uniforms.uScrollProgress.value = progress?.current ?? 0;
      uniforms.uLinesFade.value = linesFade?.current ?? 1;
      uniforms.uLinesExit.value = linesExit?.current ?? 0;

      if (baseColorToVec) {
        const raw = baseColorMorph?.current ?? 0;
        const m = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        const target = uniforms.uBaseColor.value as Vector3;
        target.set(
          baseColorFromVec.x + (baseColorToVec.x - baseColorFromVec.x) * m,
          baseColorFromVec.y + (baseColorToVec.y - baseColorFromVec.y) * m,
          baseColorFromVec.z + (baseColorToVec.z - baseColorFromVec.z) * m,
        );
      }

      if (interactive) {
        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
        uniforms.iMouse.value.copy(currentMouseRef.current);

        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
        uniforms.bendInfluence.value = currentInfluenceRef.current;
      }

      if (parallax) {
        currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
        uniforms.parallaxOffset.value.copy(currentParallaxRef.current);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderLoop);
    };

    const startIfNeeded = () => {
      if (reducedMotion || raf !== 0) return;
      if (active && inView && document.visibilityState === "visible") {
        raf = requestAnimationFrame(renderLoop);
      }
    };

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            inView = entry?.isIntersecting ?? true;
            startIfNeeded();
          })
        : null;
    if (io) io.observe(container);

    const handleVisibilityChange = () => startIfNeeded();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    renderer.render(scene, camera);
    startIfNeeded();

    return () => {
      active = false;

      cancelAnimationFrame(raf);

      if (ro) ro.disconnect();
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (interactive) {
        renderer.domElement.removeEventListener("pointermove", handlePointerMove);
        renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    linesGradient,
    baseColor,
    baseColorTo,
    colorBoost,
    topBoost,
    enabledWaves,
    lineCount,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength,
    // `progress`/`linesFade`/`linesExit`/`baseColorMorph` ficam de fora de
    // propósito: são refs lidos a cada frame em `renderLoop` (via
    // `.current`), não valores reativos — colocá-los aqui recriaria o
    // WebGLRenderer inteiro a cada troca de progresso.
  ]);

  return (
    <div
      ref={containerRef}
      className="floating-lines-container"
      style={{
        mixBlendMode,
      }}
    />
  );
}
