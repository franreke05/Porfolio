"use client";

import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Globe2,
  PanelsTopLeft,
  Smartphone,
  Wrench,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  type MotionValue,
} from "motion/react";
import { ComicCover } from "@/components/comic-cover";
import { CountUp } from "@/components/count-up";
import { MagneticButton } from "@/components/magnetic-button";
import { MarkerHighlight } from "@/components/marker-highlight";
import { PhoneMockup } from "@/components/phone-mockup";
import { ScrollProgress } from "@/components/scroll-progress";
import { dur, ease } from "@/lib/motion";
import { caseStudies } from "@/lib/case-studies";
import {
  projectStatusAccent,
  projectStatusWord,
  projects,
  services,
  siteProfile,
  trustSignals,
} from "@/lib/site-data";
import type { Service } from "@/lib/site-data";

const SUBTITLE =
  "Construyo el sistema completo: app mobile con KMP, CRM a medida, web rápida y automatizaciones que eliminan el trabajo repetitivo. Todo publicado, todo mantenido.";

/** Client-side 4-act homepage body — split out of app/page.tsx so that file
 * can stay a server component and export `metadata`. */
const serviceIcons: Record<Service["icon"], LucideIcon> = {
  mobile: Smartphone,
  crm: PanelsTopLeft,
  web: Globe2,
  support: Wrench,
  automation: Workflow,
  growth: ChartNoAxesCombined,
};

const SERVICE_LOOP_DURATION = {
  mobile: 8500,
  tablet: 7500,
  desktop: 6500,
} as const;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function subscribePageVisibility(onStoreChange: () => void) {
  document.addEventListener("visibilitychange", onStoreChange);
  return () => document.removeEventListener("visibilitychange", onStoreChange);
}

function getPageVisibilitySnapshot() {
  return document.visibilityState === "visible";
}

function subscribeLoopDuration(onStoreChange: () => void) {
  const mobileQuery = window.matchMedia("(max-width: 639px)");
  const tabletQuery = window.matchMedia("(max-width: 1279px)");
  mobileQuery.addEventListener("change", onStoreChange);
  tabletQuery.addEventListener("change", onStoreChange);

  return () => {
    mobileQuery.removeEventListener("change", onStoreChange);
    tabletQuery.removeEventListener("change", onStoreChange);
  };
}

function getLoopDurationSnapshot() {
  if (window.matchMedia("(max-width: 639px)").matches) return SERVICE_LOOP_DURATION.mobile;
  if (window.matchMedia("(max-width: 1279px)").matches) return SERVICE_LOOP_DURATION.tablet;
  return SERVICE_LOOP_DURATION.desktop;
}

type ServiceLoopController = {
  durationMs: number;
  isReducedMotion: boolean;
  isRunning: boolean;
  isSectionInView: boolean;
  progress: MotionValue<number>;
  holdAfterInteraction: () => void;
  selectService: (serviceId: Service["id"]) => void;
  setFocusPaused: (paused: boolean) => void;
  setHoverPaused: (paused: boolean) => void;
};

function useServiceLoop({
  activeServiceId,
  onActiveServiceChange,
  sectionRef,
}: {
  activeServiceId: Service["id"];
  onActiveServiceChange: (serviceId: Service["id"]) => void;
  sectionRef: RefObject<HTMLElement | null>;
}): ServiceLoopController {
  const isSectionInView = useInView(sectionRef, {
    amount: "some",
    margin: "-18% 0px -18% 0px",
  });
  const progress = useMotionValue(0);
  const interactionTimerRef = useRef<number | null>(null);
  const durationMs = useSyncExternalStore(
    subscribeLoopDuration,
    getLoopDurationSnapshot,
    () => SERVICE_LOOP_DURATION.desktop,
  );
  const isPageVisible = useSyncExternalStore(
    subscribePageVisibility,
    getPageVisibilitySnapshot,
    () => true,
  );
  const isReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);

  useEffect(
    () => () => {
      if (interactionTimerRef.current !== null) {
        window.clearTimeout(interactionTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    progress.set(0);
  }, [activeServiceId, progress]);

  const isRunning =
    services.length > 1 &&
    isSectionInView &&
    isPageVisible &&
    !isReducedMotion &&
    !isHoverPaused &&
    !isFocusPaused &&
    !isInteractionPaused;

  useEffect(() => {
    if (!isRunning) return;

    const currentProgress = Math.min(1, Math.max(0, progress.get()));
    const remainingDuration = Math.max(0.05, ((1 - currentProgress) * durationMs) / 1000);
    const playback = animate(progress, 1, {
      duration: remainingDuration,
      ease: "linear",
      onComplete: () => {
        const currentIndex = services.findIndex((service) => service.id === activeServiceId);
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % services.length;
        onActiveServiceChange(services[nextIndex].id);
      },
    });

    return () => playback.stop();
  }, [activeServiceId, durationMs, isRunning, onActiveServiceChange, progress]);

  const pauseAfterInteraction = () => {
    setIsInteractionPaused(true);
    if (interactionTimerRef.current !== null) {
      window.clearTimeout(interactionTimerRef.current);
    }
    interactionTimerRef.current = window.setTimeout(() => {
      setIsInteractionPaused(false);
      interactionTimerRef.current = null;
    }, durationMs);
  };

  const selectService = (serviceId: Service["id"]) => {
    progress.set(0);
    onActiveServiceChange(serviceId);
    pauseAfterInteraction();
  };

  return {
    durationMs,
    holdAfterInteraction: () => {
      progress.set(0);
      pauseAfterInteraction();
    },
    isReducedMotion,
    isRunning,
    isSectionInView,
    progress,
    selectService,
    setFocusPaused: setIsFocusPaused,
    setHoverPaused: setIsHoverPaused,
  };
}

export function HomepageActs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLElement>(null);
  const [activeServiceId, setActiveServiceId] = useState<Service["id"]>(services[0].id);
  const serviceLoop = useServiceLoop({
    activeServiceId,
    onActiveServiceChange: setActiveServiceId,
    sectionRef: servicesSectionRef,
  });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div className="page-shell min-h-screen">
      <ScrollProgress />
      <main className="min-w-0">
        <div ref={containerRef} className="relative w-full px-5 pt-28 sm:px-8 lg:px-12 lg:pt-36 xl:px-16 2xl:px-24">
          <div className="grid gap-16 xl:grid-cols-[1.05fr_0.95fr] xl:gap-16 2xl:gap-24">
            {/* ── Left: 4 stacked acts ── */}
            <div className="order-2 flex flex-col gap-28 pb-24 lg:gap-48 lg:pb-40 xl:order-1">
              <ActApertura />
              <ActTrabajo />
              <ActServicios
                activeServiceId={activeServiceId}
                loop={serviceLoop}
                sectionRef={servicesSectionRef}
              />
              <ActAutor />
            </div>

            {/* ── Right: sticky phone through-line — outer cell stretches to
                the row's full height (left column's height) so the inner
                sticky wrapper has room to actually hold in place while
                scrolling, instead of scrolling away with a short cell. ── */}
            <div className="hidden xl:order-2 xl:block xl:pb-0 [@media(max-height:779px)]:!hidden">
              <div
                className="xl:sticky xl:top-28 xl:flex xl:justify-start"
                onMouseEnter={() => serviceLoop.setHoverPaused(true)}
                onMouseLeave={() => serviceLoop.setHoverPaused(false)}
              >
                <PhoneMockup
                  progress={scrollYProgress}
                  activeServiceId={activeServiceId}
                  screenOverride={serviceLoop.isSectionInView ? "servicios" : undefined}
                  serviceLoopProgress={serviceLoop.isReducedMotion ? undefined : serviceLoop.progress}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Act 1 — Apertura. One confident line, no CTA yet.
───────────────────────────────────────────── */
function ActApertura() {
  const rm = useReducedMotion();
  const d = (base: number) => (rm ? 0 : base);

  return (
    <section aria-label="Apertura">
      <motion.p
        className="mb-6 inline-flex items-center gap-2 border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] px-3 py-2 text-sm font-semibold text-[color:var(--on-primary)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d(dur.normal), ease: ease.premium, delay: d(0.06) }}
      >
        {siteProfile.location} · Remoto
      </motion.p>

      <motion.h1
        className="max-w-full text-balance font-display text-display-sm font-semibold leading-[1.04] text-[color:var(--foreground)] sm:text-5xl sm:leading-[1.06] lg:text-display-xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d(0.64), ease: ease.premium, delay: d(0.16) }}
      >
        Apps mobile y sistemas digitales que ordenan <MarkerHighlight>tu negocio.</MarkerHighlight>
      </motion.h1>

      <motion.p
        className="mt-6 max-w-xl text-pretty text-lg leading-8 text-[color:var(--surface-foreground)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d(dur.normal), ease: ease.premium, delay: d(0.37) }}
      >
        {SUBTITLE}
      </motion.p>

      <motion.div
        className="mt-8 flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: d(dur.normal), delay: d(0.5) }}
      >
        {trustSignals.map((signal) => (
          <span
            key={signal}
            className="inline-flex items-center gap-1.5 border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-1.5 font-mono text-xs text-[color:var(--muted)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" aria-hidden="true" />
            {signal}
          </span>
        ))}
      </motion.div>

      <motion.div
        className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[color:var(--border)] pt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d(dur.normal), ease: ease.premium, delay: d(0.6) }}
      >
        <div>
          <p className="font-display text-2xl font-bold text-[color:var(--foreground)]">
            <CountUp to={projects.length} duration={1} />
          </p>
          <p className="text-xs text-[color:var(--muted)]">proyectos reales</p>
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-[color:var(--foreground)]">
            <CountUp to={services.length} duration={1} />
          </p>
          <p className="text-xs text-[color:var(--muted)]">líneas de servicio</p>
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-[color:var(--foreground)]">100%</p>
          <p className="text-xs text-[color:var(--muted)]">código propio, sin plantillas</p>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Act 2 — El trabajo. 3 comic-cover previews, single CTA → /proyectos.
───────────────────────────────────────────── */
const HOMEPAGE_PROJECT_SLOTS = 2;
const PROJECT_ROTATION_MS = 6000;

function ActTrabajo() {
  const reduceMotion = useReducedMotion();
  const [activePage, setActivePage] = useState(0);
  const projectPageCount = Math.ceil(projects.length / HOMEPAGE_PROJECT_SLOTS);
  const firstProjectIndex = activePage * HOMEPAGE_PROJECT_SLOTS;
  const visibleProjects = projects.slice(firstProjectIndex, firstProjectIndex + HOMEPAGE_PROJECT_SLOTS);

  useEffect(() => {
    if (reduceMotion || projectPageCount < 2) return;

    const rotation = window.setInterval(() => {
      setActivePage((current) => (current + 1) % projectPageCount);
    }, PROJECT_ROTATION_MS);

    return () => window.clearInterval(rotation);
  }, [projectPageCount, reduceMotion]);

  return (
    <section aria-label="El trabajo">
      <p className="section-eyebrow mb-4">El trabajo</p>
      <h2 className="text-balance font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
        Proyectos reales, con portada propia y estado honesto.
      </h2>
      <p className="mt-5 max-w-xl text-pretty leading-7 text-[color:var(--muted)]">
        Nada de capturas de marketing: cada caso explica el problema, la
        decisión técnica y en qué punto está hoy — beta pública, MVP o en
        desarrollo activo.
      </p>

      <div
        className="mt-10 flex min-h-[192px] items-end gap-4 pl-28 sm:gap-6 sm:pl-[136px] md:pl-[152px]"
        aria-live="off"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activePage}
            className="flex items-end gap-4 sm:gap-6"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {visibleProjects.map((project, slot) => {
              const index = firstProjectIndex + slot;
              const study = caseStudies[project.caseStudySlug ?? project.id];
              return (
                <div key={project.id} style={{ transform: `rotate(${slot * 4}deg)` }}>
                  <Link
                    href={`/proyectos/${project.caseStudySlug ?? project.id}`}
                    className="block w-24 transition-transform duration-200 hover:-translate-y-1 sm:w-28 md:w-32"
                    aria-label={`Ver caso completo: ${project.title}`}
                  >
                    <ComicCover
                      mode="mini"
                      issueNumber={index + 1}
                      title={project.title}
                      tagline={study?.tagline ?? project.projectType}
                      techStack={project.stack.slice(0, 2).join(" · ").toUpperCase()}
                      statusWord={projectStatusWord[project.status]}
                      statusAccent={projectStatusAccent[project.status]}
                      coverSrc={project.coverSrc}
                      coverAlt={project.coverAlt}
                      coverPosition={project.coverPosition}
                      coverFit={project.coverFit}
                    />
                  </Link>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {projectPageCount > 1 && (
        <div
          className="mt-5 ml-28 flex w-[208px] justify-center gap-1.5 sm:ml-[136px] sm:w-[248px] md:ml-[152px] md:w-[280px]"
          aria-label="Selección de proyecto"
        >
          {Array.from({ length: projectPageCount }, (_, page) => (
            <button
              key={page}
              type="button"
              onClick={() => setActivePage(page)}
              aria-label={`Mostrar proyectos ${page * HOMEPAGE_PROJECT_SLOTS + 1} a ${Math.min((page + 1) * HOMEPAGE_PROJECT_SLOTS, projects.length)}`}
              aria-current={page === activePage ? "true" : undefined}
              className={`h-11 w-8 transition-colors ${page === activePage ? "bg-[color:var(--primary)]" : "bg-[color:var(--border)] hover:bg-[color:var(--border-hover)]"}`}
            />
          ))}
        </div>
      )}

      <div className="mt-8">
        <MagneticButton href="/proyectos">
          Ver los proyectos
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-px group-hover/btn:-translate-y-px" aria-hidden="true" />
        </MagneticButton>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Act 3 — Lo que hace. 6 service lines, single CTA → /servicios.
───────────────────────────────────────────── */
function ActServicios({
  activeServiceId,
  loop,
  sectionRef,
}: {
  activeServiceId: Service["id"];
  loop: ServiceLoopController;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const reduceMotion = useReducedMotion();
  const inlinePhoneProgress = useMotionValue(2 / 3);
  const activeService = services.find((service) => service.id === activeServiceId) ?? services[0];
  const ActiveServiceIcon = serviceIcons[activeService.icon];

  return (
    <section
      ref={sectionRef}
      aria-label="Lo que hace"
      data-service-loop-state={loop.isRunning ? "playing" : "paused"}
      data-service-loop-duration={loop.durationMs}
      data-active-service={activeService.id}
      onFocusCapture={() => loop.setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          loop.setFocusPaused(false);
        }
      }}
    >
      <p className="section-eyebrow mb-4">Lo que hace</p>
      <h2 className="text-balance font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
        Seis capacidades, una misma idea: construir lo que tu negocio sí necesita.
      </h2>

      <div className="mt-8 flex justify-center xl:hidden [@media(max-height:779px)]:!flex">
        <PhoneMockup
          progress={inlinePhoneProgress}
          activeServiceId={activeService.id}
          screenOverride="servicios"
          variant="inline"
          serviceLoopProgress={loop.isReducedMotion ? undefined : loop.progress}
        />
      </div>

      <div
        className="mt-10 grid overflow-hidden border-2 border-[color:var(--foreground)] bg-[color:var(--surface)] lg:grid-cols-[0.88fr_1.12fr]"
        onMouseEnter={() => loop.setHoverPaused(true)}
        onMouseLeave={() => loop.setHoverPaused(false)}
        onTouchStart={loop.holdAfterInteraction}
      >
        <div className="divide-y-2 divide-[color:var(--foreground)] bg-[color:var(--background)]" aria-label="Áreas de servicio" aria-live="off">
          {services.map((service, index) => {
            const isActive = service.id === activeService.id;
            const Icon = serviceIcons[service.icon];

            return (
              <motion.button
                key={service.id}
                type="button"
                data-service-id={service.id}
                onClick={() => loop.selectService(service.id)}
                aria-pressed={isActive}
                className={`group relative flex w-full items-center gap-3 px-4 py-4 text-left transition-colors sm:px-5 ${
                  isActive
                    ? "bg-[color:var(--foreground)] text-[color:var(--background)]"
                    : "text-[color:var(--foreground)] hover:bg-[color:var(--surface)]"
                }`}
                whileHover={reduceMotion ? undefined : { x: 3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
              >
                <span
                  className={`w-7 shrink-0 font-mono text-xs font-bold ${
                    isActive ? "text-[color:var(--primary)]" : "text-[color:var(--muted)]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center border-2 ${
                    isActive
                      ? "border-[color:var(--background)] bg-[color:var(--primary)] text-[color:var(--on-primary)]"
                      : "border-[color:var(--foreground)] bg-[color:var(--surface-elevated)] text-[color:var(--primary)]"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base font-bold leading-tight">{service.title}</span>
                  <span
                    className={`mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.1em] ${
                      isActive ? "text-[color:var(--background)]/65" : "text-[color:var(--primary)]"
                    }`}
                  >
                    {service.highlight}
                  </span>
                </span>
                <ArrowUpRight
                  className={`h-4 w-4 shrink-0 transition-transform ${isActive ? "translate-x-0.5 -translate-y-0.5" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"}`}
                  aria-hidden="true"
                />
                {isActive && !loop.isReducedMotion && (
                  <span className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden bg-[color:var(--background)]/20" aria-hidden="true">
                    <motion.span
                      className="block h-full origin-left bg-[color:var(--primary)]"
                      style={{ scaleX: loop.progress }}
                    />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="relative min-h-[360px] overflow-hidden bg-[color:var(--surface)] p-5 sm:min-h-[390px] sm:p-8">
          <div className="comic-halftone absolute inset-0 opacity-50" aria-hidden="true" />
          <span className="pointer-events-none absolute -right-3 -top-5 font-display text-[9rem] font-bold leading-none text-[color:var(--primary)]/10 sm:text-[12rem]" aria-hidden="true">
            {String(services.findIndex((service) => service.id === activeService.id) + 1).padStart(2, "0")}
          </span>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeService.id}
              className="relative z-10 flex h-full flex-col"
              initial={reduceMotion ? false : { opacity: 0, x: 18, y: 6 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -12, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--primary)]">
                    Dossier de servicio
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
                    {activeService.title}
                  </h3>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] text-[color:var(--on-primary)]">
                  <ActiveServiceIcon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>

              <p className="mt-5 max-w-lg text-pretty leading-7 text-[color:var(--surface-foreground)]">
                {activeService.summary}
              </p>

              <div className="mt-8 border-t-2 border-[color:var(--foreground)] pt-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--muted)]">
                  Qué incluye
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {activeService.deliverables.map((deliverable, index) => (
                    <motion.li
                      key={deliverable}
                      className="flex items-start gap-3 border border-[color:var(--border-hover)] bg-[color:var(--background)] px-3 py-3 text-sm leading-5 text-[color:var(--foreground)]"
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : 0.05 * index }}
                    >
                      <span className="mt-0.5 font-mono text-xs font-bold text-[color:var(--primary)]">0{index + 1}</span>
                      <span>{deliverable}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <p className="mt-auto pt-7 font-mono text-[10px] font-bold uppercase tracking-[0.13em] text-[color:var(--muted)]">
                Selecciona otra línea para explorar el enfoque.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-10">
        <MagneticButton href="/servicios">
          Ver todos los servicios
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-px group-hover/btn:-translate-y-px" aria-hidden="true" />
        </MagneticButton>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Act 4 — El autor. Human line, one-glance process, CTA → contacto / sobre-mí.
───────────────────────────────────────────── */
function ActAutor() {
  return (
    <section aria-label="El autor">
      <p className="section-eyebrow mb-4">El autor</p>
      <h2 className="text-balance font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
        Un desarrollador, cuatro plataformas, cero intermediarios.
      </h2>
      <p className="mt-5 max-w-xl text-pretty leading-7 text-[color:var(--surface-foreground)]">
        {siteProfile.shortBio}
      </p>
      <blockquote className="mt-5 max-w-xl border-l-4 border-[color:var(--primary)] bg-[color:var(--surface)] p-4 text-base leading-7 text-[color:var(--foreground)]">
        {siteProfile.authority}
      </blockquote>

      <div className="mt-10 flex flex-wrap gap-3">
        <MagneticButton href="/#contacto">
          Hablemos
        </MagneticButton>
        <MagneticButton href="/sobre-mi" variant="secondary">
          Sobre mí
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-px group-hover/btn:-translate-y-px" aria-hidden="true" />
        </MagneticButton>
      </div>
    </section>
  );
}
