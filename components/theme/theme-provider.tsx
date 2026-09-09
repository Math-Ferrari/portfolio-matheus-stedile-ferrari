"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  persistTheme,
  readStoredTheme,
  readThemeAttribute,
  resolveTheme,
  writeThemeAttribute,
  type Theme,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * `data-theme` em `<html>` continua sendo a fonte de verdade visual — não um
 * estado React duplicado. `useSyncExternalStore` é o jeito correto de ler esse
 * valor externo sem divergir do HTML do servidor: no servidor e no render de
 * hidratação usa `getServerSnapshot` ("dark", o mesmo que `:root` pinta sem
 * JavaScript); depois de hidratado passa a ler o valor real.
 *
 * ── Por que o fallback em `getSnapshot` ────────────────────────────────────
 * O atributo pode DESAPARECER por um instante, e isso não é hipotético: o
 * layout raiz do site vive dentro do segmento `[locale]`
 * (`app/[locale]/layout.tsx`), e o App Router renderiza cada segmento com uma
 * `key` derivada do VALOR do parâmetro. Trocar `/pt` por `/en` muda essa key,
 * então o React desmonta a raiz e monta outra — e ao re-adquirir os host
 * singletons `<html>`/`<body>` ele apaga todo atributo que não veio do JSX,
 * `data-theme` incluído.
 *
 * Ler o atributo cru nesse instante devolveria "dark" (o valor que `:root`
 * representa) mesmo para quem está no claro. Por isso, quando o atributo não
 * está lá, caímos para `resolveTheme()` — a mesma ordem do script inline
 * (escolha salva → preferência do sistema), em `lib/theme.ts`.
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
  return readThemeAttribute() ?? resolveTheme();
}

function getServerSnapshot(): Theme {
  return "dark";
}

/** `useLayoutEffect` no cliente (precisa rodar ANTES do paint) e `useEffect` no SSR. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Fonte de verdade do tema no lado do cliente.
 *
 * O flash no primeiro carregamento é evitado pelo script inline
 * (`THEME_INIT_SCRIPT`), que roda antes de qualquer JavaScript do React. Toda
 * troca grava no `<html>` E no `localStorage` ao mesmo tempo, então um refresh
 * ou uma aba nova sempre encontram a escolha certa já persistida. Enquanto não
 * houver escolha manual (`localStorage` vazio), acompanha mudanças ao vivo em
 * `prefers-color-scheme` — assim que o usuário escolhe uma vez, essa escuta
 * para de importar.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const applyTheme = useCallback((next: Theme) => {
    writeThemeAttribute(next);
    notify();
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      persistTheme(next);
      applyTheme(next);
    },
    [applyTheme],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  /**
   * Reafirma o atributo sempre que este provider monta — e ele monta de novo a
   * cada troca de idioma, junto com a raiz (ver o comentário sobre a `key` do
   * segmento, acima). É o que devolve `data-theme` ao `<html>` depois de o
   * React tê-lo apagado ao re-adquirir o singleton.
   *
   * Duas garantias importantes:
   *
   *   - É um LAYOUT effect: roda no mesmo commit que apagou o atributo, antes
   *     do browser pintar. O visitante nunca vê o site piscar em dark.
   *   - Só escreve quando o atributo está AUSENTE. Não usa `theme` (o valor do
   *     React) porque no render de hidratação ele ainda é `getServerSnapshot()`
   *     ("dark"); escrever esse valor por cima apagaria a escolha real de quem
   *     está no claro. Um atributo já presente é sempre respeitado.
   */
  useIsomorphicLayoutEffect(() => {
    if (readThemeAttribute() !== null) {
      return;
    }
    writeThemeAttribute(resolveTheme());
    notify();
  }, []);

  useEffect(() => {
    if (readStoredTheme() !== null) {
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
