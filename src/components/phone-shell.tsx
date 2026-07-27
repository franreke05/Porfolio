import { useId } from "react";

type PhoneShellProps = {
  className?: string;
  layer?: "complete" | "depth";
};

/**
 * Shared SVG phone frame (360×780 viewBox) — body, gradient border, screen
 * glass, dynamic island, side buttons, home indicator. Used by PhoneMockup,
 * kept as its own component so the frame follows color tokens instead of
 * hardcoded hex values scattered inline.
 *
 * Gradient ids are namespaced with useId() in case more than one instance
 * ever mounts at once — plain string ids would otherwise collide.
 */
export function PhoneShell({ className, layer = "complete" }: PhoneShellProps) {
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
        {/* Metal-wrap gradient — highlight/shadow/highlight bands instead of a
            flat diagonal fade, so the border reads as light wrapping a
            curved anodized edge rather than a printed color stroke. */}
        <linearGradient id={frameGradId} x1="12%" y1="0%" x2="88%" y2="100%">
          <stop offset="0%"   stopColor="#f0c49a" stopOpacity="0.95" />
          <stop offset="14%"  style={{ stopColor: "var(--primary)", stopOpacity: 0.92 }} />
          <stop offset="34%"  stopColor="#2a1c14" stopOpacity="0.9" />
          <stop offset="50%"  style={{ stopColor: "var(--foreground)", stopOpacity: 0.88 }} />
          <stop offset="66%"  stopColor="#2a1c14" stopOpacity="0.9" />
          <stop offset="86%"  style={{ stopColor: "var(--primary)", stopOpacity: 0.9 }} />
          <stop offset="100%" stopColor="#f0c49a" stopOpacity="0.92" />
        </linearGradient>
        {/* Body — vertical fade plus a thin top specular catch, as if lit
            from slightly above. */}
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#332a21" />
          <stop offset="6%"   stopColor="#1a1510" />
          <stop offset="45%"  stopColor="#120f0c" />
          <stop offset="100%" stopColor="#090706" />
        </linearGradient>
        <radialGradient id={`${bodyGradId}-lens`} cx="38%" cy="32%" r="65%">
          <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {layer === "depth" ? (
        <>
          <rect x="5" y="3" width="350" height="774" rx="59" fill={`url(#${bodyGradId})`} />
          <rect
            x="5"
            y="3"
            width="350"
            height="774"
            rx="59"
            fill="none"
            stroke={`url(#${frameGradId})`}
            strokeWidth="3"
            opacity="0.85"
          />
          <rect x="1" y="176" width="6" height="70" rx="3" fill="var(--primary)" opacity="0.78" />
          <rect x="1" y="256" width="6" height="70" rx="3" fill="var(--primary)" opacity="0.62" />
          <rect x="353" y="210" width="6" height="90" rx="3" fill="var(--primary)" opacity="0.52" />
        </>
      ) : (
        <>
          {/* Phone body — dark hardware chassis, deliberately kept dark
              regardless of site theme (a real phone's bezel is dark either
              way); the screen glass below carries the site's paper palette. */}
          <rect x="6" y="4" width="348" height="772" rx="58" fill={`url(#${bodyGradId})`} />
          {/* Soft specular catch on the metal body, upper-left — sells a
              rounded, lit surface instead of a flat fill. */}
          <rect x="6" y="4" width="348" height="772" rx="58" fill={`url(#${bodyGradId}-lens)`} style={{ mixBlendMode: "soft-light" }} />
          {/* Gradient border — outer chamfer */}
          <rect x="6" y="4" width="348" height="772" rx="58" fill="none" stroke={`url(#${frameGradId})`} strokeWidth="2.5" />
          {/* Inner bevel line — the thin bright/dark seam between metal
              frame and screen glass that reads as a beveled edge catching
              light, not just a flat color swap. */}
          <rect x="15" y="49" width="330" height="700" rx="48" fill="none" stroke="#000000" strokeOpacity="0.35" strokeWidth="1.5" />
          <rect x="17" y="51" width="326" height="696" rx="47" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1" />
          {/* Screen glass */}
          <rect x="20" y="54" width="320" height="690" rx="44" fill="var(--background)" />
          {/* Dynamic island, with a tiny lens glint */}
          <ellipse cx="180" cy="42" rx="42" ry="11" fill="#0c0a08" />
          <circle cx="196" cy="39" r="2.4" fill="#ffffff" opacity="0.4" />
          {/* Volume buttons */}
          <rect x="3"   y="176" width="3" height="70" rx="1.5" style={{ fill: "var(--primary)", fillOpacity: 0.3 }} />
          <rect x="3"   y="256" width="3" height="70" rx="1.5" style={{ fill: "var(--primary)", fillOpacity: 0.3 }} />
          {/* Power button */}
          <rect x="354" y="210" width="3" height="90" rx="1.5" style={{ fill: "var(--foreground)", fillOpacity: 0.3 }} />
          {/* Home indicator */}
          <rect x="140" y="748" width="80" height="4" rx="2" fill="var(--foreground)" opacity="0.28" />
        </>
      )}
    </svg>
  );
}
