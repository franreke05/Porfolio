"use client";

import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Sparkles } from "lucide-react";
import {
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { PhoneShell } from "@/components/phone-shell";
import { spring } from "@/lib/motion";

type PhoneDepthStageProps = {
  children: ReactNode;
  interactive: boolean;
  isInView: boolean;
  loopProgress?: MotionValue<number>;
  reducedMotion: boolean | null;
  scrollProgress?: MotionValue<number>;
  showBadge: boolean;
};

const depthSpring = {
  stiffness: 190,
  damping: 26,
  mass: 0.6,
};

// Resting chassis tilt per homepage act (inicio → proyectos → servicios →
// contacto), interpolated smoothly across the 4 scroll-linked screens. Kept
// small because the whole phone — chassis and live screen alike — rotates
// together as one coherent 3D object: at this magnitude (max ~9° combined
// with pointer hover) real screen text stays crisp while the object still
// reads as dimensional.
const REST_ROTATE_X = [1.5, 3, -2, 0];
const REST_ROTATE_Y = [-2, -7, 6, 0];
const REST_ROTATE_ZERO = [0, 0, 0, 0];
const stops = [0, 1 / 3, 2 / 3, 1];

function clampPointer(value: number) {
  return Math.min(1, Math.max(-1, value));
}

/**
 * Three-dimensional hardware scene. Chassis and live screen content rotate
 * together as one coherent 3D object under a single rotator element: rear
 * echo, front bezel, accent rail, and the live screen are all children of
 * that rotator, each offset along Z to create real depth stacking instead
 * of a flat 2D screen glued on top of a rotating shell. The badge is
 * deliberately its own independent 3D layer outside the rotator — it
 * shares the same rotateX/Y so it still visibly tilts with the phone, but
 * Chromium and Firefox disagree on paint order for elements Z-sorted
 * *within* a shared preserve-3d group (confirmed: Firefox let screen
 * content bleed through the badge when it lived inside the rotator).
 * Keeping it a sibling means normal DOM/z-index — which every engine
 * agrees on — decides it's always on top, regardless of 3D depth-sort
 * quirks.
 */
export function PhoneDepthStage({
  children,
  interactive,
  isInView,
  loopProgress,
  reducedMotion,
  scrollProgress,
  showBadge,
}: PhoneDepthStageProps) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, depthSpring);
  const smoothY = useSpring(pointerY, depthSpring);
  const pointerBoundsRef = useRef<DOMRect | null>(null);

  const rearX = useTransform(smoothX, [-1, 1], [-5, 5]);
  const rearY = useTransform(smoothY, [-1, 1], [-4, 4]);
  const rearRotateX = useTransform(smoothY, [-1, 1], [3, -3]);
  const rearRotateY = useTransform(smoothX, [-1, 1], [-4, 4]);

  // Scroll drives the chassis's resting pose per homepage act; pointer hover
  // (rearRotateX/Y above) layers a delta on top, so the phone keeps rotating
  // on scroll — including on touch, where pointer stays at 0 — while hover
  // still adds its own feel on desktop. `scrollProgress` is optional, so
  // fall back to a stable, unmoving motion value when it isn't provided.
  const fallbackProgress = useMotionValue(0);
  const applyScrollTilt = scrollProgress !== undefined && !reducedMotion;
  const rawScrollRotateX = useTransform(
    scrollProgress ?? fallbackProgress,
    stops,
    applyScrollTilt ? REST_ROTATE_X : REST_ROTATE_ZERO,
  );
  const rawScrollRotateY = useTransform(
    scrollProgress ?? fallbackProgress,
    stops,
    applyScrollTilt ? REST_ROTATE_Y : REST_ROTATE_ZERO,
  );
  const scrollRotateXSpring = useSpring(rawScrollRotateX, spring.scroll);
  const scrollRotateYSpring = useSpring(rawScrollRotateY, spring.scroll);

  // A tap anywhere on the chassis (not on real content links) spins the
  // whole phone 180° to its back, holds briefly, then spins back — a
  // one-off "flip" layered additively on top of the scroll/pointer tilt
  // above, the same way those two are combined with each other.
  const flipRotateY = useMotionValue(0);
  const isFlippingRef = useRef(false);

  const combinedRotateX = useTransform(() => scrollRotateXSpring.get() + rearRotateX.get());
  const combinedRotateY = useTransform(
    () => scrollRotateYSpring.get() + rearRotateY.get() + flipRotateY.get(),
  );
  const backRotateY = useTransform(() => combinedRotateY.get() + 180);

  const railX = useTransform(smoothX, [-1, 1], [-2.5, 2.5]);
  const railY = useTransform(smoothY, [-1, 1], [-2, 2]);
  const shadowX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const shadowY = useTransform(smoothY, [-1, 1], [4, 9]);
  const shadowScale = useTransform(smoothY, [-1, 1], [1.025, 0.98]);
  const bezelLightY = useTransform(smoothY, [-1, 1], [-5, 5]);

  // Glass glare — a soft diagonal sheen that slides across the screen glass
  // as the chassis tilts, tracking rotation faster than the object itself
  // (a fixed light source, not a decal glued to the glass). This is the
  // single biggest lever for reading as real glass instead of a flat-color
  // rectangle — without it no amount of frame shading sells the material.
  const glareX = useTransform(combinedRotateY, [-16, 16], [-38, 38]);
  const glareY = useTransform(combinedRotateX, [-6, 6], [-26, 26]);

  useEffect(() => {
    if (interactive && !reducedMotion) return;

    pointerBoundsRef.current = null;
    pointerX.set(0);
    pointerY.set(0);
    smoothX.jump(0);
    smoothY.jump(0);
  }, [interactive, pointerX, pointerY, reducedMotion, smoothX, smoothY]);

  const canUsePointer = interactive && !reducedMotion;

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canUsePointer || event.pointerType !== "mouse") return;
    pointerBoundsRef.current = event.currentTarget.getBoundingClientRect();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canUsePointer || event.pointerType !== "mouse") return;

    const bounds =
      pointerBoundsRef.current ?? event.currentTarget.getBoundingClientRect();
    const normalizedX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const normalizedY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;

    pointerX.set(clampPointer(normalizedX));
    pointerY.set(clampPointer(normalizedY));
  };

  const resetPointer = () => {
    pointerBoundsRef.current = null;
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleChassisClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (reducedMotion || isFlippingRef.current) return;
    if ((event.target as HTMLElement).closest("a")) return; // real links navigate, no flip

    isFlippingRef.current = true;
    void animate(flipRotateY, 180, { type: "spring", stiffness: 70, damping: 16 }).then(() => {
      window.setTimeout(() => {
        void animate(flipRotateY, 0, { type: "spring", stiffness: 70, damping: 16 }).then(() => {
          isFlippingRef.current = false;
        });
      }, 1200);
    });
  };

  return (
    <div
      className="relative w-full [perspective:1100px]"
      style={{ aspectRatio: "9 / 19.5" }}
      data-phone-depth-stage
      onClick={handleChassisClick}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      onPointerCancel={resetPointer}
    >
      {/* Ambient contact shadow — kept outside the rotator, it never rotates. */}
      <motion.div
        className="pointer-events-none absolute inset-[7%] rounded-[18%] bg-[rgba(27,24,20,0.08)] shadow-[18px_28px_46px_rgba(27,24,20,0.24)]"
        style={{ x: shadowX, y: shadowY, scale: shadowScale }}
        animate={
          reducedMotion || !isInView
            ? { opacity: 0.68 }
            : { opacity: [0.62, 0.82, 0.62] }
        }
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        data-phone-shadow
        aria-hidden="true"
      />

      {/* Single rotating 3D group: chassis + live screen move together.
          backfaceVisibility hides this whole group once the flip (below)
          carries it past 90° — the back plate takes over from there. */}
      <motion.div
        className="absolute inset-0"
        style={{
          rotateX: combinedRotateX,
          rotateY: combinedRotateY,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
        data-phone-rotator
      >
        {/* Rear echo silhouette — furthest back. `preserve-3d` here keeps this
            wrapper's own 2D offset from breaking the 3D chain between the
            rotator and the translateZ below — without it, the child's Z
            offset renders under a different, incorrect perspective/scale. */}
        <div
          className="pointer-events-none absolute inset-0 translate-x-1.5 translate-y-2 -rotate-[0.45deg] md:translate-x-2 md:translate-y-2.5 xl:translate-x-3 xl:translate-y-3.5 xl:-rotate-[0.9deg]"
          style={{ transformStyle: "preserve-3d" }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0"
            style={{ x: rearX, y: rearY, translateZ: -16 }}
            data-phone-depth
          >
            <PhoneShell layer="depth" className="h-full w-full" />
          </motion.div>
        </div>

        {/* Front bezel — the reference plane. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ transform: "translateZ(0px)" }}
          aria-hidden="true"
        >
          <PhoneShell className="h-full w-full" />
        </div>

        {/* Accent rail with the loop-progress bar. No static offset here
            (unlike the rear echo above) — its 0.8% inset alone must keep it
            fully covered by the front bezel on every side. The offset this
            used to have (translate-x/y at each breakpoint) pushed its
            right/bottom edges *past* the bezel's own edge by a few px, which
            depended on sub-pixel rounding/anti-aliasing to stay hidden —
            fine in some renderers, a visible solid-orange sliver in others
            (reported on real hardware, bottom-right corner). Zero offset
            makes the overlap geometrically guaranteed, not renderer-luck. */}
        <div
          className="pointer-events-none absolute inset-[0.8%]"
          style={{ transformStyle: "preserve-3d" }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-[16%] border-2 border-[color:var(--foreground)]/70 bg-[color:var(--primary)] shadow-[inset_-10px_-14px_20px_rgba(27,24,20,0.32)]"
            style={{ x: railX, y: railY, translateZ: -4 }}
            data-phone-rail
          >
            <span className="absolute right-0 top-[18%] h-[64%] w-[3px] bg-[color:var(--background)]/20">
              <motion.span
                className="block h-full w-full origin-top bg-[color:var(--background)]/80"
                style={{ scaleY: loopProgress ?? 1 }}
              />
            </span>
            <span className="absolute bottom-[2%] right-[14%] h-[3px] w-[36%] bg-[color:var(--background)]/30" />
          </motion.div>
        </div>

        {/* Live screen — not pointer-events-none: ContactoScreen renders real links. */}
        {children}

        {/* Glass glare — sits above the live screen content at a higher Z,
            clipped to the same rounded rect the screen uses. Low-opacity
            "screen" blend so it reads as a light reflection sliding over
            glass rather than a white smear obscuring the UI underneath. */}
        <div
          className="pointer-events-none absolute overflow-hidden"
          style={{
            left: "5.56%", top: "6.92%", width: "88.9%", height: "88.46%",
            borderRadius: "9.4%",
            transform: "translateZ(6px)",
          }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute -inset-[60%] rotate-[22deg] mix-blend-overlay opacity-70"
            style={{
              x: glareX,
              y: glareY,
              background:
                "linear-gradient(105deg, transparent 44%, rgba(0,0,0,0.06) 48%, rgba(255,255,255,0.5) 49.5%, rgba(255,255,255,0.5) 50.5%, rgba(0,0,0,0.06) 52%, transparent 56%)",
            }}
          />
          {/* Ambient corner sheen — a fixed, gentle top-left highlight so the
              glass reads as reflective even when the sliding streak above is
              parked out of frame at rest. Overlay blend keeps it subtle
              against both light and dark screens. */}
          <div
            className="pointer-events-none absolute -inset-[10%] mix-blend-overlay opacity-80"
            style={{
              background:
                "radial-gradient(circle at 22% 14%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.1) 20%, transparent 42%)",
            }}
          />
        </div>
      </motion.div>

      {/* Back plate — the flip's destination. Carries the rotator's rotation
          plus a static 180°, so the two cancel out and this faces the
          camera exactly when the front (above) has rotated past 90° and
          hidden itself via backfaceVisibility. Reuses the same "depth"
          silhouette as the rear echo — already a clean, simple phone-back
          shape — plus a couple of minimal decorative marks. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          rotateX: combinedRotateX,
          rotateY: backRotateY,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
        aria-hidden="true"
      >
        <PhoneShell layer="depth" className="h-full w-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="h-9 w-9 rounded-full border-2 border-[color:var(--primary)]/50" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[color:var(--primary)]/60">
            fr.dev
          </span>
        </div>
      </motion.div>

      {/* Bezel light-beam reflection — kept outside the rotator, existing behavior. */}
      <motion.span
        className="pointer-events-none absolute left-[4.1%] top-[17%] z-40 h-[19%] w-[2px] bg-gradient-to-b from-transparent via-[color:var(--primary)] to-transparent opacity-80"
        style={{ y: bezelLightY }}
        aria-hidden="true"
      />

      {/* Badge — see component doc comment above for why this is a separate
          3D layer instead of a child of the rotator. */}
      {showBadge && (
        <div
          className="pointer-events-none absolute -right-3 top-[14%] z-50"
          style={{ transformStyle: "preserve-3d" }}
          aria-hidden="true"
        >
          <motion.div
            className="comic-action-word comic-status-live flex items-center gap-1.5 border-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-2.5 py-1.5 text-[9px] shadow-[4px_5px_0_rgba(27,24,20,0.18)]"
            style={{
              rotateX: combinedRotateX,
              rotateY: combinedRotateY,
              translateZ: 48,
              backfaceVisibility: "hidden",
            }}
            animate={reducedMotion || !isInView ? { y: 0 } : { y: [0, -5, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          >
            <motion.span
              animate={
                reducedMotion || !isInView
                  ? { rotate: 0, scale: 1 }
                  : { rotate: [0, 12, 0], scale: [1, 1.12, 1] }
              }
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
            </motion.span>
            En vivo
          </motion.div>
        </div>
      )}
    </div>
  );
}
