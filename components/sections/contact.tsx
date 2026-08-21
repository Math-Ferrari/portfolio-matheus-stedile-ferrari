import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { contact, primaryContact } from "@/data/site";

/**
 * Encerramento — uma pergunta, uma ação, o e-mail. A versão anterior tinha
 * título + subtítulo + parágrafo + botão + a mesma lista de contatos que o
 * rodapé logo abaixo já mostra; tudo isso dizia "fale comigo" cinco vezes.
 */
export function Contact() {
  return (
    <section
      id="contato"
      className="flex min-h-[70vh] flex-col justify-center bg-background"
    >
      <Container className="py-section">
        <Reveal>
          {/* `max-w` em `ch` precisa ficar no próprio h2: em um wrapper, `ch`
              resolve contra o font-size herdado (1rem) e espreme o título de
              tamanho display numa coluna de ~190px. */}
          <h2 className="text-balance-title max-w-[16ch] text-display font-medium text-foreground">
            {contact.title}
          </h2>

          {primaryContact ? (
            <div className="mt-12 flex flex-col gap-6">
              <ActionLink href={primaryContact.href} variant="quiet" external className="text-xl">
                {contact.cta}
              </ActionLink>

              <a
                href={primaryContact.href}
                className="w-fit text-muted transition-colors duration-200 hover:text-accent"
              >
                {primaryContact.display || primaryContact.label}
              </a>
            </div>
          ) : (
            <p className="mt-12 text-sm text-muted">
              Canais de contato a configurar em <code>data/site.ts</code>.
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
