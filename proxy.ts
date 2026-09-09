import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

/**
 * Toda rota do site vive sob `/pt` ou `/en` (ver `app/[locale]/`). Qualquer
 * caminho SEM esse prefixo — incluindo `/`, e links antigos/externos que
 * ainda apontem para `/projetos/...` sem idioma — é redirecionado uma única
 * vez para a versão em português, preservando o resto do caminho e a query.
 *
 * Determinístico de propósito: não há detecção de `Accept-Language` nem
 * leitura de cookie — sempre `/pt`. A checagem de `isLocale` abaixo é o que
 * torna isto seguro contra loop mesmo que o `matcher` algum dia passe a
 * casar um caminho já prefixado: um pathname que já começa com um locale
 * válido nunca é redirecionado, só segue adiante.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const target = pathname === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(new URL(`${target}${search}`, request.url));
}

export const config = {
  // Ignora assets internos do Next e qualquer caminho com extensão (arquivos
  // estáticos, robots.txt, sitemap.xml, favicon…) — essas rotas não têm
  // versão por idioma.
  matcher: ["/((?!_next|.*\\..*).*)"],
};
