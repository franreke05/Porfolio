"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { spring } from "@/lib/motion";

type FaqDisclosureProps = {
  index: number;
  question: string;
  answer: string;
};

/**
 * A single FAQ accordion item — native <details>/<summary> for free
 * keyboard/AT support, with the +/× indicator on a spring instead of a
 * linear CSS transition, so it settles with a little overshoot instead of
 * stopping dead at 45deg.
 */
export function FaqDisclosure({ index, question, answer }: FaqDisclosureProps) {
  const [open, setOpen] = useState(false);

  return (
    <details
      className="group border-t border-[color:var(--foreground)] last:border-b"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="grid cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-start gap-3 py-5 marker:content-none sm:gap-5 sm:py-6">
        <span className="pt-1 font-mono text-[10px] font-bold text-[color:var(--primary)]">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="font-display text-lg font-bold leading-snug text-[color:var(--foreground)] sm:text-xl">{question}</h3>
        <motion.span
          className="flex h-7 w-7 items-center justify-center border border-[color:var(--foreground)] font-mono text-lg leading-none text-[color:var(--primary)]"
          animate={{ rotate: open ? 45 : 0 }}
          transition={spring.tilt}
          aria-hidden="true"
        >
          +
        </motion.span>
      </summary>
      <div className="pb-6 pl-11 pr-10 sm:pl-[3.25rem] sm:pr-14">
        <p className="max-w-3xl leading-7 text-[color:var(--muted)]">{answer}</p>
      </div>
    </details>
  );
}
