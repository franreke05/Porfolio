"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Fixed atmospheric layer behind all page content.
 *
 * Layers (bottom → top):
 *   1. Solid base colour  (#070a10)
 *   2. SVG grain texture  (feTurbulence fractalNoise — same technique as fffuel.co/nnnoise)
 *   3. Dot grid           (28-px period radial-gradient)
 *   4. 4 gradient orbs    (CSS keyframe drift + scroll parallax via useTransform)
 *   5. Scanlines          (4-px repeating bands, 1.5 % opacity — CRT texture)
 *   6. Radial vignette    (edge-darkening to keep focus on content)
 */
export function PageBackground() {
  const { scrollYProgress } = useScroll();
  const rm = useReducedMotion();

  const y1 = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [0,  300]);
  const y3 = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [0, -155]);
  const y4 = useTransform(scrollYProgress, [0, 1], rm ? [0, 0] : [0,  220]);

  return (
    <div className="page-bg-root" aria-hidden="true">

      {/* ── 1. SVG grain texture (feTurbulence fractalNoise) ── */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.042]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── 2. Dot grid ── */}
      <div className="page-bg-dots" />

      {/* ── 3. Orb 1 — gold, top-left ── */}
      <motion.div className="page-bg-orb-anchor" style={{ left: "-14%", top: "-10%", y: y1 }}>
        <div className="page-bg-orb orb-gold-hero" style={{ width: 900, height: 900 }} />
      </motion.div>

      {/* ── 4. Orb 2 — cyan, top-right ── */}
      <motion.div className="page-bg-orb-anchor" style={{ right: "-12%", top: "4%", y: y2 }}>
        <div className="page-bg-orb orb-cyan-hero" style={{ width: 760, height: 760 }} />
      </motion.div>

      {/* ── 5. Orb 3 — gold warm, left-mid ── */}
      <motion.div className="page-bg-orb-anchor" style={{ left: "-16%", top: "42%", y: y3 }}>
        <div className="page-bg-orb orb-gold-mid" style={{ width: 640, height: 640 }} />
      </motion.div>

      {/* ── 6. Orb 4 — cyan cool, right-low ── */}
      <motion.div className="page-bg-orb-anchor" style={{ right: "-10%", top: "70%", y: y4 }}>
        <div className="page-bg-orb orb-cyan-low" style={{ width: 580, height: 580 }} />
      </motion.div>

      {/* ── 7. Scanlines ── */}
      <div className="page-bg-scanlines" />

      {/* ── 8. Radial vignette ── */}
      <div className="page-bg-vignette" />
    </div>
  );
}
