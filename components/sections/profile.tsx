import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/data/site";

/**
 * Quem sou — a única apresentação do corpo da home, feita para ser entendida
 * em segundos. O heading fica largo de propósito (`max-w-[62.5rem]`, ~1000px
 * no desktop): a hero já é uma coluna central estreita, e uma frase curta
 * apertada na mesma largura quebra em mais linhas do que precisa. Sem
 * eyebrow, sem número de seção — a escala tipográfica já organiza a leitura.
 */
export function Profile() {
  return (
    <section id="perfil" className="bg-tone-graphite">
      <Container className="py-section">
        <Reveal className="mx-auto flex max-w-[62.5rem] flex-col items-center text-center">
          <h2 className="text-balance-title max-w-[18ch] text-display font-medium text-foreground">
            {profile.heading}
          </h2>

          <p className="mt-8 max-w-[46ch] text-body-lg text-foreground">{profile.lead}</p>

          <p className="mt-4 max-w-[48ch] text-sm text-muted">{profile.detail}</p>
        </Reveal>
      </Container>
    </section>
  );
}
