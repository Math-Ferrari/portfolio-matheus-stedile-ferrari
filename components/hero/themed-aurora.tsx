"use client";

import Aurora, { type AuroraColorStops } from "@/components/hero/aurora";
import { useTheme } from "@/components/theme/theme-provider";

const DARK_STOPS: AuroraColorStops = ["#00aaff", "#0061ff", "#ff0000"];
const LIGHT_STOPS: AuroraColorStops = ["#0a84c4", "#0047c2", "#c4281e"];

type ThemedAuroraProps = {
  blend?: number;
  amplitude?: number;
  speed?: number;
};

/**
 * `Aurora` recebe cor via prop de JS, não CSS — não há como um custom
 * property de tema alcançar o shader diretamente. Este wrapper escolhe os
 * `colorStops` a partir do tema ativo; como o componente já lê `colorStops`
 * a cada frame via `propsRef` (não só no mount), a troca de tema atualiza a
 * animação em execução sem recriar o contexto WebGL.
 */
export function ThemedAurora(props: ThemedAuroraProps) {
  const { theme } = useTheme();

  return <Aurora colorStops={theme === "dark" ? DARK_STOPS : LIGHT_STOPS} {...props} />;
}
