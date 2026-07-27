import { MapPin, Wrench } from "lucide-react";

/**
 * The two fully-illustrated panels (opening + closing) in the FlashFix
 * comic reader. Flat ink-silhouette style — thick outlines, halftone,
 * sunburst — built entirely from the site's existing comic CSS tokens
 * and lucide icons, never a painted/raster illustration. Deliberately a
 * different technique from the commissioned cover art (flashfix-comic-
 * cover-v2.png): silhouette + shape, not photorealistic rendering.
 */

const INK = "var(--foreground)";
const PAPER = "var(--background)";
const RED = "var(--primary)";

/** Simple side-profile car silhouette. `broken` adds jagged smoke + a
 *  dim headlight; otherwise it's a bright, whole vehicle. */
function CarSilhouette({ broken }: { broken: boolean }) {
  return (
    <g>
      {broken && (
        <path
          d="M120 78 Q132 54 118 40 Q140 50 132 20"
          stroke={RED}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
          opacity={0.75}
        />
      )}
      {/* body */}
      <path
        d="M40 150
           L58 150 L70 122 Q84 104 118 102 L182 102
           Q208 104 222 128 L246 132
           Q258 134 258 150 L258 158
           L40 158 Z"
        fill={INK}
      />
      {/* cabin glass */}
      <path
        d="M92 118 Q102 108 122 106 L172 106 Q188 108 198 122 L198 126 L92 126 Z"
        fill={PAPER}
        opacity={broken ? 0.5 : 0.85}
      />
      {/* wheels */}
      <circle cx="86" cy="158" r="18" fill={INK} />
      <circle cx="86" cy="158" r="7" fill={PAPER} />
      <circle cx="222" cy="158" r="18" fill={INK} />
      <circle cx="222" cy="158" r="7" fill={PAPER} />
      {/* headlight */}
      <circle cx="252" cy="140" r="5" fill={broken ? INK : RED} opacity={broken ? 0.4 : 1} />
    </g>
  );
}

/** Minimal standing figure — a torso wedge + circle head, arm raised
 *  toward a phone (opening panel) or in a fist-pump (closing panel). */
function FigureSilhouette({ pose }: { pose: "stuck" | "fixed" }) {
  return (
    <g>
      <circle cx="40" cy="34" r="12" fill={INK} />
      {pose === "stuck" ? (
        <>
          <path d="M40 46 L40 96 M40 58 L18 78 M40 58 L58 44" stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none" />
          <rect x="52" y="30" width="14" height="20" rx="2" fill={RED} transform="rotate(18 59 40)" />
        </>
      ) : (
        <>
          <path d="M40 46 L40 96 M40 58 L20 46 M40 58 L60 40" stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none" />
          <circle cx="61" cy="38" r="9" fill={RED} />
        </>
      )}
      <path d="M28 96 L28 130 M52 96 L52 130" stroke={INK} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
}

function PanelFrame({
  children,
  tone = "paper",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "paper" | "sunburst";
  className?: string;
}) {
  return (
    <div className={`comic-ink-outline relative h-full w-full min-h-[280px] overflow-hidden bg-[color:var(--background)] ${className}`}>
      {tone === "sunburst" && <div className="comic-sunburst absolute inset-0" aria-hidden="true" />}
      <div className="comic-halftone absolute inset-0" aria-hidden="true" />
      <MapPin className="pointer-events-none absolute left-3 top-3 h-6 w-6 text-[color:var(--foreground)]/15 sm:h-8 sm:w-8" aria-hidden="true" />
      <Wrench className="pointer-events-none absolute right-3 top-3 h-6 w-6 rotate-45 text-[color:var(--foreground)]/15 sm:h-8 sm:w-8" aria-hidden="true" />
      {children}
    </div>
  );
}

export function ProblemIllustration() {
  return (
    <PanelFrame>
      <svg viewBox="0 0 300 180" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <line x1="0" y1="158" x2="300" y2="158" stroke={INK} strokeWidth={2} opacity={0.5} />
        <g transform="translate(-4 0)">
          <CarSilhouette broken />
        </g>
        <g transform="translate(210 20)">
          <FigureSilhouette pose="stuck" />
        </g>
      </svg>
    </PanelFrame>
  );
}

export function ResolutionIllustration() {
  return (
    <PanelFrame tone="sunburst">
      <svg viewBox="0 0 300 180" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <line x1="0" y1="158" x2="300" y2="158" stroke={INK} strokeWidth={2} opacity={0.5} />
        <g transform="translate(-4 0)">
          <CarSilhouette broken={false} />
        </g>
        <g transform="translate(210 20)">
          <FigureSilhouette pose="fixed" />
        </g>
      </svg>
    </PanelFrame>
  );
}
