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
        <linearGradient id={frameGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   style={{ stopColor: "var(--primary)",    stopOpacity: 0.9  }} />
          <stop offset="50%"  style={{ stopColor: "var(--foreground)", stopOpacity: 0.85 }} />
          <stop offset="100%" style={{ stopColor: "var(--primary)",   stopOpacity: 0.75 }} />
        </linearGradient>
        <linearGradient id={bodyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#171310" />
          <stop offset="100%" stopColor="#0c0a08" />
        </linearGradient>
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
            stroke="var(--primary)"
            strokeWidth="3"
            opacity="0.68"
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
          {/* Gradient border */}
          <rect x="6" y="4" width="348" height="772" rx="58" fill="none" stroke={`url(#${frameGradId})`} strokeWidth="2" />
          {/* Screen glass */}
          <rect x="20" y="54" width="320" height="690" rx="44" fill="var(--background)" />
          {/* Dynamic island */}
          <ellipse cx="180" cy="42" rx="42" ry="11" fill="#0c0a08" />
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
