"use client";

import { createContext, useContext, useMemo } from "react";

import type { Locale } from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * O idioma vive na URL (`/pt/...`, `/en/...`), não em `localStorage`: o
 * segmento `[locale]` (`app/[locale]/layout.tsx`) já sabe o valor correto no
 * SERVIDOR, antes de qualquer render — por isso não existe risco de flash nem
 * necessidade de um script inline ou de `useSyncExternalStore` como no tema
 * (`ThemeProvider`), que não tem como saber a escolha do visitante fora do
 * cliente.
 *
 * Este provider só repassa esse valor via Context para os componentes
 * client mais fundo na árvore (`useContent()`, `LanguageToggle` etc.), sem
 * guardar estado próprio: trocar de idioma é navegar para outra URL, não
 * mutar uma variável.
 */
export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage precisa estar dentro de <LanguageProvider>.");
  }
  return context;
}
