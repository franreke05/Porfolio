import Link from "next/link";
import { projectHref } from "@/lib/portfolio";

type Box = {
  n: number;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string[];
  lines: string[];
  dashed?: boolean;
  href?: string;
};

type Connector = { from: [number, number]; to: [number, number]; arrow?: boolean; label?: string };

const INK = "var(--foreground)";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";

const wide: { viewBox: string; boxes: Box[]; connectors: Connector[] } = {
  viewBox: "0 0 960 392",
  boxes: [
    { n: 1, x: 30, y: 46, w: 240, h: 112, title: ["App OposiBot"], lines: ["Android · iOS"], dashed: true, href: projectHref("oposibot") },
    { n: 2, x: 360, y: 26, w: 240, h: 152, title: ["Backend"], lines: ["Reglas de negocio", "Autorización", "Acceso a datos"] },
    { n: 3, x: 690, y: 46, w: 240, h: 112, title: ["Backoffice"], lines: ["Android · iOS · Escritorio"] },
    { n: 4, x: 360, y: 268, w: 240, h: 100, title: ["Base de datos", "y autenticación"], lines: [] },
    { n: 5, x: 690, y: 268, w: 240, h: 100, title: ["Operación"], lines: ["Contenido · Tienda · Soporte"] },
  ],
  connectors: [
    { from: [270, 102], to: [360, 102], arrow: true },
    { from: [690, 102], to: [600, 102], arrow: true },
    { from: [480, 178], to: [480, 268], arrow: true },
    { from: [810, 158], to: [810, 268] },
  ],
};

const narrow: { viewBox: string; boxes: Box[]; connectors: Connector[] } = {
  viewBox: "0 0 340 518",
  boxes: [
    { n: 5, x: 184, y: 18, w: 144, h: 92, title: ["Operación"], lines: ["Contenido", "Tienda · Soporte"] },
    { n: 1, x: 12, y: 152, w: 144, h: 92, title: ["App OposiBot"], lines: ["Android · iOS"], dashed: true, href: projectHref("oposibot") },
    { n: 3, x: 184, y: 152, w: 144, h: 92, title: ["Backoffice"], lines: ["Android · iOS", "Escritorio"] },
    { n: 2, x: 12, y: 292, w: 316, h: 104, title: ["Backend"], lines: ["Reglas de negocio · Autorización", "Acceso a datos"] },
    { n: 4, x: 12, y: 444, w: 316, h: 60, title: ["Base de datos y autenticación"], lines: [] },
  ],
  connectors: [
    { from: [256, 152], to: [256, 110] },
    { from: [84, 244], to: [84, 292], arrow: true },
    { from: [256, 244], to: [256, 292], arrow: true },
    { from: [170, 396], to: [170, 444], arrow: true },
  ],
};

function Diagram({
  spec,
  markerId,
  className,
}: {
  spec: typeof wide;
  markerId: string;
  className: string;
}) {
  return (
    <svg viewBox={spec.viewBox} className={className} aria-hidden="true" focusable="false">
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
          <path d="M1 1 L9 5 L1 9" fill="none" stroke={INK} strokeWidth="1.2" />
        </marker>
      </defs>

      {spec.connectors.map((connector) => (
        <line
          key={`${connector.from.join("-")}-${connector.to.join("-")}`}
          x1={connector.from[0]}
          y1={connector.from[1]}
          x2={connector.to[0]}
          y2={connector.to[1]}
          stroke={INK}
          strokeWidth="1"
          markerEnd={connector.arrow ? `url(#${markerId})` : undefined}
        />
      ))}

      {spec.boxes.map((box) => {
        const content = (
          <>
            <rect
              x={box.x}
              y={box.y}
              width={box.w}
              height={box.h}
              fill="var(--background)"
              stroke={INK}
              strokeWidth="1.5"
              strokeDasharray={box.dashed ? "6 4" : undefined}
            />
            <circle cx={box.x} cy={box.y} r="12" fill={INK} />
            <text
              x={box.x}
              y={box.y + 4.5}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize="13"
              fontWeight="700"
              fill="var(--background)"
            >
              {box.n}
            </text>
            {box.title.map((line, index) => (
              <text
                key={line}
                x={box.x + 20}
                y={box.y + 36 + index * 21}
                fontFamily="var(--font-geist-sans), system-ui, sans-serif"
                fontSize="17"
                fontWeight="600"
                fill={INK}
              >
                {line}
              </text>
            ))}
            {box.lines.map((line, index) => (
              <text
                key={line}
                x={box.x + 20}
                y={box.y + 36 + box.title.length * 21 + 4 + index * 18}
                fontFamily={MONO}
                fontSize="11.5"
                fill="var(--surface-foreground)"
              >
                {line}
              </text>
            ))}
          </>
        );

        // The diagram is aria-hidden: the legend carries the accessible link.
        // This one is a pointer convenience only, kept out of the tab order.
        return box.href ? (
          <a key={box.n} href={box.href} tabIndex={-1}>
            {content}
          </a>
        ) : (
          <g key={box.n}>{content}</g>
        );
      })}
    </svg>
  );
}

function Callout({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-foreground font-mono text-xs font-bold text-background"
    >
      {n}
    </span>
  );
}

/** Annotated architecture drawing + its text-equivalent legend. */
export function ArchitectureDiagram() {
  return (
    <div>
      <Diagram spec={wide} markerId="plano-flecha-ancho" className="hidden h-auto w-full lg:block" />
      <Diagram
        spec={narrow}
        markerId="plano-flecha-estrecho"
        className="mx-auto h-auto w-full max-w-[26rem] lg:hidden"
      />

      <div className="mt-8 border-[1.5px] border-foreground bg-background p-5 sm:p-6">
        <h2 className="label-mono text-muted">Leyenda del plano</h2>
        <ol className="mt-4 grid gap-x-8 gap-y-4 font-mono text-[0.8125rem] leading-relaxed text-foreground md:grid-cols-2 lg:grid-cols-3">
          <li className="flex gap-3">
            <Callout n={1} />
            <span>
              <span className="sr-only">1. </span>
              <Link
                href={projectHref("oposibot")}
                className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 sm:min-h-0"
              >
                App OposiBot
              </Link>{" "}
              (proyecto aparte, línea discontinua). Consume el backend; nunca accede a la base de datos.
            </span>
          </li>
          <li className="flex gap-3">
            <Callout n={2} />
            <span>
              <span className="sr-only">2. </span>
              <strong>Backend.</strong> Concentra reglas de negocio, autorización y acceso a datos. Lo usan la
              app (1) y el backoffice (3).
            </span>
          </li>
          <li className="flex gap-3">
            <Callout n={3} />
            <span>
              <span className="sr-only">3. </span>
              <strong>Backoffice.</strong> Android · iOS · Escritorio. Trabaja siempre a través del backend.
            </span>
          </li>
          <li className="flex gap-3">
            <Callout n={4} />
            <span>
              <span className="sr-only">4. </span>
              <strong>Base de datos y autenticación.</strong> Solo el backend (2) llega hasta aquí.
            </span>
          </li>
          <li className="flex gap-3">
            <Callout n={5} />
            <span>
              <span className="sr-only">5. </span>
              <strong>Operación.</strong> Contenido, tienda y soporte, gestionados desde el backoffice (3).
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}
