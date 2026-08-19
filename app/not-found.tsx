import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-section">
      <p className="flex items-center gap-3 text-caption font-medium uppercase tracking-[0.18em] text-muted">
        <span aria-hidden className="h-px w-6 bg-accent-blue" />
        Erro 404
      </p>
      <h1 className="mt-6 max-w-[16ch] text-heading-xl font-medium text-foreground">
        Esta página não existe.
      </h1>
      <p className="mt-5 max-w-[46ch] text-muted">
        O endereço pode ter mudado ou o conteúdo ainda não foi publicado.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <ActionLink href="/">Voltar ao início</ActionLink>
        <ActionLink href="/projetos" variant="secondary">
          Ver projetos
        </ActionLink>
      </div>
    </Container>
  );
}
