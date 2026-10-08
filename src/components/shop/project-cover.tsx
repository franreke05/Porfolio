import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { getProject, portfolioProjects, workStatusLabel } from "@/lib/portfolio";

export type ProjectCoverSize = "sm" | "md" | "lg";

type ProjectCoverProps = {
  slug: string;
  size: ProjectCoverSize;
  /** Preload the art (only for covers above the fold). */
  priority?: boolean;
  className?: string;
};

const maxWidth: Record<ProjectCoverSize, string> = {
  sm: "max-w-[13rem]",
  md: "max-w-[17rem]",
  lg: "max-w-[23rem]",
};

const imageSizes: Record<ProjectCoverSize, string> = {
  sm: "(min-width: 640px) 208px, 45vw",
  md: "(min-width: 640px) 272px, 45vw",
  lg: "(min-width: 640px) 368px, 90vw",
};

/** Screen-printed covers for the projects that have no commissioned art. */
type Design = {
  /** The cover's own ink colour, on top of the shared cream / ink / red base. */
  accent: string;
  /** Title split into masthead lines, with a size tuned to the longest line. */
  lines: string[];
  titleSize: string;
  motif: ReactNode;
};

const ink = "var(--foreground)";
const cream = "var(--background)";
const red = "var(--primary)";

const designs: Record<string, Design> = {
  "caravantruck-way": {
    accent: "#e08a1e",
    lines: ["CaravanTruck", "Way"],
    titleSize: "text-[15.5cqw]",
    motif: (
      <>
        {/* route across the map, with waypoints and a destination pin */}
        <polyline
          points="18,44 58,22 104,38 148,14 178,26"
          fill="none"
          stroke={ink}
          strokeWidth="4"
          strokeDasharray="9 6"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="44" r="6" fill={cream} stroke={ink} strokeWidth="3" />
        <circle cx="104" cy="38" r="4" fill={ink} />
        <path d="M178 30 c-9-10-9-22 0-22 s9 12 0 22z" fill={red} stroke={ink} strokeWidth="3" />
        {/* motorhome */}
        <path d="M6 96 h22 M0 108 h24 M10 120 h16" stroke={ink} strokeWidth="4" strokeLinecap="round" />
        <path d="M38 122 V74 q0-9 9-9 h73 q8 0 11 6 l16 28 q3 5 3 11 v12 z" fill={ink} />
        <path d="M124 73 h3 l13 23 h-16 z" fill={cream} />
        <rect x="50" y="75" width="30" height="16" fill={cream} />
        <rect x="87" y="75" width="27" height="16" fill={cream} />
        <rect x="38" y="103" width="112" height="6" fill={red} />
        <circle cx="66" cy="124" r="13" fill={ink} stroke={cream} strokeWidth="3" />
        <circle cx="66" cy="124" r="4.5" fill={cream} />
        <circle cx="128" cy="124" r="13" fill={ink} stroke={cream} strokeWidth="3" />
        <circle cx="128" cy="124" r="4.5" fill={cream} />
        <path d="M0 139 H200" stroke={ink} strokeWidth="4" />
      </>
    ),
  },
  oposibot: {
    accent: "#2f9184",
    lines: ["OposiBot"],
    titleSize: "text-[23cqw]",
    motif: (
      <>
        {/* robot */}
        <path d="M100 30 V14" stroke={ink} strokeWidth="4" />
        <circle cx="100" cy="11" r="6" fill={red} stroke={ink} strokeWidth="3" />
        <rect x="59" y="44" width="10" height="20" fill={ink} />
        <rect x="131" y="44" width="10" height="20" fill={ink} />
        <rect x="68" y="30" width="64" height="48" rx="9" fill={cream} stroke={ink} strokeWidth="4" />
        <circle cx="87" cy="51" r="7" fill={ink} />
        <circle cx="113" cy="51" r="7" fill={ink} />
        <circle cx="89" cy="49" r="2" fill={cream} />
        <circle cx="115" cy="49" r="2" fill={cream} />
        <path d="M88 66 h24" stroke={ink} strokeWidth="4" strokeLinecap="round" />
        <rect x="92" y="78" width="16" height="8" fill={ink} />
        <path d="M62 100 q0-15 15-15 h46 q15 0 15 15 z" fill={ink} />
        {/* stack of books */}
        <rect x="56" y="100" width="90" height="14" fill={red} stroke={ink} strokeWidth="3" />
        <rect x="46" y="114" width="104" height="14" fill={cream} stroke={ink} strokeWidth="3" />
        <path d="M54 121 h60" stroke={ink} strokeWidth="2" />
        <rect x="52" y="128" width="100" height="14" fill={ink} stroke={ink} strokeWidth="3" />
        <path d="M62 135 h18" stroke={cream} strokeWidth="3" />
      </>
    ),
  },
  requenadesk: {
    accent: "#6b4fa0",
    lines: ["Requena", "Desk"],
    titleSize: "text-[21cqw]",
    motif: (
      <>
        {/* tickets in flight */}
        <g transform="translate(18 30) rotate(-18)">
          <rect width="40" height="22" fill={cream} stroke={ink} strokeWidth="3" />
          <path d="M28 2 V20" stroke={ink} strokeWidth="2" strokeDasharray="3 3" />
          <path d="M6 8 h14 M6 14 h10" stroke={ink} strokeWidth="2" />
        </g>
        <g transform="translate(140 14) rotate(14)">
          <rect width="40" height="22" fill={cream} stroke={ink} strokeWidth="3" />
          <path d="M28 2 V20" stroke={ink} strokeWidth="2" strokeDasharray="3 3" />
          <path d="M6 8 h14 M6 14 h10" stroke={ink} strokeWidth="2" />
        </g>
        <g transform="translate(152 70) rotate(-9)">
          <rect width="32" height="18" fill={red} stroke={ink} strokeWidth="3" />
          <path d="M22 2 V16" stroke={ink} strokeWidth="2" strokeDasharray="3 3" />
        </g>
        {/* desk bell, ringing */}
        <path d="M34 78 q-10 12 -5 28 M166 96 q5 8 2 16" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
        <path d="M22 70 q-9 14 -5 30" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <rect x="93" y="50" width="14" height="14" fill={ink} />
        <circle cx="100" cy="46" r="8" fill={red} stroke={ink} strokeWidth="3" />
        <path d="M52 118 a48 48 0 0 1 96 0 z" fill={cream} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
        <path d="M66 110 a36 36 0 0 1 22 -30" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <rect x="40" y="118" width="120" height="13" rx="3" fill={ink} />
        <path d="M0 139 H200" stroke={ink} strokeWidth="4" />
      </>
    ),
  },
  agendnote: {
    accent: "#c2417a",
    lines: ["AgendNote"],
    titleSize: "text-[20cqw]",
    motif: (
      <>
        {/* open agenda */}
        <path d="M100 30 L28 22 V120 L100 130 Z" fill={cream} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
        <path d="M100 30 L172 22 V120 L100 130 Z" fill={cream} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
        <path d="M40 44 L88 49 M40 62 L88 67 M40 80 L88 85 M40 98 L72 101" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        {/* checked tasks */}
        <path d="M112 50 l7 8 l13 -17 M112 76 l7 8 l13 -17" fill="none" stroke={red} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="111" y="93" width="16" height="16" fill="none" stroke={ink} strokeWidth="3" />
        <path d="M140 47 L162 45 M140 73 L162 71 M140 100 L162 98" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <path d="M86 128 v20 l6 -6 l6 6 v-19" fill={red} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
  },
};

/** 16 alternating rays from the centre of the cover. */
const rays = Array.from({ length: 16 }, (_, index) => {
  const a = ((index * 22.5 - 5) * Math.PI) / 180;
  const b = ((index * 22.5 + 5) * Math.PI) / 180;
  const point = (angle: number) =>
    `${(100 + Math.cos(angle) * 320).toFixed(1)},${(140 + Math.sin(angle) * 320).toFixed(1)}`;
  return `100,140 ${point(a)} ${point(b)}`;
});

// Deterministic "barcode" derived from the slug: stable on server and client.
function Barcode({ seed }: { seed: string }) {
  const bars = Array.from({ length: 20 }).reduce<Array<{ x: number; width: number }>>((acc, _, index) => {
    const previous = acc[acc.length - 1];
    const width = 1 + ((seed.charCodeAt(index % seed.length) + index * 7) % 3);
    return [...acc, { x: previous ? previous.x + previous.width + 2 : 0, width }];
  }, []);
  const last = bars[bars.length - 1];
  return (
    <svg viewBox={`0 0 ${last.x + last.width} 20`} className="h-full w-full" preserveAspectRatio="none">
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y={0} width={bar.width} height={20} fill={ink} />
      ))}
    </svg>
  );
}

const outline: CSSProperties = {
  WebkitTextStroke: "0.03em var(--foreground)",
  textShadow: "0.045em 0.055em 0 var(--foreground)",
  paintOrder: "stroke fill",
};

/**
 * One project as a 2:3 comic cover. Commissioned art is framed when the
 * catalogue has it; the rest get a designed screen-print cover. Everything
 * inside scales with the cover's own width (container units), so the same
 * markup works on a mobile shelf and in the shop window. Contains no links:
 * the poster or page that places it owns the actions.
 */
export function ProjectCover({ slug, size, priority = false, className = "" }: ProjectCoverProps) {
  const project = getProject(slug);
  if (!project) return null;

  const issue = String(portfolioProjects.findIndex((item) => item.slug === slug) + 1).padStart(2, "0");
  // Illustrated art carries its own title lettering: the designed cover is only the fallback.
  const design = project.cover ? undefined : designs[slug];
  const statusLabel = project.category === "academic" ? project.statusNote : undefined;
  const label = `Portada del cómic ${project.name}, número ${issue}: ${project.descriptor}. ${
    statusLabel ?? workStatusLabel[project.status]
  }.`;

  return (
    <div
      role="img"
      aria-label={label}
      className={`@container relative mx-auto flex aspect-[2/3] w-full flex-col overflow-hidden border-[3px] border-[color:var(--foreground)] bg-[color:var(--surface)] ${maxWidth[size]} ${className}`}
      style={design ? { backgroundColor: design.accent } : undefined}
    >
      {/* ── Art ── */}
      {project.cover ? (
        <Image
          src={project.cover.src}
          alt=""
          fill
          priority={priority}
          sizes={imageSizes[size]}
          className="object-cover object-top"
        />
      ) : design ? (
        <>
          <svg
            viewBox="0 0 200 300"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {rays.map((points) => (
              <polygon key={points} points={points} fill={cream} opacity="0.3" />
            ))}
          </svg>
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(27,23,18,0.42) 1.2px, transparent 1.7px)",
              backgroundSize: "7px 7px",
              maskImage: "linear-gradient(200deg, transparent 38%, #000 100%)",
              WebkitMaskImage: "linear-gradient(200deg, transparent 38%, #000 100%)",
            }}
          />
        </>
      ) : null}

      {/* ── Top strip: issue box + imprint ── */}
      <div className="relative flex items-start justify-between gap-[3cqw] p-[4cqw]" aria-hidden="true">
        <span className="flex flex-col items-center border-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-[2.2cqw] py-[1.4cqw] font-mono text-[max(0.5rem,3.4cqw)] font-bold leading-[1.15] text-[color:var(--foreground)]">
          <span>Nº</span>
          <span>{issue}</span>
        </span>
        <span className="hidden border-2 border-[color:var(--foreground)] bg-[color:var(--foreground)] px-[2.4cqw] py-[1.2cqw] font-mono text-[max(0.5rem,2.9cqw)] font-bold uppercase tracking-[0.12em] text-[color:var(--background)] @[11rem]:block">
          FR · estudio
        </span>
      </div>

      {/* ── Masthead + motif (designed covers only) ── */}
      {design ? (
        <>
          <p
            aria-hidden="true"
            className={`relative -mt-[1cqw] -rotate-3 px-[5cqw] font-comic uppercase leading-[0.86] tracking-[0.01em] text-[color:var(--background)] ${design.titleSize}`}
            style={outline}
          >
            {design.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <svg
            viewBox="0 0 200 150"
            preserveAspectRatio="xMidYMax meet"
            className="relative min-h-0 w-full flex-1"
            aria-hidden="true"
          >
            {design.motif}
          </svg>
        </>
      ) : (
        <div className="flex-1" />
      )}

      {/* ── Bottom bar: title (art covers), tagline, status stamp, barcode ── */}
      <div
        aria-hidden="true"
        className="relative border-t-[3px] border-[color:var(--foreground)] bg-[color:var(--background)] px-[4.5cqw] pb-[3.6cqw] pt-[3cqw] text-[color:var(--foreground)]"
      >
        {design ? null : (
          <p className="font-comic text-[max(1rem,10.5cqw)] uppercase leading-[0.9] tracking-[0.02em]">
            {project.name}
          </p>
        )}
        <p className="mt-[1cqw] line-clamp-2 text-[max(0.6875rem,4.3cqw)] font-bold italic leading-[1.2]">
          {project.descriptor}
        </p>
        <div className="mt-[2.6cqw] flex items-center justify-between gap-[3cqw]">
          <span className="-rotate-2 border-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-[2cqw] py-[1.2cqw] shadow-[2px_2px_0_var(--foreground)]">
            <StatusBadge status={project.status} label={statusLabel} className="!text-[max(0.625rem,3.9cqw)]" />
          </span>
          <span className="hidden h-[7cqw] w-[20cqw] @[13rem]:block">
            <Barcode seed={slug} />
          </span>
        </div>
      </div>
    </div>
  );
}
