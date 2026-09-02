"use client";

import { useContent } from "@/components/i18n/use-content";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  const { ui } = useContent();

  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-section">
      <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.18em] text-muted">
        <span aria-hidden className="h-px w-6 bg-accent" />
        {ui.notFound.code}
      </p>
      <h1 className="mt-6 max-w-[16ch] text-heading-xl font-medium text-foreground">
        {ui.notFound.title}
      </h1>
      <p className="mt-5 max-w-[46ch] text-muted">
        {ui.notFound.lead}
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <ActionLink href="/">{ui.notFound.home}</ActionLink>
        <ActionLink href="/projetos" variant="secondary">
          {ui.notFound.projects}
        </ActionLink>
      </div>
    </Container>
  );
}
