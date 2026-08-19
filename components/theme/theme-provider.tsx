"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * `data-theme` em `<html>` é a fonte de verdade — não um estado React
 * duplicado. `useSyncExternalStore` é o jeito correto de ler esse valor
 * externo sem divergir do HTML do servidor: no servidor e no primeiro render
 * do cliente usa `getServerSnapshot` ("dark", fixo); só depois de hidratado
 * passa a ler o atributo real via `getSnapshot`. Isso evita o erro de
 * hidratação sem depender de um `setState` dentro de efeito (a cor que a
 * pessoa vê nunca dependeu deste estado — só o `data-theme` grava a cor real,
 * via script inline em `app/layout.tsx`; este hook só mantém o React ciente
 * do valor atual, ex.: para o ícone do `ThemeToggle`).
 */
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function notify() {
  for (const listener of listeners) listener();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

/**
 * Fonte de verdade do tema no lado do cliente.
 *
 * O flash é evitado pelo script inline em `app/layout.tsx`, que roda antes de
 * qualquer JavaScript do React e já deixa `data-theme` correto em `<html>` no
 * primeiro paint. Toda troca grava no `<html>` E no `localStorage` ao mesmo
 * tempo, então um refresh ou uma aba nova sempre encontram a escolha certa já
 * persistida. Enquanto não houver escolha manual (`localStorage` vazio),
 * acompanha mudanças ao vivo em `prefers-color-scheme` — assim que o usuário
 * escolhe uma vez, essa escuta para de importar.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const applyTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next;
    notify();
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Modo privado ou storage bloqueado: a escolha só vale pela sessão.
      }
      applyTheme(next);
    },
    [applyTheme],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  useEffect(() => {
    let hasManualChoice = false;
    try {
      hasManualChoice = window.localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      hasManualChoice = false;
    }
    if (hasManualChoice) {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      applyTheme(event.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [applyTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme precisa estar dentro de <ThemeProvider>.");
  }
  return context;
}
