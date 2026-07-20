"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { projects, stackGroups } from "@/lib/site-data";
import { PhoneShell } from "@/components/phone-shell";

/**
 * Fixed decorative phone that sits between TechBackground (z=-1) and page
 * content (z=auto).
 *
 * Entry: scale 0.8→1.0 and rotate -10°→0° over the first 30 % of document
 * scroll, using spring physics for buttery deceleration.
 *
 * Screen: 8 mini sections stack inside overflow:hidden screen div. Their
 * container div translates from 0 % → -87.5 % (= 7 out of 8 section heights)
 * as scrollYProgress goes 0 → 1, so every section is shown exactly once.
 */
export function PhoneBackground() {
  const compact = useCompactViewport();
  const reducedMotion = Boolean(useReducedMotion());

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 58,
    damping:   20,
    mass:      0.48,
  });

  /* ── Shell entry animation ────────────────────────────────────────── */
  const scale = useTransform(
    smooth,
    [0, 0.3],
    reducedMotion ? [1, 1] : [0.8, 1.0],
  );
  const rotate = useTransform(
    smooth,
    [0, 0.3],
    reducedMotion ? [0, 0] : [-10, 0],
  );
  const phoneOpacity = useTransform(
    smooth,
    [0, 0.08, 0.70, 1],
    reducedMotion
      ? [0.07, 0.07, 0.07, 0.07]
      : compact
        ? [0.03, 0.11, 0.15, 0.09]
        : [0.04, 0.15, 0.21, 0.12],
  );

  /* ── Screen effects ───────────────────────────────────────────────── */
  const brightness = useTransform(
    smooth,
    [0, 0.15, 0.45, 1],
    reducedMotion ? [1, 1, 1, 1] : [0.22, 0.58, 1.0, 1.0],
  );
  const screenFilter = useTransform(
    brightness,
    (v) => `brightness(${v}) saturate(${0.88 + v * 0.22})`,
  );

  /* ── Inner-content scroll sync ────────────────────────────────────── */
  // 8 sections × 100 cqh each → inner height = 800 cqh.
  // translateY(-87.5%) = -700 cqh = scroll through all 8 sections.
  const innerY = useTransform(
    smooth,
    [0, 1],
    reducedMotion ? ["0%", "0%"] : ["0%", "-87.5%"],
  );

  return (
    <div className="phone-bg-root" aria-hidden="true">
      <motion.div
        className="phone-bg-shell"
        style={{ scale, rotate, opacity: phoneOpacity }}
      >
        {/* ── SVG phone frame — shared with PhoneMockup ───────────── */}
        <PhoneShell className="phone-bg-frame-svg" />

        {/* ── Screen — clips inner content as it scrolls ─────────── */}
        <motion.div className="phone-bg-screen" style={{ filter: screenFilter }}>
          <motion.div className="phone-bg-inner" style={{ y: innerY }}>
            <MiniHero />
            <MiniSistema />
            <MiniServicios />
            <MiniArquitectura />
            <MiniProyectos />
            <MiniProceso />
            <MiniSobreMi />
            <MiniContacto />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Shared mini-section primitives
───────────────────────────────────────────── */

function PhBgLabel({ text, color = "#52d0dc" }: { text: string; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 9 }}>
      <div style={{ width: 12, height: 1, background: color, flexShrink: 0 }} />
      <span style={{
        fontFamily: "monospace", fontSize: 6.5, fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase", color,
      }}>
        {text}
      </span>
    </div>
  );
}

function Pill({ text, accent = "cyan" }: { text: string; accent?: "cyan" | "gold" }) {
  const rgb = accent === "cyan" ? "82,208,220" : "195,147,86";
  return (
    <span style={{
      fontFamily: "monospace", fontSize: 7, fontWeight: 600,
      padding: "2px 5px", borderRadius: 4,
      background: `rgba(${rgb},0.08)`,
      border:     `1px solid rgba(${rgb},0.22)`,
      color:       accent === "cyan" ? "#52d0dc" : "#c8985a",
    }}>
      {text}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Section 1 — Hero
───────────────────────────────────────────── */
function MiniHero() {
  return (
    <div className="phone-bg-section">
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: "linear-gradient(135deg,rgba(195,147,86,0.18),rgba(82,208,220,0.10))",
          border: "1.5px solid rgba(195,147,86,0.42)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#c8985a",
        }}>FR</div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 7 }}>
        <p style={{ fontSize: 10.5, fontWeight: 600, color: "#e8e1cf", margin: 0 }}>
          Francisco Requena
        </p>
        <p style={{ fontFamily: "monospace", fontSize: 7.5, color: "#7c8595", marginTop: 2 }}>
          Full-Stack Developer
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 9 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          background: "rgba(77,196,180,0.10)", border: "1px solid rgba(77,196,180,0.28)",
          borderRadius: 999, padding: "3px 7px",
          fontSize: 7.5, fontWeight: 600, color: "#4dc4b4",
        }}>
          <div style={{ width: 4.5, height: 4.5, borderRadius: "50%", background: "#4dc4b4" }} />
          Disponible
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginBottom: 8 }}>
        {[{ n: "5+", l: "Proyectos" }, { n: "3+", l: "Años" }, { n: "12+", l: "Techs" }].map(s => (
          <div key={s.l} style={{
            background: "rgba(12,21,32,0.90)", border: "1px solid rgba(28,42,60,0.8)",
            borderRadius: 9, padding: "5px 3px", textAlign: "center",
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#c8985a", margin: 0 }}>{s.n}</p>
            <p style={{ fontSize: 6.5, color: "#7c8595", marginTop: 1 }}>{s.l}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginBottom: 9 }}>
        {[
          { label: "Mobile", rgb: "82,208,220"  },
          { label: "CRM",    rgb: "195,147,86"  },
          { label: "Web",    rgb: "82,208,220"  },
        ].map(s => (
          <div key={s.label} style={{
            background: "rgba(12,21,32,0.90)", border: `1px solid rgba(${s.rgb},0.22)`,
            borderRadius: 9, padding: "6px 3px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: `rgba(${s.rgb},0.8)` }} />
            <span style={{ fontSize: 6.5, color: "#7c8595" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 7, lineHeight: 1.55, color: "#7c8595", textAlign: "center" }}>
        Apps mobile · CRMs · Webs
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section 2 — Sistema
───────────────────────────────────────────── */
function MiniSistema() {
  const blocks = [
    { tag: "Mobile KMP",  rgb: "82,208,220",  bar: "68%" },
    { tag: "CRM SQL",     rgb: "195,147,86",  bar: "82%" },
    { tag: "Web Next.js", rgb: "82,208,220",  bar: "74%" },
  ];
  return (
    <div className="phone-bg-section">
      <PhBgLabel text="Sistema" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
        {blocks.map(b => (
          <div key={b.tag} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(12,21,32,0.90)", border: `1px solid rgba(${b.rgb},0.20)`,
            borderRadius: 8, padding: "7px 9px",
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
              background: `rgba(${b.rgb},0.9)`,
            }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 8, fontWeight: 600, color: "#e8e1cf", margin: 0 }}>{b.tag}</p>
              <div style={{
                marginTop: 3, height: 2, borderRadius: 1,
                background: `rgba(${b.rgb},0.55)`, width: b.bar,
              }} />
            </div>
            <span style={{ fontSize: 7.5, color: "#4dc4b4" }}>✓</span>
          </div>
        ))}
      </div>

      <PhBgLabel text="Flujo de entrega" color="#7c8595" />
      <div style={{ display: "flex", gap: 3 }}>
        {["1", "2", "3", "4", "5"].map((n, i) => (
          <div key={n} style={{
            flex: 1, padding: "4px 0", textAlign: "center",
            background: "rgba(12,21,32,0.90)",
            border: `1px solid ${i === 0 ? "rgba(82,208,220,0.35)" : "rgba(28,42,60,0.8)"}`,
            borderRadius: 5, fontFamily: "monospace", fontSize: 7.5, fontWeight: 600,
            color: i === 0 ? "#52d0dc" : "#7c8595",
          }}>
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section 3 — Servicios
───────────────────────────────────────────── */
function MiniServicios() {
  const items = [
    { l: "Mobile KMP",  rgb: "82,208,220"  },
    { l: "CRM SQL",     rgb: "195,147,86"  },
    { l: "Web Next.js", rgb: "82,208,220"  },
    { l: "Soporte",     rgb: "77,196,180"  },
    { l: "Automac.",    rgb: "195,147,86"  },
    { l: "Analytics",   rgb: "82,208,220"  },
  ];
  return (
    <div className="phone-bg-section">
      <PhBgLabel text="Servicios" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
        {items.map(s => (
          <div key={s.l} style={{
            background: "rgba(12,21,32,0.90)", border: "1px solid rgba(28,42,60,0.8)",
            borderRadius: 8, padding: "8px 9px",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
              background: `rgba(${s.rgb},0.85)`,
            }} />
            <span style={{ fontSize: 7.5, color: "#b2ab9a" }}>{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section 4 — Arquitectura
───────────────────────────────────────────── */
function MiniArquitectura() {
  const layers = [
    { label: "UI · Next.js + Compose", rgb: "82,208,220",  col: "#52d0dc" },
    { label: "API · Ktor (Kotlin)",    rgb: "195,147,86",  col: "#c8985a" },
    { label: "Data · PostgreSQL",      rgb: "82,208,220",  col: "#52d0dc" },
    { label: "Infra · Vercel + VPS",   rgb: "195,147,86",  col: "#c8985a" },
  ];
  return (
    <div className="phone-bg-section">
      <PhBgLabel text="Arquitectura" />
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {layers.map((layer, i) => (
          <div key={layer.label}>
            <div style={{
              background: `rgba(${layer.rgb},0.06)`,
              border: `1px solid rgba(${layer.rgb},0.22)`,
              borderRadius: 7, padding: "7px 10px",
            }}>
              <span style={{ fontFamily: "monospace", fontSize: 7.5, color: layer.col }}>
                {layer.label}
              </span>
            </div>
            {i < layers.length - 1 && (
              <div style={{
                margin: "0 auto", width: 1, height: 5,
                background: `rgba(${layer.rgb},0.3)`,
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section 5 — Proyectos
───────────────────────────────────────────── */
function MiniProyectos() {
  const items = projects.slice(0, 5);

  function dotColor(i: number, visibility: string) {
    if (visibility === "anonymous") return "#7c8595";
    return i % 2 === 0 ? "#52d0dc" : "#c8985a";
  }

  return (
    <div className="phone-bg-section">
      <PhBgLabel text="Proyectos" />
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {items.map((p, i) => (
          <div key={p.id} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(12,21,32,0.90)", border: "1px solid rgba(28,42,60,0.8)",
            borderRadius: 7, padding: "7px 9px",
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
              background: dotColor(i, p.visibility),
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: 8, fontWeight: 600, color: "#e8e1cf", margin: 0,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {p.title}
              </p>
              <p style={{ fontSize: 6.5, color: "#7c8595", marginTop: 1 }}>
                {p.projectType.split(" ")[0]}
              </p>
            </div>
            <span style={{ fontSize: 8, color: "#4dc4b4" }}>✓</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section 6 — Proceso
───────────────────────────────────────────── */
function MiniProceso() {
  const steps = ["Problema", "Arquitectura", "Desarrollo", "Publicación", "Mejora"];
  const barWidths = ["82%", "74%", "68%", "55%", "42%"] as const;
  return (
    <div className="phone-bg-section">
      <PhBgLabel text="Proceso" />
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {steps.map((step, i) => (
          <div key={step} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 5, flexShrink: 0,
              background: "rgba(82,208,220,0.10)", border: "1px solid rgba(82,208,220,0.28)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "monospace", fontSize: 7, fontWeight: 700, color: "#52d0dc",
            }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, paddingTop: 1 }}>
              <p style={{ fontSize: 8, fontWeight: 600, color: "#e8e1cf", margin: 0 }}>{step}</p>
              <div style={{
                marginTop: 4, height: 2, borderRadius: 1, width: barWidths[i],
                background: i < 3 ? "rgba(82,208,220,0.50)" : "rgba(82,208,220,0.18)",
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section 7 — Sobre mí
───────────────────────────────────────────── */
function MiniSobreMi() {
  const chips = stackGroups.flatMap(g => g.items.slice(0, 2)).slice(0, 12);
  return (
    <div className="phone-bg-section">
      <PhBgLabel text="Sobre mí" />
      <p style={{ fontSize: 7.5, lineHeight: 1.6, color: "#b2ab9a", marginBottom: 10 }}>
        Freelance · Almería. Kotlin/KMP, CRMs PostgreSQL y webs Next.js.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {chips.map((chip, i) => (
          <Pill key={chip} text={chip} accent={i % 2 === 0 ? "cyan" : "gold"} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section 8 — Contacto
───────────────────────────────────────────── */
function MiniContacto() {
  const links = [
    { label: "Email",    rgb: "82,208,220"  },
    { label: "WhatsApp", rgb: "77,196,180"  },
    { label: "LinkedIn", rgb: "195,147,86"  },
  ];
  return (
    <div className="phone-bg-section">
      <PhBgLabel text="Contacto" />
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <div style={{
          width: 32, height: 32, margin: "0 auto 7px",
          borderRadius: 10,
          background: "rgba(195,147,86,0.10)", border: "1px solid rgba(195,147,86,0.30)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(195,147,86,0.6)" }} />
        </div>
        <p style={{ fontSize: 10, fontWeight: 600, color: "#e8e1cf", margin: 0 }}>
          Hablamos
        </p>
        <p style={{ fontSize: 7.5, color: "#7c8595", marginTop: 3, lineHeight: 1.5 }}>
          Cuéntame tu proyecto.
          <br />
          Propongo un camino claro.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {links.map(link => (
          <div key={link.label} style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(12,21,32,0.90)", border: "1px solid rgba(28,42,60,0.8)",
            borderRadius: 9, padding: "7px 10px",
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
              background: `rgba(${link.rgb},0.85)`,
            }} />
            <span style={{ fontSize: 9, fontWeight: 500, color: "#e8e1cf" }}>{link.label}</span>
            <span style={{ marginLeft: "auto", fontSize: 8, color: "#7c8595" }}>&#8594;</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Viewport hook
───────────────────────────────────────────── */
function useCompactViewport() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return compact;
}
