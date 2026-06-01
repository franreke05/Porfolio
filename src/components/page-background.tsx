"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const CIRCUIT_LINES = [
  "M 78 180 H 280 V 246 H 440",
  "M 980 112 H 1184 V 208 H 1346",
  "M 160 668 H 372 V 590 H 524",
  "M 866 728 H 1084 V 608 H 1278",
  "M 656 120 V 284 H 824 V 394",
  "M 468 766 V 626 H 646 V 514",
  "M 1118 366 H 964 V 456 H 760",
  "M 240 382 H 424 V 462 H 612",
] as const;

const CIRCUIT_NODES = [
  { cx: 78, cy: 180, r: 3, tone: "cyan" },
  { cx: 280, cy: 246, r: 2.5, tone: "gold" },
  { cx: 440, cy: 246, r: 3.5, tone: "cyan" },
  { cx: 980, cy: 112, r: 3, tone: "gold" },
  { cx: 1184, cy: 208, r: 2.5, tone: "cyan" },
  { cx: 1346, cy: 208, r: 3.5, tone: "gold" },
  { cx: 160, cy: 668, r: 3, tone: "gold" },
  { cx: 524, cy: 590, r: 3, tone: "cyan" },
  { cx: 866, cy: 728, r: 3.5, tone: "cyan" },
  { cx: 1278, cy: 608, r: 3, tone: "gold" },
  { cx: 656, cy: 284, r: 2.5, tone: "cyan" },
  { cx: 824, cy: 394, r: 3, tone: "gold" },
] as const;

const DATA_PACKETS = [
  { path: "M 78 180 H 280 V 246 H 440", delay: 0, duration: 8 },
  { path: "M 980 112 H 1184 V 208 H 1346", delay: 2.4, duration: 9 },
  { path: "M 160 668 H 372 V 590 H 524", delay: 4.3, duration: 10 },
  { path: "M 866 728 H 1084 V 608 H 1278", delay: 1.2, duration: 9.5 },
] as const;

const FLOATING_PARTICLES = [
  { left: "9%", top: "18%", size: 3, tone: "cyan", delay: 0 },
  { left: "24%", top: "72%", size: 2, tone: "gold", delay: 1.2 },
  { left: "42%", top: "27%", size: 2, tone: "cyan", delay: 2.1 },
  { left: "58%", top: "78%", size: 3, tone: "gold", delay: 0.8 },
  { left: "74%", top: "22%", size: 2, tone: "cyan", delay: 2.8 },
  { left: "88%", top: "62%", size: 3, tone: "cyan", delay: 1.6 },
] as const;

/**
 * Fixed atmospheric layer behind all page content.
 *
 * Layers (bottom to top):
 *   1. Solid base colour  (#070a10)
 *   2. SVG grain texture  (feTurbulence fractalNoise)
 *   3. Dot grid           (28-px period radial-gradient)
 *   4. Circuit SVG        (nodes, traces and slow data packets)
 *   5. Gradient orbs      (CSS keyframe drift + scroll parallax via useTransform)
 *   6. Scanlines          (4-px repeating bands)
 *   7. Radial vignette    (edge-darkening to keep focus on content)
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
      {/* Grain texture */}
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

      <div className="page-bg-depth" />
      <div className="page-bg-circuit-grid" />
      <div className="page-bg-dots" />

      <svg
        className="page-bg-circuits"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="bg-circuit-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(82,208,220,0.42)" />
            <stop offset="58%" stopColor="rgba(195,147,86,0.22)" />
            <stop offset="100%" stopColor="rgba(82,208,220,0.08)" />
          </linearGradient>
          <filter id="bg-circuit-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {CIRCUIT_LINES.map((d, index) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="url(#bg-circuit-line)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={
              rm
                ? { opacity: 0.18 }
                : { opacity: [0.11, 0.24, 0.13], pathLength: [0.48, 1, 0.58] }
            }
            transition={{
              duration: 10 + index * 0.7,
              delay: index * 0.38,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {CIRCUIT_NODES.map((node, index) => (
          <motion.circle
            key={`${node.cx}-${node.cy}`}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill={node.tone === "cyan" ? "rgba(82,208,220,0.78)" : "rgba(195,147,86,0.72)"}
            filter="url(#bg-circuit-glow)"
            initial={false}
            animate={rm ? { opacity: 0.34 } : { opacity: [0.2, 0.82, 0.3], scale: [1, 1.35, 1] }}
            transition={{
              duration: 4.6 + index * 0.18,
              delay: index * 0.24,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {!rm &&
          DATA_PACKETS.map((packet, index) => (
            <motion.circle
              key={`${packet.path}-${index}`}
              r="2.6"
              fill={index % 2 === 0 ? "rgba(82,208,220,0.98)" : "rgba(195,147,86,0.92)"}
              filter="url(#bg-circuit-glow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0] }}
              transition={{
                duration: packet.duration,
                delay: packet.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <animateMotion dur={`${packet.duration}s`} begin={`${packet.delay}s`} repeatCount="indefinite" path={packet.path} />
            </motion.circle>
          ))}
      </svg>

      <div className="page-bg-diagonal-circuits" />

      {!rm &&
        FLOATING_PARTICLES.map((particle) => (
          <motion.span
            key={`${particle.left}-${particle.top}`}
            className={`page-bg-particle ${particle.tone === "cyan" ? "page-bg-particle-cyan" : "page-bg-particle-gold"}`}
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            animate={{ y: [0, -18, 0], x: [0, 8, -4, 0], opacity: [0.18, 0.72, 0.18] }}
            transition={{
              duration: 9 + particle.delay,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* Orb 1, gold top-left */}
      <motion.div className="page-bg-orb-anchor" style={{ left: "-14%", top: "-10%", y: y1 }}>
        <div className="page-bg-orb orb-gold-hero" style={{ width: 900, height: 900 }} />
      </motion.div>

      {/* Orb 2, cyan top-right */}
      <motion.div className="page-bg-orb-anchor" style={{ right: "-12%", top: "4%", y: y2 }}>
        <div className="page-bg-orb orb-cyan-hero" style={{ width: 760, height: 760 }} />
      </motion.div>

      {/* Orb 3, gold mid-left */}
      <motion.div className="page-bg-orb-anchor" style={{ left: "-16%", top: "42%", y: y3 }}>
        <div className="page-bg-orb orb-gold-mid" style={{ width: 640, height: 640 }} />
      </motion.div>

      {/* Orb 4, cyan lower-right */}
      <motion.div className="page-bg-orb-anchor" style={{ right: "-10%", top: "70%", y: y4 }}>
        <div className="page-bg-orb orb-cyan-low" style={{ width: 580, height: 580 }} />
      </motion.div>

      <div className="page-bg-scanlines" />
      <div className="page-bg-vignette" />
    </div>
  );
}
