"use client";

import { CaseBlocks } from "@/components/projects/case/case-blocks";
import { CaseHeader } from "@/components/projects/case/case-header";
import { CaseNav } from "@/components/projects/case/case-nav";
import { CaseToc } from "@/components/projects/case/case-toc";
import { useLanguage } from "@/components/i18n/language-provider";
import { Container } from "@/components/ui/container";
import { getNextProject, getProject } from "@/data/content";

/**
 * Corpo da página de case. Existe separado de `app/projetos/[slug]/page.tsx`
 * porque a página é um Server Component (precisa ser, para
 * `generateStaticParams` e `generateMetadata`) e o idioma escolhido vive no
 * cliente. A página valida o slug e passa só o identificador; a resolução do
 * projeto para o idioma ativo acontece aqui.
 *
 * É isso que faz o requisito "abrir um case em EN e continuar em EN"
 * funcionar sem duplicar rotas: a rota é uma só, o conteúdo é que é
 * resolvido por idioma.
 */
export function CaseView({ slug }: { slug: string }) {
  const { locale } = useLanguage();
  const project = getProject(slug, locale);

  if (!project) {
    return null;
  }

  const next = getNextProject(project.slug, locale);

  return (
    <article>
      <CaseHeader project={project} />

      {project.case ? (
        <Container className="pb-section pt-8">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <CaseToc blocks={project.case.blocks} />
            </div>
            <div className="min-w-0 lg:col-span-8 lg:col-start-5">
              <CaseBlocks blocks={project.case.blocks} />
            </div>
          </div>
        </Container>
      ) : null}

      <CaseNav next={next} />
    </article>
  );
}
