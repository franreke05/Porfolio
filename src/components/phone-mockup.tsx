"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Calendar,
  DatabaseZap,
  Globe2,
  Mail,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { projects, services, siteProfile } from "@/lib/site-data";
import type { Service } from "@/lib/site-data";
import { ease } from "@/lib/motion";
import { PhoneDepthStage } from "@/components/phone-depth-stage";

/** The 4 services with a dedicated detail page — everything else in
 * `services` falls back to the /servicios index. */
const serviceHref: Partial<Record<Service["icon"], string>> = {
  mobile: "/servicios/desarrollo-apps-android",
  crm: "/servicios/crm-a-medida",
  web: "/servicios/diseno-web-empresas",
  automation: "/servicios/automatizaciones-pymes",
};

/* ─────────────────────────────────────────────
   Screen registry — index-matched to the 4 homepage acts.
   Screen changes and phone rotation are both driven by the same scroll
   progress value from the parent (normal page scroll, never drag or a
   hijacked wheel).
───────────────────────────────────────────── */
export type ScreenId = "inicio" | "proyectos" | "servicios" | "contacto";

const SCREENS: { id: ScreenId; label: string }[] = [
  { id: "inicio",    label: "Inicio"    },
  { id: "proyectos", label: "Proyectos" },
  { id: "servicios", label: "Servicios" },
  { id: "contacto",  label: "Contacto"  },
];

const inicioSkills = [
  { Icon: Smartphone,  label: "Mobile", href: serviceHref.mobile },
  { Icon: DatabaseZap, label: "CRM",    href: serviceHref.crm },
  { Icon: Globe2,      label: "Web",    href: serviceHref.web },
];

function InicioScreen() {
  return (
    <div className="flex h-full flex-col gap-3" style={{ transformStyle: "preserve-3d" }}>
      <Link
        href="/sobre-mi"
        className="relative flex flex-col gap-3 transition-opacity hover:opacity-80"
        style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[color:var(--foreground)] font-display text-xl font-bold text-[color:var(--foreground)]">
          FR
        </div>
        <div className="text-center">
          <p className="text-[13px] font-semibold text-[color:var(--foreground)]">Francisco Requena</p>
          <p className="mt-0.5 font-mono text-[10px] text-[color:var(--muted)]">Desarrollador full-stack</p>
        </div>
      </Link>
      <div className="mx-auto flex items-center gap-1.5 border border-[color:var(--primary)]/40 bg-[color:var(--accent-soft)] px-2.5 py-1 text-[10px] font-medium text-[color:var(--primary)]">
        <span className="block h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
        Disponible
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { n: "4",  label: "Proyectos", href: "/proyectos" },
          { n: "3+", label: "Años",      href: undefined },
          { n: "12+", label: "Techs",    href: undefined },
        ].map((s) =>
          s.href ? (
            <Link
              key={s.label}
              href={s.href}
              className="border border-[color:var(--border)] py-2 text-center transition-colors hover:border-[color:var(--foreground)]"
            >
              <p className="font-display text-sm font-bold text-[color:var(--primary)]">{s.n}</p>
              <p className="text-[9px] text-[color:var(--muted)]">{s.label}</p>
            </Link>
          ) : (
            <div key={s.label} className="border border-[color:var(--border)] py-2 text-center">
              <p className="font-display text-sm font-bold text-[color:var(--primary)]">{s.n}</p>
              <p className="text-[9px] text-[color:var(--muted)]">{s.label}</p>
            </div>
          ),
        )}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {inicioSkills.map(({ Icon, label, href }) => (
          <Link
            key={label}
            href={href ?? "/servicios"}
            className="flex flex-col items-center gap-1 border border-[color:var(--border)] py-2 transition-colors hover:border-[color:var(--foreground)]"
          >
            <Icon className="h-3.5 w-3.5 text-[color:var(--primary)]" aria-hidden="true" />
            <span className="text-[9px] text-[color:var(--muted)]">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProyectosScreen() {
  return (
    <div className="flex h-full flex-col gap-2">
      {projects.map((p, i) => (
        <Link
          key={p.id}
          href={`/proyectos/${p.caseStudySlug ?? p.id}`}
          className="flex items-center gap-2 border border-[color:var(--border)] px-2.5 py-2 transition-colors hover:border-[color:var(--foreground)]"
        >
          <span className="flex h-5 w-6 shrink-0 items-center justify-center border border-[color:var(--foreground)] font-mono text-[8.5px] font-bold text-[color:var(--foreground)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-[color:var(--foreground)]">{p.title}</p>
            <p className="text-[9px] text-[color:var(--muted)]">{p.projectType.split(" ")[0]}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

const serviceIcon: Record<string, typeof Smartphone> = {
  mobile: Smartphone,
  crm: DatabaseZap,
  web: Globe2,
  support: ShieldCheck,
  automation: Zap,
  growth: Sparkles,
};

function ServiciosScreen({
  activeServiceId,
  loopProgress,
}: {
  activeServiceId: Service["id"];
  loopProgress?: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();
  const activeService = services.find((service) => service.id === activeServiceId) ?? services[0];
  const activeIndex = services.findIndex((service) => service.id === activeService.id);
  const Icon = serviceIcon[activeService.icon] ?? Sparkles;
  const href = serviceHref[activeService.icon] ?? "/servicios";

  return (
    <Link href={href} className="contents">
    <motion.div
      key={activeService.id}
      data-phone-service-screen
      className="flex h-full flex-col transition-opacity hover:opacity-90"
      style={{ transformStyle: "preserve-3d" }}
      initial={reduceMotion ? false : { x: 8 }}
      animate={{ x: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: ease.premium }}
    >
        <div
          className="relative overflow-hidden border-2 border-[color:var(--foreground)] bg-[color:var(--foreground)] p-3 text-[color:var(--background)]"
          style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
        >
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[color:var(--primary)]">
                Servicio {String(activeIndex + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
              </p>
              <p className="mt-2 text-balance font-display text-[18px] font-bold leading-[1.08]">
                {activeService.title}
              </p>
            </div>
            <span
              className="relative flex h-8 w-8 shrink-0 items-center justify-center border border-[color:var(--background)] bg-[color:var(--primary)] text-[color:var(--on-primary)]"
              style={{ transform: "translateZ(16px)" }}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="relative mt-2 font-mono text-[8.5px] font-bold uppercase tracking-[0.08em] text-[color:var(--background)]/85">
            {activeService.highlight}
          </p>
          <p className="relative mt-2 line-clamp-2 text-[10px] leading-[1.45] text-[color:var(--background)]/90">
            {activeService.summary}
          </p>
        </div>

        <div className="mt-3 flex min-h-0 flex-1 flex-col">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[color:var(--muted)]">
            Entregables
          </p>
          <ul className="mt-2 grid min-h-0 flex-1 grid-rows-4 gap-1.5">
            {activeService.deliverables.map((deliverable, index) => (
              <li
                key={deliverable}
                className="flex min-h-0 items-center gap-2 border border-[color:var(--border)] bg-[color:var(--surface)] px-2.5 py-1.5"
              >
                <span className="font-mono text-[8.5px] font-bold text-[color:var(--primary)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-medium leading-[1.3] text-[color:var(--foreground)]">
                  {deliverable}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 border-t border-[color:var(--foreground)] pt-2.5">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-[color:var(--muted)]">
              Arquitectura · código tuyo
            </span>
            <ArrowUpRight className="h-3 w-3 text-[color:var(--primary)]" aria-hidden="true" />
          </div>
          <div className="mt-2 grid grid-cols-6 gap-1" aria-hidden="true">
            {services.map((service, index) => (
              <span
                key={service.id}
                className="relative h-1 overflow-hidden bg-[color:var(--border)]"
              >
                <motion.span
                  className="absolute inset-0 origin-left bg-[color:var(--primary)]"
                  style={{
                    scaleX: index < activeIndex ? 1 : index === activeIndex ? (loopProgress ?? 1) : 0,
                  }}
                />
              </span>
            ))}
          </div>
        </div>
    </motion.div>
    </Link>
  );
}

function ContactoScreen() {
  const links = [
    { Icon: Mail,              label: "Email",    href: siteProfile.links.mail     },
    { Icon: MessageCircle,     label: "WhatsApp", href: siteProfile.links.whatsapp },
    { Icon: BriefcaseBusiness, label: "LinkedIn",  href: siteProfile.links.linkedin },
  ];

  return (
    <div className="flex h-full flex-col items-center gap-3" style={{ transformStyle: "preserve-3d" }}>
      <div
        className="relative flex h-12 w-12 items-center justify-center border-2 border-[color:var(--foreground)]"
        style={{ transform: "translateZ(12px)" }}
      >
        <Calendar className="h-6 w-6 text-[color:var(--primary)]" aria-hidden="true" />
      </div>
      <div className="text-center">
        <p className="text-[11px] font-semibold text-[color:var(--foreground)]">¿Hablamos?</p>
        <p className="mt-0.5 text-[9px] leading-[1.45] text-[color:var(--muted)]">
          Cuéntame tu proyecto.<br />Propongo un camino claro.
        </p>
      </div>
      <div className="w-full space-y-1.5">
        {links.map(({ Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 border border-[color:var(--border)] px-3 py-2.5"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-[color:var(--primary)]" aria-hidden="true" />
            <span className="text-[10px] font-medium text-[color:var(--foreground)]">{label}</span>
            <ArrowUpRight className="ml-auto h-3 w-3 shrink-0 text-[color:var(--muted)]" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}

const screenVariants = {
  enter:  (d: number) => ({ opacity: 0, x: d * 10 }),
  center: {              opacity: 1, x: 0        },
  exit:   (d: number) => ({ opacity: 0, x: d * -10 }),
};

function renderScreen(
  id: ScreenId,
  activeServiceId: Service["id"],
  serviceLoopProgress?: MotionValue<number>,
) {
  switch (id) {
    case "inicio":    return <InicioScreen />;
    case "proyectos": return <ProyectosScreen />;
    case "servicios": return <ServiciosScreen activeServiceId={activeServiceId} loopProgress={serviceLoopProgress} />;
    case "contacto":  return <ContactoScreen />;
  }
}

/* ─────────────────────────────────────────────
   Main component — active screen driven by `progress`, a 0→1 MotionValue
   from the parent's useScroll over the whole 4-act homepage section. The
   live HTML screen rotates together with the chassis as one 3D object
   (see PhoneDepthStage's rotator), with select hero elements inside each
   screen carrying their own extra translateZ so they float/pop with it.
   No drag, no wheel hijack: normal page scroll only.
───────────────────────────────────────────── */
export function PhoneMockup({
  progress,
  activeServiceId,
  screenOverride,
  serviceLoopProgress,
  variant = "sticky",
}: {
  progress: MotionValue<number>;
  activeServiceId: Service["id"];
  screenOverride?: ScreenId;
  serviceLoopProgress?: MotionValue<number>;
  variant?: "sticky" | "inline";
}) {
  const rm = useReducedMotion();
  const phoneRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(phoneRef, { amount: 0.15 });
  const [{ idx: activeIdx, dir }, setScreenState] = useState(() => {
    const initialIdx = Math.min(
      SCREENS.length - 1,
      Math.max(0, Math.floor(progress.get() * SCREENS.length)),
    );
    return { idx: initialIdx, dir: 1 };
  });

  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(SCREENS.length - 1, Math.max(0, Math.floor(v * SCREENS.length)));
    setScreenState((previous) =>
      previous.idx === next
        ? previous
        : {
            idx: next,
            dir: next > previous.idx ? 1 : -1,
          },
    );
  });

  const visibleIdx = screenOverride
    ? SCREENS.findIndex((screen) => screen.id === screenOverride)
    : activeIdx;
  const active = SCREENS[Math.max(0, visibleIdx)];
  const isInline = variant === "inline";

  return (
    <div
      ref={phoneRef}
      className={`relative mx-auto flex flex-col items-center select-none ${
        isInline
          ? "w-[clamp(230px,72vw,270px)] sm:w-[270px] md:w-[280px] [@media(max-height:600px)]:w-[220px]"
          : "w-[clamp(280px,min(19vw,calc((100svh-10rem)*0.46)),330px)] xl:mx-0 xl:ml-[clamp(1rem,2vw,2.5rem)] xl:mr-auto"
      }`}
      data-phone-mockup
      aria-label={`Demostración de portfolio — pantalla: ${active.label}.`}
    >
      <PhoneDepthStage
        interactive={!isInline}
        isInView={isInView}
        loopProgress={serviceLoopProgress}
        reducedMotion={rm}
        scrollProgress={progress}
        showBadge={!isInline}
      >
        {/* Live screen — a Z-offset child of the shared 3D rotator, with its own
            preserve-3d context so nested elements can carry further depth. */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: "5.56%", top: "6.92%", width: "88.9%", height: "88.46%",
            borderRadius: "9.4%",
            background: "var(--background)",
            transform: "translateZ(3px)",
            transformStyle: "preserve-3d",
          }}
          data-phone-screen
        >
          <div className="flex items-center justify-between px-5 pb-0.5 pt-8 text-[10px] text-[color:var(--foreground)]">
            <span className="font-mono">9:41</span>
            <div className="flex items-end gap-[1.5px]">
              {[3, 5, 7, 9].map((h, j) => (
                <div key={j} className="w-[2px] rounded-sm bg-[color:var(--foreground)]/70" style={{ height: h }} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-1.5">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-[color:var(--primary)]">
              {active.label}
            </span>
            <span className="font-mono text-[9px] text-[color:var(--muted)]">fr.dev</span>
          </div>

          <div className="mx-4 h-px bg-[color:var(--border)]" />

          <div
            className="relative overflow-hidden"
            style={{ height: "calc(100% - 82px)", transformStyle: "preserve-3d" }}
          >
            <AnimatePresence custom={dir} mode="wait">
              <motion.div
                key={visibleIdx}
                custom={dir}
                variants={rm ? undefined : screenVariants}
                initial={rm ? false : "enter"}
                animate="center"
                exit={rm ? undefined : "exit"}
                transition={{ duration: rm ? 0 : 0.3, ease: ease.premium }}
                className="absolute inset-0 overflow-hidden px-3.5 py-3"
                style={{ transformStyle: "preserve-3d" }}
              >
                {renderScreen(active.id, activeServiceId, serviceLoopProgress)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </PhoneDepthStage>

      {!isInline && (
        <>
          {/* Dot indicators — reflect scroll-driven act, not manual nav */}
          <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
            {SCREENS.map((s, i) => (
              <motion.span
                key={s.id}
                className="h-1.5 rounded-full"
                style={{ background: i === visibleIdx ? "var(--primary)" : "var(--border-hover)" }}
                animate={{ width: i === visibleIdx ? 20 : 6 }}
                transition={rm ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 26 }}
              />
            ))}
          </div>

          <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--muted)]">
            {active.label}
          </p>
        </>
      )}
    </div>
  );
}
