"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import type { Screenshot } from "@/lib/types";

type LightboxContextValue = {
  open: (index: number, trigger: HTMLElement) => void;
};

const ImageLightboxContext = createContext<LightboxContextValue | null>(null);

export function useImageLightbox() {
  return useContext(ImageLightboxContext);
}

type ImageLightboxProviderProps = {
  images: Screenshot[];
  children: ReactNode;
};

const focusableSelector = [
  "button:not([disabled])",
  "[href]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function ImageLightboxProvider({ images, children }: ImageLightboxProviderProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const captionId = useId();
  const isOpen = activeIndex !== null;

  const close = useCallback(() => {
    setActiveIndex(null);
    requestAnimationFrame(() => openerRef.current?.focus({ preventScroll: true }));
  }, []);

  const open = useCallback(
    (index: number, trigger: HTMLElement) => {
      if (!images[index]?.src) return;
      openerRef.current = trigger;
      setActiveIndex(index);
    },
    [images],
  );

  const previous = useCallback(() => {
    setActiveIndex((index) => (index !== null && index > 0 ? index - 1 : index));
  }, []);

  const next = useCallback(() => {
    setActiveIndex((index) =>
      index !== null && index < images.length - 1 ? index + 1 : index,
    );
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.paddingRight = previousBodyPaddingRight;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close, next, previous]);

  const context = useMemo(() => ({ open }), [open]);
  const active = activeIndex === null ? null : images[activeIndex];
  const imageWidth = active?.width ?? (active?.frame === "mobile" ? 1080 : 1920);
  const imageHeight = active?.height ?? (active?.frame === "mobile" ? 1920 : 1080);
  const imageAspect = imageWidth / imageHeight;

  return (
    <ImageLightboxContext.Provider value={context}>
      {children}
      {active?.src && activeIndex !== null
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] cursor-zoom-out bg-black/90 p-2 backdrop-blur-sm sm:p-6"
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label="Visualização ampliada de screenshots"
                aria-describedby={active.caption ? captionId : undefined}
                tabIndex={-1}
                className="relative flex size-full cursor-zoom-out items-center justify-center outline-none"
                onPointerDown={(event) => {
                  if (!(event.target as Element).closest("[data-lightbox-content]")) close();
                }}
              >
                <p
                  data-lightbox-content
                  className="absolute left-2 top-2 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-xs font-medium tabular-nums text-white/65 sm:left-0 sm:top-0"
                >
                  {activeIndex + 1} / {images.length}
                </p>

                <button
                  ref={closeButtonRef}
                  type="button"
                  data-lightbox-content
                  aria-label="Fechar visualização ampliada"
                  onClick={close}
                  className="absolute right-2 top-2 z-10 inline-flex size-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-0 sm:top-0 sm:size-12"
                >
                  <X aria-hidden className="size-5" />
                </button>

                <button
                  type="button"
                  data-lightbox-content
                  aria-label="Screenshot anterior"
                  aria-disabled={activeIndex === 0}
                  onClick={previous}
                  className="absolute left-1 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-disabled:cursor-default aria-disabled:opacity-25 sm:left-2 sm:size-12"
                >
                  <ChevronLeft aria-hidden className="size-6" />
                </button>

                <figure
                  data-lightbox-content
                  className="flex max-h-full max-w-full cursor-default flex-col items-center"
                >
                  <Image
                    key={active.src}
                    src={active.src}
                    alt={active.alt}
                    width={imageWidth}
                    height={imageHeight}
                    priority
                    sizes="95vw"
                    className="block rounded-sm object-contain shadow-2xl"
                    style={{
                      width: `min(95vw, calc((100dvh - 9rem) * ${imageAspect}))`,
                      height: "auto",
                      maxHeight: "calc(100dvh - 9rem)",
                      objectFit: "contain",
                    }}
                  />
                  {active.caption ? (
                    <figcaption
                      id={captionId}
                      className="mt-3 max-w-[min(90vw,70rem)] text-center text-sm leading-relaxed text-white/75 sm:mt-4"
                    >
                      {active.caption}
                    </figcaption>
                  ) : null}
                </figure>

                <button
                  type="button"
                  data-lightbox-content
                  aria-label="Próxima screenshot"
                  aria-disabled={activeIndex === images.length - 1}
                  onClick={next}
                  className="absolute right-1 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-disabled:cursor-default aria-disabled:opacity-25 sm:right-2 sm:size-12"
                >
                  <ChevronRight aria-hidden className="size-6" />
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </ImageLightboxContext.Provider>
  );
}