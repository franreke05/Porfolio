"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import type { ReactNode } from "react";

type ComicCoverProps = {
  mode: "gallery" | "header" | "mini";
  issueNumber: number;
  title: string;
  tagline: string;
  techStack: string;
  statusWord: string;
  statusAccent: "live" | "progress";
  coverSrc: string;
  coverAlt: string;
  /** CSS object-position for the cover art — only needed when a specific
      commissioned illustration's aspect ratio doesn't quite match the
      2:3 card and the default center crop clips something worth keeping. */
  coverPosition?: string;
  /** "cover" (default) fills the card edge-to-edge, cropping overflow — the
      FlashFix-style full-bleed poster look. "contain" shows the whole
      illustration with no cropping at all, for art whose aspect ratio is
      far enough from 2:3 that any crop would cut something worth keeping
      (e.g. full-width lettering) — the letterboxed gap is filled with a
      dark backdrop that matches the site's own ink tone, not empty space. */
  coverFit?: "cover" | "contain";
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

const sizing = {
  gallery: { wrap: "max-w-[300px]", border: "border-[3px]" },
  header:  { wrap: "max-w-[340px] sm:max-w-[400px]", border: "border-[3px] sm:border-4" },
} as const;

/**
 * Literal Marvel-style comic-book cover — full-bleed, commissioned poster
 * art (one illustrated "story" per project, referencing that project's real
 * logo/branding) with Nº/status overlaid at the top and title/tagline/tech
 * stack/barcode overlaid at the bottom. Used in two places only: the
 * /proyectos gallery and atop each case-study page (`mode` controls size).
 */
export function ComicCover({
  mode,
  issueNumber,
  title,
  tagline,
  techStack,
  statusWord,
  statusAccent,
  coverSrc,
  coverAlt,
  coverPosition = "center",
  coverFit = "cover",
  className = "",
}: ComicCoverProps) {
  const reduceMotion = useReducedMotion();
  const issue = String(issueNumber).padStart(2, "0");
  const isMini = mode === "mini";
  const s = isMini ? undefined : sizing[mode];

  return (
    <div className={`mx-auto w-full ${s?.wrap ?? ""} ${className}`}>
      <div
        className={`group relative flex aspect-[2/3] w-full flex-col overflow-hidden border-[color:var(--foreground)] bg-[color:var(--surface)] ${
          isMini ? "border-2" : s?.border
        }`}
      >
        <motion.div
          className="absolute inset-0 z-10"
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 12 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          {coverFit === "contain" && (
            <div className="absolute inset-0 bg-[color:var(--foreground)]" aria-hidden="true" />
          )}
          <Image
            src={coverSrc}
            alt={coverAlt}
            fill
            priority={mode === "header"}
            sizes={isMini ? "128px" : "(min-width: 1280px) 400px, (min-width: 640px) 45vw, 75vw"}
            className={coverFit === "contain" ? "object-contain" : "object-cover"}
            style={{ objectPosition: coverPosition }}
          />
          {/* Scrim so the top/bottom overlay text stays legible over any cover art */}
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,12,0.32)_0%,transparent_18%,transparent_72%,rgba(20,16,12,0.4)_100%)]"
            aria-hidden="true"
          />

          {/* Top bar — issue number + status */}
          <div className={`absolute left-0 right-0 top-0 flex items-start justify-between ${isMini ? "p-1" : "p-3 sm:p-4"}`}>
            <div
              className={`flex flex-col items-center justify-center border-2 border-[color:var(--foreground)] bg-[color:var(--background)] font-mono font-bold leading-[1.1] text-[color:var(--foreground)] ${
                isMini ? "h-4 w-5 text-[5px]" : "h-7 w-9 text-[9px]"
              }`}
            >
              <span>Nº</span>
              <span>{issue}</span>
            </div>
            <span
              className={`comic-action-word border-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-1.5 py-0.5 ${
                isMini ? "text-[6px]" : "text-[10px]"
              } ${statusAccent === "live" ? "comic-status-live" : "comic-status-progress"}`}
            >
              {statusWord}
            </span>
          </div>

          {/* Bottom bar — title, tagline, tech stack, barcode */}
          <div className={`absolute bottom-0 left-0 right-0 bg-[color:var(--background)]/95 ${isMini ? "px-1 py-1" : "px-3 py-2 sm:px-4"}`}>
            <p
              className={`comic-glitch-title line-clamp-1 font-display font-black italic uppercase leading-[0.95] text-[color:var(--foreground)] ${
                isMini ? "text-[9px]" : "text-lg sm:text-xl"
              }`}
            >
              <span className="comic-glitch-base relative">{title}</span>
              <span className="comic-glitch-layer comic-glitch-layer-primary" aria-hidden="true">{title}</span>
              <span className="comic-glitch-layer comic-glitch-layer-ink" aria-hidden="true">{title}</span>
            </p>
            {!isMini && (
              <p className="mt-1 text-xs font-bold italic leading-snug text-[color:var(--foreground)] sm:text-sm">
                {tagline}
              </p>
            )}
            <div className={`flex items-center justify-between gap-2 ${isMini ? "" : "mt-1.5"}`}>
              <span
                className={`border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] font-mono font-bold uppercase tracking-wide text-[color:var(--on-primary)] ${
                  isMini ? "px-1 py-0.5 text-[5px]" : "px-2 py-1 text-[9px] sm:text-[10px]"
                }`}
              >
                {techStack}
              </span>
              <div className={isMini ? "w-8" : "w-16 sm:w-20"}>
                <Barcode seed={title} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
