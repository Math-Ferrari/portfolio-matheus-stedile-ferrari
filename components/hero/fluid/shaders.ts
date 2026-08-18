/**
 * ────────────────────────────────────────────────────────────────────────────
 * GLSL do campo de fluido do hero (WebGL2 / GLSL ES 3.00).
 *
 * Solver de Stable Fluids (Jos Stam) em FBOs: advecção semi-lagrangiana,
 * confinamento de vorticidade e projeção de pressão por Jacobi. A inércia e a
 * turbulência são resultado da simulação — não há easing imitando física.
 *
 * Duas passagens são autorais e carregam o conceito "caos → estrutura":
 *
 *   - `structureShader`: perto da palavra SOFTWARE a componente vertical da
 *     velocidade é amortecida, então o escoamento vira laminar ali. A palavra
 *     organiza o campo, o tempo todo.
 *   - `displayShader`: na mesma região a densidade é quantizada em faixas
 *     discretas — o fluxo caótico "resolve" em camadas ordenadas.
 * ────────────────────────────────────────────────────────────────────────────
 */

/** `#version` precisa ser o primeiro token do fonte — sem quebra de linha antes. */
export const baseVertexShader = `#version 300 es
precision highp float;

layout(location = 0) in vec2 aPosition;

out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;

uniform vec2 uTexelSize;

void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(uTexelSize.x, 0.0);
  vR = vUv + vec2(uTexelSize.x, 0.0);
  vT = vUv + vec2(0.0, uTexelSize.y);
  vB = vUv - vec2(0.0, uTexelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const clearShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uValue;

void main () {
  fragColor = uValue * texture(uTexture, vUv);
}
`;

/** Injeta impulso (velocidade) ou matéria (dye) com queda gaussiana. */
export const splatShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTarget;
uniform float uAspectRatio;
uniform vec3 uColor;
uniform vec2 uPoint;
uniform float uRadius;

void main () {
  vec2 p = vUv - uPoint;
  p.x *= uAspectRatio;
  vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
  vec3 base = texture(uTarget, vUv).xyz;
  fragColor = vec4(base + splat, 1.0);
}
`;

/**
 * Injeta impulso/energia ao longo de um SEGMENTO (cápsula), não de um ponto.
 *
 * É a peça que faltava para o rastro do ponteiro parecer contínuo: um ponto só
 * cobre uma área minúscula, então um gesto rápido — cujos eventos de
 * pointermove chegam espaçados no espaço — virava uma sequência de manchas
 * desconectadas. Com a distância medida até o SEGMENTO entre a posição
 * anterior e a atual, o trecho inteiro percorrido pelo cursor fica coberto em
 * um único draw call, não importa a velocidade do gesto.
 */
export const segmentSplatShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTarget;
uniform float uAspectRatio;
uniform vec3 uColor;
uniform vec2 uPointA;
uniform vec2 uPointB;
uniform float uRadius;

void main () {
  vec2 p = vUv;
  p.x *= uAspectRatio;
  vec2 a = uPointA;
  a.x *= uAspectRatio;
  vec2 b = uPointB;
  b.x *= uAspectRatio;

  vec2 ab = b - a;
  float len2 = max(dot(ab, ab), 1e-7);
  float t = clamp(dot(p - a, ab) / len2, 0.0, 1.0);
  vec2 delta = p - (a + ab * t);

  vec3 splat = exp(-dot(delta, delta) / uRadius) * uColor;
  vec3 base = texture(uTarget, vUv).xyz;
  fragColor = vec4(base + splat, 1.0);
}
`;

export const advectionShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uDissipation;

void main () {
  vec2 coord = vUv - uDt * texture(uVelocity, vUv).xy * uTexelSize;
  vec4 result = texture(uSource, coord);
  float decay = 1.0 + uDissipation * uDt;
  fragColor = result / decay;
}
`;

export const divergenceShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;

uniform sampler2D uVelocity;

void main () {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;

  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }

  float div = 0.5 * (R - L + T - B);
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}
`;

export const curlShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;

uniform sampler2D uVelocity;

void main () {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  fragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`;

/** Confinamento de vorticidade: devolve ao campo o detalhe turbulento que a
    advecção numérica dissipa. É o que dá "vida" ao fluido em repouso. */
export const vorticityShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;

uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uCurlStrength;
uniform float uDt;

void main () {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;

  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= uCurlStrength * C;
  force.y *= -1.0;

  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity += force * uDt;
  velocity = clamp(velocity, -1000.0, 1000.0);
  fragColor = vec4(velocity, 0.0, 1.0);
}
`;

export const pressureShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;

uniform sampler2D uPressure;
uniform sampler2D uDivergence;

void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  fragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`;

export const gradientSubtractShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;

uniform sampler2D uPressure;
uniform sampler2D uVelocity;

void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity -= vec2(R - L, T - B);
  fragColor = vec4(velocity, 0.0, 1.0);
}
`;

/**
 * "Caos → estrutura", parte 1 (física).
 *
 * Dentro do retângulo da palavra SOFTWARE a componente vertical da velocidade
 * é amortecida e um leve arrasto horizontal é somado: o escoamento turbulento
 * vira laminar ao chegar perto da palavra. Roda ANTES da projeção de pressão,
 * como qualquer outra força, para não reintroduzir divergência.
 */
export const structureShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uVelocity;
uniform vec4 uStructure;
uniform float uAspectRatio;
uniform float uStrength;
uniform float uFalloff;

void main () {
  vec2 velocity = texture(uVelocity, vUv).xy;

  vec2 nearest = clamp(vUv, uStructure.xy, uStructure.zw);
  vec2 delta = (vUv - nearest) * vec2(uAspectRatio, 1.0);
  float order = 1.0 - smoothstep(0.0, uFalloff, length(delta));

  float k = order * uStrength;
  velocity.y = mix(velocity.y, 0.0, k);
  velocity.x = mix(velocity.x, velocity.x + 0.35, k * 0.5);

  fragColor = vec4(velocity, 0.0, 1.0);
}
`;

/**
 * Semeia ruído na densidade. A advecção estica esse ruído em filamentos — é
 * daí que vem a aparência de fluxo de dados, sem custo de LIC por pixel.
 * Reinjeção contínua em amplitude baixa impede o campo de homogeneizar.
 */
export const seedShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTarget;
uniform sampler2D uVelocity;
uniform float uAmount;
uniform float uScale;
uniform vec2 uOffset;
uniform float uThreshold;
uniform float uVelocityGate;

float hash21 (vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise (vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main () {
  float n = valueNoise(vUv * uScale + uOffset);
  n = smoothstep(uThreshold, 1.0, n);

  // Só semeia onde há escoamento para esticar o ruído. Sem esta porta, uma
  // região parada acumula ruído que nunca é advectado e aparece como chuvisco
  // estático — visível sobretudo em telas altas, onde o fluxo não alcança a
  // parte de baixo. Na semeadura inicial uVelocityGate e 0 (semeia tudo).
  float speed = length(texture(uVelocity, vUv).xy);
  float gate = mix(1.0, smoothstep(0.5, 8.0, speed), uVelocityGate);

  float base = texture(uTarget, vUv).r;
  fragColor = vec4(base + n * uAmount * gate, 0.0, 0.0, 1.0);
}
`;

/**
 * Blur de caixa 3x3 (pesos 1-2-1), duas passagens em ping-pong desde o motor
 * para um alcance maior. Roda na resolução baixa do dye — o custo não
 * acompanha o tamanho do canvas. É o "bloom pobre": nenhuma técnica de
 * post-processing inteira, só duas passagens de um shader de 9 amostras.
 */
export const blurShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform vec2 uTexelSize;
uniform float uSpread;

void main () {
  vec2 t = uTexelSize * uSpread;
  float sum = 0.0;
  sum += texture(uTexture, vUv + vec2(-t.x, -t.y)).r;
  sum += texture(uTexture, vUv + vec2(0.0, -t.y)).r * 2.0;
  sum += texture(uTexture, vUv + vec2(t.x, -t.y)).r;
  sum += texture(uTexture, vUv + vec2(-t.x, 0.0)).r * 2.0;
  sum += texture(uTexture, vUv).r * 4.0;
  sum += texture(uTexture, vUv + vec2(t.x, 0.0)).r * 2.0;
  sum += texture(uTexture, vUv + vec2(-t.x, t.y)).r;
  sum += texture(uTexture, vUv + vec2(0.0, t.y)).r * 2.0;
  sum += texture(uTexture, vUv + vec2(t.x, t.y)).r;
  fragColor = vec4(sum / 16.0, 0.0, 0.0, 1.0);
}
`;

/**
 * "Caos → estrutura" (visual) + trava de legibilidade + rampa de energia.
 *
 * Duas camadas compostas:
 *
 *   1. `uDye` — textura ambiente (ruído esticado pela advecção). Sempre
 *      presente, discreta, é o estado ocioso. Perto da palavra a densidade é
 *      quantizada em faixas (o fluxo "resolve" em camadas ordenadas).
 *   2. `uEnergy`/`uEnergyGlow` — o rastro que o ponteiro desenha no fluido.
 *      Núcleo nítido + halo desfocado, com uma rampa própria
 *      papel → navy (sombra) → azul → ciano quase branco (núcleo), passada por
 *      tonemap (`1 - exp(-x·k)`) para o pico de um gesto rápido "estourar" em
 *      vez de saturar de forma abrupta.
 *
 * `uMaxTint`/`uEnergyMax` limitam o quanto cada camada pode escurecer/clarear
 * o papel — restrição de contraste para o texto por cima, não estética.
 */
export const displayShader = `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uDye;
uniform sampler2D uEnergy;
uniform sampler2D uEnergyGlow;
uniform vec3 uPaper;
uniform vec3 uInk;
uniform vec3 uEnergyCore;
uniform vec3 uEnergyShadow;
uniform vec4 uStructure;
uniform float uAspectRatio;
uniform float uIntensity;
uniform float uMaxTint;
uniform float uFalloff;
uniform float uBands;
uniform float uEnergyGain;
uniform float uEnergyMax;
uniform float uGlowWeight;
/**
 * Modo de diagnóstico temporário (?fluidDebug=1). Substitui a composição
 * elegante por contraste absurdo — fundo verde-limão, energia em magenta puro
 * SEM tonemap, amplificada 6x — para responder uma pergunta binária: o
 * pipeline pointer→splat→FBO→advecção→display→canvas está entregando ALGUM
 * pixel não-zero na tela? Se nem isto aparecer, o problema é de composição
 * (algo cobrindo o canvas) ou de pipeline (motor não iniciou), não de
 * calibração de constante.
 */
uniform float uDebugMode;

vec3 energyRamp (float t) {
  vec3 c = mix(uPaper, uEnergyShadow, smoothstep(0.0, 0.22, t));
  c = mix(c, uInk, smoothstep(0.18, 0.55, t));
  c = mix(c, uEnergyCore, smoothstep(0.55, 1.0, t));
  return c;
}

void main () {
  float core = texture(uEnergy, vUv).r;
  float glow = texture(uEnergyGlow, vUv).r;

  if (uDebugMode > 0.5) {
    vec3 debugBg = vec3(0.82, 0.96, 0.08);
    vec3 debugEnergy = vec3(1.0, 0.0, 0.85);
    float raw = core + glow * 0.55;
    // Sem tonemap de propósito: aqui queremos que QUALQUER valor não-zero,
    // por menor que seja, vire magenta saturado — o oposto da calibração
    // "elegante" do modo normal.
    float e = clamp(raw * 6.0, 0.0, 1.0);
    vec3 color = mix(debugBg, debugEnergy, e);
    // Marcador fixo no canto: prova que o shader está rodando de fato,
    // independente do conteúdo do buffer de energia estar vazio ou não.
    if (vUv.x < 0.025 && vUv.y > 0.975) {
      color = vec3(0.0, 1.0, 0.0);
    }
    fragColor = vec4(color, 1.0);
    return;
  }

  float d = texture(uDye, vUv).r * uIntensity;

  vec2 nearest = clamp(vUv, uStructure.xy, uStructure.zw);
  vec2 delta = (vUv - nearest) * vec2(uAspectRatio, 1.0);
  float order = 1.0 - smoothstep(0.0, uFalloff, length(delta));

  float f = smoothstep(0.03, 0.60, d);
  float banded = floor(f * uBands) / uBands;
  f = mix(f, banded, order * 0.85);

  vec3 ambient = mix(uPaper, uInk, clamp(f, 0.0, 1.0) * uMaxTint);

  // núcleo nítido + halo (o halo pesa pouco de propósito: é o acabamento ao
  // redor, não o que deve dar a impressão de tamanho do rastro).
  float raw = core + glow * uGlowWeight;
  float energy = 1.0 - exp(-raw * uEnergyGain);

  vec3 color = mix(ambient, energyRamp(energy), min(energy, uEnergyMax));
  fragColor = vec4(color, 1.0);
}
`;
