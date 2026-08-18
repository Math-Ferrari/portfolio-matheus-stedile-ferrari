"use client";

import { useEffect, useRef } from "react";

import {
  FluidEngine,
  QUALITY_HIGH,
  QUALITY_LOW,
  type Quality,
} from "@/components/hero/fluid/engine";
import { cn } from "@/lib/utils";

type FluidCanvasProps = {
  /** Seletor do elemento que organiza o campo (a palavra "software"). */
  structureSelector?: string;
  className?: string;
};

/** Duração da rampa de entrada da densidade. */
const ENTRANCE_MS = 1600;
/** Janela em que a perturbação inicial atravessa a tela. */
const SWEEP_MS = 900;
/** dt máximo por frame: evita explodir o solver ao voltar de uma pausa. */
const MAX_DT = 1 / 30;
/** Segmentos por frame vindos do ponteiro. Buffer fixo, sem alocação. */
const SEGMENT_QUEUE = 24;

/** Reduzido de 16 para 7: o ocioso precisa ficar "quase o hero original", não
    um redemoinho — a força baixa faz os dois emissores mexerem o campo bem
    mais devagar, então o teto de intensidade (CONFIG.maxTint) do shader some
    de vista em vez de aparecer como uma faixa vívida em movimento. */
const AMBIENT_FORCE = 7;
/** Tinta injetada pelos emissores ambientes — também reduzida (era 0.006). */
const AMBIENT_DYE = 0.004;

/**
 * "Velocidade de referência" do ponteiro, em uv/s — a escala usada para medir
 * se um gesto é lento, médio ou rápido. ~1.4 é atravessar boa parte da largura
 * da tela em meio segundo; a partir daí o traço já está no teto de força.
 */
const POINTER_SPEED_REFERENCE = 1.4;
/** Até onde a velocidade pode "acelerar" a força além da referência. */
const POINTER_SPEED_CAP = 2.6;
const POINTER_FORCE = 4200;
/** Energia mínima injetada mesmo num gesto lento — o traço precisa aparecer
    desde o primeiro movimento, não só quando o mouse dispara. */
const POINTER_ENERGY_MIN = 0.12;
/** Ganho de energia pela velocidade: no teto de speedFactor (2.6) a energia
    injetada passa de 1 — de propósito, para estourar o tonemap do shader e
    o núcleo do traço "acender" em vez de só ficar um pouco mais forte. */
const POINTER_ENERGY_GAIN = 0.62;
/** Deslocamento mínimo (uv, isotrópico) para valer um segmento novo. */
const MIN_SEGMENT_DISTANCE = 0.0006;

const TAP_ENERGY = 0.55;
const TAP_FORCE = 220;

/** Intervalo mínimo entre atualizações do painel de debug — DOM direto, sem
    re-render do React, mas não precisa (nem deve) mexer a cada frame. */
const DEBUG_PANEL_INTERVAL_MS = 150;

type PendingSegment = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  dx: number;
  dy: number;
  energy: number;
};

/**
 * Lê o flag de debug da URL (`?fluidDebug=1`) e persiste em localStorage para
 * sobreviver a navegações — só existe para diagnóstico manual, nunca ligado
 * por padrão. `?fluidDebug=0` limpa.
 */
function readDebugFlag(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const param = new URLSearchParams(window.location.search).get("fluidDebug");
  if (param === "1" || param === "true") {
    window.localStorage.setItem("fluidDebug", "1");
    return true;
  }
  if (param === "0" || param === "false") {
    window.localStorage.removeItem("fluidDebug");
    return false;
  }

  return window.localStorage.getItem("fluidDebug") === "1";
}

/**
 * Escolha inicial de qualidade por heurística barata — sem benchmark. O loop
 * ainda mede o tempo de frame e rebaixa uma vez se o aparelho não acompanhar.
 */
function pickInitialQuality(): Quality {
  if (typeof window === "undefined") {
    return QUALITY_LOW;
  }

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const smallScreen = window.innerWidth < 900;

  if (coarsePointer || smallScreen || cores <= 4) {
    return QUALITY_LOW;
  }

  return QUALITY_HIGH;
}

/**
 * Canvas do campo de fluido.
 *
 * Todo o estado do loop vive em variáveis locais do efeito — não há `useState`
 * envolvido em nenhum frame, então a árvore React nunca re-renderiza por causa
 * da animação. O canvas só fica visível (`data-active`) depois que o motor
 * inicia; se WebGL2 faltar, o contexto se perder ou o usuário pedir
 * `prefers-reduced-motion`, ele permanece transparente e a composição estática
 * que fica atrás dele aparece no lugar.
 *
 * O ponteiro é medido como SEGMENTO (posição anterior → atual) com velocidade
 * real (distância / tempo, não distância por evento) — é isso que faz um
 * gesto rápido injetar mais energia que um lento, em vez do contrário.
 *
 * ── Diagnóstico (`?fluidDebug=1`) ─────────────────────────────────────────
 * Ativa três coisas, só quando pedido explicitamente na URL:
 *   1. ignora `prefers-reduced-motion` (com aviso alto no console — nunca em
 *      produção "de verdade", só quando o próprio dev pede);
 *   2. troca o shader de display para contraste absurdo (ver shaders.ts);
 *   3. um painel fixo no canto, atualizado por mutação direta de DOM (não
 *      React) com contagem de eventos, energia, FPS e o resultado de
 *      `document.elementFromPoint()` no centro do canvas — se isso apontar
 *      para outro elemento, algo está cobrindo o canvas.
 */
export function FluidCanvas({ structureSelector, className }: FluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const debugRequested = readDebugFlag();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Sempre logado, com ou sem debug — é a primeira pergunta do diagnóstico
    // e não custa nada deixar visível por padrão no console.
    console.info(
      `[fluid] prefers-reduced-motion: reduce = ${reducedMotion.matches}` +
        (debugRequested ? " (fluidDebug ativo — será ignorado abaixo se true)" : ""),
    );

    if (reducedMotion.matches && !debugRequested) {
      // Nenhuma simulação: o campo estático já está renderizado atrás.
      console.info(
        "[fluid] Simulação NÃO iniciada por causa de prefers-reduced-motion. " +
          "Para testar visualmente mesmo assim, abra a página com ?fluidDebug=1 na URL.",
      );
      return;
    }

    if (reducedMotion.matches && debugRequested) {
      console.warn(
        "[fluid][debug] prefers-reduced-motion está ativo, mas ?fluidDebug=1 está " +
          "forçando a simulação a rodar mesmo assim. Isto é SÓ para diagnóstico — " +
          "o comportamento de produção (respeitar a preferência) continua intacto " +
          "quando o flag não está presente.",
      );
    }

    let quality = pickInitialQuality();

    const applyCanvasSize = (): boolean => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, quality.dprCap);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    };

    applyCanvasSize();

    const engine = FluidEngine.create(canvas, quality);
    if (!engine) {
      console.error(
        "[fluid] FluidEngine.create() devolveu null — o motor NÃO iniciou. " +
          "Veja os avisos/erros acima para o motivo (contexto, extensão, shader ou FBO).",
      );
      return;
    }

    engine.debugMode = debugRequested;

    if (debugRequested) {
      const rect = canvas.getBoundingClientRect();
      const style = window.getComputedStyle(canvas);
      const gl = canvas.getContext("webgl2");
      const debugInfo = gl?.getExtension("WEBGL_debug_renderer_info");
      const renderer = gl
        ? debugInfo
          ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
          : (gl.getParameter(gl.RENDERER) as string)
        : "sem contexto";

      console.info("[fluid][debug] Canvas montado:", {
        bufferWidth: canvas.width,
        bufferHeight: canvas.height,
        cssWidth: rect.width,
        cssHeight: rect.height,
        devicePixelRatio: window.devicePixelRatio,
        computedOpacity: style.opacity,
        computedVisibility: style.visibility,
        computedDisplay: style.display,
        computedPosition: style.position,
        computedZIndex: style.zIndex,
        webgl2Renderer: renderer,
      });

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const topElement = document.elementFromPoint(cx, cy);
      if (topElement === canvas) {
        console.info("[fluid][debug] document.elementFromPoint(centro) === canvas. Nada cobrindo.");
      } else {
        console.warn(
          "[fluid][debug] document.elementFromPoint(centro) NÃO é o canvas — " +
            "outro elemento está por cima dele:",
          topElement,
        );
      }
    }

    // ── estado do loop (nada disto passa por React) ──────────────────────
    let rafId = 0;
    let running = false;
    let lastTime = performance.now();
    const startTime = lastTime;

    let inViewport = true;
    let pageVisible = !document.hidden;

    let rectDirty = true;
    let cachedLeft = 0;
    let cachedTop = 0;
    let cachedWidth = 1;
    let cachedHeight = 1;

    const queue: PendingSegment[] = Array.from({ length: SEGMENT_QUEUE }, () => ({
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0,
      dx: 0,
      dy: 0,
      energy: 0,
    }));
    let queueCount = 0;

    let pointerX = 0;
    let pointerY = 0;
    let hasPointer = false;
    let lastPointerTime = 0;

    let frameSamples = 0;
    let frameTotal = 0;
    let qualityLocked = false;

    // ── só existe (custa alguma coisa) quando o debug está ligado ────────
    let pointerMoveCount = 0;
    let lastSpeedFactor = 0;
    let lastEnergyInjected = 0;
    let fpsSmoothed = 0;
    let lastPanelUpdate = 0;

    const refreshRect = () => {
      const rect = canvas.getBoundingClientRect();
      cachedLeft = rect.left;
      cachedTop = rect.top;
      cachedWidth = rect.width || 1;
      cachedHeight = rect.height || 1;
      rectDirty = false;

      if (!structureSelector) {
        return;
      }

      const element = document.querySelector(structureSelector);
      if (!element) {
        engine.clearStructureRect();
        return;
      }

      const target = element.getBoundingClientRect();
      const x0 = (target.left - cachedLeft) / cachedWidth;
      const x1 = (target.right - cachedLeft) / cachedWidth;
      // uv tem y para cima; o rect do DOM tem y para baixo.
      const y0 = 1 - (target.bottom - cachedTop) / cachedHeight;
      const y1 = 1 - (target.top - cachedTop) / cachedHeight;

      engine.setStructureRect(
        Math.min(x0, x1),
        Math.min(y0, y1),
        Math.max(x0, x1),
        Math.max(y0, y1),
      );
    };

    const enqueueSegment = (
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      dx: number,
      dy: number,
      energy: number,
    ) => {
      if (queueCount >= SEGMENT_QUEUE) {
        return;
      }
      const slot = queue[queueCount];
      if (!slot) {
        return;
      }
      slot.x0 = x0;
      slot.y0 = y0;
      slot.x1 = x1;
      slot.y1 = y1;
      slot.dx = dx;
      slot.dy = dy;
      slot.energy = energy;
      queueCount += 1;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (debugRequested) {
        pointerMoveCount += 1;
      }

      if (!inViewport || rectDirty) {
        return;
      }

      const x = (event.clientX - cachedLeft) / cachedWidth;
      const y = 1 - (event.clientY - cachedTop) / cachedHeight;

      if (x < 0 || x > 1 || y < 0 || y > 1) {
        hasPointer = false;
        return;
      }

      const now = performance.now();

      if (!hasPointer) {
        pointerX = x;
        pointerY = y;
        hasPointer = true;
        lastPointerTime = now;
        return;
      }

      // dt real do evento, não do frame — dois pointermove podem chegar entre
      // dois RAFs, e é a velocidade VERDADEIRA que precisa mover a agulha.
      const dt = Math.max((now - lastPointerTime) / 1000, 1 / 240);
      lastPointerTime = now;

      const aspect = cachedWidth / cachedHeight;
      const rawDx = x - pointerX;
      const rawDy = y - pointerY;

      // Distância isotrópica (independe do aspecto da tela) só para medir
      // velocidade — a injeção de força usa o vetor bruto, corrigido abaixo.
      const isoDx = aspect < 1 ? rawDx * aspect : rawDx;
      const isoDy = aspect < 1 ? rawDy : rawDy / aspect;
      const distance = Math.hypot(isoDx, isoDy);

      const prevX = pointerX;
      const prevY = pointerY;
      pointerX = x;
      pointerY = y;

      if (distance < MIN_SEGMENT_DISTANCE) {
        return;
      }

      const speed = distance / dt;
      const speedFactor = Math.min(speed / POINTER_SPEED_REFERENCE, POINTER_SPEED_CAP);

      let dx = rawDx * POINTER_FORCE;
      let dy = rawDy * POINTER_FORCE;
      if (aspect < 1) {
        dx *= aspect;
      } else {
        dy /= aspect;
      }
      // A força cresce com a velocidade real do gesto — é o que faz um flick
      // rápido "arremessar" o fluido em vez de só arrastar um pouco mais.
      const forceScale = 0.35 + speedFactor * 0.65;
      dx *= forceScale;
      dy *= forceScale;

      const energy = POINTER_ENERGY_MIN + speedFactor * POINTER_ENERGY_GAIN;

      if (debugRequested) {
        lastSpeedFactor = speedFactor;
        lastEnergyInjected = energy;
      }

      enqueueSegment(prevX, prevY, x, y, dx, dy, energy);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!inViewport || rectDirty) {
        return;
      }
      const x = (event.clientX - cachedLeft) / cachedWidth;
      const y = 1 - (event.clientY - cachedTop) / cachedHeight;
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        return;
      }
      pointerX = x;
      pointerY = y;
      hasPointer = true;
      lastPointerTime = performance.now();
      // Toque sem arrasto ainda acende um pulso de energia (segmento degenerado).
      enqueueSegment(x, y, x, y, 0, TAP_FORCE, TAP_ENERGY);
    };

    const onPointerLeave = () => {
      hasPointer = false;
    };

    const updateDebugPanel = (now: number, fps: number, segmentsThisFrame: number) => {
      const panel = panelRef.current;
      if (!panel || now - lastPanelUpdate < DEBUG_PANEL_INTERVAL_MS) {
        return;
      }
      lastPanelUpdate = now;

      const info = engine.getDebugInfo();
      const rect = canvas.getBoundingClientRect();

      panel.textContent = [
        "FLUID_DEBUG",
        `reduced-motion: ${reducedMotion.matches}`,
        `webgl2: ACTIVE  data-active=${canvas.dataset.active}`,
        `canvas buffer: ${canvas.width}x${canvas.height}`,
        `canvas css: ${Math.round(rect.width)}x${Math.round(rect.height)}`,
        `dpr cap: ${quality.dprCap}`,
        `sim res: ${info.simWidth}x${info.simHeight}`,
        `dye res: ${info.dyeWidth}x${info.dyeHeight}`,
        `fps: ${fps.toFixed(0)}`,
        `pointermove recebidos: ${pointerMoveCount}`,
        `segmentos na fila (este frame): ${segmentsThisFrame}`,
        `speedFactor (último gesto): ${lastSpeedFactor.toFixed(2)}`,
        `energia injetada (último gesto): ${lastEnergyInjected.toFixed(3)}`,
      ].join("\n");
    };

    const frame = (now: number) => {
      rafId = requestAnimationFrame(frame);

      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(Math.max(rawDt, 0.0001), MAX_DT);

      if (debugRequested) {
        const instantFps = rawDt > 0 ? 1 / rawDt : 0;
        fpsSmoothed = fpsSmoothed === 0 ? instantFps : fpsSmoothed * 0.9 + instantFps * 0.1;
      }

      if (rectDirty) {
        refreshRect();
      }

      const elapsed = now - startTime;
      engine.setIntensity(Math.min(elapsed / ENTRANCE_MS, 1));

      // Perturbação de entrada: uma frente atravessa a tela uma única vez.
      if (elapsed < SWEEP_MS) {
        const progress = elapsed / SWEEP_MS;
        engine.splat(
          progress,
          0.5 + Math.sin(progress * Math.PI * 2) * 0.06,
          520,
          Math.cos(progress * Math.PI * 3) * 120,
          0.1,
        );
      }

      // Movimento autônomo: dois emissores lentos mantêm o campo vivo sem
      // ponteiro (é o comportamento padrão no mobile). Só tocam velocidade e
      // o dye AMBIENTE — nunca a energia — para o estado ocioso continuar
      // discreto mesmo com esses emissores ligados.
      const t = now * 0.001;
      const ax = 0.5 + Math.cos(t * 0.23) * 0.32;
      const ay = 0.5 + Math.sin(t * 0.31) * 0.26;
      engine.splat(
        ax,
        ay,
        -Math.sin(t * 0.23) * AMBIENT_FORCE,
        Math.cos(t * 0.31) * AMBIENT_FORCE,
        AMBIENT_DYE,
      );

      const bx = 0.5 + Math.cos(t * 0.17 + 2.2) * 0.28;
      const by = 0.5 + Math.sin(t * 0.13 + 1.1) * 0.3;
      engine.splat(
        bx,
        by,
        -Math.sin(t * 0.17 + 2.2) * AMBIENT_FORCE,
        Math.cos(t * 0.13 + 1.1) * AMBIENT_FORCE,
        AMBIENT_DYE,
      );

      const queueCountThisFrame = queueCount;
      for (let i = 0; i < queueCount; i += 1) {
        const segment = queue[i];
        if (segment) {
          engine.splatSegment(
            segment.x0,
            segment.y0,
            segment.x1,
            segment.y1,
            segment.dx,
            segment.dy,
            segment.energy,
          );
        }
      }
      queueCount = 0;

      engine.step(dt);
      engine.render();

      canvas.dataset.active = "true";

      if (debugRequested) {
        updateDebugPanel(now, fpsSmoothed, queueCountThisFrame);
      }

      // Qualidade adaptativa: mede depois do aquecimento e rebaixa uma vez.
      if (!qualityLocked && elapsed > 1200) {
        frameTotal += rawDt;
        frameSamples += 1;
        if (frameSamples >= 90) {
          if (frameTotal / frameSamples > 0.021 && quality !== QUALITY_LOW) {
            quality = QUALITY_LOW;
            engine.setQuality(quality);
            applyCanvasSize();
            engine.resize();
            rectDirty = true;
          }
          qualityLocked = true;
        }
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(rafId);
    };

    const sync = () => {
      if (inViewport && pageVisible) {
        start();
      } else {
        stop();
      }
    };

    // ── observadores ─────────────────────────────────────────────────────
    const intersection = new IntersectionObserver(
      (entries) => {
        inViewport = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { threshold: 0 },
    );
    intersection.observe(canvas);

    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      sync();
    };

    const resizeObserver = new ResizeObserver(() => {
      if (applyCanvasSize()) {
        engine.resize();
      }
      rectDirty = true;
    });
    resizeObserver.observe(canvas);

    const onScroll = () => {
      rectDirty = true;
    };

    const onContextLost = (event: Event) => {
      // Sem preventDefault o contexto nunca poderia ser recuperado; mesmo assim
      // não tentamos restaurar — o campo estático assume.
      event.preventDefault();
      console.warn("[fluid] webglcontextlost — simulação parada, campo estático assume.");
      stop();
      canvas.dataset.active = "false";
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    canvas.addEventListener("webglcontextlost", onContextLost);

    sync();

    return () => {
      stop();
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.dataset.active = "false";
      engine.dispose();
    };
  }, [structureSelector]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        data-active="false"
        className={cn("hero-canvas", className)}
      />
      {/* Vazio e invisível (`whitespace-pre` + sem conteúdo) até o efeito
          decidir, em runtime, se ?fluidDebug=1 está presente — evita
          divergência de SSR/hidratação por ler location/localStorage. */}
      <pre
        ref={panelRef}
        aria-hidden="true"
        className="pointer-events-none fixed bottom-3 left-3 z-[999] whitespace-pre rounded bg-black/85 px-3 py-2 font-mono text-[11px] leading-relaxed text-lime-300 empty:hidden"
      />
    </>
  );
}
