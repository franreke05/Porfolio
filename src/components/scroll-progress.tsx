"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[60] h-[1.5px] w-full origin-left progress-bar-gradient motion-reduce:hidden"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
