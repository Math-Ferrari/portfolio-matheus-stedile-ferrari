import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/data/site";

/**
 * Quem sou — a única apresentação do corpo da home, feita para ser entendida
 * em segundos. Heading e parágrafo ficam largos de propósito
 * (`max-w-[62.5rem]`/`max-w-[64ch]`): a hero já é uma coluna central
 * estreita, e conteúdo curto apertado na mesma largura quebra em mais linhas
 * do que precisa ou lê como um bloco espremido. Sem eyebrow, sem número de
 * seção — a escala tipográfica já organiza a leitura.
 */
export function Profile() {
  return (
    <section id="perfil" className="bg-tone-graphite">
      <Container className="py-section">
        <Reveal className="mx-auto flex max-w-[62.5rem] flex-col items-center text-center">
          <h2 className="text-balance-title max-w-[18ch] text-display font-medium text-foreground">
            {profile.heading}
          </h2>

          <p className="mt-8 max-w-[64ch] text-body-lg text-foreground">{profile.body}</p>
        </Reveal>
      </Container>
    </section>
  );
}
