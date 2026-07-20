"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DashboardMockup, MobileMockup } from "@/components/case-study-template";

type ComicCoverMockupType = "mobile" | "dashboard" | "browser" | "subscription";

type ComicCoverProps = {
  mode: "gallery" | "header" | "mini";
  issueNumber: number;
  title: string;
  tagline: string;
  techStack: string;
  statusWord: string;
  statusAccent: "live" | "progress";
  mockupType: ComicCoverMockupType;
  className?: string;
};

// Deterministic "barcode" bar widths derived from the title's char codes —
// stable across server/client render, no Math.random / no image asset.
function barcodeWidths(seed: string, count: number): number[] {
  const widths: number[] = [];
  for (let i = 0; i < count; i++) {
    widths.push(1 + ((seed.charCodeAt(i % seed.length) + i * 7) % 3));
  }
  return widths;
}

function Barcode({ seed }: { seed: string }) {
  const widths = barcodeWidths(seed, 22);
  const bars = widths.reduce<{ x: number; rects: ReactNode[] }>(
    (acc, w, i) => {
      acc.rects.push(<rect key={i} x={acc.x} y={0} width={w} height={22} fill="var(--foreground)" />);
      acc.x += w + 2;
      return acc;
    },
    { x: 0, rects: [] },
  );
  return (
    <svg viewBox={`0 0 ${bars.x} 22`} className="h-5 w-full" preserveAspectRatio="none" aria-hidden="true">
      {bars.rects}
    </svg>
  );
}

function Starburst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 0 L61 32 L92 20 L70 46 L100 50 L70 54 L92 80 L61 68 L50 100 L39 68 L8 80 L30 54 L0 50 L30 46 L8 20 L39 32 Z"
        fill="var(--primary)"
        stroke="var(--foreground)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroArt({ mockupType }: { mockupType: ComicCoverMockupType }) {
  return (
    <div className="relative flex-1 overflow-hidden bg-[color:var(--surface-elevated)]">
      <div className="comic-halftone absolute inset-0" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-1/2 w-[140%] -translate-x-1/2 -translate-y-1/2 rotate-[-7deg] scale-110 [filter:grayscale(1)_contrast(1.15)]"
        aria-hidden="true"
      >
        {mockupType === "dashboard" ? <DashboardMockup /> : <MobileMockup />}
      </div>
      {/* Duotone recolor — grayscale mockup tinted with the site's ink/primary pair */}
      <div
        className="absolute inset-0 bg-[linear-gradient(155deg,var(--foreground),var(--primary))] [mix-blend-mode:color]"
        aria-hidden="true"
      />
    </div>
  );
}

const sizing = {
  gallery: {
    wrap:   "max-w-[300px]",
    title:  "text-2xl sm:text-3xl",
    border: "border-[3px]",
  },
  header: {
    wrap:   "max-w-[340px] sm:max-w-[400px]",
    title:  "text-3xl sm:text-4xl",
    border: "border-[3px] sm:border-4",
  },
} as const;

/**
 * Literal Marvel-style comic-book cover — typography and generated SVG only,
 * no illustration/photography, matching the site's "covers only" comic
 * scope: masthead, issue number, hero art (a duotone-treated fragment of the
 * project's real UI mockup), a "price tag" repurposed as the tech stack, a
 * generated barcode, and an indicia credits strip. Used in two places only:
 * the /proyectos gallery and atop each case-study page (`mode` controls size).
 */
export function ComicCover({
  mode,
  issueNumber,
  title,
  tagline,
  techStack,
  statusWord,
  statusAccent,
  mockupType,
  className = "",
}: ComicCoverProps) {
  const reduceMotion = useReducedMotion();
  const issue = String(issueNumber).padStart(2, "0");

  // Compact variant for dense previews (e.g. 3 covers fanned in a homepage
  // teaser) — the full gallery/header layout below assumes ≥250px of width
  // for its text-2xl+ masthead and tagline; forced into a much smaller box
  // it clips mid-word instead of scaling down. This drops the tagline and
  // price-tag/stack chip (the two worst offenders) and shrinks everything
  // else, so it stays legible at ~100–150px instead of just cropping.
  if (mode === "mini") {
    return (
      <div className={`mx-auto w-full ${className}`}>
        <div className="flex aspect-[2/3] w-full flex-col overflow-hidden border-2 border-[color:var(--foreground)] bg-[color:var(--surface)]">
          <div className="flex shrink-0 items-center justify-between gap-1 border-b-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-1.5 py-1">
            <span className="font-mono text-[7px] font-bold text-[color:var(--foreground)]">Nº{issue}</span>
            <span
              className={`comic-action-word text-[6px] ${statusAccent === "live" ? "comic-status-live" : "comic-status-progress"}`}
            >
              {statusWord}
            </span>
          </div>
          <p className="line-clamp-2 shrink-0 px-1.5 py-1.5 font-display text-[11px] font-bold italic uppercase leading-[1.1] text-[color:var(--foreground)]">
            {title}
          </p>
          <HeroArt mockupType={mockupType} />
          <div className="relative shrink-0 border-t-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-1.5 py-1.5">
            <motion.div
              className="pointer-events-none absolute -top-5 right-1 h-7 w-7"
              initial={reduceMotion ? undefined : { scale: 0, rotate: -25, opacity: 0 }}
              whileInView={{ scale: 1, rotate: -12, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <Starburst className="h-full w-full" />
            </motion.div>
            <Barcode seed={title} />
          </div>
        </div>
      </div>
    );
  }

  const s = sizing[mode];

  return (
    <div className={`mx-auto w-full ${s.wrap} ${className}`}>
      <div className={`flex aspect-[2/3] w-full flex-col overflow-hidden ${s.border} border-[color:var(--foreground)] bg-[color:var(--surface)]`}>
        {/* Masthead */}
        <div className={`relative shrink-0 border-b-[3px] border-[color:var(--foreground)] bg-[color:var(--background)] px-3 pb-2 pt-3 sm:px-4`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-7 w-9 shrink-0 flex-col items-center justify-center border-2 border-[color:var(--foreground)] font-mono text-[9px] font-bold leading-[1.1]">
              <span>Nº</span>
              <span>{issue}</span>
            </div>
            <span
              className={`comic-action-word text-[10px] ${statusAccent === "live" ? "comic-status-live" : "comic-status-progress"}`}
            >
              {statusWord}
            </span>
          </div>
          <motion.h3
            className={`mt-2 overflow-hidden font-display font-bold italic uppercase leading-[0.92] tracking-tight text-[color:var(--foreground)] ${s.title}`}
            initial={reduceMotion ? undefined : { clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            {title}
          </motion.h3>
        </div>

        {/* Hero art */}
        <HeroArt mockupType={mockupType} />

        {/* Tagline burst + price-tag-as-stack */}
        <div className="relative shrink-0 px-3 pb-2 pt-3 sm:px-4">
          <motion.div
            className="pointer-events-none absolute -top-9 right-2 h-16 w-16 sm:-top-11 sm:right-3 sm:h-20 sm:w-20"
            initial={reduceMotion ? undefined : { scale: 0, rotate: -25, opacity: 0 }}
            whileInView={{ scale: 1, rotate: -12, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: reduceMotion ? 0 : 0.15 }}
          >
            <Starburst className="h-full w-full" />
          </motion.div>
          <p className="text-pretty pr-14 text-xs font-bold italic leading-snug text-[color:var(--foreground)] sm:text-sm">
            {tagline}
          </p>
          <div className="mt-2 inline-flex items-center border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-[color:var(--on-primary)]">
            {techStack}
          </div>
        </div>

        {/* Indicia bar */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t-[3px] border-[color:var(--foreground)] bg-[color:var(--background)] px-3 py-2 sm:px-4">
          <p className="min-w-0 truncate font-mono text-[9px] uppercase tracking-wide text-[color:var(--muted)]">
            Historia y código: F. Requena · 2026
          </p>
          <div className="w-16 shrink-0 sm:w-20">
            <Barcode seed={title} />
          </div>
        </div>
      </div>
    </div>
  );
}
