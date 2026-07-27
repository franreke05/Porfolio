"use client";

import {
  ArrowUpRight,
  ChevronRight,
  Database,
  Globe2,
  Layers3,
  Pause,
  Play,
  Smartphone,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { MagneticButton } from "@/components/magnetic-button";
import { TabletShell } from "@/components/tablet-shell";
import { ease } from "@/lib/motion";

const AUTO_ADVANCE_MS = 7000;

const deviceSlide = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -18 : 18 }),
};

const panelSlide = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 12 : -12 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -10 : 10 }),
};

export type ServiceTabletOffering = {
  href: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
};

type ScreenKind = "app" | "crm" | "web" | "automation";

type ServiceScreen = {
  eyebrow: string;
  headline: string;
  outcome: string;
  deliverables: string[];
  kind: ScreenKind;
  metric: string;
  metricLabel: string;
};

const serviceIcons: Record<string, LucideIcon> = {
  AP: Smartphone,
  CR: Database,
  WB: Globe2,
  AU: Workflow,
};

const serviceScreens: Record<string, ServiceScreen> = {
  AP: {
    eyebrow: "PRODUCTO MOBILE",
    headline: "De la idea a una app lista para publicar.",
    outcome: "Interfaz, lógica y lanzamiento en un mismo recorrido.",
    deliverables: ["Prototipo y experiencia", "Arquitectura mantenible", "Publicación y evolución"],
    kind: "app",
    metric: "01",
    metricLabel: "producto, un solo equipo",
  },
  CR: {
    eyebrow: "OPERACIÓN INTERNA",
    headline: "Tu proceso convertido en un sistema propio.",
    outcome: "Clientes, tareas y permisos sin forzar una plantilla ajena.",
    deliverables: ["Pipeline a medida", "Roles por equipo", "Datos y reportes claros"],
    kind: "crm",
    metric: "360°",
    metricLabel: "visión de la operación",
  },
  WB: {
    eyebrow: "PRESENCIA DIGITAL",
    headline: "Una web que explica, posiciona y convierte.",
    outcome: "Claridad, velocidad y contacto desde el primer scroll.",
    deliverables: ["Diseño responsive", "SEO y rendimiento", "Analítica y conversión"],
    kind: "web",
    metric: "<1s",
    metricLabel: "sensación de respuesta",
  },
  AU: {
    eyebrow: "FLUJO AUTOMÁTICO",
    headline: "Menos tareas manuales. Más foco útil.",
    outcome: "Las herramientas se conectan y el trabajo repetitivo deja de depender de una persona.",
    deliverables: ["Evento de entrada", "Reglas y validación", "Aviso y seguimiento"],
    kind: "automation",
    metric: "24/7",
    metricLabel: "procesos trabajando",
  },
};

function AppPreview() {
  return (
    <div className="grid h-full grid-cols-[0.62fr_1.38fr] gap-2.5">
      <div className="flex flex-col border border-[color:var(--border-hover)] bg-[color:var(--surface)] p-2.5">
        <div className="flex items-center gap-1.5 border-b border-[color:var(--border)] pb-2">
          <span className="h-2 w-2 rounded-full bg-[color:var(--primary)]" />
          <span className="font-mono text-[7px] font-bold uppercase tracking-[0.12em] text-[color:var(--muted)]">Build</span>
        </div>
        <div className="mt-3 space-y-2">
          {["01  UX", "02  DATA", "03  PLAY"].map((item, index) => (
            <div key={item} className={`border px-2 py-2 font-mono text-[7px] font-bold ${index === 1 ? "border-[color:var(--primary)] bg-[color:var(--accent-soft)] text-[color:var(--primary)]" : "border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--muted)]"}`}>
              {item}
            </div>
          ))}
        </div>
        <span className="mt-auto font-mono text-[7px] text-[color:var(--muted)]">COMPOSE / KMP</span>
      </div>
      <div className="relative overflow-hidden border border-[color:var(--foreground)] bg-[color:var(--background)] p-3">
        <div className="comic-halftone absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between">
            <span className="border border-[color:var(--foreground)] bg-[color:var(--primary)] px-2 py-1 font-mono text-[7px] font-bold text-[color:var(--on-primary)]">MVP 01</span>
            <span className="font-mono text-[7px] font-bold text-[color:var(--muted)]">ANDROID</span>
          </div>
          <p className="mt-4 max-w-[13ch] font-display text-base font-bold leading-[0.98] text-[color:var(--foreground)] sm:text-lg">Listo para probar con usuarios.</p>
          <div className="mt-auto grid grid-cols-3 gap-1.5">
            {["UI", "LÓGICA", "STORE"].map((label, index) => (
              <div key={label} className={`border px-1 py-2 text-center ${index === 2 ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--on-primary)]" : "border-[color:var(--border-hover)] bg-[color:var(--surface)] text-[color:var(--foreground)]"}`}>
                <span className="font-mono text-[6px] font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CrmPreview() {
  const columns = [
    { label: "NUEVOS", count: "12", cards: ["Alborán", "Nexo"] },
    { label: "EN CURSO", count: "07", cards: ["Marea", "Órbita"] },
    { label: "CERRADOS", count: "24", cards: ["Aster", "Lumen"] },
  ];

  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="flex items-center justify-between border border-[color:var(--border-hover)] bg-[color:var(--background)] px-3 py-2">
        <span className="font-mono text-[7px] font-bold uppercase tracking-[0.12em] text-[color:var(--foreground)]">Pipeline comercial</span>
        <span className="bg-[color:var(--accent-soft)] px-2 py-1 font-mono text-[7px] font-bold text-[color:var(--primary)]">43 ACTIVOS</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
        {columns.map((column, columnIndex) => (
          <div key={column.label} className="border border-[color:var(--border)] bg-[color:var(--surface)] p-2">
            <div className="flex items-center justify-between font-mono text-[6px] font-bold text-[color:var(--muted)]">
              <span>{column.label}</span>
              <span className={columnIndex === 1 ? "text-[color:var(--primary)]" : ""}>{column.count}</span>
            </div>
            <div className="mt-2 space-y-2">
              {column.cards.map((card, cardIndex) => (
                <div key={card} className={`border bg-[color:var(--background)] p-2 ${columnIndex === 1 && cardIndex === 0 ? "border-[color:var(--primary)]" : "border-[color:var(--border)]"}`}>
                  <p className="truncate font-mono text-[7px] font-bold text-[color:var(--foreground)]">{card}</p>
                  <div className="mt-2 h-1 rounded-full bg-[color:var(--border)]">
                    <div className="h-full rounded-full bg-[color:var(--primary)]" style={{ width: `${42 + columnIndex * 20 + cardIndex * 8}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebPreview() {
  return (
    <div className="grid h-full grid-cols-[1.45fr_0.55fr] gap-2.5">
      <div className="overflow-hidden border border-[color:var(--foreground)] bg-[color:var(--background)]">
        <div className="flex items-center gap-1.5 border-b border-[color:var(--border)] px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-[color:var(--primary)]" />
          <span className="h-2 w-2 rounded-full bg-[color:var(--border-hover)]" />
          <span className="h-2 w-2 rounded-full bg-[color:var(--border-hover)]" />
          <span className="ml-2 h-2 flex-1 rounded-full bg-[color:var(--surface-elevated)]" />
        </div>
        <div className="relative h-[calc(100%_-_33px)] overflow-hidden p-4">
          <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[color:var(--primary)]/12" />
          <div className="relative">
            <span className="font-mono text-[7px] font-bold text-[color:var(--primary)]">MENSAJE CLARO / 01</span>
            <p className="mt-3 max-w-[14ch] font-display text-base font-bold leading-[0.98] text-[color:var(--foreground)] sm:text-lg">Tu negocio, claro desde el primer scroll.</p>
            <div className="mt-4 inline-flex border border-[color:var(--foreground)] bg-[color:var(--primary)] px-3 py-2 font-mono text-[7px] font-bold text-[color:var(--on-primary)]">HABLEMOS →</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {[
          { value: "98", label: "SCORE" },
          { value: "0.7s", label: "LCP" },
          { value: "+32%", label: "CONTACTO" },
        ].map((metric) => (
          <div key={metric.label} className="flex flex-1 flex-col justify-between border border-[color:var(--border)] bg-[color:var(--surface)] p-2">
            <span className="font-mono text-[6px] font-bold text-[color:var(--muted)]">{metric.label}</span>
            <span className="font-display text-sm font-bold text-[color:var(--primary)] sm:text-base">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutomationPreview() {
  const nodes = [
    { label: "ENTRADA", detail: "Formulario" },
    { label: "REGLA", detail: "Validación" },
    { label: "CRM", detail: "Registro" },
    { label: "AVISO", detail: "Equipo" },
  ];

  return (
    <div className="relative flex h-full flex-col overflow-hidden border border-[color:var(--foreground)] bg-[color:var(--background)] p-3">
      <div className="comic-halftone absolute inset-0 opacity-25" aria-hidden="true" />
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[7px] font-bold uppercase tracking-[0.12em] text-[color:var(--foreground)]">Flujo activo</span>
        <span className="bg-[color:var(--primary)] px-2 py-1 font-mono text-[7px] font-bold text-[color:var(--on-primary)]">24/7</span>
      </div>
      <div className="relative my-auto grid grid-cols-4 items-center gap-1.5">
        {nodes.map((node, index) => (
          <div key={node.label} className="relative">
            <div className={`border p-2 text-center ${index === nodes.length - 1 ? "border-[color:var(--foreground)] bg-[color:var(--primary)] text-[color:var(--on-primary)]" : "border-[color:var(--border-hover)] bg-[color:var(--surface)] text-[color:var(--foreground)]"}`}>
              <p className="font-mono text-[6px] font-bold">{node.label}</p>
              <p className={`mt-1 truncate text-[6px] ${index === nodes.length - 1 ? "text-[color:var(--on-primary)]/75" : "text-[color:var(--muted)]"}`}>{node.detail}</p>
            </div>
            {index < nodes.length - 1 ? <span className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 font-mono text-[9px] font-bold text-[color:var(--primary)]">→</span> : null}
          </div>
        ))}
      </div>
      <p className="relative border-t border-[color:var(--border)] pt-2 font-mono text-[7px] text-[color:var(--muted)]">EVENTO → REGLA → RESULTADO MEDIBLE</p>
    </div>
  );
}

function ServiceVisual({ kind }: { kind: ScreenKind }) {
  switch (kind) {
    case "app":
      return <AppPreview />;
    case "crm":
      return <CrmPreview />;
    case "web":
      return <WebPreview />;
    case "automation":
      return <AutomationPreview />;
  }
}

function DesktopTablet({ active, screen, index, direction, reduceMotion }: { active: ServiceTabletOffering; screen: ServiceScreen; index: number; direction: number; reduceMotion: boolean }) {
  const ServiceIcon = serviceIcons[active.code] ?? Layers3;

  return (
    <div className="relative mx-auto hidden w-full max-w-[830px] sm:block" style={{ perspective: 1400 }} aria-hidden="true">
      <div className="relative w-full drop-shadow-[8px_10px_0_rgba(24,20,16,0.16)]" style={{ aspectRatio: "960 / 650" }}>
        <TabletShell className="absolute inset-0 h-full w-full" />
        <div className="absolute overflow-hidden bg-[color:var(--background)]" style={{ left: "5.625%", top: "9.23%", width: "88.75%", height: "78.77%", borderRadius: "4.5%" }}>
          <div className="flex h-[12%] items-center justify-between border-b border-[color:var(--border)] px-[4%]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[clamp(7px,0.72vw,10px)] font-bold uppercase tracking-[0.16em] text-[color:var(--primary)]">{screen.eyebrow}</span>
              <span className="h-1 w-1 rounded-full bg-[color:var(--border-hover)]" />
              <span className="font-mono text-[clamp(6px,0.65vw,9px)] text-[color:var(--muted)]">fr.dev / service lab</span>
            </div>
            <span className="flex h-6 w-6 items-center justify-center border border-[color:var(--foreground)] text-[color:var(--primary)]">
              <ServiceIcon className="h-3.5 w-3.5" />
            </span>
          </div>

          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.div
              key={active.code}
              custom={direction}
              className="grid h-[88%] grid-cols-[0.82fr_1.18fr] gap-[4%] p-[4%]"
              variants={deviceSlide}
              initial={reduceMotion ? false : "enter"}
              animate="center"
              exit={reduceMotion ? undefined : "exit"}
              transition={{ duration: reduceMotion ? 0 : 0.34, ease: ease.premium }}
            >
              <div className="flex min-w-0 flex-col">
                <p className="font-mono text-[clamp(7px,0.72vw,10px)] font-bold text-[color:var(--primary)]">{active.code} / 0{index + 1}</p>
                <h3 className="mt-2 max-w-[18ch] font-display text-[clamp(15px,1.7vw,24px)] font-bold leading-[1.02] text-[color:var(--foreground)]">{screen.headline}</h3>
                <p className="mt-3 max-w-[28ch] text-[clamp(8px,0.78vw,11px)] leading-relaxed text-[color:var(--muted)]">{screen.outcome}</p>
                <ol className="mt-auto space-y-1.5">
                  {screen.deliverables.map((deliverable, deliverableIndex) => (
                    <li key={deliverable} className="flex items-center gap-2 border-t border-[color:var(--border)] pt-1.5 font-mono text-[clamp(6px,0.66vw,9px)] font-bold text-[color:var(--foreground)]">
                      <span className="text-[color:var(--primary)]">0{deliverableIndex + 1}</span>
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="min-h-0">
                <ServiceVisual kind={screen.kind} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MobileDevice({ active, screen, index, direction, reduceMotion }: { active: ServiceTabletOffering; screen: ServiceScreen; index: number; direction: number; reduceMotion: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[390px] sm:hidden" aria-hidden="true">
      <div className="aspect-[4/5] rounded-[34px] border-2 border-[color:var(--primary)] bg-[#17130f] p-3 shadow-[6px_7px_0_rgba(24,20,16,0.16)]">
        <div className="flex h-full flex-col overflow-hidden rounded-[23px] bg-[color:var(--background)]">
          <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3">
            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[color:var(--primary)]">{screen.eyebrow}</span>
            <span className="font-mono text-[8px] font-bold text-[color:var(--foreground)]">0{index + 1} / 04</span>
          </div>
          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.div
              key={active.code}
              custom={direction}
              className="flex min-h-0 flex-1 flex-col p-4"
              variants={deviceSlide}
              initial={reduceMotion ? false : "enter"}
              animate="center"
              exit={reduceMotion ? undefined : "exit"}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: ease.premium }}
            >
              <h3 className="max-w-[18ch] font-display text-xl font-bold leading-[1.02] text-[color:var(--foreground)]">{screen.headline}</h3>
              <div className="mt-4 min-h-0 flex-1">
                <ServiceVisual kind={screen.kind} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function ServicesTabletExperience({ services }: { services: readonly ServiceTabletOffering[] }) {
  const reduceMotion = useReducedMotion() === true;
  const regionRef = useRef<HTMLElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const autoAdvanceRef = useRef(false);
  const isInView = useInView(regionRef, { amount: 0.45 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [cycle, setCycle] = useState(0);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const canAutoplay = services.length > 1 && isInView && documentVisible && !reduceMotion && !pausedByUser && !pointerInside && !focusInside;

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
      setActiveIndex((current) => (current + 1) % services.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, canAutoplay, services.length]);

  useEffect(() => {
    if (!autoAdvanceRef.current) return;
    autoAdvanceRef.current = false;
    if (window.matchMedia("(min-width: 1280px)").matches) return;

    const tabList = tabListRef.current;
    const activeTab = tabRefs.current[activeIndex];
    if (!tabList || !activeTab) return;

    const nextLeft = activeTab.offsetLeft - (tabList.clientWidth - activeTab.clientWidth) / 2;
    tabList.scrollTo({ left: nextLeft, behavior: reduceMotion ? "auto" : "smooth" });
  }, [activeIndex, reduceMotion]);

  const active = services[activeIndex] ?? services[0];
  if (!active) return null;

  const screen = serviceScreens[active.code] ?? serviceScreens.AP;
  const activePosition = String(activeIndex + 1).padStart(2, "0");
  const totalServices = String(services.length).padStart(2, "0");

  const selectService = (index: number, options?: { focus?: boolean; direction?: number }) => {
    autoAdvanceRef.current = false;
    setDirection(options?.direction ?? (index >= activeIndex ? 1 : -1));
    setActiveIndex(index);
    setCycle((current) => current + 1);
    if (options?.focus) tabRefs.current[index]?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = services.length - 1;
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
      selectService(nextIndex, { focus: true, direction: nextDirection });
    }
  };

  return (
    <section
      ref={regionRef}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Servicios de desarrollo"
      data-active-service={active.code}
      className="overflow-hidden border-2 border-[color:var(--foreground)] bg-[color:var(--surface)]"
    >
      <div className="flex min-h-12 items-center justify-between gap-3 border-b-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-4 sm:px-6">
        <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
          <span className="text-[color:var(--primary)]">Servicios</span>
          <span className="text-[color:var(--muted)]">{activePosition} / {totalServices}</span>
        </div>
        {reduceMotion ? (
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[color:var(--muted)]">Recorrido manual</span>
        ) : (
          <button
            type="button"
            onClick={() => setPausedByUser((current) => !current)}
            className="inline-flex min-h-9 items-center gap-2 px-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[color:var(--foreground)] transition-colors hover:text-[color:var(--primary)]"
          >
            {pausedByUser ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
            <span className="sm:hidden">{pausedByUser ? "Reanudar" : "Pausar"}</span>
            <span className="hidden sm:inline">{pausedByUser ? "Reanudar recorrido" : "Pausar recorrido"}</span>
          </button>
        )}
      </div>

      <div
        className="grid min-w-0 grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(330px,0.76fr)_minmax(0,1.24fr)] xl:grid-rows-[auto_1fr]"
        onPointerEnter={() => setPointerInside(true)}
        onPointerLeave={() => setPointerInside(false)}
        onFocus={() => setFocusInside(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocusInside(false);
        }}
      >
        <div className="order-1 min-w-0 border-b-2 border-[color:var(--foreground)] p-5 sm:p-7 xl:col-start-1 xl:row-start-1 xl:border-r-2 xl:p-8">
          <div className="min-w-0">
            <p className="section-eyebrow mb-4">Elige un punto de partida</p>
            <div ref={tabListRef} className="-mx-5 flex min-w-0 max-w-full snap-x gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-7 sm:px-7 xl:mx-0 xl:block xl:overflow-visible xl:px-0 xl:pb-0" role="tablist" aria-label="Servicios disponibles">
              {services.map((service, index) => {
                const isActive = index === activeIndex;
                const Icon = serviceIcons[service.code] ?? Layers3;

                return (
                  <button
                    key={service.code}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    id={`service-tab-${service.code}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="service-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectService(index)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    className={`group relative flex min-h-[72px] w-[78vw] max-w-[310px] shrink-0 snap-start items-center gap-3 overflow-hidden border border-[color:var(--foreground)] px-4 py-3 text-left transition-colors xl:w-full xl:max-w-none xl:border-b-0 xl:last:border-b ${isActive ? "bg-[color:var(--surface-elevated)]" : "bg-[color:var(--surface)] hover:bg-[color:var(--background)]"}`}
                  >
                    <span className={`absolute inset-y-0 left-0 w-[3px] ${isActive ? "bg-[color:var(--primary)]" : "bg-transparent"}`} aria-hidden="true" />
                    <span className={`font-mono text-[10px] font-bold ${isActive ? "text-[color:var(--primary)]" : "text-[color:var(--muted)]"}`}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center border ${isActive ? "border-[color:var(--foreground)] bg-[color:var(--primary)] text-[color:var(--on-primary)]" : "border-[color:var(--border-hover)] bg-[color:var(--background)] text-[color:var(--primary)]"}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[15px] font-bold leading-[1.05] text-[color:var(--foreground)]">{service.title}</span>
                      <span className="mt-1 block truncate font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-[color:var(--muted)]">{service.tagline}</span>
                    </span>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isActive ? "translate-x-0.5 text-[color:var(--primary)]" : "text-[color:var(--muted)] group-hover:translate-x-0.5"}`} aria-hidden="true" />
                    {isActive ? (
                      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[color:var(--border)]" aria-hidden="true">
                        <motion.span
                          key={`${active.code}-${cycle}-${canAutoplay}`}
                          className="block h-full origin-left bg-[color:var(--primary)]"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: canAutoplay ? 1 : 0 }}
                          transition={{ duration: canAutoplay ? AUTO_ADVANCE_MS / 1000 : 0.18, ease: "linear" }}
                        />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <article
          id="service-panel"
          role="tabpanel"
          aria-labelledby={`service-tab-${active.code}`}
          aria-live={canAutoplay ? "off" : "polite"}
          className="order-3 min-w-0 bg-[color:var(--surface)] p-5 sm:p-7 xl:col-start-1 xl:row-start-2 xl:border-r-2 xl:border-[color:var(--foreground)] xl:p-8"
        >
          <AnimatePresence custom={direction} mode="wait" initial={false}>
              <motion.div
                key={active.code}
                custom={direction}
                className="w-full"
                variants={panelSlide}
                initial={reduceMotion ? false : "enter"}
                animate="center"
                exit={reduceMotion ? undefined : "exit"}
                transition={{ duration: reduceMotion ? 0 : 0.26, ease: ease.premium }}
              >
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--primary)]">{screen.eyebrow}</p>
                <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-[color:var(--foreground)]">{active.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{active.description}</p>
                <div className="mt-5">
                  <MagneticButton href={active.href} rounded="none">
                    Ver servicio
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </MagneticButton>
                </div>
              </motion.div>
          </AnimatePresence>
        </article>

        <div className="relative order-2 flex min-h-[420px] min-w-0 flex-col justify-center overflow-hidden border-b-2 border-[color:var(--foreground)] bg-[color:var(--background)] p-5 sm:p-7 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:min-h-[620px] xl:border-b-0 xl:p-9">
          <div className="comic-halftone pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative">
            <DesktopTablet active={active} screen={screen} index={activeIndex} direction={direction} reduceMotion={reduceMotion} />
            <MobileDevice active={active} screen={screen} index={activeIndex} direction={direction} reduceMotion={reduceMotion} />
          </div>
          <div className="relative mx-auto mt-5 flex w-full max-w-[830px] items-center justify-between gap-4 border-t border-[color:var(--border-hover)] pt-4">
            <div>
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[color:var(--muted)]">Resultado</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[color:var(--primary)]">{screen.metric}</span>
                <span className="text-xs font-medium text-[color:var(--foreground)]">{screen.metricLabel}</span>
              </p>
            </div>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {services.map((service, index) => (
                <span key={service.code} className={`h-1.5 transition-[width,background-color] duration-300 ${index === activeIndex ? "w-8 bg-[color:var(--primary)]" : "w-3 bg-[color:var(--border-hover)]"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
