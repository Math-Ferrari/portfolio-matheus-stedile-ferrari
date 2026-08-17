import Link from "next/link";

import { BrandSignature } from "@/components/ui/brand-signature";
import { Container } from "@/components/ui/container";
import { activeContacts, nav, site } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-navy border-t border-line-navy bg-navy">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <BrandSignature tone="dark" className="text-[1.05rem]" />
            <p className="mt-4 text-sm text-on-navy">{site.positioning}</p>
            <p className="mt-1.5 max-w-[32ch] text-sm text-on-navy-muted">{site.summary}</p>
          </div>

          <nav aria-label="Rodapé" className="lg:col-span-3">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-on-navy-muted">
              Navegação
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-on-navy transition-colors duration-200 hover:text-blue-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {activeContacts.length > 0 ? (
            <div className="lg:col-span-4">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-on-navy-muted">
                Contato
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {activeContacts.map((contact) => (
                  <li key={contact.label}>
                    <a
                      href={contact.href}
                      className="text-sm text-on-navy transition-colors duration-200 hover:text-blue-light"
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

        <p className="mt-14 border-t border-line-navy pt-6 text-xs text-on-navy-muted">
          © {year} {site.name}
        </p>
      </Container>
    </footer>
  );
}
