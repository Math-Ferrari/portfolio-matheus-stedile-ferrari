"use client";

import Image from "next/image";

import { useContent } from "@/components/i18n/use-content";

function ProfileHeading() {
  const { profile } = useContent();

  return (
    <div className="hero-profile-heading">
      <div className="mb-5 flex items-center gap-3 sm:mb-7">
        <span aria-hidden className="h-px w-8 bg-accent-soft" />
        <p className="text-caption font-semibold uppercase tracking-[0.22em] text-muted">
          {profile.eyebrow}
        </p>
      </div>

      {/* A tensão vem do par tipográfico, não do tamanho bruto: entrelinha
          fechada (0.92) trava as duas linhas como um bloco só, e a segunda
          linha é MAIOR que a primeira, em serifa itálica — a escala cresce
          justamente onde a frase entrega o sentido ("operações reais"). */}
      <h2 className="text-[clamp(2.35rem,4.55vw,4.25rem)] font-semibold leading-[0.92] tracking-[-0.035em] text-foreground">
        <span className="block">{profile.heading}</span>
        <span className="mt-[0.1em] block font-serif text-[1.16em] font-normal italic leading-[0.95] tracking-[-0.03em] text-muted">
          {profile.highlight}
        </span>
      </h2>
    </div>
  );
}

/**
 * O retrato acompanha a ALTURA da coluna de texto (`self-stretch` + altura
 * automática no desktop), em vez de ter uma altura própria em `svh`. Assim
 * as duas colunas terminam alinhadas, sem faixa morta sob a mais curta, e a
 * imagem nunca volta a comandar a altura da seção.
 */
function ProfilePortrait() {
  const { site, ui } = useContent();

  return (
    <figure className="hero-profile-portrait group relative aspect-[4/5] w-full overflow-hidden border border-foreground/10 bg-surface md:col-span-5 md:col-start-8 md:row-start-1 md:aspect-auto md:h-auto md:min-h-[clamp(30rem,60svh,40rem)] md:self-stretch">
      <Image
        src="/foto.jpeg"
        alt={`${ui.media.portraitOf} ${site.name}`}
        fill
        priority
        sizes="(max-width: 767px) 100vw, 42vw"
        className="object-cover object-[center_22%] grayscale-[0.14] saturate-[0.9] contrast-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
      />
      {/* Só o gradiente neutro preto (para legenda legível) toca a foto —
          sem tingir a imagem com a cor da marca, sem borda colorida: a
          fotografia fica natural, é o design que se adapta a ela, não o
          contrário. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/60"
      />
      <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">
          {site.name}
        </p>
        <p className="mt-1 text-[0.68rem] uppercase tracking-[0.13em] text-white/60">
          {site.role}
        </p>
      </figcaption>
    </figure>
  );
}

/**
 * As especialidades vivem DENTRO da composição principal, não numa faixa
 * solta embaixo: é o bloco que dá ritmo à coluna de texto e, ao mesmo tempo,
 * o que impede a lista de parecer um rodapé perdido. Um filete só no topo —
 * sem caixa, sem borda por item, sem grade pesada.
 */
function ProfileDisciplines() {
  const { profile, ui } = useContent();

  return (
    <div className="hero-profile-details mt-10 border-t border-foreground/10 pt-7 sm:mt-12 sm:pt-8">
      <p className="mb-4 text-caption font-semibold uppercase tracking-[0.22em] text-foreground/40">
        {ui.profile.specialties}
      </p>
      <ul className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-3">
        {profile.keywords.map((keyword, index) => (
          <li
            key={keyword}
            className="flex items-baseline gap-3 text-caption font-medium uppercase tracking-[0.08em] text-foreground/75"
          >
            <span className="font-serif text-xs italic text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            {keyword}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A apresentação final da transformação da hero. O conteúdo continua dentro
 * da mesma cena sticky da capa; headline, retrato e detalhes assumem o quadro
 * em fases ordenadas por `HeroTransition`. No mobile, os mesmos elementos
 * aparecem em fluxo normal, depois da capa, sem estado visual alternativo.
 *
 * Duas colunas de altura equivalente: à esquerda a coluna editorial inteira
 * (label → título → texto → especialidades) como um bloco contínuo; à
 * direita o retrato, acompanhando a mesma altura.
 */
export function AboutIntro() {
  const { profile } = useContent();

  return (
    <div
      id="perfil"
      className="relative mx-auto w-full max-w-[86rem] px-0 text-left sm:px-2 md:px-4"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-12 md:gap-x-10 lg:gap-x-14 xl:gap-x-16">
        <div className="md:col-span-7 md:row-start-1 md:self-center">
          <ProfileHeading />

          <div className="hero-profile-details mt-8 sm:mt-10">
            <p className="max-w-[34rem] text-body-lg text-muted">
              {profile.body}
            </p>
          </div>

          <ProfileDisciplines />
        </div>

        <ProfilePortrait />
      </div>
    </div>
  );
}
