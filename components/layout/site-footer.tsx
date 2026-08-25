import Link from "next/link";

import { Container } from "@/components/ui/container";
import { activeContacts, nav, site } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-elevated">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-[1.05rem] font-medium -tracking-[0.01em] text-foreground">
              {site.name}
            </p>
            <p className="mt-4 text-sm text-foreground">{site.positioning}</p>
          </div>

          <nav aria-label="Rodapé" className="lg:col-span-3">
            <p className="text-caption font-medium uppercase tracking-[0.18em] text-muted">
              Navegação
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 sm:mt-4 lg:flex lg:flex-col lg:gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-sm text-foreground transition-colors duration-200 hover:text-accent lg:min-h-0 lg:py-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {activeContacts.length > 0 ? (
            <div className="lg:col-span-4">
              <p className="text-caption font-medium uppercase tracking-[0.18em] text-muted">
                Contato
              </p>
              <ul className="mt-3 flex flex-col sm:mt-4">
                {activeContacts.map((contact) => (
                  <li key={contact.label}>
                    <a
                      href={contact.href}
                      className="inline-flex min-h-11 items-center text-sm text-foreground transition-colors duration-200 hover:text-accent lg:min-h-0 lg:py-1"
                      {...(contact.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                    >
                      {contact.display || contact.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <p className="mt-14 border-t border-border pt-6 text-xs text-muted">
          © {year} {site.name}
        </p>
      </Container>
    </footer>
  );
}
