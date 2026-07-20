import { useId } from "react";

type PhoneShellProps = {
  className?: string;
};

/**
 * Shared SVG phone frame (360×780 viewBox) — body, gradient border, screen
 * glass, dynamic island, side buttons, home indicator. Used by both
 * PhoneMockup (foreground, interactive) and PhoneBackground (fixed,
 * decorative) so the two stay pixel-identical and follow the color tokens
 * instead of drifting hardcoded hex values independently.
 *
 * Gradient ids are namespaced with useId() since both consumers can be
 * mounted on the page at the same time — plain "pm-*"/"pbg-*" string ids
 * would otherwise collide across the two SVGs.
 */
export function PhoneShell({ className }: PhoneShellProps) {
  const uid = useId();
  const frameGradId = `phone-frame-${uid}`;
  const bodyGradId  = `phone-body-${uid}`;

  return (
    <svg
      viewBox="0 0 360 780"
      className={className}
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={frameGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   style={{ stopColor: "var(--primary)",     stopOpacity: 0.88 }} />
          <stop offset="50%"  style={{ stopColor: "var(--accent-cyan)", stopOpacity: 0.92 }} />
          <stop offset="100%" style={{ stopColor: "var(--primary)",     stopOpacity: 0.73 }} />
        </linearGradient>
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#0e1828" />
          <stop offset="100%" stopColor="#06090e" />
        </linearGradient>
      </defs>

      {/* Phone body */}
      <rect x="6" y="4" width="348" height="772" rx="58" fill={`url(#${bodyGradId})`} />
      {/* Gradient border */}
      <rect x="6" y="4" width="348" height="772" rx="58" fill="none" stroke={`url(#${frameGradId})`} strokeWidth="2" />
      {/* Screen glass */}
      <rect x="20" y="54" width="320" height="690" rx="44" fill="rgba(4,7,12,0.97)" />
      {/* Dynamic island */}
      <ellipse cx="180" cy="42" rx="42" ry="11" fill="rgba(4,7,12,1)" />
      {/* Volume buttons */}
      <rect x="3"   y="176" width="3" height="70" rx="1.5" style={{ fill: "var(--primary)",     fillOpacity: 0.3  }} />
      <rect x="3"   y="256" width="3" height="70" rx="1.5" style={{ fill: "var(--primary)",     fillOpacity: 0.3  }} />
      {/* Power button */}
      <rect x="354" y="210" width="3" height="90" rx="1.5" style={{ fill: "var(--accent-cyan)", fillOpacity: 0.24 }} />
      {/* Home indicator */}
      <rect x="140" y="748" width="80" height="4" rx="2" fill="rgba(232,225,207,0.21)" />
    </svg>
  );
}
