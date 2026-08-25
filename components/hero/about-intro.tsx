import Image from "next/image";


import { profile, site } from "@/data/site";

function ProfileHeading() {
  return (
    <div className="hero-profile-heading md:col-span-7">
      <div className="mb-3 flex items-center gap-3 sm:mb-5">
        <span aria-hidden className="h-px w-8 bg-accent-soft" />
        <p className="text-caption font-semibold uppercase tracking-[0.22em] text-muted">
          {profile.eyebrow}
        </p>
        <span className="ml-auto shrink-0 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-foreground/35 sm:text-[0.68rem] sm:tracking-[0.2em]">
          01 / Perfil
        </span>
      </div>

      {/* Tamanho normal (`7.1vw`) intacto em qualquer janela com altura
          "normal" — o cap por altura só existe dentro de
          `@media (max-height: 820px)` em globals.css, para não encolher o
          heading em telas comuns (900–1080px, a maioria) só para blindar um
          caso raro. Ver `#profile-title` naquele arquivo para o porquê do
          valor. */}
      <h2
        id="profile-title"
        className="max-w-[10ch] text-[clamp(2.35rem,7.1vw,7.6rem)] font-semibold leading-[0.85] tracking-[-0.065em] text-foreground"
      >
        {profile.headingLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        {/* Sem verde: o contraste vem da tipografia (serifa itálica), não da
            cor — `text-muted` é o mesmo neutro "cinza quente" do resto do
            site, só um degrau mais suave que `--foreground`. */}
        <span className="-ml-[0.025em] mt-[0.08em] block font-serif text-[1.04em] font-normal italic tracking-[-0.045em] text-muted">
          {profile.highlight}
        </span>
      </h2>
    </div>
  );
}

function ProfilePortrait() {
  return (
    <figure
      className="hero-profile-portrait group relative aspect-[4/5] w-full overflow-hidden border border-foreground/10 bg-surface md:col-span-5 md:col-start-8 md:row-span-3 md:row-start-1 md:aspect-auto md:h-[clamp(31rem,72svh,48rem)]"
    >
      <Image
        src="/foto.jpeg"
        alt={`Retrato de ${site.name}`}
        fill
        priority
        sizes="(max-width: 767px) 100vw, 42vw"
        className="object-cover object-[center_22%] grayscale-[0.14] saturate-[0.9] contrast-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
      />
      {/* Só o gradiente neutro preto (para legenda legível) toca a foto —
          sem tingir a imagem com a cor da marca, sem borda colorida: a
          fotografia fica natural, é o design que se adapta a ela, não o
          contrário. A própria foto (céu, vegetação, pele, luz quente) é a
          riqueza cromática da seção — o resto da UI fica quase monocromático
          de propósito. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/55"
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-white sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em]">
            {site.name}
          </p>
          <p className="mt-1 text-[0.68rem] uppercase tracking-[0.13em] text-white/60">
            Engenharia de software
          </p>
        </div>
        <span className="font-serif text-2xl italic text-white/70" aria-hidden>
          MSF
        </span>
      </figcaption>
    </figure>
  );
}

function ProfileSpecialties() {
  return (
    <div className="hero-profile-details md:col-span-7 md:self-end">
      <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-foreground/45 sm:mb-3 sm:text-[0.65rem]">
        Especialidades
      </p>
      <ul className="grid grid-cols-1 border-y border-foreground/10 sm:grid-cols-3">
        {profile.keywords.map((keyword, index) => (
          <li
            key={keyword}
            className="flex min-h-11 items-center gap-3 border-foreground/10 py-2.5 pr-2 text-[0.66rem] font-medium uppercase tracking-[0.07em] text-foreground/75 [&:not(:first-child)]:border-t sm:min-h-12 sm:gap-2 sm:border-t-0 sm:py-2 sm:pr-3 sm:text-xs sm:tracking-[0.08em] sm:[&:nth-child(2n)]:border-l-0 sm:[&:nth-child(2n)]:pl-0 sm:[&:not(:nth-child(3n+1))]:border-l sm:[&:not(:nth-child(3n+1))]:pl-4"
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
 */
export function AboutIntro() {
  return (
    <div
      id="perfil"
      className="relative mx-auto w-full max-w-[90rem] px-0 text-left sm:px-2 md:px-4"
    >
      {/* Antes havia dois glows radiais em verde atrás de toda a composição
          — exatamente o tipo de "mancha verde" que a seção não deve ter.
          Sobra só este filete neutro no topo, quase invisível, no espírito
          de "linhas/divisores em branco com alpha muito baixo". Só desktop:
          amarrado a `--tp-profile-heading`, que só é aceso pela coreografia
          de scroll (exclusiva de desktop). */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 hidden overflow-hidden md:block"
        style={{ opacity: "var(--tp-profile-heading, 0)" }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:gap-y-5 md:grid-cols-12 md:grid-rows-[auto_auto_1fr] md:gap-x-8 md:gap-y-6 lg:gap-x-12 lg:gap-y-7 xl:gap-x-16">
        <ProfileHeading />

        <div className="hero-profile-details md:col-span-7">
          <div className="grid gap-2.5 border-l border-foreground/15 pl-3 sm:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] sm:gap-7 sm:pl-6">
            <p className="max-w-[34rem] text-[0.88rem] font-medium leading-[1.42] text-foreground sm:text-[clamp(1rem,1.35vw,1.22rem)] sm:leading-[1.5]">
              {profile.intro}
            </p>
            <p className="max-w-[32rem] text-[0.76rem] leading-[1.5] text-muted sm:text-[0.95rem] sm:leading-[1.65]">
              {profile.body}
            </p>
          </div>
        </div>

        <ProfilePortrait />
        <ProfileSpecialties />
      </div>

    </div>
  );
}
