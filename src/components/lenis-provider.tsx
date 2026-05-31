"use client";

import Lenis from "lenis";
import { useEffect } from "react";

const lenisEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function LenisProvider() {
  useEffect(() => {
    // Skip smooth scroll for: reduced-motion prefs OR touch-only devices.
    // Mobile native scroll is already great; Lenis adds JS overhead there.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchOnly     = !window.matchMedia("(pointer: fine)").matches;

    if (reducedMotion || touchOnly) return;

    const lenis = new Lenis({
      duration:    1.2,
      easing:      lenisEasing,
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
