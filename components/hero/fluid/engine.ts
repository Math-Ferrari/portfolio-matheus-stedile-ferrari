/**
 * ────────────────────────────────────────────────────────────────────────────
 * Motor do campo de fluido do hero.
 *
 * Solver de Stable Fluids em GPU. Cada frame executa, em FBOs de meio-float:
 *
 *   1. impulsos pendentes (ponteiro / ambiente / entrada)
 *   2. curl  → confinamento de vorticidade      (devolve turbulência)
 *   3. estrutura                                 (lamina o fluxo na palavra)
 *   4. divergência → Jacobi de pressão → subtração de gradiente  (projeção)
 *   5. advecção da velocidade
 *   6. reinjeção de ruído + advecção da densidade
 *
 * A inércia é consequência da equação, não de easing: a velocidade injetada
 * pelo ponteiro é advectada por si mesma e só desaparece pela dissipação, o
 * que leva alguns segundos.
 *
 * Nada aqui aloca por frame. Todos os FBOs são reutilizados; trocar de
 * qualidade ou redimensionar recria os alvos uma única vez.
 * ────────────────────────────────────────────────────────────────────────────
 */

import {
  bindTexture,
  createBlitter,
  createContext,
  createDoubleFBO,
  createFBO,
  deleteDoubleFBO,
  deleteFBO,
  getResolution,
  Program,
  type Blitter,
  type DoubleFBO,
  type FBO,
  type TextureFormat,
} from "@/components/hero/fluid/gl";
import {
  advectionShader,
  baseVertexShader,
  blurShader,
  clearShader,
  curlShader,
  displayShader,
  divergenceShader,
  gradientSubtractShader,
  pressureShader,
  seedShader,
  segmentSplatShader,
  splatShader,
  structureShader,
  vorticityShader,
} from "@/components/hero/fluid/shaders";

export type Quality = {
  /** Lado menor da malha de simulação. O custo do solver escala com isto. */
  simResolution: number;
  /** Lado menor da malha de densidade. Define a finura dos filamentos. */
  dyeResolution: number;
  pressureIterations: number;
  /** Teto de devicePixelRatio para o canvas. */
  dprCap: number;
};

export const QUALITY_HIGH: Quality = {
  simResolution: 144,
  dyeResolution: 448,
  pressureIterations: 20,
  dprCap: 1.75,
};

export const QUALITY_LOW: Quality = {
  simResolution: 104,
  dyeResolution: 256,
  pressureIterations: 12,
  dprCap: 1.15,
};

/**
 * Constantes de ajuste visual. Ficam todas aqui de propósito — é o único lugar
 * a mexer para calibrar a sensação do campo.
 */
const CONFIG = {
  /**
   * Recalibração para minimalismo: ocioso quase invisível, interação como
   * perturbação LOCALIZADA que desaparece rápido — não uma mancha que cresce
   * e persiste. Cinco alavancas trabalham juntas para isso (nenhuma sozinha
   * resolveria): raio pequeno (área), dissipação alta (tempo de vida), teto
   * ambiente baixo (repouso), glow contido (o halo não pode ser o que
   * "espalha" visualmente) e ganho de tonemap moderado (resíduo difuso de
   * baixa intensidade, depois de várias interações, precisa cair abaixo do
   * limiar de visibilidade em vez de se acumular quadro a quadro).
   */
  velocityDissipation: 0.22,
  dyeDissipation: 0.65,
  /**
   * Decaimento da energia (rastro do ponteiro). A fórmula por quadro é
   * `v / (1 + k·dt)`, que composta ao longo de N quadros aproxima um
   * decaimento exponencial `exp(-k·T)`. Em k=3.2, T=1s já deixa ~4% do valor
   * original — dentro da janela de ~0.8-1.5s pedida. Em 1.1 (valor anterior)
   * ainda restava ~50% depois de 1s, e é exatamente esse resíduo que a
   * advecção ambiente ia espalhando pela tela ao longo de muitos gestos.
   */
  energyDissipation: 3.2,
  pressureDecay: 0.8,
  /** Confinamento de vorticidade: detalhe turbulento. Mantido — é o que dá
      o "curva/vórtice" no gesto, não é o que causa o espalhamento. */
  curlStrength: 26,
  /** Raio gaussiano do impulso ambiente (auto-emissores), em uv². */
  splatRadius: 0.0022,
  /**
   * Raios do rastro do ponteiro, recalibrados para ~150-200px de influência
   * visível num viewport de ~1440px (uv é proporcional à largura do canvas,
   * então a mesma fração acompanha telas maiores/menores sem lógica extra).
   * Antes (0.009) dava um raio de meia-intensidade de ~115px só de núcleo,
   * antes do glow — várias vezes maior que o pedido.
   */
  trailVelocityRadius: 0.002,
  trailEnergyRadius: 0.0014,
  seedAmountInitial: 0.85,
  seedAmountPerFrame: 0.004,
  /**
   * Texels por célula de ruído. A frequência da semente PRECISA acompanhar a
   * resolução da densidade: com escala fixa, uma textura pequena (mobile,
   * retrato) cai perto de 1 texel por célula e o campo vira chuvisco em vez de
   * filamentos, porque a advecção não tem o que esticar.
   */
  seedTexelsPerCell: 3,
  seedThreshold: 0.55,
  structureStrength: 0.6,
  structureFalloff: 0.15,
  displayBands: 6,
  /**
   * Teto de escurecimento do papel pela textura AMBIENTE (não pela energia do
   * ponteiro, que tem o próprio teto abaixo). Em 0.6 o ocioso já parecia um
   * redemoinho azul visível — o pedido agora é "quase o hero original", então
   * 0.2 deixa só uma presença de textura, não uma tinta.
   */
  maxTint: 0.2,
  /** Nº de passagens de blur (ping-pong) sobre a energia, para o glow. */
  glowPasses: 2,
  /** Alcance de cada passagem de blur, em texels da textura de dye. Menor que
      antes — o halo não pode ser o que faz o rastro "parecer" maior que é. */
  glowSpread: 1.0,
  /** Peso do glow (borrado) ao somar com o núcleo (nítido) antes do tonemap.
      Baixo de propósito: o halo é acabamento, o núcleo é o sinal. */
  glowWeight: 0.35,
  /** Ganho do tonemap (`1 - exp(-x·k)`) que comprime o pico de um gesto rápido.
      Moderado o bastante para o pico continuar vívido, mas sem empurrar
      resíduo de baixa intensidade (já espalhado pela advecção) para cima do
      limiar de visibilidade. */
  energyGain: 1.15,
  /** Teto de mistura da rampa de energia sobre o ambiente — nunca 100% para
      o papel nunca sumir por completo mesmo num traço muito forte. */
  energyMax: 0.82,
} as const;

/** Papel #f3efe7, azul #0b4fe0 e navy #0b1a33, normalizados. */
const PAPER: readonly [number, number, number] = [0.9529, 0.9373, 0.9059];
const INK: readonly [number, number, number] = [0.0431, 0.3098, 0.8784];
const NAVY: readonly [number, number, number] = [0.0431, 0.1020, 0.2];
/** Núcleo "elétrico" do rastro — mais claro e saturado que o azul de base. */
const ENERGY_CORE: readonly [number, number, number] = [0.58, 0.82, 1.0];

/** Retângulo degenerado fora da tela: nenhuma região ordenada por padrão. */
const NO_STRUCTURE: readonly [number, number, number, number] = [-9, -9, -8, -8];

type Programs = {
  clear: Program;
  splat: Program;
  segmentSplat: Program;
  advection: Program;
  divergence: Program;
  curl: Program;
  vorticity: Program;
  pressure: Program;
  gradientSubtract: Program;
  structure: Program;
  seed: Program;
  blur: Program;
  display: Program;
};

export class FluidEngine {
  private readonly gl: WebGL2RenderingContext;
  private readonly blitter: Blitter;
  private readonly programs: Programs;

  private velocity: DoubleFBO;
  private dye: DoubleFBO;
  /** Rastro do ponteiro: densidade separada do dye ambiente, própria rampa
      de cor no display. É o que dá o contraste ocioso↔interativo. */
  private energy: DoubleFBO;
  /** Versão borrada de `energy`, para o halo/glow. Em ping-pong só entre si. */
  private energyGlow: DoubleFBO;
  private pressure: DoubleFBO;
  private divergence: FBO;
  private curl: FBO;

  private quality: Quality;
  private simFormat: TextureFormat;
  private dyeFormat: TextureFormat;

  private structure: [number, number, number, number] = [...NO_STRUCTURE];
  private intensity = 0;
  private seedOffsetX = 0;
  private seedOffsetY = 0;
  private disposed = false;

  private constructor(
    gl: WebGL2RenderingContext,
    blitter: Blitter,
    programs: Programs,
    quality: Quality,
    targets: {
      velocity: DoubleFBO;
      dye: DoubleFBO;
      energy: DoubleFBO;
      energyGlow: DoubleFBO;
      pressure: DoubleFBO;
      divergence: FBO;
      curl: FBO;
    },
    formats: { sim: TextureFormat; dye: TextureFormat },
  ) {
    this.gl = gl;
    this.blitter = blitter;
    this.programs = programs;
    this.quality = quality;
    this.velocity = targets.velocity;
    this.dye = targets.dye;
    this.energy = targets.energy;
    this.energyGlow = targets.energyGlow;
    this.pressure = targets.pressure;
    this.divergence = targets.divergence;
    this.curl = targets.curl;
    this.simFormat = formats.sim;
    this.dyeFormat = formats.dye;
  }

  /** Devolve `null` quando o ambiente não suporta a simulação. */
  static create(canvas: HTMLCanvasElement, quality: Quality): FluidEngine | null {
    const gl = createContext(canvas);
    if (!gl) {
      return null;
    }

    const blitter = createBlitter(gl);
    if (!blitter) {
      return null;
    }

    const compiled: Partial<Programs> = {};
    const sources: Array<[keyof Programs, string]> = [
      ["clear", clearShader],
      ["splat", splatShader],
      ["segmentSplat", segmentSplatShader],
      ["advection", advectionShader],
      ["divergence", divergenceShader],
      ["curl", curlShader],
      ["vorticity", vorticityShader],
      ["pressure", pressureShader],
      ["gradientSubtract", gradientSubtractShader],
      ["structure", structureShader],
      ["seed", seedShader],
      ["blur", blurShader],
      ["display", displayShader],
    ];

    for (const [name, source] of sources) {
      const program = Program.create(gl, baseVertexShader, source);
      if (!program) {
        // O erro de GLSL específico já saiu por gl.ts — aqui identificamos
        // QUAL dos 13 programas foi, o que sozinho já reduz a busca de "nada
        // aparece" para um shader/uniform específico.
        console.error(`[fluid] Programa "${name}" falhou ao compilar/linkar — motor não iniciado.`);
        for (const created of Object.values(compiled)) {
          created.dispose();
        }
        blitter.dispose();
        return null;
      }
      compiled[name] = program;
    }

    const programs = compiled as Programs;

    // Velocidade precisa de 2 canais; densidade e pressão, de 1.
    const simFormat: TextureFormat = { internalFormat: gl.RG16F, format: gl.RG };
    const scalarFormat: TextureFormat = { internalFormat: gl.R16F, format: gl.RED };

    const targets = FluidEngine.createTargets(gl, quality, simFormat, scalarFormat);
    if (!targets) {
      console.error("[fluid] Falha ao criar os FBOs iniciais (velocity/dye/energy/pressão).");
      for (const created of Object.values(programs)) {
        created.dispose();
      }
      blitter.dispose();
      return null;
    }

    const engine = new FluidEngine(gl, blitter, programs, quality, targets, {
      sim: simFormat,
      dye: scalarFormat,
    });

    engine.seedDye(CONFIG.seedAmountInitial, 0);
    return engine;
  }

  private static createTargets(
    gl: WebGL2RenderingContext,
    quality: Quality,
    simFormat: TextureFormat,
    scalarFormat: TextureFormat,
  ): {
    velocity: DoubleFBO;
    dye: DoubleFBO;
    energy: DoubleFBO;
    energyGlow: DoubleFBO;
    pressure: DoubleFBO;
    divergence: FBO;
    curl: FBO;
  } | null {
    const sim = getResolution(gl, quality.simResolution);
    const dyeSize = getResolution(gl, quality.dyeResolution);

    const velocity = createDoubleFBO(gl, sim.width, sim.height, simFormat);
    const dye = createDoubleFBO(gl, dyeSize.width, dyeSize.height, scalarFormat);
    // Energia e seu glow vivem na resolução do dye — o rastro precisa da
    // mesma finura visual da textura ambiente, e o blur fica barato por sair
    // dessa resolução baixa, não da do canvas.
    const energy = createDoubleFBO(gl, dyeSize.width, dyeSize.height, scalarFormat);
    const energyGlow = createDoubleFBO(gl, dyeSize.width, dyeSize.height, scalarFormat);
    const pressure = createDoubleFBO(gl, sim.width, sim.height, scalarFormat);
    const divergence = createFBO(gl, sim.width, sim.height, scalarFormat);
    const curl = createFBO(gl, sim.width, sim.height, scalarFormat);

    if (!velocity || !dye || !energy || !energyGlow || !pressure || !divergence || !curl) {
      if (velocity) deleteDoubleFBO(gl, velocity);
      if (dye) deleteDoubleFBO(gl, dye);
      if (energy) deleteDoubleFBO(gl, energy);
      if (energyGlow) deleteDoubleFBO(gl, energyGlow);
      if (pressure) deleteDoubleFBO(gl, pressure);
      if (divergence) deleteFBO(gl, divergence);
      if (curl) deleteFBO(gl, curl);
      return null;
    }

    return { velocity, dye, energy, energyGlow, pressure, divergence, curl };
  }

  private get aspectRatio(): number {
    const { drawingBufferWidth: w, drawingBufferHeight: h } = this.gl;
    return h > 0 ? w / h : 1;
  }

  /** Recria os alvos quando o canvas ou a qualidade mudam de tamanho. */
  private rebuildTargets(): void {
    const gl = this.gl;
    const sim = getResolution(gl, this.quality.simResolution);

    if (sim.width === this.velocity.width && sim.height === this.velocity.height) {
      const dyeSize = getResolution(gl, this.quality.dyeResolution);
      if (dyeSize.width === this.dye.width && dyeSize.height === this.dye.height) {
        return;
      }
    }

    const targets = FluidEngine.createTargets(
      gl,
      this.quality,
      this.simFormat,
      this.dyeFormat,
    );
    if (!targets) {
      return;
    }

    deleteDoubleFBO(gl, this.velocity);
    deleteDoubleFBO(gl, this.dye);
    deleteDoubleFBO(gl, this.energy);
    deleteDoubleFBO(gl, this.energyGlow);
    deleteDoubleFBO(gl, this.pressure);
    deleteFBO(gl, this.divergence);
    deleteFBO(gl, this.curl);

    this.velocity = targets.velocity;
    this.dye = targets.dye;
    this.energy = targets.energy;
    this.energyGlow = targets.energyGlow;
    this.pressure = targets.pressure;
    this.divergence = targets.divergence;
    this.curl = targets.curl;

    // Sem isto o campo apareceria vazio depois de um resize.
    this.seedDye(CONFIG.seedAmountInitial, 0);
  }

  resize(): void {
    if (this.disposed) return;
    this.rebuildTargets();
  }

  setQuality(quality: Quality): void {
    if (this.disposed) return;
    this.quality = quality;
    this.rebuildTargets();
  }

  getQuality(): Quality {
    return this.quality;
  }

  /** Rampa de entrada, 0 → 1. Multiplica a densidade no shader de display. */
  setIntensity(value: number): void {
    this.intensity = Math.min(Math.max(value, 0), 1);
  }

  /** Retângulo (em uv, y para cima) da palavra que organiza o campo. */
  setStructureRect(x0: number, y0: number, x1: number, y1: number): void {
    this.structure[0] = x0;
    this.structure[1] = y0;
    this.structure[2] = x1;
    this.structure[3] = y1;
  }

  clearStructureRect(): void {
    this.structure[0] = NO_STRUCTURE[0];
    this.structure[1] = NO_STRUCTURE[1];
    this.structure[2] = NO_STRUCTURE[2];
    this.structure[3] = NO_STRUCTURE[3];
  }

  /**
   * Injeta impulso e matéria em um ponto.
   * `x`/`y` em uv (y para cima); `dx`/`dy` já multiplicados pela força.
   */
  splat(x: number, y: number, dx: number, dy: number, dyeAmount: number): void {
    if (this.disposed) return;

    const gl = this.gl;
    const aspect = this.aspectRatio;
    const splat = this.programs.splat;

    splat.use();
    splat.vec2("uTexelSize", this.velocity.texelSizeX, this.velocity.texelSizeY);
    splat.float("uAspectRatio", aspect);
    splat.vec2("uPoint", x, y);
    splat.float("uRadius", CONFIG.splatRadius);

    splat.int("uTarget", bindTexture(gl, this.velocity.read.texture, 0));
    splat.vec3("uColor", dx, dy, 0);
    this.blitter.blit(this.velocity.write);
    this.velocity.swap();

    if (dyeAmount > 0) {
      splat.int("uTarget", bindTexture(gl, this.dye.read.texture, 0));
      splat.vec3("uColor", dyeAmount, 0, 0);
      this.blitter.blit(this.dye.write);
      this.dye.swap();
    }
  }

  /**
   * Injeta impulso e energia ao longo do SEGMENTO entre a posição anterior e a
   * atual do ponteiro — não um ponto. É isto que faz um gesto rápido (poucos
   * eventos, muito espaço percorrido) parecer um traço contínuo em vez de uma
   * sequência de manchas: a distância é medida até a cápsula inteira, então o
   * trajeto todo fica coberto em um único par de draws, com qualquer
   * velocidade. `energyAmount` vai para o buffer de ENERGIA (rastro visível),
   * não para o `dye` ambiente — são camadas visuais separadas de propósito.
   */
  splatSegment(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    dx: number,
    dy: number,
    energyAmount: number,
  ): void {
    if (this.disposed) return;

    const gl = this.gl;
    const aspect = this.aspectRatio;
    const segment = this.programs.segmentSplat;

    segment.use();
    segment.float("uAspectRatio", aspect);
    segment.vec2("uPointA", x0, y0);
    segment.vec2("uPointB", x1, y1);

    segment.float("uRadius", CONFIG.trailVelocityRadius);
    segment.int("uTarget", bindTexture(gl, this.velocity.read.texture, 0));
    segment.vec3("uColor", dx, dy, 0);
    this.blitter.blit(this.velocity.write);
    this.velocity.swap();

    if (energyAmount > 0) {
      segment.float("uRadius", CONFIG.trailEnergyRadius);
      segment.int("uTarget", bindTexture(gl, this.energy.read.texture, 0));
      segment.vec3("uColor", energyAmount, 0, 0);
      this.blitter.blit(this.energy.write);
      this.energy.swap();
    }
  }

  /** Frequência do ruído ligada ao menor lado da textura de densidade. */
  private get seedScale(): number {
    const minDimension = Math.min(this.dye.width, this.dye.height);
    return Math.max(24, minDimension / CONFIG.seedTexelsPerCell);
  }

  /**
   * @param velocityGate 0 semeia o campo inteiro (carga inicial); 1 semeia
   *   apenas onde há escoamento (reinjeção por frame).
   */
  private seedDye(amount: number, velocityGate: number): void {
    const gl = this.gl;
    const seed = this.programs.seed;

    seed.use();
    seed.vec2("uTexelSize", this.dye.texelSizeX, this.dye.texelSizeY);
    seed.int("uTarget", bindTexture(gl, this.dye.read.texture, 0));
    seed.int("uVelocity", bindTexture(gl, this.velocity.read.texture, 1));
    seed.float("uAmount", amount);
    seed.float("uScale", this.seedScale);
    seed.float("uThreshold", CONFIG.seedThreshold);
    seed.float("uVelocityGate", velocityGate);
    seed.vec2("uOffset", this.seedOffsetX, this.seedOffsetY);
    this.blitter.blit(this.dye.write);
    this.dye.swap();
  }

  /** Um passo da simulação. `dt` em segundos, já limitado pelo chamador. */
  step(dt: number): void {
    if (this.disposed) return;

    const gl = this.gl;
    const p = this.programs;
    const texelX = this.velocity.texelSizeX;
    const texelY = this.velocity.texelSizeY;

    gl.disable(gl.BLEND);

    // ── vorticidade ──────────────────────────────────────────────────────
    p.curl.use();
    p.curl.vec2("uTexelSize", texelX, texelY);
    p.curl.int("uVelocity", bindTexture(gl, this.velocity.read.texture, 0));
    this.blitter.blit(this.curl);

    p.vorticity.use();
    p.vorticity.vec2("uTexelSize", texelX, texelY);
    p.vorticity.int("uVelocity", bindTexture(gl, this.velocity.read.texture, 0));
    p.vorticity.int("uCurl", bindTexture(gl, this.curl.texture, 1));
    p.vorticity.float("uCurlStrength", CONFIG.curlStrength);
    p.vorticity.float("uDt", dt);
    this.blitter.blit(this.velocity.write);
    this.velocity.swap();

    // ── estrutura (força; roda antes da projeção) ────────────────────────
    p.structure.use();
    p.structure.vec2("uTexelSize", texelX, texelY);
    p.structure.int("uVelocity", bindTexture(gl, this.velocity.read.texture, 0));
    p.structure.vec4(
      "uStructure",
      this.structure[0],
      this.structure[1],
      this.structure[2],
      this.structure[3],
    );
    p.structure.float("uAspectRatio", this.aspectRatio);
    p.structure.float("uStrength", CONFIG.structureStrength);
    p.structure.float("uFalloff", CONFIG.structureFalloff);
    this.blitter.blit(this.velocity.write);
    this.velocity.swap();

    // ── projeção: torna o campo incompressível ───────────────────────────
    p.divergence.use();
    p.divergence.vec2("uTexelSize", texelX, texelY);
    p.divergence.int("uVelocity", bindTexture(gl, this.velocity.read.texture, 0));
    this.blitter.blit(this.divergence);

    p.clear.use();
    p.clear.vec2("uTexelSize", texelX, texelY);
    p.clear.int("uTexture", bindTexture(gl, this.pressure.read.texture, 0));
    p.clear.float("uValue", CONFIG.pressureDecay);
    this.blitter.blit(this.pressure.write);
    this.pressure.swap();

    p.pressure.use();
    p.pressure.vec2("uTexelSize", texelX, texelY);
    p.pressure.int("uDivergence", bindTexture(gl, this.divergence.texture, 0));
    for (let i = 0; i < this.quality.pressureIterations; i += 1) {
      p.pressure.int("uPressure", bindTexture(gl, this.pressure.read.texture, 1));
      this.blitter.blit(this.pressure.write);
      this.pressure.swap();
    }

    p.gradientSubtract.use();
    p.gradientSubtract.vec2("uTexelSize", texelX, texelY);
    p.gradientSubtract.int("uPressure", bindTexture(gl, this.pressure.read.texture, 0));
    p.gradientSubtract.int("uVelocity", bindTexture(gl, this.velocity.read.texture, 1));
    this.blitter.blit(this.velocity.write);
    this.velocity.swap();

    // ── advecção ─────────────────────────────────────────────────────────
    p.advection.use();
    p.advection.vec2("uTexelSize", texelX, texelY);
    p.advection.float("uDt", dt);
    p.advection.int("uVelocity", bindTexture(gl, this.velocity.read.texture, 0));
    p.advection.int("uSource", bindTexture(gl, this.velocity.read.texture, 0));
    p.advection.float("uDissipation", CONFIG.velocityDissipation);
    this.blitter.blit(this.velocity.write);
    this.velocity.swap();

    // Reinjeção lenta de ruído: sem isto a advecção acaba homogeneizando o
    // campo e os filamentos somem depois de alguns minutos.
    this.seedOffsetX += dt * 0.05;
    this.seedOffsetY += dt * 0.03;
    this.seedDye(CONFIG.seedAmountPerFrame, 1);

    p.advection.use();
    p.advection.vec2("uTexelSize", texelX, texelY);
    p.advection.float("uDt", dt);
    p.advection.int("uVelocity", bindTexture(gl, this.velocity.read.texture, 0));
    p.advection.int("uSource", bindTexture(gl, this.dye.read.texture, 1));
    p.advection.float("uDissipation", CONFIG.dyeDissipation);
    this.blitter.blit(this.dye.write);
    this.dye.swap();

    // Energia do rastro: mesma advecção, mas SEM reinjeção de ruído — o único
    // jeito de entrar aqui é o ponteiro (splatSegment). É o que faz o rastro
    // ser esticado, curvado e enrolado pela mesma vorticidade do fluido, em
    // vez de ficar preso na posição em que foi desenhado.
    p.advection.use();
    p.advection.vec2("uTexelSize", this.energy.texelSizeX, this.energy.texelSizeY);
    p.advection.float("uDt", dt);
    p.advection.int("uVelocity", bindTexture(gl, this.velocity.read.texture, 0));
    p.advection.int("uSource", bindTexture(gl, this.energy.read.texture, 1));
    p.advection.float("uDissipation", CONFIG.energyDissipation);
    this.blitter.blit(this.energy.write);
    this.energy.swap();
  }

  /** Duas passagens de blur em ping-pong sobre `energy`, para o glow. */
  private blurEnergy(): void {
    const gl = this.gl;
    const blur = this.programs.blur;

    blur.use();
    blur.float("uSpread", CONFIG.glowSpread);

    let source = this.energy.read.texture;
    for (let i = 0; i < CONFIG.glowPasses; i += 1) {
      blur.vec2("uTexelSize", this.energyGlow.texelSizeX, this.energyGlow.texelSizeY);
      blur.int("uTexture", bindTexture(gl, source, 0));
      this.blitter.blit(this.energyGlow.write);
      this.energyGlow.swap();
      source = this.energyGlow.read.texture;
    }
  }

  /** true entre chamadas de `render()` — ligado via `?fluidDebug=1`. */
  debugMode = false;

  render(): void {
    if (this.disposed) return;

    this.blurEnergy();

    const gl = this.gl;
    const display = this.programs.display;

    display.use();
    display.vec2("uTexelSize", this.dye.texelSizeX, this.dye.texelSizeY);
    display.int("uDye", bindTexture(gl, this.dye.read.texture, 0));
    display.int("uEnergy", bindTexture(gl, this.energy.read.texture, 1));
    display.int("uEnergyGlow", bindTexture(gl, this.energyGlow.read.texture, 2));
    display.vec3("uPaper", PAPER[0], PAPER[1], PAPER[2]);
    display.vec3("uInk", INK[0], INK[1], INK[2]);
    display.vec3("uEnergyCore", ENERGY_CORE[0], ENERGY_CORE[1], ENERGY_CORE[2]);
    display.vec3("uEnergyShadow", NAVY[0], NAVY[1], NAVY[2]);
    display.vec4(
      "uStructure",
      this.structure[0],
      this.structure[1],
      this.structure[2],
      this.structure[3],
    );
    display.float("uAspectRatio", this.aspectRatio);
    display.float("uIntensity", this.intensity);
    display.float("uMaxTint", CONFIG.maxTint);
    display.float("uFalloff", CONFIG.structureFalloff);
    display.float("uBands", CONFIG.displayBands);
    display.float("uEnergyGain", CONFIG.energyGain);
    display.float("uEnergyMax", CONFIG.energyMax);
    display.float("uGlowWeight", CONFIG.glowWeight);
    display.float("uDebugMode", this.debugMode ? 1 : 0);
    this.blitter.blit(null);
  }

  /** Resolução atual do solver e da densidade, para o painel de debug. */
  getDebugInfo(): {
    simWidth: number;
    simHeight: number;
    dyeWidth: number;
    dyeHeight: number;
  } {
    return {
      simWidth: this.velocity.width,
      simHeight: this.velocity.height,
      dyeWidth: this.dye.width,
      dyeHeight: this.dye.height,
    };
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    const gl = this.gl;

    deleteDoubleFBO(gl, this.velocity);
    deleteDoubleFBO(gl, this.dye);
    deleteDoubleFBO(gl, this.energy);
    deleteDoubleFBO(gl, this.energyGlow);
    deleteDoubleFBO(gl, this.pressure);
    deleteFBO(gl, this.divergence);
    deleteFBO(gl, this.curl);

    for (const program of Object.values(this.programs)) {
      program.dispose();
    }

    this.blitter.dispose();

    // NÃO chamamos gl.getExtension('WEBGL_lose_context')?.loseContext() aqui.
    //
    // Um canvas só pode ter UM contexto WebGL2 durante toda a sua vida — uma
    // vez perdido explicitamente, getContext('webgl2') no mesmo elemento
    // devolve esse mesmo contexto já morto, não um novo. Em produção isso
    // nunca aparecia porque o efeito só roda uma vez. Mas o React Strict Mode
    // (ativo em `next dev`, não em produção) monta → desmonta → remonta todo
    // componente uma vez de propósito, reaproveitando o MESMO nó <canvas> —
    // e a segunda montagem tentava reabrir um contexto já perdido. Resultado:
    // extensões de float relatavam ausentes mesmo existindo de verdade, o
    // motor falhava silenciosamente ao criar, e o hero ficava preso no
    // fallback estático — só em dev, nunca no build de produção testado.
    //
    // Deletar todos os objetos acima (texturas, framebuffers, programas,
    // VAO/buffers) já libera a memória de GPU que eles ocupavam; o contexto
    // em si é reclamado pelo navegador quando o canvas perde a última
    // referência — não precisa do gesto explícito, e o gesto explícito é
    // exatamente o que quebrava o remount.
  }
}

export { CONFIG as FLUID_CONFIG };
