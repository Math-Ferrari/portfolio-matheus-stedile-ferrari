import { InteractiveHero } from "@/components/hero/interactive-hero";
import { Profile } from "@/components/sections/profile";
import { SelectedProjects } from "@/components/sections/selected-projects";
import { PlatoTruckCase } from "@/components/sections/platotruck-case";
import { HowIWork } from "@/components/sections/how-i-work";
import { StackEngineering } from "@/components/sections/stack-engineering";
import { Contact } from "@/components/sections/contact";

/**
 * Home — sete blocos, cada argumento dito uma vez só.
 *
 * A ordem responde, nessa sequência: quem é (hero + `Profile`), o que já
 * fez (`SelectedProjects`, com hierarquia visual explícita), por que o
 * principal importa (`PlatoTruckCase`, o aprofundamento do case), como
 * trabalha (`HowIWork`), com o quê (`StackEngineering`) e como falar
 * comigo (`Contact`).
 *
 * A revisão estrutural anterior desta página tinha dez blocos e repetia o
 * posicionamento em três seções, a lista de capacidades em duas e o case
 * PlatoTruck inteiro em duas seguidas. O que saiu:
 *
 *   - `About` — repetia a apresentação de `Profile` em quatro parágrafos.
 *     O dado exclusivo dela (graduação) continua em `about`, em
 *     `data/site.ts`, para uma futura página /sobre.
 *   - `Approach` + `Capabilities` → fundidos em `HowIWork`.
 *   - `Tech` + `Engineering` → fundidos em `StackEngineering`.
 *   - `PlatoTruckShowcase` → virou `PlatoTruckCase`: em vez de uma versão
 *     curta do mesmo card (nome/funcionalidades/preview/CTA já mostrados em
 *     `SelectedProjects`), agora é um aprofundamento — contexto, problema,
 *     por que um sistema interno, decisões (problema → solução) e
 *     engenharia, com screenshots grandes entre os blocos.
 *
 * Nada de `/projetos` foi tocado: `FeaturedProject`, `Transformation` e
 * `ProjectExplorer` seguem intactos naquela rota.
 *
 * Ritmo de superfícies (`components/ui/tone.ts`): `base` (hero) →
 * `graphite` (Profile) → `navy` (Projetos) → `slate` (Case PlatoTruck) →
 * `base` (Como trabalho) → `graphite` (Stack) → `base` (Contato) →
 * `elevated` (rodapé). Nunca duas seguidas com o mesmo tom.
 */
export default function HomePage() {
  return (
    <>
      <InteractiveHero />
      <Profile />
      <SelectedProjects />
      <PlatoTruckCase />
      <HowIWork />
      <StackEngineering />
      <Contact />
    </>
  );
}
