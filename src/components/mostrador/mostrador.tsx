"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import styles from "./mostrador.module.css";

export type MostradorIssue = {
  /** Also the URL hash that mirrors the zoom state (#apps-moviles…). */
  id: string;
  ordinal: string;
  title: string;
  tagline: string;
  summary: string;
  deliverables: string[];
  href: string;
  cta: { label: string; href: string };
  style: { name: string; why: string };
  proof: Array<{ slug: string; name: string; descriptor: string; href: string; badge: ReactNode }>;
  proofNote?: string;
};

const TRAVEL_MS = 900;
const noopSubscribe = () => () => {};

/** One simple line motif per style. Decorative only. */
function Motif({ index }: { index: number }) {
  const common = { fill: "none", stroke: "#070807", strokeWidth: 5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (index === 0) {
    // Aventura: a route that leaves the frame.
    return (
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <path d="M-10 170 C40 150 40 110 85 112 S140 150 150 100 S150 40 215 28" {...common} strokeDasharray="2 14" />
        <circle cx="150" cy="100" r="13" fill="#f8e2bb" stroke="#070807" strokeWidth="5" />
        <circle cx="150" cy="100" r="3" fill="#070807" />
      </svg>
    );
  }
  if (index === 1) {
    // Novela gráfica: a page of panels that fit together.
    return (
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <g fill="#f8e2bb" stroke="#070807" strokeWidth="5" strokeLinejoin="round">
          <path d="M62 62 H128 V112 H62 Z" />
          <path d="M136 62 H178 V140 H136 Z" />
          <path d="M62 120 H128 V178 H62 Z" />
          <path d="M136 148 H178 V178 H136 Z" />
        </g>
      </svg>
    );
  }
  // Línea clara: one clean stroke.
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <circle cx="128" cy="128" r="42" fill="#f8e2bb" stroke="#070807" strokeWidth="5" />
      <path d="M20 176 H184" {...common} />
    </svg>
  );
}

export function Mostrador({ issues }: { issues: MostradorIssue[] }) {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [active, setActive] = useState<number | null>(null);
  const [moving, setMoving] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const stageRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const returnTo = useRef<number | null>(null);
  const moveFocus = useRef(false);
  const travelTimer = useRef<number | undefined>(undefined);
  const frame = useRef<number | undefined>(undefined);

  const go = useCallback(
    (next: number | null, options: { focus?: boolean; hash?: boolean } = {}) => {
      const { focus = true, hash = true } = options;
      setActive((current) => {
        if (current !== null) returnTo.current = current;
        return next;
      });
      moveFocus.current = focus;
      setMoving(true);
      window.clearTimeout(travelTimer.current);
      travelTimer.current = window.setTimeout(() => setMoving(false), TRAVEL_MS);
      setAnnouncement(
        next === null ? "Mostrador" : `Abierto: ${issues[next].title}. Estilo: ${issues[next].style.name}.`,
      );
      if (hash) {
        const url = next === null ? window.location.pathname + window.location.search : `#${issues[next].id}`;
        window.history.replaceState(window.history.state, "", url);
      }
    },
    [issues],
  );

  // The hash mirrors the zoom state: open from a deep link and follow manual hash changes.
  useEffect(() => {
    const fromHash = () => {
      const index = issues.findIndex((issue) => `#${issue.id}` === window.location.hash);
      go(index === -1 ? null : index, { focus: false, hash: false });
    };
    if (window.location.hash) fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.clearTimeout(travelTimer.current);
      if (frame.current !== undefined) window.cancelAnimationFrame(frame.current);
    };
  }, [go, issues]);

  // Focus follows the camera: into the open spread, back to the cover on close.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    if (active !== null) {
      pageRefs.current[active]?.focus({ preventScroll: true });
      const stage = stageRef.current;
      if (stage) {
        const rect = stage.getBoundingClientRect();
        if (rect.top < 0 || rect.bottom > window.innerHeight) stage.scrollIntoView({ block: "nearest" });
      }
    } else if (returnTo.current !== null) {
      buttonRefs.current[returnTo.current]?.focus({ preventScroll: true });
    }
  }, [active]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (active === null) return;
    if (event.key === "Escape") {
      event.preventDefault();
      go(null);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go((active + 1) % issues.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go((active + issues.length - 1) % issues.length);
    }
  };

  // Parallax: the vanishing point follows a fine pointer by a few pixels. No React state per frame.
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = stageRef.current;
    if (!stage || frame.current !== undefined) return;
    const { clientX, clientY } = event;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = undefined;
      const rect = stage.getBoundingClientRect();
      const nx = (clientX - rect.left) / rect.width - 0.5;
      const ny = (clientY - rect.top) / rect.height - 0.5;
      stage.style.setProperty("--px", `${(nx * 110).toFixed(1)}px`);
      stage.style.setProperty("--py", `${(ny * 60).toFixed(1)}px`);
    });
  };
  const onPointerLeave = () => {
    stageRef.current?.style.setProperty("--px", "0px");
    stageRef.current?.style.setProperty("--py", "0px");
  };

  const zoomed = active !== null;

  return (
    <div className={`${styles.root} ${moving ? styles.moving : ""}`} onKeyDown={onKeyDown}>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div
        ref={stageRef}
        className={styles.stage}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div className={styles.camera} data-zoomed={zoomed} data-active={active ?? undefined}>
          <div className={styles.counter} aria-hidden="true">
            <div className={styles.wall}>
              <span className={styles.sign}>Recomendados</span>
              <span className={styles.bubble}>¿Qué estilo buscas?</span>
            </div>
            <div className={styles.counterFront} />
            <div className={styles.bell}>
              <span className={styles.bellBase} />
              <span className={styles.bellDome} />
            </div>
          </div>

          {issues.map((issue, index) => {
            const open = active === index;
            const pageId = `mostrador-${issue.id}`;
            const titleId = `mostrador-${issue.id}-titulo`;
            return (
              <article
                key={issue.id}
                id={issue.id}
                className={styles.issue}
                data-i={index}
                data-open={open}
                data-dim={zoomed && !open}
                aria-labelledby={titleId}
                inert={zoomed && !open}
              >
                <div className={styles.shadow} aria-hidden="true" />
                <div className={styles.book}>
                  <div className={styles.edgeBottom} aria-hidden="true" />
                  <div className={styles.edgeRight} aria-hidden="true" />

                  <div className={styles.cover}>
                    <div className={styles.front} inert={open}>
                      <p className={styles.masthead}>
                        <span>El mostrador</span>
                        <span>N.º {issue.ordinal}</span>
                      </p>
                      <h3 id={titleId} className={styles.coverTitle} data-long={issue.title.length > 16}>
                        {issue.title}
                      </h3>
                      <div className={styles.art}>
                        <Motif index={index} />
                        <p className={styles.styleTag}>Estilo: {issue.style.name}</p>
                      </div>
                      <p className={styles.tagline}>{issue.tagline}</p>
                      <button
                        ref={(node) => {
                          buttonRefs.current[index] = node;
                        }}
                        type="button"
                        className={styles.coverButton}
                        aria-expanded={open}
                        aria-controls={pageId}
                        onClick={() => go(index)}
                      >
                        Abrir {issue.title}
                      </button>
                    </div>
                    <div className={styles.inner}>
                      <p className={styles.innerKicker}>Por qué este estilo</p>
                      <p className={styles.innerStyle}>{issue.style.name}</p>
                      <p className={styles.innerWhy}>{issue.style.why}</p>
                    </div>
                  </div>

                  <div
                    ref={(node) => {
                      pageRefs.current[index] = node;
                    }}
                    id={pageId}
                    className={styles.page}
                    role="group"
                    aria-labelledby={titleId}
                    tabIndex={-1}
                    inert={hydrated && !open}
                    data-lenis-prevent=""
                  >
                    <p className={styles.label}>
                      N.º {issue.ordinal} · {issue.title}
                    </p>
                    <p className={styles.summary}>{issue.summary}</p>

                    <div className={styles.block}>
                      <p className={styles.label}>Qué incluye</p>
                      <ul className={styles.list}>
                        {issue.deliverables.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.block}>
                      <p className={styles.label}>Lo respalda</p>
                      {issue.proof.length > 0 ? (
                        <ul className={styles.proof}>
                          {issue.proof.map((project) => (
                            <li key={project.slug}>
                              <Link href={project.href} className={styles.proofLink}>
                                {project.name}
                              </Link>
                              {project.badge}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {issue.proofNote ? <p className={styles.summary}>{issue.proofNote}</p> : null}
                    </div>

                    <div className={styles.actions}>
                      <Link href={issue.cta.href} className={styles.cta}>
                        {issue.cta.label}
                        <span aria-hidden="true">→</span>
                      </Link>
                      <Link href={issue.href} className={styles.more}>
                        {issue.title}: ver el servicio completo
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div key={String(active)} className={styles.veil} aria-hidden="true" />

        {zoomed ? (
          <div className={styles.hud}>
            <button type="button" className={styles.hudButton} onClick={() => go(null)}>
              <span aria-hidden="true">←</span> Volver al mostrador
            </button>
            <div className={styles.hudGroup}>
              <button
                type="button"
                className={styles.hudButton}
                aria-label="Número anterior"
                onClick={() => go((active + issues.length - 1) % issues.length)}
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                className={styles.hudButton}
                aria-label="Número siguiente"
                onClick={() => go((active + 1) % issues.length)}
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>
        ) : (
          <p className={`label-mono ${styles.hint}`}>Elige un número para abrirlo</p>
        )}
      </div>
    </div>
  );
}
