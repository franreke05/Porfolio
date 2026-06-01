"use client";

import { ArrowUpRight, Calendar, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { PhoneMockup } from "@/components/phone-mockup";
import { MagneticButton } from "@/components/magnetic-button";
import { dur, ease } from "@/lib/motion";
import { siteProfile, trustSignals } from "@/lib/site-data";

const TITLE_LINES_DESKTOP = ["Apps mobile y sistemas digitales", "que ordenan tu negocio."];
const TITLE_LINES_MOBILE = ["Apps mobile", "y sistemas", "digitales", "que ordenan", "tu negocio."];

const SUBTITLE =
  "Construyo el sistema completo: app mobile con KMP, CRM a medida, web rápida y automatizaciones que eliminan el trabajo repetitivo. Todo publicado, todo mantenido.";

// Chip stagger container — propagates "visible" to all chip children
const chipContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0 } },
};
const chipItem = {
  hidden:  { opacity: 0, scale: 0.86 },
  visible: { opacity: 1, scale: 1    },
};

export function HeroSection() {
  const rm = useReducedMotion();
  const d  = (base: number) => (rm ? 0 : base);

  return (
    <section id="inicio" className="relative px-5 pb-20 pt-28 sm:px-6 lg:pt-32">
      {/* No section-specific overlay — TechBackground is the unified visual layer */}

      <div className="relative mx-auto grid w-full max-w-[calc(100vw-2.5rem)] gap-12 sm:max-w-6xl lg:grid-cols-[1.05fr_0.95fr] lg:items-center">

        {/* ── Left: copy ── */}
        <div className="min-w-0 max-w-full">

          {/* Location badge */}
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]/80 px-3 py-2 text-sm text-[color:var(--surface-foreground)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(dur.normal), ease: ease.premium, delay: d(0.06) }}
          >
            <Sparkles className="h-4 w-4 text-[color:var(--accent-cyan)]" aria-hidden="true" />
            {siteProfile.location} · Remoto
          </motion.div>

          {/* Title — line-by-line reveal */}
          <h1 className="max-w-full text-[2.35rem] font-semibold leading-[1.04] text-[color:var(--foreground)] sm:text-5xl sm:leading-[1.06] lg:text-[3.5rem]">
            {TITLE_LINES_MOBILE.map((line, i) => (
              <motion.span
                key={`mobile-${line}`}
                className="block sm:hidden"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: d(0.64),
                  ease: ease.premium,
                  delay: d(0.16 + i * 0.11),
                }}
              >
                {line}
              </motion.span>
            ))}
            {TITLE_LINES_DESKTOP.map((line, i) => (
              <motion.span
                key={`desktop-${line}`}
                className="hidden sm:block"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: d(0.64),
                  ease: ease.premium,
                  delay: d(0.16 + i * 0.11),
                }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 max-w-[20rem] text-pretty text-base leading-7 text-[color:var(--surface-foreground)] sm:max-w-2xl sm:text-lg sm:leading-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(dur.normal), ease: ease.premium, delay: d(0.37) }}
          >
            {SUBTITLE}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-8 flex max-w-[20rem] flex-col gap-3 sm:max-w-none sm:flex-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: d(dur.normal), ease: ease.premium, delay: d(0.48) }}
          >
            <MagneticButton href="#contacto">
              <Calendar className="h-4 w-4 transition-transform duration-200 group-hover/btn:-translate-y-px" aria-hidden="true" />
              Agendar llamada
            </MagneticButton>
            <MagneticButton href="#proyectos" variant="secondary">
              Ver proyectos
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-px group-hover/btn:-translate-y-px" aria-hidden="true" />
            </MagneticButton>
          </motion.div>

          {/* Trust chips — stagger container */}
          <motion.div
            className="mt-8 grid max-w-full grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:flex sm:flex-wrap"
            aria-label="Especialidades"
            variants={chipContainer}
            initial="hidden"
            animate={rm ? "visible" : "visible"}  // always runs (above fold)
            transition={{ delayChildren: d(0.58) }}
          >
            {trustSignals.map((signal) => (
              <motion.span
                key={signal}
                className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)]/60 px-3 py-1.5 font-mono text-[11px] leading-5 text-[color:var(--muted)] sm:w-auto sm:text-xs"
                variants={chipItem}
                transition={{ duration: d(dur.fast), ease: ease.soft }}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent-cyan)]" aria-hidden="true" />
                <span className="min-w-0 whitespace-normal break-words">{signal}</span>
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ── Right: phone mockup ── */}
        <motion.div
          className="min-w-0 max-w-full"
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          transition={{ duration: d(dur.slow), ease: ease.soft, delay: d(0.12) }}
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}
