"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { usePhoneBackgroundTarget } from "@/components/phone-background-context";

/**
 * Fixed decorative phone that reacts to document scroll and to the projects
 * section viewport progress. The frame is an inline SVG so no large image or
 * flipbook assets are needed; Motion only updates transform, opacity and filter.
 */
export function PhoneBackground() {
  const compactViewport = useCompactViewport();
  const reducedMotion = Boolean(useReducedMotion());
  const { projectTargetRef, targetVersion } = usePhoneBackgroundTarget();

  const { scrollYProgress } = useScroll();
  const { scrollYProgress: projectProgress } = useScroll({
    target: projectTargetRef,
    offset: ["start end", "center center"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 82,
    damping: 26,
    mass: 0.42,
  });

  const smoothProjectProgress = useSpring(projectProgress, {
    stiffness: 94,
    damping: 28,
    mass: 0.34,
  });

  const scaleRange = compactViewport ? [0.42, 0.62, 0.78, 0.78] : [0.5, 0.8, 1, 1];
  const scale = useTransform(
    smoothScroll,
    [0, 0.4, 0.7, 1],
    reducedMotion ? [0.78, 0.78, 0.78, 0.78] : scaleRange,
  );
  const y = useTransform(
    smoothScroll,
    [0, 0.4],
    reducedMotion ? ["0%", "0%"] : compactViewport ? ["18%", "0%"] : ["30%", "0%"],
  );
  const phoneOpacity = useTransform(
    smoothScroll,
    [0, 0.18, 0.72, 1],
    reducedMotion ? [0.22, 0.22, 0.22, 0.22] : compactViewport ? [0.12, 0.18, 0.28, 0.2] : [0.18, 0.28, 0.48, 0.3],
  );

  const brightness = useTransform(
    smoothProjectProgress,
    [0, 1],
    reducedMotion ? [0.72, 0.72] : [0.3, 1],
  );
  const screenOpacity = useTransform(
    smoothProjectProgress,
    [0, 0.55, 1],
    reducedMotion ? [0.34, 0.34, 0.34] : [0.2, 0.48, 0.9],
  );
  const screenGlow = useTransform(
    smoothProjectProgress,
    [0, 1],
    reducedMotion ? [0.1, 0.1] : [0.08, 0.42],
  );
  const screenFilter = useTransform(brightness, (value) => `brightness(${value}) saturate(${0.92 + value * 0.28})`);
  const glowOpacity = useTransform(screenGlow, (value) => value);

  return (
    <div className="phone-bg-root" aria-hidden="true" data-target-version={targetVersion}>
      <motion.div className="phone-bg-device" style={{ scale, y, opacity: phoneOpacity }}>
        <svg
          className="phone-bg-svg"
          viewBox="0 0 360 720"
          role="presentation"
          focusable="false"
        >
          <defs>
            <linearGradient id="phone-frame-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(243,232,215,0.34)" />
              <stop offset="38%" stopColor="rgba(195,147,86,0.58)" />
              <stop offset="100%" stopColor="rgba(82,208,220,0.36)" />
            </linearGradient>
            <linearGradient id="phone-screen-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(82,208,220,0.32)" />
              <stop offset="48%" stopColor="rgba(18,29,46,0.88)" />
              <stop offset="100%" stopColor="rgba(195,147,86,0.3)" />
            </linearGradient>
            <radialGradient id="phone-screen-hotspot" cx="50%" cy="42%" r="70%">
              <stop offset="0%" stopColor="rgba(82,208,220,0.38)" />
              <stop offset="48%" stopColor="rgba(195,147,86,0.14)" />
              <stop offset="100%" stopColor="rgba(7,10,16,0)" />
            </radialGradient>
            <filter id="phone-screen-blur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>

          <motion.ellipse
            cx="180"
            cy="360"
            rx="158"
            ry="308"
            fill="url(#phone-screen-hotspot)"
            filter="url(#phone-screen-blur)"
            style={{ opacity: glowOpacity }}
          />

          <rect
            x="58"
            y="18"
            width="244"
            height="684"
            rx="48"
            fill="rgba(8,12,18,0.86)"
            stroke="url(#phone-frame-gradient)"
            strokeWidth="1.4"
          />
          <rect
            x="72"
            y="36"
            width="216"
            height="648"
            rx="36"
            fill="rgba(4,7,12,0.96)"
            stroke="rgba(255,255,255,0.08)"
          />
          <rect x="148" y="52" width="64" height="8" rx="4" fill="rgba(243,232,215,0.18)" />

          <motion.g style={{ opacity: screenOpacity, filter: screenFilter }}>
            <rect x="84" y="78" width="192" height="584" rx="28" fill="url(#phone-screen-gradient)" />
            <rect x="104" y="112" width="64" height="8" rx="4" fill="rgba(195,147,86,0.86)" />
            <rect x="104" y="136" width="124" height="8" rx="4" fill="rgba(243,232,215,0.46)" />
            <rect x="104" y="154" width="92" height="8" rx="4" fill="rgba(82,208,220,0.42)" />

            <g opacity="0.9">
              <rect x="104" y="196" width="68" height="92" rx="10" fill="rgba(7,10,16,0.72)" stroke="rgba(82,208,220,0.28)" />
              <rect x="188" y="196" width="68" height="92" rx="10" fill="rgba(7,10,16,0.72)" stroke="rgba(195,147,86,0.28)" />
              <rect x="104" y="312" width="152" height="72" rx="12" fill="rgba(12,21,32,0.82)" stroke="rgba(255,255,255,0.08)" />
              <rect x="120" y="330" width="54" height="8" rx="4" fill="rgba(82,208,220,0.62)" />
              <rect x="120" y="350" width="102" height="8" rx="4" fill="rgba(243,232,215,0.32)" />
            </g>

            <g opacity="0.85">
              <rect x="104" y="418" width="152" height="96" rx="14" fill="rgba(7,10,16,0.66)" stroke="rgba(82,208,220,0.22)" />
              <path
                d="M122 480 L148 454 L174 466 L204 432 L238 444"
                fill="none"
                stroke="rgba(82,208,220,0.78)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="204" cy="432" r="5" fill="rgba(195,147,86,0.9)" />
            </g>

            <g opacity="0.92">
              <rect x="104" y="548" width="42" height="42" rx="10" fill="rgba(12,21,32,0.9)" stroke="rgba(195,147,86,0.26)" />
              <rect x="158" y="548" width="42" height="42" rx="10" fill="rgba(12,21,32,0.9)" stroke="rgba(82,208,220,0.24)" />
              <rect x="212" y="548" width="42" height="42" rx="10" fill="rgba(12,21,32,0.9)" stroke="rgba(82,208,220,0.24)" />
              <text x="125" y="574" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="rgba(243,232,215,0.74)">APP</text>
              <text x="179" y="574" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="rgba(243,232,215,0.74)">CRM</text>
              <text x="233" y="574" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="rgba(243,232,215,0.74)">WEB</text>
            </g>
          </motion.g>

          <rect x="58" y="130" width="3" height="74" rx="1.5" fill="rgba(195,147,86,0.36)" />
          <rect x="299" y="178" width="3" height="116" rx="1.5" fill="rgba(82,208,220,0.3)" />
          <circle cx="180" cy="648" r="14" fill="rgba(243,232,215,0.04)" stroke="rgba(243,232,215,0.12)" />
        </svg>
      </motion.div>
    </div>
  );
}

function useCompactViewport() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateCompact = () => setCompact(mediaQuery.matches);

    updateCompact();
    mediaQuery.addEventListener("change", updateCompact);

    return () => mediaQuery.removeEventListener("change", updateCompact);
  }, []);

  return compact;
}
