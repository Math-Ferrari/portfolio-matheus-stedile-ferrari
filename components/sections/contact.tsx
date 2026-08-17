import { ArrowUpRight } from "lucide-react";

import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { activeContacts, contact, primaryContact } from "@/data/site";

/** Fecho da página: única seção navy da parte final, continuada pelo rodapé. */
export function Contact() {
  return (
    <section
      id="contato"
      className="on-navy flex min-h-[85vh] flex-col justify-center border-t border-line-navy bg-navy"
    >
      <Container className="py-section">
        <div className="grid gap-x-10 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-3 xl:col-span-2">
            <Eyebrow index="07" tone="navy">
              {contact.eyebrow}
            </Eyebrow>
          </div>

          <div className="lg:col-span-9 xl:col-span-10">
            <Reveal>
              <h2 className="text-balance-title max-w-[18ch] font-serif text-display font-medium text-on-navy">
                {contact.title}
                <span className="mt-2 block text-blue-light">{contact.subtitle}</span>
              </h2>

              <p className="mt-8 max-w-[52ch] text-lead text-on-navy-muted">{contact.lead}</p>

              {primaryContact ? (
                <div className="mt-10">
                  <ActionLink href={primaryContact.href} variant="primaryDark">
                    {primaryContact.label === "E-mail"
                      ? "Enviar um e-mail"
                      : `Falar por ${primaryContact.label}`}
                  </ActionLink>
                </div>
              ) : null}
            </Reveal>

            {activeContacts.length > 0 ? (
              <Reveal delay={80}>
                <ul className="mt-16 border-t border-line-navy">
                  {activeContacts.map((item) => (
                    <li key={item.label} className="border-b border-line-navy">
                      <a
                        href={item.href}
                        {...(item.href.startsWith("http")
                          ? { target: "_blank", rel: "noreferrer noopener" }
                          : {})}
                        className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5 transition-colors duration-200"
                      >
                        <span className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-on-navy-muted transition-colors duration-200 group-hover:text-blue-light">
                          {item.label}
                        </span>
                        <span className="flex items-center gap-3 text-[1.2rem] text-on-navy transition-colors duration-200 group-hover:text-blue-light">
                          {item.display || item.label}
                          <ArrowUpRight
                            aria-hidden
                            className="size-5 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            strokeWidth={1.75}
                          />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : (
              <p className="mt-16 border-t border-line-navy pt-6 text-sm text-on-navy-muted">
                Canais de contato a configurar em <code>data/site.ts</code>.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
