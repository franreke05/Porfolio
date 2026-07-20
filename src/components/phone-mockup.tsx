"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Calendar,
  CheckCircle2,
  Clock,
  DatabaseZap,
  Globe2,
  Mail,
  MessageCircle,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { projects, siteProfile, stackGroups } from "@/lib/site-data";
import { ease } from "@/lib/motion";
import { PhoneShell } from "@/components/phone-shell";

/* ─────────────────────────────────────────────
   Screen registry
───────────────────────────────────────────── */
type ScreenId = "inicio" | "proyectos" | "stack" | "contacto";

const SCREENS: { id: ScreenId; label: string }[] = [
  { id: "inicio",    label: "Inicio"    },
  { id: "proyectos", label: "Proyectos" },
  { id: "stack",     label: "Stack"     },
  { id: "contacto",  label: "Contacto"  },
];

/* ─────────────────────────────────────────────
   Screen content components
   Each must fit in ~88 % of the phone height
   without scrolling (~480–520 px at clamp midpoint).
───────────────────────────────────────────── */
function InicioScreen() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* Avatar */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl font-mono text-xl font-bold"
        style={{
          background: "linear-gradient(135deg,rgba(195,147,86,0.22),rgba(82,208,220,0.12))",
          border: "1px solid rgba(195,147,86,0.4)",
          color: "#c8985a",
        }}>
        FR
      </div>

      {/* Name + role */}
      <div className="text-center">
        <p className="text-[11px] font-semibold" style={{ color: "#e8e1cf" }}>Francisco Requena</p>
        <p className="mt-0.5 font-mono text-[9px]" style={{ color: "#7c8595" }}>Full-Stack Developer</p>
      </div>

      {/* Available badge */}
      <div className="mx-auto flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-medium"
        style={{ background: "rgba(77,196,180,0.1)", border: "1px solid rgba(77,196,180,0.28)", color: "#4dc4b4" }}>
        <motion.span
          className="block h-1.5 w-1.5 rounded-full"
          style={{ background: "#4dc4b4" }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        Disponible
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { n: "5+",  label: "Proyectos" },
          { n: "3+",  label: "Años"      },
          { n: "12+", label: "Techs"     },
        ].map((s) => (
          <div key={s.label} className="rounded-xl py-2 text-center"
            style={{ background: "rgba(12,21,32,0.95)", border: "1px solid #1c2a3c" }}>
            <p className="text-sm font-bold" style={{ color: "#c8985a" }}>{s.n}</p>
            <p className="text-[8px]" style={{ color: "#7c8595" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Service icons */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { Icon: Smartphone,  label: "Mobile" },
          { Icon: DatabaseZap, label: "CRM"    },
          { Icon: Globe2,      label: "Web"    },
        ].map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 rounded-xl py-2"
            style={{ background: "rgba(12,21,32,0.95)", border: "1px solid #1c2a3c" }}>
            <Icon className="h-3.5 w-3.5" style={{ color: "#52d0dc" }} aria-hidden="true" />
            <span className="text-[8px]" style={{ color: "#7c8595" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProyectosScreen() {
  const items = projects.slice(0, 5);
  const statusIcon = (status: (typeof items)[number]["status"]) => {
    if (status === "documented-case" || status === "own-system" || status === "real-lab")
      return <CheckCircle2 className="h-2.5 w-2.5 shrink-0" style={{ color: "#4dc4b4" }} />;
    if (status === "anonymous-project")
      return <ShieldCheck className="h-2.5 w-2.5 shrink-0" style={{ color: "#7c8595" }} />;
    return <Clock className="h-2.5 w-2.5 shrink-0" style={{ color: "#c8985a" }} />;
  };

  return (
    <div className="flex h-full flex-col gap-2">
      {items.map((p, i) => (
        <motion.div
          key={p.id}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2"
          style={{ background: "rgba(12,21,32,0.95)", border: "1px solid #1c2a3c" }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.055, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: p.visibility === "anonymous" ? "#7c8595" : i % 2 === 0 ? "#52d0dc" : "#c8985a" }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[9.5px] font-semibold" style={{ color: "#e8e1cf" }}>
              {p.title}
            </p>
            <p className="text-[8px]" style={{ color: "#7c8595" }}>{p.projectType.split(" ")[0]}</p>
          </div>
          {statusIcon(p.status)}
        </motion.div>
      ))}
    </div>
  );
}

function StackScreen() {
  const CHIP_LIMIT = 3;
  const displayed = stackGroups.slice(0, 4);
  const accentColor = (i: number) => i % 2 === 0 ? "#52d0dc" : "#c8985a";
  const accentRgb   = (i: number) => i % 2 === 0 ? "82,208,220" : "195,147,86";

  return (
    <div className="flex h-full flex-col gap-2.5">
      {displayed.map((g, gi) => (
        <div key={g.title}>
          <p className="mb-1 text-[7.5px] font-bold uppercase tracking-[0.15em]"
            style={{ color: accentColor(gi) }}>
            {g.title}
          </p>
          <div className="flex flex-wrap gap-1">
            {g.items.slice(0, CHIP_LIMIT).map((item, ii) => (
              <motion.span
                key={item}
                className="rounded-md px-1.5 py-[3px] font-mono text-[8px] font-semibold"
                style={{
                  background: `rgba(${accentRgb(gi)},0.08)`,
                  border:     `1px solid rgba(${accentRgb(gi)},0.2)`,
                  color:       accentColor(gi),
                }}
                initial={{ opacity: 0, scale: 0.84 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: gi * 0.08 + ii * 0.04, duration: 0.22 }}
              >
                {item}
              </motion.span>
            ))}
            {g.items.length > CHIP_LIMIT && (
              <span className="rounded-md px-1.5 py-[3px] text-[8px]"
                style={{ border: "1px solid #1c2a3c", color: "#7c8595" }}>
                +{g.items.length - CHIP_LIMIT}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactoScreen() {
  const links = [
    { Icon: Mail,             label: "Email",     href: siteProfile.links.mail      },
    { Icon: MessageCircle,    label: "WhatsApp",  href: siteProfile.links.whatsapp  },
    { Icon: BriefcaseBusiness,label: "LinkedIn",  href: siteProfile.links.linkedin  },
  ];

  return (
    <div className="flex h-full flex-col items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{ background: "rgba(195,147,86,0.12)", border: "1px solid rgba(195,147,86,0.32)" }}>
        <Calendar className="h-6 w-6" style={{ color: "#c8985a" }} aria-hidden="true" />
      </div>

      <div className="text-center">
        <p className="text-[11px] font-semibold" style={{ color: "#e8e1cf" }}>¿Hablamos?</p>
        <p className="mt-0.5 text-[9px] leading-[1.45]" style={{ color: "#7c8595" }}>
          Cuéntame tu proyecto.<br />Propongo un camino claro.
        </p>
      </div>

      <div className="w-full space-y-1.5">
        {links.map(({ Icon, label, href }, i) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
            style={{ background: "rgba(12,21,32,0.95)", border: "1px solid #1c2a3c" }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: "#c8985a" }} aria-hidden="true" />
            <span className="text-[10px] font-medium" style={{ color: "#e8e1cf" }}>{label}</span>
            <ArrowUpRight className="ml-auto h-3 w-3 shrink-0" style={{ color: "#7c8595" }} aria-hidden="true" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Animation variants — slide + blur on change
───────────────────────────────────────────── */
const screenVariants = {
  enter:  (d: number) => ({ opacity: 0, x: d * 18, filter: "blur(4px)" }),
  center: {              opacity: 1, x: 0,        filter: "blur(0px)"  },
  exit:   (d: number) => ({ opacity: 0, x: d * -18, filter: "blur(4px)" }),
};

function renderScreen(id: ScreenId) {
  switch (id) {
    case "inicio":    return <InicioScreen />;
    case "proyectos": return <ProyectosScreen />;
    case "stack":     return <StackScreen />;
    case "contacto":  return <ContactoScreen />;
  }
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export function PhoneMockup() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const rm = useReducedMotion();
  const d  = (base: number) => (rm ? 0 : base);

  // Auto-cycle
  useEffect(() => {
    if (rm) return;
    intervalRef.current = setInterval(() => {
      setDir(1);
      setActiveIdx((prev) => (prev + 1) % SCREENS.length);
    }, 3800);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [rm]);

  const goTo = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDir(i > activeIdx ? 1 : -1);
    setActiveIdx(i);
    // Restart auto-cycle after manual navigation
    if (!rm) {
      intervalRef.current = setInterval(() => {
        setDir(1);
        setActiveIdx((prev) => (prev + 1) % SCREENS.length);
      }, 3800);
    }
  };

  const active = SCREENS[activeIdx];

  return (
    <div
      className="relative mx-auto flex flex-col items-center select-none"
      style={{ width: "clamp(220px, 48%, 275px)" }}
      aria-label={`Demostración de portfolio — pantalla: ${active.label}`}
    >
      {/* Ambient glow — behind phone */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 scale-125 rounded-full blur-[72px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 46%, rgba(82,208,220,0.13), rgba(195,147,86,0.09) 58%, transparent 80%)",
        }}
      />

      {/* Phone — gentle breathing float */}
      <motion.div
        className="w-full"
        animate={rm ? {} : { y: [0, -7, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Aspect-ratio shell */}
        <div className="relative w-full" style={{ aspectRatio: "9 / 19.5" }}>

          {/* SVG phone frame — shared with PhoneBackground */}
          <PhoneShell className="absolute inset-0 h-full w-full" />

          {/* Screen HTML overlay */}
          {/* Matches SVG screen rect: x=20, y=54, w=320, h=690 of 360×780 */}
          {/* As percentages: left=5.56%, top=6.92%, w=88.9%, h=88.46% */}
          <div
            className="absolute overflow-hidden"
            style={{
              left:         "5.56%",
              top:          "6.92%",
              width:        "88.9%",
              height:       "88.46%",
              borderRadius: "9.4%", /* = 44/360 * 100 — stays proportional */
              background:   "rgba(5,8,14,0.98)",
            }}
          >
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pb-0.5 pt-8 text-[9px]"
              style={{ color: "#e8e1cf" }}>
              <span className="font-mono">9:41</span>
              {/* Minimal status icons */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-[1.5px]">
                  {[3, 5, 7, 9].map((h, j) => (
                    <div key={j} className="w-[2px] rounded-sm"
                      style={{ height: h, background: "rgba(232,225,207,0.8)" }} />
                  ))}
                </div>
                <div className="flex items-center gap-0.5">
                  <div className="relative h-[8px] w-[14px] rounded-[2px]"
                    style={{ border: "1px solid rgba(232,225,207,0.7)" }}>
                    <div className="absolute inset-[1.5px] rounded-[1px]"
                      style={{ width: "72%", background: "rgba(232,225,207,0.85)" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Screen label */}
            <div className="flex items-center justify-between px-4 py-1.5">
              <span className="font-mono text-[8.5px] uppercase tracking-[0.18em]"
                style={{ color: "#52d0dc" }}>
                {active.label}
              </span>
              <span className="font-mono text-[8px]" style={{ color: "#7c8595" }}>fr.dev</span>
            </div>

            {/* Separator */}
            <div className="mx-4 h-px" style={{ background: "rgba(28,42,60,0.9)" }} />

            {/* Screen content */}
            <div className="relative overflow-hidden" style={{ height: "calc(100% - 82px)" }}>
              <AnimatePresence custom={dir} mode="wait">
                <motion.div
                  key={activeIdx}
                  custom={dir}
                  variants={rm ? undefined : screenVariants}
                  initial={rm ? false : "enter"}
                  animate="center"
                  exit={rm ? undefined : "exit"}
                  transition={{ duration: d(0.3), ease: ease.premium }}
                  className="absolute inset-0 overflow-hidden px-3.5 py-3"
                >
                  {renderScreen(active.id)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dot indicators */}
      <div className="mt-4 flex items-center gap-1.5" role="tablist" aria-label="Navegar pantallas">
        {SCREENS.map((s, i) => (
          <motion.button
            key={s.id}
            role="tab"
            aria-selected={i === activeIdx}
            aria-label={s.label}
            onClick={() => goTo(i)}
            className="h-1.5 cursor-pointer rounded-full"
            animate={{ width: i === activeIdx ? 20 : 6 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            style={{
              background: i === activeIdx
                ? "var(--primary)"
                : "rgba(124,133,149,0.35)",
            }}
          />
        ))}
      </div>

      {/* Screen name label */}
      <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.15em]"
        style={{ color: "#7c8595" }}>
        {active.label}
      </p>
    </div>
  );
}
