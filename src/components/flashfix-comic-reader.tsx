import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import breakdownArt from "@/assets/flashfix-comic/01-breakdown.png";
import flashFixEntersArt from "@/assets/flashfix-comic/02-flashfix-enters.png";
import workshopsNearbyArt from "@/assets/flashfix-comic/03-workshops-nearby.png";
import afterSearchArt from "@/assets/flashfix-comic/04-after-search.png";
import requestSentArt from "@/assets/flashfix-comic/05-request-sent.png";
import workshopRespondsArt from "@/assets/flashfix-comic/06-workshop-responds.png";
import clearConversationArt from "@/assets/flashfix-comic/09-clear-conversation.png";
import sharedProgressArt from "@/assets/flashfix-comic/10-shared-progress.png";
import repairCompleteArt from "@/assets/flashfix-comic/11-repair-complete.png";
import nightModeArt from "@/assets/flashfix-comic/12-night-mode.png";
import backOnTheRoadArt from "@/assets/flashfix-comic/13-back-on-the-road.png";

import { FlashfixChapterNav, type ComicScene } from "@/components/flashfix/chapter-nav";
import s from "@/components/flashfix/flashfix.module.css";
import { FlashFixInterfaceGallery } from "@/components/flashfix-interface-gallery";
import { StatusBadge } from "@/components/ui/status-badge";
import { contactHref, type PortfolioProject } from "@/lib/portfolio";

// ─────────────────────────────────────────────
// Storyboard — eight scenes, one idea each. Facts: docs/source-of-truth/
// projects/flashfix.md + the `flashfix` entry of src/lib/portfolio.ts.
// ─────────────────────────────────────────────
const SCENES: ComicScene[] = [
  { id: "escena-0", n: 0, name: "Portada" },
  { id: "escena-1", n: 1, name: "Origen" },
  { id: "escena-2", n: 2, name: "Problema" },
  { id: "escena-3", n: 3, name: "Idea" },
  { id: "escena-4", n: 4, name: "Construcción" },
  { id: "escena-5", n: 5, name: "Retos" },
  { id: "escena-6", n: 6, name: "Decisiones" },
  { id: "escena-7", n: 7, name: "Resultado" },
];

const SIZES = {
  cover: "(min-width: 1024px) 380px, (min-width: 640px) 420px, 300px",
  single: "(min-width: 520px) 460px, 100vw",
  three: "(min-width: 1280px) 370px, (min-width: 768px) 31vw, (min-width: 520px) 460px, 100vw",
  four: "(min-width: 1280px) 275px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw",
} as const;

const WRAP = "mx-auto w-full max-w-[1180px]";
const PAD = "px-4 sm:px-8";

// ─────────────────────────────────────────────
// Building blocks
// ─────────────────────────────────────────────
function Kicker({ n, name, onInk = false }: { n: number; name: string; onInk?: boolean }) {
  return (
    <p
      className={`font-mono text-xs font-semibold uppercase tracking-[0.14em] ${
        onInk ? "text-[color:var(--ink-fg)]" : "text-[color:var(--foreground)]"
      }`}
    >
      <span className="mr-2 inline-block bg-[color:var(--primary)] px-2 py-1 text-[color:var(--on-primary)]">
        Escena {n}
      </span>
      {name}
    </p>
  );
}

function Plate({
  src,
  alt,
  sizes,
  tilt = "",
  eager = false,
  lead,
  caption,
  children,
}: {
  src: StaticImageData | string;
  alt: string;
  sizes: string;
  tilt?: string;
  eager?: boolean;
  lead?: string;
  caption?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <figure className={`${s.reveal} ${tilt} mx-auto w-full max-w-[460px]`}>
      <div className={`${s.panel} @container relative aspect-[2/3] overflow-hidden`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="object-cover"
        />
        {children}
      </div>
      {caption ? (
        <figcaption
          className={`${s.caption} relative z-10 -mt-6 ml-3 mr-5 px-3.5 py-2.5 text-[15px] leading-snug`}
        >
          {lead ? (
            <strong className="mb-0.5 block font-mono text-[11px] uppercase tracking-[0.1em] text-[color:var(--primary)]">
              {lead}
            </strong>
          ) : null}
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

// ─────────────────────────────────────────────
// The comic
// ─────────────────────────────────────────────
export function FlashFixComicReader({ project }: { project: PortfolioProject }) {
  return (
    <article className={`${s.story} pt-16`} aria-label="FlashFix, el cómic del proyecto">
      <FlashfixChapterNav scenes={SCENES} />

      {/* ── 0 · PORTADA ─────────────────────────────── */}
      <section id="escena-0" aria-labelledby="escena-0-titulo" className={`${s.scene} ${PAD} pb-16 pt-7 lg:pb-24 lg:pt-10`}>
        <div className={`${WRAP} grid items-center gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16`}>
          <div className={`${s.tiltA} mx-auto w-full max-w-[300px] sm:max-w-[420px] lg:max-w-none`}>
            <div className={`${s.panel} relative aspect-[2/3] overflow-hidden`}>
              <Image
                src={project.cover?.src ?? "/images/flashfix-comic-cover-v2.png"}
                alt={project.cover?.alt ?? "Portada del cómic de FlashFix"}
                fill
                preload
                sizes={SIZES.cover}
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className={`${s.captionInk} inline-block px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em]`}>
              Proyecto de fin de grado · MVP académico
            </p>
            <h1
              id="escena-0-titulo"
              className={`${s.display} ${s.displayShadow} mt-5 text-[clamp(4.5rem,17vw,10rem)] text-[color:var(--foreground)]`}
            >
              {project.name}
            </h1>
            <p className="mt-5 max-w-[34rem] text-pretty text-lg leading-8 text-[color:var(--surface-foreground)]">
              {project.pitch}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <StatusBadge status={project.status} label={project.statusNote} />
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[color:var(--muted)]">
                {project.platforms.join(" · ")} · {project.relation}
              </span>
            </div>
            <a
              href="#escena-1"
              className="mt-8 inline-flex min-h-11 items-center gap-2 border-b-[3px] border-[color:var(--primary)] font-mono text-sm font-semibold uppercase tracking-[0.1em] text-[color:var(--foreground)] hover:text-[color:var(--primary)]"
            >
              Empezar a leer <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 1 · ORIGEN ──────────────────────────────── */}
      <section id="escena-1" aria-labelledby="escena-1-titulo" className={`${s.scene} ${PAD} py-14 lg:py-20`}>
        <div className={`${WRAP} ${s.reveal} ${s.panelInk} ${s.halftoneInk} relative overflow-hidden px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-20`}>
          <Kicker n={1} name="Origen" onInk />
          <h2
            id="escena-1-titulo"
            className={`${s.display} mt-6 max-w-[16ch] text-[clamp(2.75rem,9vw,6.5rem)] text-[color:var(--ink-fg)]`}
          >
            No había cliente. Había un{" "}
            <span className="text-[#ff7a5c]">proyecto de fin de grado.</span>
          </h2>

          <dl className="mt-10 grid gap-x-10 gap-y-5 border-t-2 border-[color:var(--ink-fg)] pt-6 sm:grid-cols-3">
            {[
              ["Cliente", "Ninguno"],
              ["Modelo de negocio", "Ninguno: no es un SaaS"],
              ["Qué es", "Un proyecto de fin de grado (PFG)"],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#b9ae9b]">{term}</dt>
                <dd className="mt-1 font-display text-xl font-semibold leading-snug text-[color:var(--ink-fg)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 max-w-[40rem] text-pretty text-lg leading-8 text-[#ddd5c4]">
            FlashFix nació en la universidad, como proyecto de fin de grado. Nadie nos lo encargó y no
            tenía que venderse: tenía que llevar una idea hasta un MVP que funcionara. Aquí contamos
            cómo fue, con lo que salió bien y con lo que no.
          </p>
        </div>
      </section>

      {/* ── 2 · PROBLEMA ────────────────────────────── */}
      <section id="escena-2" aria-labelledby="escena-2-titulo" className={`${s.scene} ${PAD} py-14 lg:py-20`}>
        <div className={`${WRAP} grid items-center gap-10 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-16`}>
          <Plate
            src={breakdownArt}
            alt="Viñeta: un coche blanco con franjas rojas echa humo, averiado en una calle del centro; su conductor, de pie junto a él, mira el móvil sin saber a quién llamar"
            sizes={SIZES.single}
            tilt={s.tiltB}
          >
            <p
              className={`${s.bubble} ${s.display} ${s.revealPop} absolute left-[5%] top-[4%] w-[52%] px-[4cqw] py-[5cqw] text-[8.5cqw]`}
            >
              ¿A quién llamo?
            </p>
          </Plate>

          <div className="order-first lg:order-none">
            <Kicker n={2} name="Problema" />
            <h2
              id="escena-2-titulo"
              className={`${s.display} ${s.displayShadow} mt-5 text-[clamp(3rem,10vw,6.5rem)]`}
            >
              Llamar a ciegas
            </h2>
            <p className="mt-6 max-w-[34rem] text-pretty text-xl leading-8 text-[color:var(--surface-foreground)]">
              {project.problem}
            </p>
            <ul className="mt-8 flex flex-wrap gap-4">
              <li className={`${s.captionInk} ${s.tiltA} px-4 py-3 font-display text-lg font-semibold italic`}>
                «¿Tendrán hueco?»
              </li>
              <li className={`${s.captionInk} ${s.tiltB} px-4 py-3 font-display text-lg font-semibold italic`}>
                «¿Qué dicen de ellos?»
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 3 · IDEA ────────────────────────────────── */}
      <section id="escena-3" aria-labelledby="escena-3-titulo" className={`${s.scene} ${s.speed} ${PAD} py-14 lg:py-20`}>
        <div className={WRAP}>
          <Kicker n={3} name="Idea" />
          <h2
            id="escena-3-titulo"
            className={`${s.display} ${s.displayShadow} mt-5 max-w-[18ch] text-[clamp(2.75rem,8vw,5.5rem)]`}
          >
            ¿Y si el taller estuviera en el mapa?
          </h2>
          <p className="mt-6 max-w-[42rem] text-pretty text-xl leading-8 text-[color:var(--surface-foreground)]">
            {project.solution}
          </p>

          <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-7 lg:gap-10">
            <Plate
              src={flashFixEntersArt}
              alt="Viñeta: el conductor enseña el móvil a cámara con la pantalla de bienvenida de FlashFix; detrás, su coche sigue averiado"
              sizes={SIZES.three}
              tilt={s.tiltA}
              lead="Un marketplace"
              caption="Los talleres, reunidos en una app Android en lugar de en una lista de teléfonos."
            />
            <Plate
              src={workshopsNearbyArt}
              alt="Viñeta: el conductor consulta en FlashFix los talleres cercanos; sobre la ciudad, una ruta roja lleva hasta un taller marcado con un pin"
              sizes={SIZES.three}
              tilt={s.tiltB}
              lead="Geolocalizado"
              caption="La app localiza los talleres cercanos a partir de la ubicación."
            />
            <Plate
              src={afterSearchArt}
              alt="Viñeta: el conductor, junto a su coche, mira al fondo de la calle un taller señalado con un pin de mapa"
              sizes={SIZES.three}
              tilt={s.tiltC}
              lead="Con chat y valoraciones"
              caption="Antes de ir se puede hablar con el taller y ver cómo lo han valorado."
            >
              <p className={`${s.display} ${s.revealPop} absolute right-[6%] top-[5%] w-[52%] text-right text-[9.5cqw] text-[color:var(--foreground)]`}>
                ¡No más llamadas a ciegas!
              </p>
            </Plate>
          </div>
        </div>
      </section>

      {/* ── 4 · CONSTRUCCIÓN ────────────────────────── */}
      <section id="escena-4" aria-labelledby="escena-4-titulo" className={`${s.scene} ${PAD} py-14 lg:py-20`}>
        <div className={WRAP}>
          <Kicker n={4} name="Construcción" />
          <h2 id="escena-4-titulo" className={`${s.display} mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[clamp(2.25rem,6vw,4.5rem)]`}>
            <span>
              <span className={`${s.displayOutline} mr-2 text-[2.4em] leading-[0.8]`}>17</span>
              pantallas,
            </span>
            <span>
              <span className={`${s.displayOutline} mr-2 text-[2.4em] leading-[0.8]`}>3</span>
              roles
            </span>
          </h2>
          <p className="mt-6 max-w-[42rem] text-pretty text-xl leading-8 text-[color:var(--surface-foreground)]">
            La misma app se abre de tres maneras según quién entra. Cada rol tiene sus propias pantallas.
          </p>

          {/* Three-role splash */}
          <ul className={`${s.reveal} ${s.panel} mt-10 grid md:grid-cols-3`}>
            <li className="comic-halftone border-b-[3px] border-[color:var(--foreground)] p-6 md:border-b-0 md:border-r-[3px] lg:p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--primary)]">Rol 1</p>
              <h3 className={`${s.display} mt-2 text-[clamp(2.25rem,4.4vw,3.5rem)]`}>Conductor</h3>
              <p className="mt-3 text-base leading-7 text-[color:var(--surface-foreground)]">
                Busca talleres cercanos, envía la solicitud, sigue su estado, habla con el taller y lo valora al terminar.
              </p>
            </li>
            <li className="border-b-[3px] border-[color:var(--foreground)] bg-[color:var(--primary)] p-6 text-[color:var(--on-primary)] md:border-b-0 md:border-r-[3px] lg:p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em]">Rol 2</p>
              <h3 className={`${s.display} mt-2 text-[clamp(2.25rem,4.4vw,3.5rem)]`}>Taller</h3>
              <p className="mt-3 text-base leading-7">
                Recibe las solicitudes en su bandeja, las acepta o las rechaza, marca la reparación como completada y responde por chat.
              </p>
            </li>
            <li className={`${s.halftoneInk} bg-[color:var(--ink-bg)] p-6 text-[color:var(--ink-fg)] lg:p-8`}>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff7a5c]">Rol 3</p>
              <h3 className={`${s.display} mt-2 text-[clamp(2.25rem,4.4vw,3.5rem)]`}>Administrador</h3>
              <p className="mt-3 text-base leading-7 text-[#ddd5c4]">
                Tiene su propio panel para administrar la plataforma.
              </p>
            </li>
          </ul>

          {/* The flow, drawn */}
          <div className="mt-14 grid gap-12 sm:grid-cols-2 sm:gap-x-7 lg:grid-cols-4 lg:gap-6">
            <Plate
              src={requestSentArt}
              alt="Viñeta: el conductor sostiene el móvil con el seguimiento de su solicitud en FlashFix; de la pantalla salen líneas que conectan varios puntos de estado"
              sizes={SIZES.four}
              tilt={s.tiltA}
              lead="Solicitud"
              caption="El conductor la envía desde el móvil y ve su estado."
            />
            <Plate
              src={workshopRespondsArt}
              alt="Viñeta: una mecánica, llave inglesa en mano, mira la solicitud que acaba de llegar a FlashFix en el móvil del taller"
              sizes={SIZES.four}
              tilt={s.tiltB}
              lead="Bandeja del taller"
              caption="Al taller le llega la solicitud: aceptar o rechazar."
            />
            <Plate
              src={clearConversationArt}
              alt="Viñeta: conductor y mecánica escriben cada uno en su móvil; entre los dos, la pantalla del chat de FlashFix con sus mensajes"
              sizes={SIZES.four}
              tilt={s.tiltC}
              lead="Chat"
              caption="La conversación ocurre dentro de la app."
            />
            <Plate
              src={sharedProgressArt}
              alt="Viñeta: conductor y mecánica, cada uno a un lado del coche, siguen la misma cadena de hitos de la reparación"
              sizes={SIZES.four}
              tilt={s.tiltA}
              lead="Seguimiento"
              caption="Solicitado, aceptado, en reparación, completado: los dos ven lo mismo."
            >
              <p className={`${s.display} ${s.revealPop} absolute inset-x-[8%] top-[7%] text-center text-[11cqw] text-[color:var(--foreground)]`}>
                Mismo estado. Misma ruta.
              </p>
            </Plate>
          </div>

          {/* Toolbox */}
          <div className={`${s.reveal} ${s.caption} mt-14 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6`}>
            <h3 className={`${s.display} shrink-0 text-3xl`}>Caja de herramientas</h3>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="border-2 border-[color:var(--foreground)] bg-[#fffdf6] px-2.5 py-1 font-mono text-xs font-semibold text-[color:var(--foreground)]"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {/* Real screens */}
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b-[3px] border-[color:var(--foreground)] pb-4">
              <h3 className={`${s.display} ${s.displayShadow} text-[clamp(2.25rem,6vw,4rem)]`}>Pantallas reales</h3>
              <p className="max-w-[30rem] text-base leading-7 text-[color:var(--surface-foreground)]">
                Hasta aquí, dibujos. Esto son capturas de la aplicación Android: ocho de las 17 pantallas.
              </p>
            </div>
            <div className="mt-8">
              <FlashFixInterfaceGallery />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 · RETOS ───────────────────────────────── */}
      <section
        id="escena-5"
        aria-labelledby="escena-5-titulo"
        className={`${s.scene} ${s.halftoneInk} on-ink ${PAD} border-y-[3px] border-[color:var(--foreground)] bg-[color:var(--ink-bg)] py-16 text-[color:var(--ink-fg)] lg:py-24`}
      >
        <div className={WRAP}>
          <Kicker n={5} name="Retos" onInk />
          <h2
            id="escena-5-titulo"
            className={`${s.display} mt-5 max-w-[15ch] text-[clamp(2.75rem,9vw,6.5rem)] text-[color:var(--ink-fg)]`}
          >
            El villano vivía en <span className="text-[#ff7a5c]">nuestro código</span>
          </h2>
          <p className="mt-6 max-w-[40rem] text-pretty text-xl leading-8 text-[#ddd5c4]">
            La app funcionaba. Por dentro, tres problemas la esperaban, y los tres eran nuestros.
          </p>

          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-7">
            <li className={`${s.reveal} ${s.panelOnInk} ${s.tiltA} flex flex-col p-6 lg:p-7`}>
              <p className={`${s.display} text-[clamp(3.5rem,7vw,5rem)] text-[#ff7a5c]`} aria-hidden="true">
                ¿Quién lo cambió?
              </p>
              <p className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b9ae9b]">Reto 1</p>
              <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">Estado global repartido</h3>
              <p className="mt-3 text-base leading-7 text-[#ddd5c4]">
                El estado de la app estaba repartido como estado global. Cuando cualquier pantalla puede tocarlo,
                seguir de dónde viene un cambio cuesta cada vez más.
              </p>
            </li>
            <li className={`${s.reveal} ${s.panelOnInk} ${s.tiltB} flex flex-col p-6 lg:p-7`}>
              <p className={`${s.display} text-[clamp(3.5rem,7vw,5rem)] text-[#ff7a5c]`} aria-hidden="true">
                2 ≠ 3
              </p>
              <p className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b9ae9b]">Reto 2</p>
              <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">Mezcla de Material 2 y Material 3</h3>
              <p className="mt-3 text-base leading-7 text-[#ddd5c4]">
                Dos generaciones del sistema de diseño conviviendo en la misma app. Funciona, pero la interfaz
                deja de hablar con una sola voz.
              </p>
            </li>
            <li className={`${s.reveal} ${s.tiltC} flex flex-col border-[3px] border-[color:var(--ink-fg)] bg-[color:var(--primary)] p-6 text-[color:var(--on-primary)] shadow-[6px_6px_0_0_var(--ink-fg)] lg:p-7`}>
              <p className={`${s.display} text-[clamp(3.5rem,7vw,5rem)] text-[color:var(--ink-bg)]`} aria-hidden="true">
                ¡Fallo crítico!
              </p>
              <p className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.12em]">Reto 3 · el más serio</p>
              <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">Un fallo crítico en el borrado de usuarios</h3>
              <p className="mt-3 text-base leading-7">
                Borrar un usuario escondía un fallo crítico. No lo maquillamos: estaba en nuestro código y
                forma parte de esta historia.
              </p>
            </li>
          </ol>

          <p className={`${s.reveal} mt-12 max-w-[40rem] border-l-4 border-[color:var(--primary)] pl-5 font-display text-2xl font-semibold italic leading-snug`}>
            Los tres salieron a la luz de la misma forma: revisando nuestro propio trabajo.
          </p>
        </div>
      </section>

      {/* ── 6 · DECISIONES ──────────────────────────── */}
      <section id="escena-6" aria-labelledby="escena-6-titulo" className={`${s.scene} ${PAD} py-16 lg:py-24`}>
        <div className={`${WRAP} grid items-start gap-12 lg:grid-cols-[1fr_minmax(0,340px)] lg:gap-14`}>
          <div className={`${s.reveal} ${s.sheet} min-w-0 px-5 py-8 sm:px-10 sm:py-10`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[color:var(--foreground)] pb-3">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em]">
                Auditoría de código · FlashFix · revisión propia
              </p>
              <p className={`${s.stamp} px-2.5 py-1 text-[11px]`}>Refactor parcial</p>
            </div>

            <div className="mt-6">
              <Kicker n={6} name="Decisiones" />
            </div>
            <h2 id="escena-6-titulo" className={`${s.display} mt-4 max-w-[14ch] text-[clamp(2.5rem,7vw,4.75rem)]`}>
              Boli rojo sobre nuestro propio código
            </h2>

            <ol className="mt-10 space-y-9">
              <li className="flex gap-4">
                <span className={s.tick} aria-hidden="true">✓</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold leading-tight">Auditar nuestro propio código</h3>
                  <p className={`${s.pen} ${s.penTilt} mt-2 text-xl leading-snug`}>
                    Con los problemas reales documentados, no escondidos.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className={s.tick} aria-hidden="true">✓</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold leading-tight">
                    Migrar de{" "}
                    <span className={s.struck}>Material 2 + 3</span> a{" "}
                    <span className={s.circled}>Material 3</span>
                  </h3>
                  <p className={`${s.pen} ${s.penTilt} mt-3 text-xl leading-snug`}>Un solo sistema de diseño.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className={s.tick} aria-hidden="true">✓</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold leading-tight">Cifrar las preferencias sensibles</h3>
                  <p className={`${s.pen} ${s.penTilt} mt-2 text-xl leading-snug`}>
                    Con Encrypted<wbr />Shared<wbr />Preferences.
                  </p>
                </div>
              </li>
            </ol>

            <p className="mt-10 border-t-2 border-dashed border-[color:var(--primary)] pt-5 text-base leading-7 text-[color:var(--surface-foreground)]">
              <strong className="font-semibold text-[color:var(--foreground)]">Nota al margen.</strong> La
              refactorización fue parcial: no damos por cerrado todo lo que encontró la auditoría. Sirve
              justo para eso, para saber qué queda.
            </p>
          </div>

          <Plate
            src={nightModeArt}
            alt="Viñeta nocturna: el conductor, apoyado en su coche frente al taller, mira FlashFix en tema oscuro con la pantalla de valoración"
            sizes={SIZES.single}
            tilt={s.tiltB}
            lead="Después"
            caption="La interfaz, ya en Material 3. También en tema oscuro."
          />
        </div>
      </section>

      {/* ── 7 · RESULTADO ───────────────────────────── */}
      <section id="escena-7" aria-labelledby="escena-7-titulo" className={`${s.scene} ${s.speed} ${PAD} pb-20 pt-14 lg:pb-28 lg:pt-20`}>
        <div className={WRAP}>
          <Kicker n={7} name="Resultado" />
          <h2
            id="escena-7-titulo"
            className={`${s.display} ${s.displayShadow} mt-5 text-[clamp(3rem,10vw,6.5rem)]`}
          >
            Un MVP que arranca
          </h2>

          <div className="mt-12 grid items-start gap-12 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-10">
            <Plate
              src={repairCompleteArt}
              alt="Viñeta: la mecánica entrega las llaves al conductor frente al taller; en primer plano, FlashFix muestra la reparación completada y la valoración"
              sizes={SIZES.three}
              tilt={s.tiltA}
              lead="El ciclo se cierra"
              caption="Reparación completada y taller valorado, de principio a fin dentro de la app."
            />
            <Plate
              src={backOnTheRoadArt}
              alt="Viñeta: el coche, ya reparado, sale del taller al amanecer mientras la mecánica lo despide al fondo"
              sizes={SIZES.three}
              tilt={s.tiltB}
              lead="Final"
              caption="El MVP académico funciona. El coche, también."
            >
              <p className={`${s.display} ${s.revealPop} absolute left-[19%] top-[15.5%] w-[36%] -rotate-6 text-center text-[11cqw] text-[color:var(--foreground)]`}>
                ¡Ruta libre!
              </p>
            </Plate>

            <div className={`${s.reveal} ${s.caption} p-6 md:col-span-2 lg:col-span-1 lg:p-7`}>
              <h3 className={`${s.display} text-4xl`}>Lo que queda</h3>
              <ul className="mt-4 space-y-3 text-base leading-7 text-[color:var(--surface-foreground)]">
                {project.proof.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.6em] h-2.5 w-2.5 flex-none bg-[color:var(--primary)]" />
                    {line}
                  </li>
                ))}
              </ul>
              <h3 className={`${s.display} mt-8 text-4xl`}>Lo que aprendimos</h3>
              <ul className={`${s.pen} mt-4 space-y-2 text-xl leading-snug`}>
                <li>Revisar lo construido antes de seguir ampliando.</li>
                <li>Un solo sistema de diseño, no dos a la vez.</li>
                <li>Lo sensible se guarda cifrado.</li>
              </ul>
              <p className="mt-6 border-t-2 border-[color:var(--foreground)] pt-4 text-sm leading-6 text-[color:var(--muted)]">
                Sigue siendo lo que fue desde la primera viñeta: un proyecto de fin de grado, sin cliente.
              </p>
            </div>
          </div>

          {/* Fin + CTA */}
          <div className={`${s.reveal} ${s.panelInk} mt-16 flex flex-col items-start gap-8 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-12`}>
            <div>
              <p className={`${s.display} text-6xl text-[#ff7a5c]`}>Fin</p>
              <p className="mt-3 max-w-[30rem] font-display text-2xl font-semibold leading-snug text-[color:var(--ink-fg)]">
                ¿Tienes una app en mente? La siguiente historia puede ser la tuya.
              </p>
            </div>
            <div className="on-ink flex flex-col items-start gap-5">
              <Link
                href={contactHref(project.cta.intent)}
                className={`${s.cta} inline-flex min-h-14 items-center gap-3 px-7 text-lg font-semibold !shadow-[5px_5px_0_0_var(--ink-fg)]`}
              >
                {project.cta.label} <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/proyectos"
                className="inline-flex min-h-11 items-center gap-2 font-mono text-sm font-semibold uppercase tracking-[0.1em] text-[color:var(--ink-fg)] underline decoration-[color:var(--primary)] decoration-2 underline-offset-4 hover:text-[#ff7a5c]"
              >
                <span aria-hidden="true">←</span> Volver a proyectos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
