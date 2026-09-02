"use client";

import { ArrowUpRight } from "lucide-react";

import { useContent } from "@/components/i18n/use-content";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

/**
 * Encerramento — uma pergunta, uma frase, uma ação. O WhatsApp é o único
 * item com peso (variante `quiet`, a mesma linguagem de "Ver case →" do
 * resto do site); e-mail, LinkedIn e GitHub descem um degrau de hierarquia
 * numa linha só, em `text-muted` e corpo menor. Sem cards, sem botões
 * grandes, sem repetir a lista completa que o rodapé logo abaixo já mostra.
 */
export function Contact() {
  const { contact } = useContent();

  return (
    <section
      id="contato"
      className="flex flex-col justify-center bg-background md:min-h-[70vh]"
    >
      <Container className="py-section">
        <Reveal>
          {/* `max-w` em `ch` precisa ficar no próprio h2: em um wrapper, `ch`
              resolve contra o font-size herdado (1rem) e espreme o título de
              tamanho display numa coluna de ~190px. */}
          <h2 className="text-balance-title max-w-[16ch] text-display font-medium text-foreground">
            {contact.title}
          </h2>

          <p className="mt-6 max-w-[46ch] text-body-lg text-muted">
            {contact.lead}
          </p>

          <div className="mt-12 flex flex-col gap-8">
            {/* `text-xl!`: `cn` (lib/utils) é um join simples, sem
                tailwind-merge, então o `text-[0.95rem]` da base do
                `ActionLink` e um `text-xl` normal coexistem — e o arbitrário
                vence na cascata, deixando o CTA do mesmo tamanho dos links
                secundários. O `!` é o que garante a hierarquia sem alterar o
                componente compartilhado, usado por outras seções. */}
            <ActionLink
              href={contact.cta.href}
              variant="quiet"
              external
              className="min-h-11 text-xl!"
            >
              {contact.cta.label}
            </ActionLink>

            <ul className="flex flex-wrap items-center gap-x-7 gap-y-1">
              {contact.secondary.map((item) => {
                /* `mailto:` entrega o link ao cliente de e-mail — abrir uma
                   aba em branco antes disso não ajuda ninguém. Só os links
                   http saem para uma nova aba. */
                const opensTab = item.href.startsWith("http");

                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      {...(opensTab
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      className="group inline-flex min-h-11 items-center gap-1.5 text-sm text-muted transition-colors duration-200 hover:text-foreground focus-visible:text-foreground"
                    >
                      {item.label}
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        strokeWidth={1.75}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
