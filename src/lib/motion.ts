/**
 * Animation system — single source of truth.
 * All Motion variants, easings and durations come from here.
 * Components import only what they need.
 */

// ── Easings ────────────────────────────────────────────────
export const ease = {
  /** Sharp acceleration → buttery deceleration. Hero & key reveals. */
  premium: [0.22, 1, 0.36, 1] as const,
  /** Gentler start. Cards, stagger children. */
  soft:    [0.16, 1, 0.3, 1] as const,
  /** Standard out. Hover states, fast transitions. */
  out:     [0, 0, 0.2, 1] as const,
} as const;

// ── Durations (seconds) ────────────────────────────────────
export const dur = {
  fast:   0.22,
  normal: 0.45,
  slow:   0.72,
} as const;

// ── Viewport ──────────────────────────────────────────────
/** Pass to `viewport` prop — fires once, 15% visible. */
export const viewport = {
  once:   true,
  amount: 0.15,
} as const;

// ── Transition presets ────────────────────────────────────
export const t = {
  fast:   { duration: dur.fast,   ease: ease.premium } as const,
  normal: { duration: dur.normal, ease: ease.premium } as const,
  slow:   { duration: dur.slow,   ease: ease.soft    } as const,
  spring: { type: "spring", stiffness: 200, damping: 26, mass: 1 } as const,
} as const;

// Tech background presets stay local to the background component so existing
// page and card animations keep their current timing.
export const backgroundMotion = {
  trace: {
    duration: 10,
    repeat: Infinity,
    ease: "easeInOut",
  },
  node: {
    duration: 4.4,
    repeat: Infinity,
    ease: "easeInOut",
  },
  particle: {
    duration: 8.6,
    repeat: Infinity,
    ease: "easeInOut",
  },
} as const;

// ── Scroll-enter variants ─────────────────────────────────
// Use with initial="hidden" whileInView="visible".
// Children with the same variant key inherit parent stagger automatically.

export const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0  },
} as const;

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
} as const;

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1    },
} as const;

/** Use for hero headline only — above the fold, needs blur to feel premium. */
export const blurReveal = {
  hidden:  { opacity: 0, y: 16, filter: "blur(8px)"  },
  visible: { opacity: 1, y: 0,  filter: "blur(0px)"  },
} as const;

export const chipReveal = {
  hidden:  { opacity: 0, scale: 0.86 },
  visible: { opacity: 1, scale: 1    },
} as const;

// ── Stagger container ─────────────────────────────────────
/** Wrap a list in this; each child gets stagger automatically. */
export const staggerContainer = (stagger = 0.07, delay = 0.05) => ({
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren:   delay,
    },
  },
});

/** Generic stagger item — pair with staggerContainer. */
export const staggerItem = fadeUp;

// ── Hover variants ────────────────────────────────────────
export const cardHover = {
  rest:  { y: 0 },
  hover: { y: -4 },
} as const;

// ── Spring presets ────────────────────────────────────────
// Pointer-driven physics (magnetic follow, 3D tilt) — centralized so the
// whole site's "snap back" feel is tuned in one place instead of scattered
// ad hoc {stiffness, damping} literals per component.
export const spring = {
  /** MagneticButton x/y follow. */
  magnetic: { type: "spring", stiffness: 200, damping: 20 } as const,
  /** FlipCard 3D rotation. */
  flip: { type: "spring", stiffness: 260, damping: 30, mass: 1 } as const,
  /** ProjectCard pointer-tilt (rotateX/rotateY). */
  tilt: { type: "spring", stiffness: 170, damping: 24 } as const,
} as const;
