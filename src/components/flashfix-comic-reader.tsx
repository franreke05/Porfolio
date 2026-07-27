"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";

import breakdownArt from "@/assets/flashfix-comic/01-breakdown.png";
import flashFixEntersArt from "@/assets/flashfix-comic/02-flashfix-enters.png";
import workshopsNearbyArt from "@/assets/flashfix-comic/03-workshops-nearby.png";
import afterSearchArt from "@/assets/flashfix-comic/04-after-search.png";
import requestSentArt from "@/assets/flashfix-comic/05-request-sent.png";
import workshopRespondsArt from "@/assets/flashfix-comic/06-workshop-responds.png";
import afterRequestArt from "@/assets/flashfix-comic/07-after-request.png";
import repairUnderwayArt from "@/assets/flashfix-comic/08-repair-underway.png";
import clearConversationArt from "@/assets/flashfix-comic/09-clear-conversation.png";
import sharedProgressArt from "@/assets/flashfix-comic/10-shared-progress.png";
import repairCompleteArt from "@/assets/flashfix-comic/11-repair-complete.png";
import nightModeArt from "@/assets/flashfix-comic/12-night-mode.png";
import backOnTheRoadArt from "@/assets/flashfix-comic/13-back-on-the-road.png";

// ─────────────────────────────────────────────
// Script — an open-book spread: left page + right page, one scene each,
// turned as a pair. This reader stays entirely inside the comic narrative.
// ─────────────────────────────────────────────
type ComicLeaf = {
  page: number;
  eyebrow: string;
  title: string;
  src: StaticImageData | string;
  alt: string;
  step: string;
  caption: string;
  narration?: string;
  narrationPosition?: "top-left" | "top-center" | "top-right";
};

type PairSpread = { kind: "pair"; left: ComicLeaf; right: ComicLeaf };

const SPREADS: PairSpread[] = [
  {
    kind: "pair",
    left: {
      page: 1,
      eyebrow: "01 · Portada",
      title: "FlashFix",
      src: "/images/flashfix-comic-cover-v2.png",
      alt: "Portada del cómic FlashFix con un coche deportivo rojo y blanco",
      step: "Portada",
      caption: "FlashFix: la historia de una avería que vuelve a ponerse en marcha.",
    },
    right: {
      page: 2,
      eyebrow: "02 · El conflicto",
      title: "¿A quién llamo?",
      src: breakdownArt,
      alt: "Conductor junto a un coche averiado en una calle urbana",
      step: "El problema",
      caption: "Una avería no debería empezar con una llamada a ciegas.",
      narration: "¿A quién llamo?",
      narrationPosition: "top-left",
    },
  },
  {
    kind: "pair",
    left: {
      page: 3,
      eyebrow: "03 · El acceso",
      title: "FlashFix entra en escena",
      src: flashFixEntersArt,
      alt: "Conductor mostrando FlashFix en su teléfono junto al coche averiado",
      step: "Acceso",
      caption: "Cuando todo se detiene, el móvil abre la puerta a una solución.",
    },
    right: {
      page: 4,
      eyebrow: "04 · La búsqueda",
      title: "Talleres cerca de ti",
      src: workshopsNearbyArt,
      alt: "Búsqueda de talleres cercanos dentro de FlashFix",
      step: "Búsqueda",
      caption: "Talleres cercanos, una ruta clara y una decisión informada.",
    },
  },
  {
    kind: "pair",
    left: {
      page: 5,
      eyebrow: "05 · Interludio",
      title: "No más llamadas a ciegas",
      src: afterSearchArt,
      alt: "Conductor eligiendo un taller siguiendo una ruta urbana",
      step: "La decisión",
      caption: "Comparar antes de llamar convierte la incertidumbre en una elección concreta.",
      narration: "No más llamadas a ciegas",
      narrationPosition: "top-right",
    },
    right: {
      page: 6,
      eyebrow: "06 · La solicitud",
      title: "Solicitud enviada",
      src: requestSentArt,
      alt: "Conductor consultando el seguimiento de una solicitud en FlashFix",
      step: "Solicitud",
      caption: "La petición queda registrada y su estado puede seguirse desde el primer momento.",
    },
  },
  {
    kind: "pair",
    left: {
      page: 7,
      eyebrow: "07 · El taller",
      title: "El taller responde",
      src: workshopRespondsArt,
      alt: "Mecánica recibiendo una solicitud de FlashFix en el taller",
      step: "Bandeja",
      caption: "El taller recibe el aviso y puede responder desde su propia bandeja de trabajo.",
    },
    right: {
      page: 8,
      eyebrow: "08 · Interludio",
      title: "Una petición. Un trabajo.",
      src: afterRequestArt,
      alt: "Conductor y mecánica unidos por una ruta de seguimiento",
      step: "Conexión",
      caption: "La misma petición conecta al cliente, el coche y el taller.",
      narration: "Una petición. Un taller.",
      narrationPosition: "top-left",
    },
  },
  {
    kind: "pair",
    left: {
      page: 9,
      eyebrow: "09 · La reparación",
      title: "Manos a la obra",
      src: repairUnderwayArt,
      alt: "Mecánica reparando un coche mientras actualiza FlashFix",
      step: "Reparación",
      caption: "El progreso avanza mientras el taller trabaja en el coche.",
    },
    right: {
      page: 10,
      eyebrow: "10 · Los mensajes",
      title: "Hablan claro",
      src: clearConversationArt,
      alt: "Cliente y mecánica conversando mediante el chat de FlashFix",
      step: "Chat",
      caption: "Cliente y taller mantienen la conversación dentro de la aplicación.",
    },
  },
  {
    kind: "pair",
    left: {
      page: 11,
      eyebrow: "11 · Interludio",
      title: "El mismo estado para los dos",
      src: sharedProgressArt,
      alt: "Cliente y mecánica siguiendo los mismos hitos de reparación",
      step: "Seguimiento",
      caption: "Cada avance se comparte: el estado de la reparación deja de ser un misterio.",
      narration: "Mismo estado. Misma ruta.",
      narrationPosition: "top-center",
    },
    right: {
      page: 12,
      eyebrow: "12 · El cierre",
      title: "Reparación completada",
      src: repairCompleteArt,
      alt: "Conductor completando la valoración de un taller en FlashFix",
      step: "Valoración",
      caption: "Al terminar, el usuario puede cerrar el ciclo y valorar el servicio.",
    },
  },
  {
    kind: "pair",
    left: {
      page: 13,
      eyebrow: "13 · El detalle",
      title: "También de noche",
      src: nightModeArt,
      alt: "FlashFix en modo oscuro junto a un taller de noche",
      step: "Modo oscuro",
      caption: "La experiencia se mantiene legible también cuando cae la noche.",
    },
    right: {
      page: 14,
      eyebrow: "14 · El desenlace",
      title: "Todo vuelve a rodar",
      src: backOnTheRoadArt,
      alt: "Coche reparado saliendo del taller al amanecer",
      step: "Resuelto",
      caption: "La reparación se resuelve; el trayecto puede continuar.",
      narration: "¡Ruta libre!",
      narrationPosition: "top-left",
    },
  },
];

const TOTAL_PAGES = SPREADS.length * 2;

// ─────────────────────────────────────────────
// Small building blocks
// ─────────────────────────────────────────────
const narrationPositionClasses = {
  "top-left": "left-[7%] top-[7%] text-left",
  "top-center": "left-1/2 top-[7%] w-[58%] -translate-x-1/2 text-center",
  "top-right": "right-[7%] top-[7%] text-right",
} as const;

function ComicArt({ leaf, isActive, reduceMotion }: { leaf: ComicLeaf; isActive: boolean; reduceMotion: boolean | null }) {
  return (
    <article className="relative h-full min-h-0 overflow-hidden bg-[#171310]" aria-label={`${leaf.eyebrow}: ${leaf.title}`}>
      <h3 className="sr-only">{leaf.title}</h3>
      <Image src={leaf.src} alt={leaf.alt} fill sizes="(min-width: 640px) 520px, 100vw" className="object-cover" />
      {leaf.narration && leaf.narrationPosition && (
        <motion.p
          initial={false}
          animate={
            reduceMotion || isActive
              ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
              : { opacity: 0, scale: 0.7, y: 10, rotate: -3 }
          }
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 22, delay: isActive ? 0.08 : 0 }}
          className={`absolute z-10 max-w-[46%] font-comic text-[clamp(1.4rem,3.2vw,2.6rem)] font-normal uppercase leading-[0.78] tracking-[0.015em] text-[#171310] [text-wrap:balance] ${narrationPositionClasses[leaf.narrationPosition]}`}
        >
          {leaf.narration}
        </motion.p>
      )}
    </article>
  );
}

function BookHalf({ leaf, isActive, reduceMotion }: { leaf: ComicLeaf; isActive: boolean; reduceMotion: boolean | null }) {
  return (
    <div className="relative min-h-0 overflow-hidden">
      <ComicArt leaf={leaf} isActive={isActive} reduceMotion={reduceMotion} />
    </div>
  );
}

// ─────────────────────────────────────────────
// Reader
// ─────────────────────────────────────────────
export function FlashFixComicReader() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.5 });
  const lastIndex = SPREADS.length - 1;

  const goTo = useCallback(
    (next: number) => setIndex(Math.min(lastIndex, Math.max(0, next))),
    [lastIndex],
  );

  useEffect(() => {
    if (!isInView) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
      if (event.key === "ArrowRight") goTo(index + 1);
      if (event.key === "ArrowLeft") goTo(index - 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, index, isInView]);

  // Manual touch tracking instead of Motion's `drag` — a plain `drag="x"`
  // treats every gesture as horizontal regardless of its real direction,
  // which hijacks vertical page-scroll swipes on touch devices. Only a
  // gesture that's clearly more horizontal than vertical turns the page;
  // anything else is left alone so native scrolling never breaks.
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };
  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      goTo(dx < 0 ? index + 1 : index - 1);
    }
  };

  const currentSpread = SPREADS[index];
  const firstPage = currentSpread.left.page;
  const lastPage = currentSpread.right.page;

  return (
    <section ref={sectionRef} aria-label="Cómic: cómo funciona FlashFix" className="mb-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow">El cómic</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-[color:var(--foreground)] sm:text-3xl">Cómo funciona FlashFix</h2>
        </div>
        <p className="shrink-0 font-mono text-xs text-[color:var(--muted)]">
          Página {firstPage === lastPage ? firstPage : `${firstPage}–${lastPage}`} / {TOTAL_PAGES}
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[1040px]" style={{ perspective: reduceMotion ? undefined : 1800 }}>
        <motion.div
          className="relative aspect-[1/3] w-full touch-pan-y overflow-hidden sm:aspect-[4/3]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {SPREADS.map((spread, i) => {
            const offset = i - index;
            const isActive = offset === 0;
            if (Math.abs(offset) > 1) return null;
            const key = spread.left.page;
            return (
              <motion.div
                key={key}
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
                initial={false}
                animate={
                  reduceMotion
                    ? { opacity: isActive ? 1 : 0 }
                    : {
                        x: `${offset * 100}%`,
                        rotateY: offset === 0 ? 0 : offset < 0 ? -22 : 22,
                        opacity: Math.abs(offset) > 1 ? 0 : 1,
                      }
                }
                transition={{ type: "spring", stiffness: 210, damping: 28 }}
                aria-hidden={!isActive}
                inert={!isActive}
              >
                <div className="relative grid h-full grid-cols-1 gap-[3px] overflow-hidden bg-[#171310] sm:grid-cols-2 sm:gap-[6px]">
                  <BookHalf leaf={spread.left} isActive={isActive} reduceMotion={reduceMotion} />
                  <BookHalf leaf={spread.right} isActive={isActive} reduceMotion={reduceMotion} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Progress + controls */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Página anterior"
          className="flex h-11 w-11 shrink-0 items-center justify-center text-[color:var(--foreground)] transition-colors hover:text-[color:var(--primary)] disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="h-1 flex-1 overflow-hidden bg-[color:var(--border)]">
          <div
            className="h-full bg-[color:var(--primary)] transition-[width] duration-300 ease-out"
            style={{ width: `${(lastPage / TOTAL_PAGES) * 100}%` }}
          />
        </div>

        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === lastIndex}
          aria-label="Página siguiente"
          className="flex h-11 w-11 shrink-0 items-center justify-center text-[color:var(--foreground)] transition-colors hover:text-[color:var(--primary)] disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 text-center font-mono text-[10px] text-[color:var(--muted)] sm:hidden">
        Desliza para pasar página
      </p>
    </section>
  );
}
