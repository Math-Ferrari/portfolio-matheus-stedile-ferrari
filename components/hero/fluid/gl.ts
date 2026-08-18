/**
 * Utilitários WebGL2 do campo de fluido.
 *
 * WebGL2 é requisito — não há caminho WebGL1. Isso evita toda a dança de
 * extensões (`OES_texture_half_float`, filtragem manual em shader) e deixa o
 * código muito menor. Quem não tiver WebGL2 ou float renderizável recebe a
 * composição estática do hero, que é um caminho testado e não um degradê feio.
 */

export type FBO = {
  texture: WebGLTexture;
  framebuffer: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
};

export type DoubleFBO = {
  read: FBO;
  write: FBO;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  swap: () => void;
};

export type TextureFormat = {
  internalFormat: number;
  format: number;
};

/**
 * Cria o contexto. Devolve `null` quando WebGL2 não existe ou quando não dá
 * para renderizar em textura de ponto flutuante — em ambos os casos o
 * componente cai no fallback estático.
 */
export function createContext(canvas: HTMLCanvasElement): WebGL2RenderingContext | null {
  const attributes: WebGLContextAttributes = {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
  };

  const gl = canvas.getContext("webgl2", attributes);
  if (!gl) {
    // Diagnóstico sempre ativo, não só em dev: um WebGL2 ausente é raro o
    // bastante (e importante o bastante) para não ficar em silêncio nunca —
    // é exatamente o tipo de falha que faz o hero cair no fallback estático
    // sem nenhum sinal visível do motivo.
    console.warn("[fluid] getContext('webgl2') devolveu null — sem WebGL2 neste navegador/GPU.");
    return null;
  }

  // Necessário para renderizar em R16F / RG16F.
  const renderable =
    gl.getExtension("EXT_color_buffer_float") ??
    gl.getExtension("EXT_color_buffer_half_float");

  if (!renderable) {
    console.warn(
      "[fluid] WebGL2 existe, mas nem EXT_color_buffer_float nem EXT_color_buffer_half_float " +
        "estão disponíveis — não dá para renderizar nos FBOs de ponto flutuante que o solver usa.",
    );
    return null;
  }

  return gl;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Sempre logado — em build de produção isto ficava mudo antes, e um
    // shader que falha ao compilar é exatamente por onde o motor inteiro
    // volta `null` em silêncio, sem nenhum indício no console.
    console.error("[fluid] Falha ao compilar shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Programa com cache de localizações de uniform. Buscar `getUniformLocation`
 * por frame seria uma consulta ao driver a cada set — aqui é resolvido uma vez.
 */
export class Program {
  readonly program: WebGLProgram;
  private readonly gl: WebGL2RenderingContext;
  private readonly uniforms = new Map<string, WebGLUniformLocation | null>();

  private constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {
    this.gl = gl;
    this.program = program;
  }

  static create(
    gl: WebGL2RenderingContext,
    vertexSource: string,
    fragmentSource: string,
  ): Program | null {
    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return null;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return null;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    // Os shaders já estão linkados no programa; podem ser liberados agora.
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[fluid] Falha ao linkar programa:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return new Program(gl, program);
  }

  use(): void {
    this.gl.useProgram(this.program);
  }

  private location(name: string): WebGLUniformLocation | null {
    let cached = this.uniforms.get(name);
    if (cached === undefined) {
      cached = this.gl.getUniformLocation(this.program, name);
      this.uniforms.set(name, cached);
    }
    return cached;
  }

  int(name: string, value: number): void {
    this.gl.uniform1i(this.location(name), value);
  }

  float(name: string, value: number): void {
    this.gl.uniform1f(this.location(name), value);
  }

  vec2(name: string, x: number, y: number): void {
    this.gl.uniform2f(this.location(name), x, y);
  }

  vec3(name: string, x: number, y: number, z: number): void {
    this.gl.uniform3f(this.location(name), x, y, z);
  }

  vec4(name: string, x: number, y: number, z: number, w: number): void {
    this.gl.uniform4f(this.location(name), x, y, z, w);
  }

  dispose(): void {
    this.gl.deleteProgram(this.program);
    this.uniforms.clear();
  }
}

export function createFBO(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  { internalFormat, format }: TextureFormat,
): FBO | null {
  const texture = gl.createTexture();
  if (!texture) {
    return null;
  }

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    internalFormat,
    width,
    height,
    0,
    format,
    gl.HALF_FLOAT,
    null,
  );

  const framebuffer = gl.createFramebuffer();
  if (!framebuffer) {
    gl.deleteTexture(texture);
    return null;
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );

  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    gl.deleteTexture(texture);
    gl.deleteFramebuffer(framebuffer);
    return null;
  }

  gl.viewport(0, 0, width, height);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return {
    texture,
    framebuffer,
    width,
    height,
    texelSizeX: 1 / width,
    texelSizeY: 1 / height,
  };
}

export function createDoubleFBO(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  format: TextureFormat,
): DoubleFBO | null {
  const first = createFBO(gl, width, height, format);
  const second = createFBO(gl, width, height, format);

  if (!first || !second) {
    if (first) deleteFBO(gl, first);
    if (second) deleteFBO(gl, second);
    return null;
  }

  const target: DoubleFBO = {
    read: first,
    write: second,
    width,
    height,
    texelSizeX: 1 / width,
    texelSizeY: 1 / height,
    swap: () => {
      const temp = target.read;
      target.read = target.write;
      target.write = temp;
    },
  };

  return target;
}

export function deleteFBO(gl: WebGL2RenderingContext, target: FBO): void {
  gl.deleteTexture(target.texture);
  gl.deleteFramebuffer(target.framebuffer);
}

export function deleteDoubleFBO(gl: WebGL2RenderingContext, target: DoubleFBO): void {
  deleteFBO(gl, target.read);
  deleteFBO(gl, target.write);
}

export function bindTexture(
  gl: WebGL2RenderingContext,
  texture: WebGLTexture,
  unit: number,
): number {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  return unit;
}

/** Quad de tela cheia reutilizado por todas as passagens. */
export type Blitter = {
  blit: (target: FBO | null) => void;
  dispose: () => void;
};

export function createBlitter(gl: WebGL2RenderingContext): Blitter | null {
  const vao = gl.createVertexArray();
  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();

  if (!vao || !vertexBuffer || !indexBuffer) {
    console.warn("[fluid] Falha ao criar o VAO/buffers do quad de tela cheia.");
    return null;
  }

  gl.bindVertexArray(vao);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
    gl.STATIC_DRAW,
  );

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 0, 2, 3]),
    gl.STATIC_DRAW,
  );

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  return {
    blit: (target) => {
      if (target === null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    },
    dispose: () => {
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteVertexArray(vao);
    },
  };
}

/**
 * Resolução da simulação respeitando o aspecto da tela. A malha é sempre bem
 * menor que o canvas — o custo do solver não deve seguir a resolução do
 * display.
 */
export function getResolution(
  gl: WebGL2RenderingContext,
  resolution: number,
): { width: number; height: number } {
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  if (!Number.isFinite(aspectRatio) || aspectRatio === 0) {
    aspectRatio = 1;
  }
  if (aspectRatio < 1) {
    aspectRatio = 1 / aspectRatio;
  }

  const min = Math.max(1, Math.round(resolution));
  const max = Math.max(1, Math.round(resolution * aspectRatio));

  return gl.drawingBufferWidth > gl.drawingBufferHeight
    ? { width: max, height: min }
    : { width: min, height: max };
}
