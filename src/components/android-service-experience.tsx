"use client";

import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  FileCheck2,
  GitBranch,
  Layers3,
  Pause,
  Play,
  Rocket,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { PhoneShell } from "@/components/phone-shell";
import { ease } from "@/lib/motion";

const AUTO_ADVANCE_MS = 8000;

const subscribeToHydration = () => () => undefined;
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

type ChapterId = "diagnosis" | "architecture" | "development" | "release";

type Chapter = {
  id: ChapterId;
  code: string;
  label: string;
  hint: string;
  eyebrow: string;
  title: string;
  summary: string;
  points: readonly string[];
  output: string;
  outputLabel: string;
  icon: LucideIcon;
};

const chapters = [
  {
    id: "diagnosis",
    code: "01",
    label: "Diagnóstico",
    hint: "Alcance sin humo",
    eyebrow: "Primero entendemos",
    title: "Antes de escribir código, cierro el problema real.",
    summary:
      "Definimos quién usará la app, qué debe resolver y cuáles son los flujos que justifican el primer lanzamiento.",
    points: [
      "Objetivo, usuarios y flujos críticos definidos.",
      "Un MVP sin funciones que todavía no validan nada.",
      "Riesgos, integraciones y plazo visibles desde el inicio.",
      "Sin plantillas genéricas ni reuniones que no producen decisiones.",
    ],
    output: "Brief + alcance",
    outputLabel: "Punto de partida aprobado",
    icon: FileCheck2,
  },
  {
    id: "architecture",
    code: "02",
    label: "Arquitectura",
    hint: "Preparada para crecer",
    eyebrow: "Una base mantenible",
    title: "Cada capa tiene una responsabilidad clara.",
    summary:
      "La interfaz, la lógica y los datos evolucionan por separado para añadir funciones sin rehacer el producto.",
    points: [
      "Jetpack Compose para una interfaz Android nativa y adaptable.",
      "MVVM con dominio y datos separados de las pantallas.",
      "Kotlin Multiplatform cuando conviene compartir lógica con iOS.",
      "Room y WorkManager para funcionar sin conexión estable.",
    ],
    output: "Mapa técnico",
    outputLabel: "Decisiones antes del desarrollo",
    icon: Layers3,
  },
  {
    id: "development",
    code: "03",
    label: "Desarrollo",
    hint: "Builds que puedes probar",
    eyebrow: "Progreso comprobable",
    title: "Iteraciones cortas, repositorio abierto y entregas reales.",
    summary:
      "No esperas al final para descubrir el producto. Cada ciclo deja una versión instalable y una decisión revisable.",
    points: [
      "El repositorio Git es tuyo desde el primer commit.",
      "Firebase Auth, FCM y Ktor conectados con sistemas reales.",
      "Pruebas unitarias e instrumentadas en los flujos principales.",
      "Avance visible mediante builds, no porcentajes abstractos.",
    ],
    output: "Build instalable",
    outputLabel: "Producto usable en cada ciclo",
    icon: Code2,
  },
  {
    id: "release",
    code: "04",
    label: "Publicación",
    hint: "Lista para producción",
    eyebrow: "El cierre también cuenta",
    title: "La app termina publicada, documentada y bajo tu control.",
    summary:
      "Gestiono la firma, la ficha y la revisión de Google Play para que el último tramo no se convierta en otro proyecto.",
    points: [
      "Publicación y configuración de producción en Play Store.",
      "Revisión de firma, permisos y políticas de la plataforma.",
      "Documentación técnica y guía de mantenimiento.",
      "30 días de soporte para ajustes menores tras el lanzamiento.",
    ],
    output: "Release 1.0",
    outputLabel: "Producción + documentación",
    icon: Rocket,
  },
] as const satisfies readonly Chapter[];

const stats = [
  ["6–12", "semanas MVP"],
  ["100%", "código tuyo"],
  ["30", "días soporte"],
] as const;

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ScreenHeading({ code, title }: { code: string; title: string }) {
  return (
    <div className="flex items-end justify-between gap-3 border-b border-[color:var(--border-hover)] pb-3">
      <div>
        <p className="font-mono text-[7px] font-bold uppercase tracking-[0.14em] text-[color:var(--primary)]">{code}</p>
        <p className="mt-1 font-display text-lg font-bold leading-none text-[color:var(--foreground)]">{title}</p>
      </div>
      <span className="h-2 w-2 rounded-full bg-[color:var(--primary)]" aria-hidden="true" />
    </div>
  );
}

function ScreenFooter({ label }: { label: string }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-[color:var(--border-hover)] pt-3">
      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">{label}</span>
      <span className="flex h-5 w-5 items-center justify-center bg-[color:var(--primary)] text-[color:var(--on-primary)]">
        <ChevronRight className="h-3 w-3" aria-hidden="true" />
      </span>
    </div>
  );
}

function PhoneScreen({ id }: { id: ChapterId }) {
  if (id === "diagnosis") {
    return (
      <div className="flex h-full flex-col">
        <ScreenHeading code="BRIEF / 01" title="Nuevo producto" />
        <div className="mt-4 space-y-2.5">
          {[
            ["Objetivo", "Operación más rápida"],
            ["Usuarios", "Equipo + clientes"],
            ["Flujos críticos", "03 definidos"],
          ].map(([label, value], index) => (
            <div key={label} className="border border-[color:var(--border-hover)] bg-[color:var(--surface)] px-3 py-2.5">
              <div className="flex justify-between font-mono text-[7px] font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
                <span>{label}</span>
                <span className="text-[color:var(--primary)]">0{index + 1}</span>
              </div>
              <p className="mt-1.5 text-[10px] font-semibold text-[color:var(--foreground)]">{value}</p>
            </div>
          ))}
        </div>
        <ScreenFooter label="Alcance definido" />
      </div>
    );
  }

  if (id === "architecture") {
    return (
      <div className="flex h-full flex-col">
        <ScreenHeading code="SYSTEM / 02" title="Arquitectura" />
        <div className="relative mt-4 space-y-2">
          <span className="absolute bottom-3 left-4 top-3 w-px bg-[color:var(--primary)]" aria-hidden="true" />
          {[
            ["INTERFAZ", "Compose · Material 3"],
            ["ESTADO", "ViewModel · MVVM"],
            ["DOMINIO", "Casos de uso · KMP"],
            ["DATOS", "Ktor · Room · API"],
          ].map(([label, value], index) => (
            <div
              key={label}
              className={cn(
                "relative ml-2 border px-3 py-2.5 pl-7",
                index === 0
                  ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                  : "border-[color:var(--border-hover)] bg-[color:var(--surface)] text-[color:var(--foreground)]",
              )}
            >
              <span className="absolute left-[0.3rem] top-1/2 h-2.5 w-2.5 -translate-y-1/2 border border-current bg-[color:var(--background)]" aria-hidden="true" />
              <p className="font-mono text-[7px] font-bold tracking-[0.12em] opacity-60">{label}</p>
              <p className="mt-1 text-[10px] font-semibold">{value}</p>
            </div>
          ))}
        </div>
        <ScreenFooter label="Capas conectadas" />
      </div>
    );
  }

  if (id === "development") {
    return (
      <div className="flex h-full flex-col">
        <ScreenHeading code="REPO / 03" title="Sprint actual" />
        <div className="mt-4 border border-[color:var(--foreground)] bg-[color:var(--surface)]">
          <div className="flex justify-between border-b border-[color:var(--border-hover)] px-3 py-2 font-mono text-[8px]">
            <span className="flex items-center gap-1.5 font-bold">
              <GitBranch className="h-2.5 w-2.5 text-[color:var(--primary)]" aria-hidden="true" /> main
            </span>
            <span className="text-[color:var(--muted)]">build #28</span>
          </div>
          <div className="space-y-3 p-3">
            {[
              ["feat", "flujo de acceso", "OK"],
              ["test", "sesión offline", "OK"],
              ["api", "sincronización", "RUN"],
            ].map(([kind, task, status]) => (
              <div key={task} className="grid grid-cols-[2.2rem_1fr_auto] items-center gap-2">
                <span className="bg-[color:var(--accent-soft)] px-1 py-0.5 text-center font-mono text-[6px] font-bold uppercase text-[color:var(--primary)]">{kind}</span>
                <span className="truncate text-[9px] text-[color:var(--foreground)]">{task}</span>
                <span className="font-mono text-[6px] font-bold text-[color:var(--primary)]">{status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between font-mono text-[7px] text-[color:var(--muted)]"><span>Sprint verificable</span><span>68%</span></div>
          <div className="mt-1.5 h-1.5 bg-[color:var(--border)]"><div className="h-full w-[68%] bg-[color:var(--primary)]" /></div>
        </div>
        <ScreenFooter label="Build disponible" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScreenHeading code="PLAY / 04" title="Release 1.0" />
      <div className="mt-4 border-2 border-[color:var(--foreground)] bg-[color:var(--foreground)] p-4 text-[color:var(--background)]">
        <div className="flex items-center justify-between">
          <span className="flex h-9 w-9 items-center justify-center bg-[color:var(--primary)] text-[color:var(--on-primary)]"><Rocket className="h-4 w-4" aria-hidden="true" /></span>
          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.12em] text-white/60">Producción</span>
        </div>
        <p className="mt-4 font-display text-xl font-bold leading-none">Lista para publicar.</p>
        <p className="mt-2 text-[9px] leading-4 text-white/65">Firma, ficha y políticas revisadas.</p>
      </div>
      <div className="mt-3 space-y-2">
        {["App bundle firmado", "Play Console validada", "Documentación entregada"].map((item) => (
          <div key={item} className="flex items-center gap-2 border-b border-[color:var(--border)] pb-2 text-[9px] text-[color:var(--foreground)]">
            <Check className="h-3 w-3 text-[color:var(--primary)]" aria-hidden="true" /> {item}
          </div>
        ))}
      </div>
      <ScreenFooter label="Publicación preparada" />
    </div>
  );
}

function AndroidDevice({ activeIndex, reduceMotion }: { activeIndex: number; reduceMotion: boolean }) {
  return (
    <div className="relative mx-auto aspect-[9/19.5] w-[210px] sm:w-[240px] xl:w-[270px]">
      <PhoneShell className="absolute inset-0 h-full w-full" />
      <div
        className="absolute overflow-hidden bg-[color:var(--background)]"
        style={{ left: "5.56%", top: "6.92%", width: "88.9%", height: "88.46%", borderRadius: "9.4%" }}
      >
        <div className="flex items-end justify-between px-5 pb-2 pt-8 font-mono text-[7px] text-[color:var(--foreground)]"><span>9:41</span><span>5G · 87%</span></div>
        <div className="mx-4 flex items-center justify-between border-y border-[color:var(--border)] py-2">
          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.12em] text-[color:var(--primary)]">Android Build Lab</span>
          <Smartphone className="h-3 w-3" aria-hidden="true" />
        </div>
        <div className="relative mx-4 mt-3 h-[calc(100%-104px)] overflow-hidden">
          {chapters.map((chapter, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.div
                key={chapter.id}
                aria-hidden={!isActive}
                className={cn("absolute inset-0", isActive ? "pointer-events-auto" : "pointer-events-none")}
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                transition={{ duration: reduceMotion ? 0 : 0.32, ease: ease.premium }}
              >
                <PhoneScreen id={chapter.id} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AndroidServiceExperience() {
  const prefersReducedMotion = useReducedMotion();
  const regionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabListRef = useRef<HTMLDivElement>(null);
  const autoAdvanceRef = useRef(false);
  const isInView = useInView(regionRef, { amount: 0.35 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const reduceMotion = hydrated && prefersReducedMotion === true;
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
      setActiveIndex((current) => (current + 1) % chapters.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, canAutoplay, cycle]);

  useEffect(() => {
    if (!autoAdvanceRef.current) return;
    autoAdvanceRef.current = false;
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const tabList = tabListRef.current;
    const activeTab = tabRefs.current[activeIndex];
    if (!tabList || !activeTab) return;
    tabList.scrollTo({
      left: activeTab.offsetLeft - (tabList.clientWidth - activeTab.clientWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeIndex, reduceMotion]);

  const active = chapters[activeIndex] ?? chapters[0];
  const ActiveIcon = active.icon;

  const selectChapter = (index: number, options?: { focus?: boolean }) => {
    autoAdvanceRef.current = false;
    setActiveIndex(index);
    setCycle((current) => current + 1);
    if (options?.focus) tabRefs.current[index]?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = chapters.length - 1;
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index === lastIndex ? 0 : index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index === 0 ? lastIndex : index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = lastIndex;
    if (nextIndex !== null) {
      event.preventDefault();
      selectChapter(nextIndex, { focus: true });
    }
  };

  return (
    <section
      ref={regionRef}
      id="android-lab"
      role="region"
      aria-labelledby="android-service-title"
      aria-roledescription="carrusel"
      data-active-chapter={active.id}
      data-autoplay={canAutoplay ? "running" : "paused"}
      className="overflow-hidden border-2 border-[color:var(--foreground)] bg-[color:var(--surface)]"
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={() => setPointerInside(false)}
      onFocus={() => setFocusInside(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusInside(false);
      }}
    >
      <div className="flex min-h-12 items-center justify-between gap-3 border-b-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.14em] sm:text-[10px]">
          <span className="truncate text-[color:var(--primary)]">Android Build Lab</span>
          <span className="shrink-0 text-[color:var(--muted)]">{active.code} / 04</span>
        </div>
        {reduceMotion ? (
          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[color:var(--muted)]">Recorrido manual</span>
        ) : (
          <button
            type="button"
            onClick={() => setPausedByUser((current) => !current)}
            aria-pressed={pausedByUser}
            className="inline-flex min-h-9 items-center gap-2 px-1 font-mono text-[8px] font-bold uppercase tracking-[0.1em] transition-colors hover:text-[color:var(--primary)] sm:text-[9px]"
          >
            {pausedByUser ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
            {pausedByUser ? "Reanudar" : "Pausar"}
          </button>
        )}
      </div>

      <div
        className="grid min-w-0 xl:grid-cols-[minmax(0,1.05fr)_minmax(430px,0.95fr)]"
      >
        <div className="min-w-0 border-b-2 border-[color:var(--foreground)] xl:border-b-0 xl:border-r-2">
          <header className="px-5 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10 xl:px-10 xl:pt-12">
            <p className="section-eyebrow mb-5">Desarrollo mobile</p>
            <h1 id="android-service-title" className="max-w-[18ch] font-display text-[clamp(2.5rem,5vw,4.75rem)] font-bold leading-[0.96] tracking-[-0.035em] text-[color:var(--foreground)]">
              Apps Android que llegan a <span className="text-[color:var(--primary)]">producción.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:text-lg sm:leading-8">
              Diseño y desarrollo productos Android a medida con Kotlin, Jetpack Compose y KMP: desde el primer flujo hasta la publicación, sin plantillas ni una caja negra entre medias.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/#contacto" className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] px-5 text-sm font-semibold text-[color:var(--on-primary)] transition-colors hover:bg-[color:var(--primary-hover)]">
                Hablemos de tu app <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href="#android-blueprint" className="inline-flex min-h-12 items-center justify-center gap-2 border border-[color:var(--foreground)] px-5 text-sm font-semibold transition-colors hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]">
                Ver cómo trabajo <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <dl className="mt-8 grid grid-cols-3 border-y border-[color:var(--border-hover)] py-4">
              {stats.map(([value, label], index) => (
                <div key={label} className={cn("px-3 first:pl-0", index > 0 && "border-l border-[color:var(--border-hover)]")}>
                  <dt className="font-mono text-[8px] font-bold uppercase tracking-[0.08em] text-[color:var(--muted)] sm:text-[9px]">{label}</dt>
                  <dd className="mt-1 font-display text-xl font-bold sm:text-2xl">{value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <div id="android-chapters" className="border-t-2 border-[color:var(--foreground)]">
            <div ref={tabListRef} role="tablist" aria-label="Fases del desarrollo de una app Android" className="flex snap-x overflow-x-auto border-b border-[color:var(--foreground)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:overflow-visible">
              {chapters.map((chapter, index) => {
                const isActive = index === activeIndex;
                const Icon = chapter.icon;
                return (
                  <button
                    key={chapter.id}
                    ref={(element) => { tabRefs.current[index] = element; }}
                    id={"android-tab-" + chapter.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={"android-panel-" + chapter.id}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectChapter(index)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    className={cn(
                      "relative flex min-h-[78px] w-[74vw] max-w-[290px] shrink-0 snap-start items-center gap-3 border-r border-[color:var(--foreground)] px-4 py-3 text-left transition-colors last:border-r-0 lg:w-auto lg:max-w-none",
                      isActive ? "bg-[color:var(--surface-elevated)]" : "bg-[color:var(--surface)] hover:bg-[color:var(--background)]",
                    )}
                  >
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center border", isActive ? "border-[color:var(--foreground)] bg-[color:var(--primary)] text-[color:var(--on-primary)]" : "border-[color:var(--border-hover)] bg-[color:var(--background)] text-[color:var(--primary)]")}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-baseline gap-2"><span className="font-mono text-[8px] font-bold text-[color:var(--primary)]">{chapter.code}</span><span className="font-display text-[15px] font-bold">{chapter.label}</span></span>
                      <span className="mt-1 block truncate font-mono text-[8px] uppercase tracking-[0.08em] text-[color:var(--muted)]">{chapter.hint}</span>
                    </span>
                    {isActive ? (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[color:var(--border)]" aria-hidden="true">
                        <motion.span
                          key={chapter.id + "-" + cycle + "-" + canAutoplay}
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

            <div
              className="relative min-h-[380px] overflow-hidden px-5 py-7 sm:min-h-[330px] sm:px-8 sm:py-8 xl:px-10"
              aria-live={canAutoplay ? "off" : "polite"}
            >
              {chapters.map((chapter, index) => {
                const isActive = index === activeIndex;
                return (
                  <motion.article
                    key={chapter.id}
                    id={"android-panel-" + chapter.id}
                    role="tabpanel"
                    aria-labelledby={"android-tab-" + chapter.id}
                    aria-hidden={!isActive}
                    tabIndex={isActive ? 0 : -1}
                    className={cn("absolute inset-x-5 top-7 sm:inset-x-8 sm:top-8 xl:inset-x-10", isActive ? "pointer-events-auto" : "pointer-events-none")}
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3, ease: ease.premium }}
                  >
                    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--primary)]">{chapter.eyebrow}</p>
                    <h2 className="mt-2 max-w-[24ch] font-display text-2xl font-bold leading-tight sm:text-3xl">{chapter.title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">{chapter.summary}</p>
                    <ul className="mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                      {chapter.points.map((point) => (
                        <li key={point} className="flex gap-2 text-xs leading-5"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--primary)]" aria-hidden="true" />{point}</li>
                      ))}
                    </ul>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[570px] min-w-0 flex-col justify-center overflow-hidden bg-[color:var(--background)] p-5 sm:min-h-[640px] sm:p-8 xl:min-h-[830px]">
          <div className="comic-halftone pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative z-10 grid items-center gap-7 md:grid-cols-[minmax(145px,0.7fr)_minmax(220px,1fr)]">
            <div className="order-2 hidden border border-[color:var(--foreground)] bg-[color:var(--surface)] p-4 md:order-1 md:block md:p-5">
              <div className="flex items-center justify-between border-b border-[color:var(--border-hover)] pb-4">
                <span className="flex h-9 w-9 items-center justify-center bg-[color:var(--primary)] text-[color:var(--on-primary)]"><ActiveIcon className="h-4 w-4" aria-hidden="true" /></span>
                <span className="font-mono text-[8px] font-bold text-[color:var(--muted)]">{active.code} / 04</span>
              </div>
              <p className="mt-5 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[color:var(--primary)]">Entregable de fase</p>
              <p className="mt-2 font-display text-xl font-bold leading-tight">{active.output}</p>
              <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">{active.outputLabel}</p>
              <ol className="mt-6 space-y-3" aria-label="Estado del recorrido">
                {chapters.map((chapter, index) => (
                  <li key={chapter.id} className="grid grid-cols-[1rem_1fr] items-center gap-2">
                    <span className={cn("h-2 w-2 border", index === activeIndex ? "border-[color:var(--primary)] bg-[color:var(--primary)]" : index < activeIndex ? "border-[color:var(--foreground)] bg-[color:var(--foreground)]" : "border-[color:var(--border-hover)]")} aria-hidden="true" />
                    <span className={cn("font-mono text-[7px] uppercase tracking-[0.08em]", index === activeIndex ? "font-bold text-[color:var(--primary)]" : "text-[color:var(--muted)]")}>{chapter.label}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="order-1 md:order-2"><AndroidDevice activeIndex={activeIndex} reduceMotion={reduceMotion} /></div>
          </div>
          <div className="relative z-10 mx-auto mt-7 flex w-full max-w-2xl items-center justify-between gap-4 border-t border-[color:var(--border-hover)] pt-4">
            <p className="flex items-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.1em]"><span className="h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" aria-hidden="true" />Kotlin / Compose / KMP</p>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {chapters.map((chapter, index) => <span key={chapter.id} className={cn("h-1.5 transition-[width,background-color] duration-300", index === activeIndex ? "w-8 bg-[color:var(--primary)]" : "w-3 bg-[color:var(--border-hover)]")} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
