"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useLenis } from "lenis/react";

import { InteractiveHero } from "@/components/hero/interactive-hero";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

type Easing = (value: number) => number;

const phase = (
  progress: number,
  start: number,
  end: number,
  easing: Easing = smoothstep,
) => easing(clamp01((progress - start) / (end - start)));

/**
 * Uma única cena sticky conduz capa e perfil.
 *
 * A arquitetura anterior mantinha duas interfaces completas na mesma célula,
 * ambas com opacidade residual, e adicionava um RAF amortecido sobre o Lenis.
 * Aqui há um só relógio: o callback do Lenis lê o progresso geométrico e, no
 * mesmo frame, escreve as custom properties do DOM e os refs consumidos pelo
 * shader. Não há React state por frame, filtros de blur, snap ou outra física
 * de scroll.
 *
 * Coreografia, em três fases (não um degradê único do início ao fim):
 *
 *  FASE 1 — Transformação (progress 0 → ~0.62): contexto e CTA deixam o
 *  quadro; o nome recua enquanto as Floating Lines convergem; a headline do
 *  perfil começa quando a hero já tem baixa presença; a foto entra depois da
 *  saída completa da hero; detalhes assentam; as linhas convergem e perdem
 *  quase todo o brilho.
 *
 *  FASE 2 — Assentamento (~0.62 → HOLD_START): a última peça (detalhes/
 *  especialidades) termina de assentar e as linhas terminam de sair de cena,
 *  bem antes do HOLD começar — ninguém "chega" no exato instante em que o
 *  hold começa.
 *
 *  FASE 3 — HOLD (HOLD_START → 1): nada muda. Todas as `phase()` abaixo já
 *  saturaram em 1 (ou 0) antes de HOLD_START, então este trecho do scroll não
 *  aciona escrita nenhuma de custom property com valor diferente do frame
 *  anterior — só o scroll físico continua acontecendo enquanto a composição
 *  fica visualmente parada. É esse "nada muda" que dá tempo de leitura real
 *  (ler a headline, olhar a foto, entender o parágrafo) sem tocar no Lenis
 *  global — o tempo vem da ALTURA do wrapper (`--hero-transition-height`),
 *  não de desacelerar o scroll do site inteiro. Ver `HOLD_START` abaixo e a
 *  altura do wrapper em `globals.css`.
 *
 * Reversível por construção: como tudo é função pura de `progress` (a
 * posição de scroll), rolar para cima reproduz a mesma coreografia ao
 * contrário, incluindo o hold — sem lógica separada de "saída".
 */

/** Início do hold, em fração do progresso do wrapper (0–1). Tudo que assenta
    a composição (hero, headline, foto, detalhes, linhas) termina ANTES
    disto — ver a fase 1/2 acima — para o hold começar já parado, nunca no
    meio de um movimento. */
const HOLD_START = 0.65;

/** Piso de brilho das linhas no estado final — não some por completo
    ("uma linha muito suave, com opacity extremamente baixa" em vez de
    "linhas praticamente desaparecem" ao pé da letra): ainda há sinal de
    vida, mas sem peso visual competindo com tipografia/foto. */
const LINES_RESTING_FADE = 0.05;

export function HeroTransition() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const linesProgressRef = useRef(0);
  const linesFadeRef = useRef(1);
  const linesExitRef = useRef(0);
  const bgMorphRef = useRef(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const readScrollProgress = useCallback(() => {
    const wrapper = wrapperRef.current;
    const sticky = stickyRef.current;
    if (!wrapper || !sticky) return 0;

    const wrapperRect = wrapper.getBoundingClientRect();
    const stickyHeight = sticky.getBoundingClientRect().height;
    const runway = wrapperRect.height - stickyHeight;
    return runway > 0 ? clamp01(-wrapperRect.top / runway) : 0;
  }, []);

  const applyProgress = useCallback((progress: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Toda a transformação (fases 1–2 do comentário acima) termina em
    // HOLD_START (0.65) — nenhuma destas linhas tem `end` além disso, de
    // propósito: é o que garante um hold parado de verdade, não um degradê
    // que só desacelera perto do fim.
    const supportingExit = phase(progress, 0, 0.18);
    const heroRecede = phase(progress, 0.02, 0.32, easeOutCubic);
    const heroExit = phase(progress, 0.14, 0.38, smootherstep);
    const profileHeading = phase(progress, 0.34, 0.52, smootherstep);
    const portrait = phase(progress, 0.42, 0.58, smootherstep);
    const profileDetails = phase(progress, 0.46, 0.62, smootherstep);
    const linesConverge = phase(progress, 0.02, 0.45, easeOutCubic);
    // Não vai a zero: LINES_RESTING_FADE é o piso ("uma linha muito suave"),
    // não um desaparecimento total. Termina de cair bem antes de HOLD_START.
    const linesFade = 1 - phase(progress, 0.34, 0.6) * (1 - LINES_RESTING_FADE);
    const linesExit = phase(progress, 0.5, 0.65, smootherstep);
    const backgroundMorph = phase(progress, 0.16, 0.58, smootherstep);

    wrapper.style.setProperty("--tp-supporting", String(1 - supportingExit));
    wrapper.style.setProperty("--tp-hero-recede", String(heroRecede));
    wrapper.style.setProperty("--tp-hero-opacity", String(1 - heroExit));
    wrapper.style.setProperty("--tp-profile-heading", String(profileHeading));
    wrapper.style.setProperty("--tp-profile-portrait", String(portrait));
    wrapper.style.setProperty("--tp-profile-details", String(profileDetails));
    wrapper.style.setProperty("--tp-bg-morph", String(backgroundMorph));
    wrapper.dataset.pastCta = supportingExit > 0.9 ? "true" : "false";
    // Grava onde o hold começa como um dado real do DOM (mesmo padrão de
    // `dataset.pastCta` acima) — não é lido por CSS/JS hoje, mas documenta o
    // limiar exato e fica disponível para QA/depuração sem reabrir este
    // arquivo para descobrir o número.
    wrapper.dataset.heroSettled = progress >= HOLD_START ? "true" : "false";

    linesProgressRef.current = linesConverge;
    linesFadeRef.current = linesFade;
    linesExitRef.current = linesExit;
    bgMorphRef.current = backgroundMorph;
  }, []);

  const updateProgress = useCallback(() => {
    applyProgress(readScrollProgress());
  }, [applyProgress, readScrollProgress]);

  useEffect(() => {
    if (reducedMotion) {
      linesProgressRef.current = 0;
      linesFadeRef.current = 1;
      linesExitRef.current = 0;
      bgMorphRef.current = 0;

      const wrapper = wrapperRef.current;
      wrapper?.style.removeProperty("--tp-supporting");
      wrapper?.style.removeProperty("--tp-hero-recede");
      wrapper?.style.removeProperty("--tp-hero-opacity");
      wrapper?.style.removeProperty("--tp-profile-heading");
      wrapper?.style.removeProperty("--tp-profile-portrait");
      wrapper?.style.removeProperty("--tp-profile-details");
      wrapper?.style.removeProperty("--tp-bg-morph");
      if (wrapper) {
        wrapper.dataset.pastCta = "false";
        // Sem a transição rodando, o CSS de `prefers-reduced-motion` já
        // força tudo para o estado final (opacity:1, transform:none) — este
        // dataset só mantém a leitura "assentado" consistente com isso.
        wrapper.dataset.heroSettled = "true";
      }
      return;
    }

    updateProgress();
    const onResize = () => updateProgress();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [reducedMotion, updateProgress]);

  useLenis(reducedMotion ? undefined : updateProgress, [
    reducedMotion,
    updateProgress,
  ]);

  return (
    <div ref={wrapperRef} className="hero-transition-wrapper">
      <div ref={stickyRef} className="hero-transition-sticky">
        <InteractiveHero
          progressRef={linesProgressRef}
          linesFadeRef={linesFadeRef}
          linesExitRef={linesExitRef}
          baseColorMorphRef={bgMorphRef}
        />
      </div>
    </div>
  );
}
