"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
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
import { useState } from "react";
import { projects, services, siteProfile } from "@/lib/site-data";
import { ease, spring } from "@/lib/motion";
import { PhoneShell } from "@/components/phone-shell";

/* ─────────────────────────────────────────────
   Screen registry — index-matched to the 4 homepage acts.
   Screen changes and phone rotation are both driven by the same scroll
   progress value from the parent (normal page scroll, never drag or a
   hijacked wheel).
───────────────────────────────────────────── */
type ScreenId = "inicio" | "proyectos" | "servicios" | "contacto";

const SCREENS: { id: ScreenId; label: string }[] = [
  { id: "inicio",    label: "Inicio"    },
  { id: "proyectos", label: "Proyectos" },
  { id: "servicios", label: "Servicios" },
  { id: "contacto",  label: "Contacto"  },
];

// Resting tilt per act — interpolated smoothly between these 4 keyframes.
const REST_ROTATE_X = [5, 10, -6, 0];
const REST_ROTATE_Y = [-8, -24, 20, 0];

function InicioScreen() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[color:var(--foreground)] font-display text-xl font-bold text-[color:var(--foreground)]">
        FR
      </div>
      <div className="text-center">
        <p className="text-[11px] font-semibold text-[color:var(--foreground)]">Francisco Requena</p>
        <p className="mt-0.5 font-mono text-[9px] text-[color:var(--muted)]">Desarrollador full-stack</p>
      </div>
      <div className="mx-auto flex items-center gap-1.5 border border-[color:var(--primary)]/40 bg-[color:var(--accent-soft)] px-2.5 py-1 text-[9px] font-medium text-[color:var(--primary)]">
        <span className="block h-1.5 w-1.5 rounded-full bg-[color:var(--primary)]" />
        Disponible
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { n: "4",  label: "Proyectos" },
          { n: "3+", label: "Años"      },
          { n: "12+", label: "Techs"    },
        ].map((s) => (
          <div key={s.label} className="border border-[color:var(--border)] py-2 text-center">
            <p className="font-display text-sm font-bold text-[color:var(--primary)]">{s.n}</p>
            <p className="text-[8px] text-[color:var(--muted)]">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { Icon: Smartphone,  label: "Mobile" },
          { Icon: DatabaseZap, label: "CRM"    },
          { Icon: Globe2,      label: "Web"    },
        ].map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 border border-[color:var(--border)] py-2">
            <Icon className="h-3.5 w-3.5 text-[color:var(--primary)]" aria-hidden="true" />
            <span className="text-[8px] text-[color:var(--muted)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProyectosScreen() {
  return (
    <div className="flex h-full flex-col gap-2">
      {projects.map((p, i) => (
        <div key={p.id} className="flex items-center gap-2 border border-[color:var(--border)] px-2.5 py-2">
          <span className="flex h-4 w-5 shrink-0 items-center justify-center border border-[color:var(--foreground)] font-mono text-[7px] font-bold text-[color:var(--foreground)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[9.5px] font-semibold text-[color:var(--foreground)]">{p.title}</p>
            <p className="text-[8px] text-[color:var(--muted)]">{p.projectType.split(" ")[0]}</p>
          </div>
        </div>
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

function ServiciosScreen() {
  return (
    <div className="flex h-full flex-col gap-2">
      {services.slice(0, 4).map((s) => {
        const Icon = serviceIcon[s.icon] ?? Sparkles;
        return (
          <div key={s.id} className="flex items-center gap-2.5 border border-[color:var(--border)] px-2.5 py-2">
            <Icon className="h-3.5 w-3.5 shrink-0 text-[color:var(--primary)]" aria-hidden="true" />
            <span className="truncate text-[9.5px] font-semibold text-[color:var(--foreground)]">{s.title}</span>
          </div>
        );
      })}
    </div>
  );
}

function ContactoScreen() {
  const links = [
    { Icon: Mail,              label: "Email",    href: siteProfile.links.mail     },
    { Icon: MessageCircle,     label: "WhatsApp", href: siteProfile.links.whatsapp },
    { Icon: BriefcaseBusiness, label: "LinkedIn",  href: siteProfile.links.linkedin },
  ];

  return (
    <div className="flex h-full flex-col items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center border-2 border-[color:var(--foreground)]">
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
  enter:  (d: number) => ({ opacity: 0, x: d * 18, filter: "blur(4px)" }),
  center: {              opacity: 1, x: 0,        filter: "blur(0px)"  },
  exit:   (d: number) => ({ opacity: 0, x: d * -18, filter: "blur(4px)" }),
};

function renderScreen(id: ScreenId) {
  switch (id) {
    case "inicio":    return <InicioScreen />;
    case "proyectos": return <ProyectosScreen />;
    case "servicios": return <ServiciosScreen />;
    case "contacto":  return <ContactoScreen />;
  }
}

/* ─────────────────────────────────────────────
   Main component — rotation and active screen both driven by `progress`,
   a 0→1 MotionValue from the parent's useScroll over the whole 4-act
   homepage section. No drag, no wheel hijack: normal page scroll only.
───────────────────────────────────────────── */
export function PhoneMockup({ progress }: { progress: MotionValue<number> }) {
  const rm = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const stops = [0, 1 / 3, 2 / 3, 1];
  const rawRotateX = useTransform(progress, stops, REST_ROTATE_X);
  const rawRotateY = useTransform(progress, stops, REST_ROTATE_Y);
  const rotateX = useSpring(rawRotateX, spring.scroll);
  const rotateY = useSpring(rawRotateY, spring.scroll);

  useMotionValueEvent(progress, "change", (v) => {
    const next = Math.min(SCREENS.length - 1, Math.max(0, Math.floor(v * SCREENS.length)));
    setActiveIdx((prev) => {
      if (prev === next) return prev;
      setDir(next > prev ? 1 : -1);
      return next;
    });
  });

  const active = SCREENS[activeIdx];

  return (
    <div
      className="relative mx-auto flex flex-col items-center select-none"
      style={{ width: "clamp(220px, 48%, 275px)", perspective: 1200 }}
      aria-label={`Demostración de portfolio — pantalla: ${active.label}.`}
    >
      <motion.div
        className="w-full"
        animate={rm ? {} : { y: [0, -7, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="relative w-full"
          style={{
            aspectRatio: "9 / 19.5",
            transformStyle: "preserve-3d",
            rotateX: rm ? 0 : rotateX,
            rotateY: rm ? 0 : rotateY,
          }}
        >
          {/* Floating status badge — positive Z, pops toward the viewer */}
          <motion.div
            className="comic-action-word comic-status-live absolute -right-3 top-[14%] z-20 flex items-center gap-1.5 border-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-2.5 py-1.5 text-[9px]"
            style={{ transform: "translateZ(72px)" }}
            animate={rm ? {} : { y: [0, -5, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            aria-hidden="true"
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            En vivo
          </motion.div>

          <PhoneShell className="absolute inset-0 h-full w-full" />

          {/* Screen HTML overlay — matches SVG screen rect: x=20,y=54,w=320,h=690 of 360×780 */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: "5.56%", top: "6.92%", width: "88.9%", height: "88.46%",
              borderRadius: "9.4%",
              background: "var(--background)",
            }}
          >
            <div className="flex items-center justify-between px-5 pb-0.5 pt-8 text-[9px] text-[color:var(--foreground)]">
              <span className="font-mono">9:41</span>
              <div className="flex items-end gap-[1.5px]">
                {[3, 5, 7, 9].map((h, j) => (
                  <div key={j} className="w-[2px] rounded-sm bg-[color:var(--foreground)]/70" style={{ height: h }} />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-1.5">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-[color:var(--primary)]">
                {active.label}
              </span>
              <span className="font-mono text-[8px] text-[color:var(--muted)]">fr.dev</span>
            </div>

            <div className="mx-4 h-px bg-[color:var(--border)]" />

            <div className="relative overflow-hidden" style={{ height: "calc(100% - 82px)" }}>
              <AnimatePresence custom={dir} mode="wait">
                <motion.div
                  key={activeIdx}
                  custom={dir}
                  variants={rm ? undefined : screenVariants}
                  initial={rm ? false : "enter"}
                  animate="center"
                  exit={rm ? undefined : "exit"}
                  transition={{ duration: rm ? 0 : 0.3, ease: ease.premium }}
                  className="absolute inset-0 overflow-hidden px-3.5 py-3"
                >
                  {renderScreen(active.id)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Dot indicators — reflect scroll-driven act, not manual nav */}
      <div className="mt-4 flex items-center gap-1.5" aria-hidden="true">
        {SCREENS.map((s, i) => (
          <motion.span
            key={s.id}
            className="h-1.5 rounded-full"
            style={{ background: i === activeIdx ? "var(--primary)" : "var(--border-hover)" }}
            animate={{ width: i === activeIdx ? 20 : 6 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
          />
        ))}
      </div>

      <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[color:var(--muted)]">
        {active.label}
      </p>
    </div>
  );
}
