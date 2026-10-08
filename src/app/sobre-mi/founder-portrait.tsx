"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./founder-profile.module.css";

const MAX_TILT_DEG = 4;
const DAMPING = 0.08;

/**
 * Framed portrait with a damped pointer tilt (≤4°) and a small counter-shift of
 * the photo for depth. The box is reserved by CSS (4:5), so nothing moves on
 * load. Without a fine pointer, or with reduced motion, it is a static frame.
 */
export function FounderPortrait({ src, alt }: { src: string; alt: string }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * DAMPING;
      currentY += (targetY - currentY) * DAMPING;
      stage.style.setProperty("--tilt-x", `${(-currentY * MAX_TILT_DEG).toFixed(3)}deg`);
      stage.style.setProperty("--tilt-y", `${(currentX * MAX_TILT_DEG).toFixed(3)}deg`);
      stage.style.setProperty("--shift-x", `${(-currentX * 6).toFixed(2)}px`);
      stage.style.setProperty("--shift-y", `${(-currentY * 6).toFixed(2)}px`);
      const settled = Math.abs(targetX - currentX) < 0.002 && Math.abs(targetY - currentY) < 0.002;
      frame = settled ? 0 : requestAnimationFrame(render);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const clamp = (value: number) => Math.max(-1, Math.min(1, value));

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      targetX = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2);
      targetY = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2);
      schedule();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      schedule();
    };

    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={stageRef} className={styles.stage}>
      <div className={styles.frame}>
        <div className={styles.photo}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 320px, 272px"
            loading="eager"
            fetchPriority="high"
            className={styles.image}
          />
          <span className={styles.sweep} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
