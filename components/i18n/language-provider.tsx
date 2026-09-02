"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import { DEFAULT_LOCALE, HTML_LANG, type Locale, toLocale } from "@/lib/i18n";

export const LANGUAGE_STORAGE_KEY = "portfolio-language";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Mesmo desenho do `ThemeProvider`: o atributo em `<html>` é a fonte de
 * verdade, não um estado React paralelo, e `useSyncExternalStore` lê esse
 * valor externo sem divergir do HTML do servidor.
 *
 * `getServerSnapshot` devolve sempre o idioma padrão (pt) — é o que o
 * servidor renderiza. Na hidratação o React usa esse mesmo valor, casando com
 * o HTML recebido, e só então lê `getSnapshot` e re-renderiza se o visitante
 * tiver escolhido inglês. É esse par de snapshots que evita o erro de
 * hidratação; sem ele, ler `localStorage` direto no primeiro render quebraria
 * a página para quem está em EN.
 *
 * O script inline em `app/layout.tsx` já acerta `lang`/`data-lang` em `<html>`
 * antes do primeiro paint, então leitores de tela e o próprio navegador nunca
 * veem o idioma errado — só o texto renderizado troca na hidratação.
 */
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function notify() {
  for (const listener of listeners) listener();
}

function getSnapshot(): Locale {
  return toLocale(document.documentElement.dataset.lang);
}

function getServerSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const applyLocale = useCallback((next: Locale) => {
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = HTML_LANG[next];
    notify();
  }, []);

  const setLocale = useCallback(
    (next: Locale) => {
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      } catch {
        // Modo privado ou storage bloqueado: a escolha vale só pela sessão.
      }
      applyLocale(next);
    },
    [applyLocale],
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === "pt" ? "en" : "pt");
  }, [locale, setLocale]);

  /**
   * Rede de segurança: se o script inline não tiver rodado (CSP, erro de
   * parsing), o atributo ainda é acertado assim que o React monta. Sem isto,
   * `getSnapshot` leria `undefined` e o site ficaria preso em PT mesmo com a
   * escolha salva.
   */
  useEffect(() => {
    if (document.documentElement.dataset.lang) {
      return;
    }
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
      stored = null;
    }
    applyLocale(toLocale(stored));
  }, [applyLocale]);

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale }),
    [locale, setLocale, toggleLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage precisa estar dentro de <LanguageProvider>.");
  }
  return context;
}
