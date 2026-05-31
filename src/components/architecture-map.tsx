"use client";

import {
  BarChart3,
  DatabaseZap,
  Globe2,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

// ─────────────────────────────────────────────────
// Coordinate system.  VW/VH define the SVG viewport;
// all HTML node positions are % of these values.
// Layout verified: no node clips at container ≥ 300px.
// ─────────────────────────────────────────────────
// VH raised to 568 so bottom row (cy ≤ 420) has ≥ 65 px margin before clip.
// Rule: node center cy ≤ VH − 68  →  safe for node half-height ~34 px.
const VW = 700;
const VH = 568;
const HUB = { label: "Negocio", sub: "eje central", cx: 350, cy: 256 } as const;

type NodeDef = {
  id:         string;
  label:      string;
  sub:        string;
  cx:         number;
  cy:         number;
  icon:       LucideIcon;
  tone:       "cyan" | "gold";
  mobileHide: boolean;
};

const NODES: readonly NodeDef[] = [
  { id: "app",   label: "App",     sub: "Kotlin / KMP", cx: 138, cy: 76,  icon: Smartphone,  tone: "cyan", mobileHide: false },
  { id: "crm",   label: "CRM",     sub: "SQL",          cx: 558, cy: 76,  icon: DatabaseZap, tone: "gold", mobileHide: false },
  { id: "maint", label: "Soporte", sub: "continuo",     cx: 68,  cy: 260, icon: ShieldCheck, tone: "gold", mobileHide: true  },
  { id: "data",  label: "Datos",   sub: "REST + API",   cx: 562, cy: 260, icon: BarChart3,   tone: "cyan", mobileHide: false },
  { id: "web",   label: "Web",     sub: "Next.js",      cx: 148, cy: 408, icon: Globe2,      tone: "gold", mobileHide: false },
  { id: "auto",  label: "Auto",    sub: "flujos",       cx: 288, cy: 426, icon: Zap,         tone: "gold", mobileHide: false },
  { id: "seo",   label: "SEO",     sub: "medición",     cx: 456, cy: 418, icon: TrendingUp,  tone: "cyan", mobileHide: true  },
];

const LINES = NODES.map((n) => `M ${n.cx} ${n.cy} L ${HUB.cx} ${HUB.cy}`);

const PKT1 = {
  cx:      [138, 350, 558, 350, 148, 350, 138],
  cy:      [76,  256, 76,  256, 408, 256, 76 ],
  opacity: [0,   1,   1,   1,   1,   1,   0  ],
};
const PKT2 = {
  cx:      [562, 350, 288, 350, 456, 350, 562],
  cy:      [260, 256, 426, 256, 418, 256, 260],
  opacity: [0,   1,   1,   1,   1,   1,   0  ],
};

function pct(v: number, total: number) {
  return `${((v / total) * 100).toFixed(3)}%`;
}

export function ArchitectureMap() {
  const rm = useReducedMotion();

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-[color:var(--border)] shadow-[0_36px_88px_rgba(0,0,0,0.58)]"
      style={{
        aspectRatio: `${VW}/${VH}`,
        contain: "layout paint",
        background:
          "radial-gradient(ellipse 160% 100% at 50% 0%, rgba(13,21,34,0.99), rgba(5,8,14,1))",
      }}
      role="img"
      aria-label="Diagrama de arquitectura: app, CRM, web, datos, automatización, SEO y soporte conectados al eje de negocio"
    >
      {/* ── SVG layer: grid + lines + rings + packets ── */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="am-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.55" fill="rgba(140,170,210,0.055)" />
          </pattern>

          <linearGradient id="am-line" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="rgba(82,208,220,0.65)" />
            <stop offset="100%" stopColor="rgba(195,147,86,0.4)"  />
          </linearGradient>

          <radialGradient id="am-hubglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(195,147,86,0.3)"  />
            <stop offset="55%"  stopColor="rgba(195,147,86,0.07)" />
            <stop offset="100%" stopColor="transparent"            />
          </radialGradient>

          {/* Dual-layer vignette to frame the diagram */}
          <radialGradient id="am-vignette" cx="50%" cy="50%" r="72%">
            <stop offset="55%"  stopColor="transparent"         />
            <stop offset="100%" stopColor="rgba(4,7,12,0.72)"   />
          </radialGradient>

          <filter id="am-pkt-glow" x="-300%" y="-300%" width="700%" height="700%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dot grid background */}
        <rect width={VW} height={VH} fill="url(#am-grid)" />

        {/* Hub glow */}
        <circle cx={HUB.cx} cy={HUB.cy} r="120" fill="url(#am-hubglow)" />

        {/* Connection lines — progressive draw */}
        {LINES.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="url(#am-line)"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={rm ? { opacity: 0.45 } : { pathLength: 0, opacity: 0 }}
            animate={rm ? { opacity: 0.45 } : { pathLength: 1, opacity: 0.58 }}
            transition={{
              pathLength: { duration: 1.2, delay: 0.65 + i * 0.1, ease: "easeOut" },
              opacity:    { duration: 0.3,  delay: 0.65 + i * 0.1 },
            }}
          />
        ))}

        {/* Inner orbital ring — clockwise */}
        {!rm && (
          <motion.g
            style={{ transformOrigin: `${HUB.cx}px ${HUB.cy}px` }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            <circle cx={HUB.cx} cy={HUB.cy} r="58" fill="none"
              stroke="rgba(82,208,220,0.28)" strokeWidth="1" strokeDasharray="48 316" strokeLinecap="round" />
          </motion.g>
        )}

        {/* Outer orbital ring — counter-clockwise */}
        {!rm && (
          <motion.g
            style={{ transformOrigin: `${HUB.cx}px ${HUB.cy}px` }}
            animate={{ rotate: -360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            <circle cx={HUB.cx} cy={HUB.cy} r="82" fill="none"
              stroke="rgba(195,147,86,0.16)" strokeWidth="0.8" strokeDasharray="30 485" strokeLinecap="round" />
          </motion.g>
        )}

        {/* Packet 1 — cyan glow */}
        {!rm && (
          <motion.circle r="3" fill="rgba(82,208,220,1)" filter="url(#am-pkt-glow)"
            initial={{ cx: PKT1.cx[0], cy: PKT1.cy[0], opacity: 0 }}
            animate={PKT1}
            transition={{ duration: 10, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
          />
        )}

        {/* Packet 2 — gold glow, offset start */}
        {!rm && (
          <motion.circle r="2.5" fill="rgba(200,152,90,0.95)" filter="url(#am-pkt-glow)"
            initial={{ cx: PKT2.cx[0], cy: PKT2.cy[0], opacity: 0 }}
            animate={PKT2}
            transition={{ duration: 10, delay: 5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
          />
        )}

        {/* Vignette frame */}
        <rect width={VW} height={VH} fill="url(#am-vignette)" />
      </svg>

      {/* ── Status bar ── */}
      <div className="absolute inset-x-5 top-4 z-20 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
          Arquitectura digital
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] text-[color:var(--accent-cyan)]">
          <motion.span
            className="block h-1.5 w-1.5 rounded-full bg-[color:var(--accent-cyan)]"
            animate={rm ? {} : { opacity: [1, 0.2, 1], scale: [1, 1.45, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          sistema vivo
        </span>
      </div>

      {/* ── Hub ── */}
      <motion.div
        className="absolute z-20 flex items-center justify-center rounded-xl text-center"
        style={{
          left: pct(HUB.cx, VW),
          top:  pct(HUB.cy, VH),
          transform: "translate(-50%,-50%)",
          width: "clamp(100px, 22%, 128px)",
          border: "1px solid rgba(195,147,86,0.5)",
          background:
            "linear-gradient(135deg, rgba(22,30,46,0.98) 0%, rgba(10,14,24,1) 100%)",
          boxShadow:
            "0 0 0 1px rgba(195,147,86,0.08), inset 0 1px 0 rgba(195,147,86,0.1), 0 24px 72px rgba(0,0,0,0.65)",
        }}
        initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
        animate={
          rm
            ? { opacity: 1, scale: 1, filter: "blur(0px)" }
            : {
                opacity: 1,
                scale: [1, 1.02, 1],
                filter: "blur(0px)",
                boxShadow: [
                  "0 0 0 1px rgba(195,147,86,0.08), inset 0 1px 0 rgba(195,147,86,0.1), 0 24px 72px rgba(0,0,0,0.65)",
                  "0 0 0 1px rgba(82,208,220,0.22), inset 0 1px 0 rgba(82,208,220,0.12), 0 0 90px rgba(82,208,220,0.2)",
                  "0 0 0 1px rgba(195,147,86,0.08), inset 0 1px 0 rgba(195,147,86,0.1), 0 24px 72px rgba(0,0,0,0.65)",
                ],
              }
        }
        transition={
          rm
            ? { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }
            : {
                opacity:   { duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] },
                scale:     { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                filter:    { duration: 0.6, delay: 0.2 },
                boxShadow: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
              }
        }
      >
        <div className="px-3.5 py-4">
          <div className="mb-2 h-px w-full bg-[linear-gradient(90deg,transparent,rgba(195,147,86,0.55),transparent)]" />
          <p className="text-[14px] font-semibold text-[color:var(--foreground)]">{HUB.label}</p>
          <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-widest text-[color:var(--muted)]">
            {HUB.sub}
          </p>
        </div>
      </motion.div>

      {/* ── Satellite nodes ── */}
      {NODES.map((node, i) => {
        const Icon = node.icon;
        const isCyan = node.tone === "cyan";
        const accentRgb = isCyan ? "82,208,220" : "195,147,86";

        return (
          <motion.div
            key={node.id}
            className={`absolute z-20 flex-col rounded-lg ${
              node.mobileHide ? "hidden sm:flex" : "flex"
            }`}
            style={{
              left: pct(node.cx, VW),
              top:  pct(node.cy, VH),
              transform: "translate(-50%,-50%)",
              width: "clamp(82px, 17.5%, 98px)",
              border: `1px solid rgba(${accentRgb},0.2)`,
              background:
                "linear-gradient(145deg, rgba(18,26,42,0.97), rgba(8,12,22,0.99))",
              boxShadow: `0 6px 28px rgba(0,0,0,0.52), inset 0 1px 0 rgba(${accentRgb},0.06)`,
            }}
            initial={{ opacity: 0, scale: 0.78, filter: "blur(8px)" }}
            animate={
              rm
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 1, scale: 1, y: [0, -4, 0], filter: "blur(0px)" }
            }
            whileHover={
              rm
                ? undefined
                : {
                    scale: 1.1,
                    y: -7,
                    border: `1px solid rgba(${accentRgb},0.6)`,
                    boxShadow: `0 16px 48px rgba(${accentRgb},0.18)`,
                    transition: { type: "spring", stiffness: 300, damping: 22 },
                  }
            }
            transition={
              rm
                ? { duration: 0.5, delay: 0.4 + i * 0.07, ease: [0.22, 1, 0.36, 1] }
                : {
                    opacity: { duration: 0.55, delay: 0.5 + i * 0.09, ease: [0.22, 1, 0.36, 1] },
                    scale:   { duration: 0.55, delay: 0.5 + i * 0.09, ease: [0.22, 1, 0.36, 1] },
                    filter:  { duration: 0.55, delay: 0.5 + i * 0.09 },
                    y: {
                      duration: 4 + i * 0.32,
                      repeat:   Infinity,
                      ease:     "easeInOut",
                      delay:    0.5 + i * 0.38,
                    },
                  }
            }
          >
            <div className="min-w-0 p-2.5">
              {/* Icon badge */}
              <div
                className="mb-2 flex h-6 w-6 items-center justify-center rounded-md"
                style={{
                  background: `rgba(${accentRgb},0.1)`,
                  border: `1px solid rgba(${accentRgb},0.2)`,
                }}
              >
                <Icon
                  className="h-3.5 w-3.5"
                  style={{ color: `rgba(${accentRgb},0.9)` }}
                  aria-hidden="true"
                />
              </div>

              <p className="truncate text-[10.5px] font-semibold leading-tight text-[color:var(--foreground)]">
                {node.label}
              </p>
              <p
                className="mt-0.5 truncate font-mono text-[8px] leading-snug"
                style={{ color: `rgba(${accentRgb},0.55)` }}
              >
                {node.sub}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
