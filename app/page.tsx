import { HeroTransition } from "@/components/hero/hero-transition";
import { SelectedProjects } from "@/components/sections/selected-projects";
import { HowIWork } from "@/components/sections/how-i-work";
import { StackEngineering } from "@/components/sections/stack-engineering";
import { Contact } from "@/components/sections/contact";

/**
 * Home — cinco blocos, cada argumento dito uma vez só.
 *
 * A ordem responde, nessa sequência: quem é (hero — que agora já termina na
 * própria apresentação "Software para operações reais.", ver
 * `hero-transition.tsx`/`about-intro.tsx`; não existe mais uma seção
 * `Profile` separada, essa duplicação foi removida), o que já fez
 * (`SelectedProjects`, com hierarquia visual explícita), como trabalha
 * (`HowIWork`), com o quê (`StackEngineering`) e como falar comigo
 * (`Contact`).
 *
 * A revisão estrutural anterior desta página tinha dez blocos e repetia o
 * posicionamento em três seções, a lista de capacidades em duas e o case
 * PlatoTruck inteiro em duas seguidas. O que saiu:
 *
 *   - `About` — repetia a apresentação em quatro parágrafos. O dado
 *     exclusivo dela (graduação) continua em `about`, em `data/site.ts`,
 *     para uma futura página /sobre.
 *   - `Approach` + `Capabilities` → fundidos em `HowIWork`.
 *   - `Tech` + `Engineering` → fundidos em `StackEngineering`.
 *   - `PlatoTruckShowcase` → virou `PlatoTruckCase` → e saiu de vez: o
 *     aprofundamento do case (contexto, problema, por que um sistema
 *     interno, decisões, engenharia) duplicava o que a própria página
 *     `/projetos/sistema-platotruck` já existe pra fazer, com mais
 *     profundidade. A home cita o projeto uma vez, em `SelectedProjects`;
 *     quem quer o aprofundamento clica no CTA e vai para o case. O
 *     componente (`components/sections/platotruck-case.tsx`) e o texto que
 *     ele usava (`platotruckCase`, em `data/projects.ts`) não foram
 *     apagados — ver o comentário em `data/projects.ts` sobre o que ainda
 *     vale a pena migrar para dentro do case de verdade.
 *
 * Nada de `/projetos` foi tocado: `FeaturedProject`, `Transformation` e
 * `ProjectExplorer` seguem intactos naquela rota.
 *
 * Ritmo de superfícies (`components/ui/tone.ts`): `base` (hero, terminando
 * em `graphite` pelo morph de fundo) → `navy` (Projetos) → `base` (Como
 * trabalho) → `graphite` (Stack) → `base` (Contato) → `elevated` (rodapé).
 * Nunca duas seguidas com o mesmo tom.
 */
export default function HomePage() {
  return (
    <>
      <HeroTransition />
      <SelectedProjects />
      <HowIWork />
      <StackEngineering />
      <Contact />
    </>
  );
}
