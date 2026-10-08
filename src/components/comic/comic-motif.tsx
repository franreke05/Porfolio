import { ArchitectureDiagram } from "@/components/projects/architecture-diagram";
import { RouteMotif } from "@/components/projects/route-motif";
import type { ComicMotifId } from "@/lib/comics";

const INK = "var(--foreground)";
const PAGE = "#fbf7ec";
const ACCENT = "var(--accent)";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";

function Label({ x, y, children, anchor = "middle" }: { x: number; y: number; children: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={MONO} fontSize="12" fontWeight="700" fill={INK}>
      {children}
    </text>
  );
}

/** App on one side, backend on the other, a hard border between them. */
function Frontera() {
  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" aria-hidden="true" focusable="false">
      {/* phone: deliberately blank, no invented interface */}
      <rect x="22" y="34" width="84" height="150" rx="10" fill={PAGE} stroke={INK} strokeWidth="3" />
      <rect x="52" y="44" width="24" height="5" fill={INK} />
      <Label x={64} y={116}>APP</Label>
      {/* border */}
      <line x1="160" y1="10" x2="160" y2="210" stroke={INK} strokeWidth="3" strokeDasharray="10 7" />
      {/* backend */}
      <rect x="208" y="52" width="92" height="114" fill={ACCENT} stroke={INK} strokeWidth="3" />
      <line x1="208" y1="90" x2="300" y2="90" stroke={INK} strokeWidth="2" />
      <line x1="208" y1="128" x2="300" y2="128" stroke={INK} strokeWidth="2" />
      <Label x={254} y={76}>IDENTIDAD</Label>
      <Label x={254} y={114}>PERMISOS</Label>
      <Label x={254} y={152}>DINERO</Label>
      {/* ask / answer */}
      <path d="M112 92 H200 M190 84 L200 92 L190 100" fill="none" stroke={INK} strokeWidth="2.5" />
      <path d="M200 132 H112 M122 124 L112 132 L122 140" fill="none" stroke={INK} strokeWidth="2.5" />
      <Label x={64} y={206}>PREGUNTA</Label>
      <Label x={254} y={190}>DECIDE</Label>
    </svg>
  );
}

/** Two sides of one counter: the team's desktop app and the client's portal. */
function Mostrador() {
  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" aria-hidden="true" focusable="false">
      <rect x="14" y="40" width="104" height="72" fill={PAGE} stroke={INK} strokeWidth="3" />
      <line x1="14" y1="56" x2="118" y2="56" stroke={INK} strokeWidth="2" />
      <Label x={66} y={90}>EQUIPO</Label>
      <rect x="202" y="40" width="104" height="72" fill={PAGE} stroke={INK} strokeWidth="3" />
      <line x1="202" y1="56" x2="306" y2="56" stroke={INK} strokeWidth="2" />
      <Label x={254} y={90}>CLIENTE</Label>
      {/* the shared record: a stack of slips */}
      <rect x="126" y="126" width="76" height="52" fill={PAGE} stroke={INK} strokeWidth="2.5" transform="rotate(-5 164 152)" />
      <rect x="124" y="122" width="76" height="52" fill={PAGE} stroke={INK} strokeWidth="2.5" transform="rotate(4 162 148)" />
      <rect x="122" y="118" width="76" height="52" fill={ACCENT} stroke={INK} strokeWidth="3" />
      <path d="M134 134 h52 M134 146 h40 M134 158 h46" stroke={INK} strokeWidth="2.5" />
      <path d="M66 112 V144 H116 M106 136 L116 144 L106 152" fill="none" stroke={INK} strokeWidth="2.5" />
      <path d="M254 112 V144 H204 M214 136 L204 144 L214 152" fill="none" stroke={INK} strokeWidth="2.5" />
      <Label x={66} y={30}>ESCRITORIO</Label>
      <Label x={254} y={30}>PORTAL</Label>
      <Label x={160} y={204}>TODO REGISTRADO</Label>
    </svg>
  );
}

/** Exams with different weights, and the one still to come. */
function Pesos() {
  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" aria-hidden="true" focusable="false">
      <Label x={16} y={30} anchor="start">CADA PRUEBA, SU PESO</Label>
      <rect x="16" y="46" width="150" height="30" fill={ACCENT} stroke={INK} strokeWidth="3" />
      <rect x="16" y="88" width="230" height="30" fill={ACCENT} stroke={INK} strokeWidth="3" />
      <rect x="16" y="130" width="96" height="30" fill={ACCENT} stroke={INK} strokeWidth="3" />
      <rect x="16" y="172" width="190" height="30" fill={PAGE} stroke={INK} strokeWidth="3" strokeDasharray="8 6" />
      <Label x={28} y={192} anchor="start">LO QUE QUEDA</Label>
      <circle cx="262" cy="187" r="24" fill={PAGE} stroke={INK} strokeWidth="3" />
      <text x="262" y="198" textAnchor="middle" fontFamily="var(--font-bangers), Impact, sans-serif" fontSize="34" fill={INK}>
        ?
      </text>
    </svg>
  );
}

/** Test → confirmed failure → implementation. */
function Ciclo() {
  const steps = ["TEST", "FALLO CONFIRMADO", "IMPLEMENTACIÓN"];
  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" aria-hidden="true" focusable="false">
      {steps.map((step, index) => {
        const y = 18 + index * 68;
        return (
          <g key={step}>
            <rect x="40" y={y} width="240" height="46" fill={index === 2 ? ACCENT : PAGE} stroke={INK} strokeWidth="3" />
            <circle cx="40" cy={y} r="13" fill={INK} />
            <text x="40" y={y + 5} textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill={PAGE}>
              {index + 1}
            </text>
            <Label x={160} y={y + 28}>{step}</Label>
            {index < steps.length - 1 ? (
              <path d={`M160 ${y + 46} V${y + 66} M152 ${y + 58} L160 ${y + 66} L168 ${y + 58}`} fill="none" stroke={INK} strokeWidth="2.5" />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function ComicMotif({ motif }: { motif: ComicMotifId }) {
  switch (motif) {
    case "route":
      return (
        <div className="bg-[color:var(--ink-bg)] p-4">
          <RouteMotif className="h-auto w-full" />
        </div>
      );
    case "plano":
      return <ArchitectureDiagram />;
    case "frontera":
      return <Frontera />;
    case "mostrador":
      return <Mostrador />;
    case "pesos":
      return <Pesos />;
    case "ciclo":
      return <Ciclo />;
  }
}
