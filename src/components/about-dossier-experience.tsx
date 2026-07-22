"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Download,
  MapPin,
  Pause,
  Play,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

const AUTO_ADVANCE_MS = 8500;

const chapters = [
  { id: "profile", label: "Perfil", hint: "Punto de vista" },
  { id: "experience", label: "Experiencia", hint: "Trabajo real" },
  { id: "stack", label: "Stack", hint: "Base técnica" },
  { id: "method", label: "Método", hint: "Cómo construyo" },
] as const;

type ChapterId = (typeof chapters)[number]["id"];

export type AboutProfile = {
  name: string;
  role: string;
  location: string;
  headline: string;
  authority: string;
  links: {
    cv: string;
    linkedin: string;
    github: string;
  };
};

export type AboutExperienceItem = {
  company: string;
  role: string;
  detail: string;
};

export type AboutStackGroup = {
  title: string;
  items: readonly string[];
};

export type AboutProcessStep = {
  title: string;
  output: string;
  text: string;
};

type AboutDossierExperienceProps = {
  profile: AboutProfile;
  experience: readonly AboutExperienceItem[];
  stack: readonly AboutStackGroup[];
  process: readonly AboutProcessStep[];
  portraitSrc: string;
};

const chapterMotion = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 16 : -16 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -12 : 12 }),
};

const listMotion = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const itemMotion = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

function ProfileChapter({ profile, reduceMotion }: { profile: AboutProfile; reduceMotion: boolean }) {
  return (
    <motion.div
      variants={reduceMotion ? undefined : listMotion}
      initial={false}
      animate="visible"
      className="flex min-h-full flex-col"
    >
      <motion.p variants={itemMotion} className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--primary)]">
        01 / Perfil profesional
      </motion.p>
      <motion.h2 variants={itemMotion} className="mt-4 max-w-[15ch] text-balance font-display text-3xl font-bold leading-[0.98] tracking-tight text-[color:var(--foreground)] sm:text-4xl xl:text-5xl">
        {profile.authority}
      </motion.h2>
      <motion.p variants={itemMotion} className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg sm:leading-8">
        {profile.headline}
      </motion.p>

      <motion.dl variants={itemMotion} className="mt-auto grid gap-px border border-[color:var(--foreground)] bg-[color:var(--foreground)] sm:grid-cols-3">
        <ProfileFact label="Base" value="Mobile first" />
        <ProfileFact label="Ubicación" value={profile.location} icon={MapPin} />
        <ProfileFact label="Estado" value="Disponible" accent />
      </motion.dl>
    </motion.div>
  );
}

function ProfileFact({ label, value, accent, icon: Icon }: { label: string; value: string; accent?: boolean; icon?: LucideIcon }) {
  return (
    <div className="min-w-0 bg-[color:var(--surface)] px-4 py-4">
      <dt className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[color:var(--muted)]">{label}</dt>
      <dd className={`mt-1.5 flex items-center gap-1.5 text-sm font-semibold ${accent ? "text-[color:var(--primary)]" : "text-[color:var(--foreground)]"}`}>
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-[color:var(--primary)]" aria-hidden="true" /> : null}
        <span className="truncate">{value}</span>
      </dd>
    </div>
  );
}

function ExperienceChapter({ items, reduceMotion }: { items: readonly AboutExperienceItem[]; reduceMotion: boolean }) {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--primary)]">02 / Experiencia</p>
          <h2 className="mt-3 max-w-[18ch] font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
            Producto, equipo y entrega real.
          </h2>
        </div>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-[color:var(--muted)] sm:block">Archivo / {String(items.length).padStart(2, "0")} entradas</span>
      </div>

      <motion.div
        variants={reduceMotion ? undefined : listMotion}
        initial={false}
        animate="visible"
        className="mt-6 border-y border-[color:var(--foreground)]"
      >
        {items.map((item, index) => (
          <motion.article
            key={item.company}
            variants={itemMotion}
            className="grid gap-2 border-b border-[color:var(--border-hover)] py-4 last:border-b-0 sm:grid-cols-[2.75rem_0.72fr_1.28fr] sm:gap-4"
          >
            <span className="font-mono text-[10px] font-bold text-[color:var(--primary)]">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-[color:var(--foreground)]">{item.company}</p>
              <h3 className="mt-1 font-display text-base font-bold leading-tight text-[color:var(--foreground)]">{item.role}</h3>
            </div>
            <p className="text-sm leading-6 text-[color:var(--muted)]">{item.detail}</p>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}

function StackChapter({ groups, reduceMotion }: { groups: readonly AboutStackGroup[]; reduceMotion: boolean }) {
  const core = groups[0];
  const support = groups.slice(1);

  return (
    <div className="flex min-h-full flex-col">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--primary)]">03 / Stack</p>
      <div className="mt-3 flex items-end justify-between gap-5">
        <h2 className="max-w-[16ch] font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
          Una base mobile, conectada con todo lo demás.
        </h2>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.14em] text-[color:var(--muted)] sm:block">Producción / no wishlist</span>
      </div>

      <motion.div
        variants={reduceMotion ? undefined : listMotion}
        initial={false}
        animate="visible"
        className="mt-6 grid flex-1 gap-3 sm:grid-cols-[1.05fr_0.95fr]"
      >
        <motion.div variants={itemMotion} className="relative flex min-h-40 flex-col overflow-hidden border-2 border-[color:var(--foreground)] bg-[color:var(--foreground)] p-5 text-[color:var(--background)]">
          <div className="comic-halftone absolute inset-0 opacity-[0.08]" aria-hidden="true" />
          <p className="relative font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[color:var(--primary)]">Núcleo / {core?.title ?? "Mobile"}</p>
          <div className="relative my-auto">
            <p className="font-display text-4xl font-black leading-[0.9] tracking-tight sm:text-5xl">{core?.items.slice(0, 3).join(" / ")}</p>
          </div>
          <p className="relative border-t border-white/25 pt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-white/65">
            {core?.items.slice(3).join(" · ")}
          </p>
        </motion.div>

        <div className="grid gap-px border border-[color:var(--foreground)] bg-[color:var(--foreground)]">
          {support.map((group) => (
            <motion.div key={group.title} variants={itemMotion} className="grid grid-cols-[6.5rem_1fr] gap-3 bg-[color:var(--surface)] px-4 py-3 sm:grid-cols-[7rem_1fr]">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[color:var(--primary)]">{group.title}</p>
              <p className="text-sm font-medium leading-5 text-[color:var(--foreground)]">{group.items.join(" · ")}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MethodChapter({ steps, reduceMotion }: { steps: readonly AboutProcessStep[]; reduceMotion: boolean }) {
  return (
    <div className="flex min-h-full flex-col">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--primary)]">04 / Método</p>
      <h2 className="mt-3 max-w-[18ch] font-display text-3xl font-bold leading-tight text-[color:var(--foreground)] sm:text-4xl">
        Cuatro decisiones para llegar a algo publicable.
      </h2>

      <div className="relative mt-7 flex-1">
        <div className="absolute left-[1.15rem] top-0 h-full w-px bg-[color:var(--border-hover)] sm:left-0 sm:top-[1.15rem] sm:h-px sm:w-full" aria-hidden="true" />
        {!reduceMotion ? (
          <motion.div
            className="absolute left-[1.15rem] top-0 h-full w-px origin-top bg-[color:var(--primary)] sm:left-0 sm:top-[1.15rem] sm:h-px sm:w-full sm:origin-left"
            initial={{ scaleY: 0, scaleX: 0 }}
            animate={{ scaleY: 1, scaleX: 1 }}
            transition={{ duration: 0.65, ease: ease.premium }}
            aria-hidden="true"
          />
        ) : null}

        <motion.ol
          variants={reduceMotion ? undefined : listMotion}
          initial={false}
          animate="visible"
          className="relative grid gap-5 sm:grid-cols-4 sm:gap-3"
        >
          {steps.map((step, index) => (
            <motion.li key={step.title} variants={itemMotion} className="grid grid-cols-[2.3rem_1fr] gap-3 sm:block">
              <span className="flex h-9 w-9 items-center justify-center border border-[color:var(--foreground)] bg-[color:var(--surface)] font-mono text-[9px] font-bold text-[color:var(--primary)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="sm:mt-4 sm:border-t sm:border-[color:var(--border-hover)] sm:pt-4">
                <h3 className="font-display text-base font-bold leading-tight text-[color:var(--foreground)]">{step.title}</h3>
                <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-[color:var(--primary)]">{step.output}</p>
                <p className="mt-2 text-[13px] leading-5 text-[color:var(--muted)]">{step.text}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </div>
  );
}

function DossierLink({ href, label, icon: Icon, external, primary }: { href: string; label: string; icon: LucideIcon; external?: boolean; primary?: boolean }) {
  const className = `inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-[color:var(--foreground)] px-3 text-xs font-semibold transition-colors ${primary ? "w-full bg-[color:var(--primary)] text-[color:var(--on-primary)] hover:bg-[color:var(--primary-hover)] sm:w-auto" : "bg-[color:var(--surface)] text-[color:var(--foreground)] hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]"}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </Link>
  );
}

function ActiveChapter({ id, profile, experience, stack, process, reduceMotion }: {
  id: ChapterId;
  profile: AboutProfile;
  experience: readonly AboutExperienceItem[];
  stack: readonly AboutStackGroup[];
  process: readonly AboutProcessStep[];
  reduceMotion: boolean;
}) {
  switch (id) {
    case "profile":
      return <ProfileChapter profile={profile} reduceMotion={reduceMotion} />;
    case "experience":
      return <ExperienceChapter items={experience} reduceMotion={reduceMotion} />;
    case "stack":
      return <StackChapter groups={stack} reduceMotion={reduceMotion} />;
    case "method":
      return <MethodChapter steps={process} reduceMotion={reduceMotion} />;
  }
}

export function AboutDossierExperience({ profile, experience, stack, process, portraitSrc }: AboutDossierExperienceProps) {
  const reduceMotion = useReducedMotion() === true;
  const regionRef = useRef<HTMLElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const autoAdvanceRef = useRef(false);
  const isInView = useInView(regionRef, { amount: 0.35 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [cycle, setCycle] = useState(0);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const canAutoplay = isInView && documentVisible && !reduceMotion && !pausedByUser && !pointerInside && !focusInside;

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!canAutoplay) return;

    const timer = window.setTimeout(() => {
      autoAdvanceRef.current = true;
      setDirection(1);
      setActiveIndex((current) => (current + 1) % chapters.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, canAutoplay, cycle]);

  useEffect(() => {
    if (!autoAdvanceRef.current) return;
    autoAdvanceRef.current = false;
    if (window.matchMedia("(min-width: 768px)").matches) return;

    const tabList = tabListRef.current;
    const activeTab = tabRefs.current[activeIndex];
    if (!tabList || !activeTab) return;

    const nextLeft = activeTab.offsetLeft - (tabList.clientWidth - activeTab.clientWidth) / 2;
    tabList.scrollTo({ left: nextLeft, behavior: reduceMotion ? "auto" : "smooth" });
  }, [activeIndex, reduceMotion]);

  const active = chapters[activeIndex] ?? chapters[0];
  const activePosition = String(activeIndex + 1).padStart(2, "0");

  const selectChapter = (index: number, options?: { focus?: boolean; direction?: number }) => {
    autoAdvanceRef.current = false;
    setDirection(options?.direction ?? (index >= activeIndex ? 1 : -1));
    setActiveIndex(index);
    setCycle((current) => current + 1);
    if (options?.focus) tabRefs.current[index]?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = chapters.length - 1;
    let nextIndex: number | null = null;
    let nextDirection = 1;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = index === 0 ? lastIndex : index - 1;
      nextDirection = -1;
    }
    if (event.key === "Home") {
      nextIndex = 0;
      nextDirection = -1;
    }
    if (event.key === "End") nextIndex = lastIndex;

    if (nextIndex !== null) {
      event.preventDefault();
      selectChapter(nextIndex, { focus: true, direction: nextDirection });
    }
  };

  return (
    <section
      ref={regionRef}
      role="region"
      aria-roledescription="carrusel"
      aria-label={`Perfil profesional de ${profile.name}`}
      data-active-chapter={active.id}
      data-autoplay={canAutoplay ? "running" : "paused"}
      className="min-w-0 overflow-hidden border-2 border-[color:var(--foreground)] bg-[color:var(--surface)]"
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={() => setPointerInside(false)}
      onFocus={() => setFocusInside(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusInside(false);
      }}
    >
      <div className="flex min-h-12 items-center justify-between gap-3 border-b-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.14em] sm:text-[10px]">
          <span className="truncate text-[color:var(--primary)]">Expediente / FR</span>
          <span className="shrink-0 text-[color:var(--muted)]">{activePosition} / 04</span>
        </div>
        {reduceMotion ? (
          <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.1em] text-[color:var(--muted)] sm:text-[9px]">Recorrido manual</span>
        ) : (
          <button
            type="button"
            onClick={() => setPausedByUser((current) => !current)}
            aria-pressed={pausedByUser}
            className="inline-flex min-h-9 shrink-0 items-center gap-2 px-1 font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-[color:var(--foreground)] transition-colors hover:text-[color:var(--primary)] sm:text-[9px]"
          >
            {pausedByUser ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
            <span>{pausedByUser ? "Reanudar" : "Pausar"}</span>
          </button>
        )}
      </div>

      <div className="min-w-0">
        <div ref={tabListRef} role="tablist" aria-label="Capítulos del perfil" className="flex min-w-0 snap-x overflow-x-auto border-b-2 border-[color:var(--foreground)] bg-[color:var(--surface)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible">
          {chapters.map((chapter, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={chapter.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`about-tab-${chapter.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="about-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectChapter(index)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={`relative flex min-h-[74px] w-[54vw] max-w-[215px] shrink-0 snap-start items-center gap-3 border-r border-[color:var(--foreground)] px-4 text-left transition-colors last:border-r-0 md:w-auto md:max-w-none ${isActive ? "bg-[color:var(--surface-elevated)]" : "bg-[color:var(--surface)] hover:bg-[color:var(--background)]"}`}
              >
                <span className={`font-mono text-[9px] font-bold ${isActive ? "text-[color:var(--primary)]" : "text-[color:var(--muted)]"}`}>{String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0">
                  <span className="block font-display text-base font-bold leading-tight text-[color:var(--foreground)]">{chapter.label}</span>
                  <span className="mt-1 block truncate font-mono text-[8px] uppercase tracking-[0.08em] text-[color:var(--muted)]">{chapter.hint}</span>
                </span>
                {isActive ? (
                  <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[color:var(--border)]" aria-hidden="true">
                    <motion.span
                      key={`${active.id}-${cycle}-${canAutoplay}`}
                      className="block h-full origin-left bg-[color:var(--primary)]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: canAutoplay ? 1 : 0 }}
                      transition={{ duration: canAutoplay ? AUTO_ADVANCE_MS / 1000 : 0.16, ease: "linear" }}
                    />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="grid min-w-0 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)]">
          <div className="relative min-h-[320px] overflow-hidden border-b-2 border-[color:var(--foreground)] bg-[#231f1a] sm:min-h-[420px] lg:min-h-[620px] lg:border-b-0 lg:border-r-2">
            <Image
              src={portraitSrc}
              alt={`Retrato de ${profile.name}`}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 38vw"
              className="scale-100 object-cover object-[48%_44%] saturate-[0.72] contrast-[1.08] sepia-[0.08] sm:scale-[1.02] sm:object-[48%_50%] lg:scale-[1.24] lg:object-[48%_39%]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,12,0.06)_35%,rgba(20,16,12,0.72)_100%)]" aria-hidden="true" />
            <div className="comic-halftone absolute inset-0 opacity-[0.1] mix-blend-multiply" aria-hidden="true" />

            <div className="absolute left-4 top-4 max-w-[52%] truncate border border-[color:var(--foreground)] bg-[color:var(--background)] px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-[color:var(--foreground)] sm:left-6 sm:top-6">
              FR / {profile.name}
            </div>
            <span className="absolute right-4 top-4 flex items-center gap-2 border border-[color:var(--foreground)] bg-[color:var(--primary)] px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[color:var(--on-primary)] sm:right-6 sm:top-6">
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" /> Disponible
            </span>

            <div className="absolute inset-x-0 bottom-0 hidden items-end justify-between gap-4 p-7 text-white lg:flex">
              <div>
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-white/65">Desarrollador / Almería</p>
                <p className="mt-2 max-w-[13ch] font-display text-2xl font-bold leading-[0.96] sm:text-3xl">{profile.name}</p>
              </div>
              <ArrowDownRight className="h-7 w-7 shrink-0 text-[color:var(--primary)]" aria-hidden="true" />
            </div>

            <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-white/55" aria-hidden="true" />
            <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-white/55" aria-hidden="true" />
          </div>

          <article
            id="about-panel"
            role="tabpanel"
            aria-labelledby={`about-tab-${active.id}`}
            aria-live={canAutoplay ? "off" : "polite"}
            className="flex min-h-[540px] min-w-0 flex-col bg-[color:var(--surface)] lg:min-h-[620px]"
          >
            <div className="flex-1 overflow-x-hidden p-5 sm:p-8 xl:p-10">
              <AnimatePresence custom={direction} mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  custom={direction}
                  className="min-h-full"
                  variants={chapterMotion}
                  initial={reduceMotion ? false : "enter"}
                  animate="center"
                  exit={reduceMotion ? undefined : "exit"}
                  transition={{ duration: reduceMotion ? 0 : 0.3, ease: ease.premium }}
                >
                  <ActiveChapter id={active.id} profile={profile} experience={experience} stack={stack} process={process} reduceMotion={reduceMotion} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="grid min-w-0 grid-cols-3 gap-2 border-t border-[color:var(--foreground)] bg-[color:var(--background)] p-3 sm:flex sm:flex-wrap sm:items-center sm:px-5 sm:py-4">
              <div className="order-first col-span-3 sm:order-last sm:ml-auto">
                <DossierLink href="#contacto" label="Hablemos" icon={ArrowUpRight} primary />
              </div>
              <DossierLink href={profile.links.cv} label="CV" icon={Download} />
              <DossierLink href={profile.links.linkedin} label="LinkedIn" icon={BriefcaseBusiness} external />
              <DossierLink href={profile.links.github} label="GitHub" icon={Code2} external />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
