import type { CSSProperties } from "react";
import Link from "next/link";
import { primaryButton } from "@/components/projects/project-cta";
import { ScopeLedger } from "@/components/projects/scope-ledger";
import { ProjectCover } from "@/components/shop/project-cover";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ComicScript } from "@/lib/comics";
import { contactHref, projectHref, type PortfolioProject } from "@/lib/portfolio";
import { ChapterIndicator, type ChapterLink } from "./chapter-indicator";
import { ComicScenePanel } from "./comic-scene";
import styles from "./comic.module.css";

const sceneShell = "mx-auto flex w-full max-w-[62rem] flex-col justify-center px-4 sm:px-8";
/* One panel group per screen on mobile; natural height from md up. */
const sceneFrame = `${sceneShell} min-h-[calc(100svh-11rem)] scroll-mt-36 md:scroll-mt-20 py-6 md:min-h-0 md:py-8`;

/** Vertical scroll comic built from a typed script. Server component. */
export function ComicReader({ script, project }: { script: ComicScript; project: PortfolioProject }) {
  const chapters: ChapterLink[] = [{ label: "Portada", href: "#portada" }];
  const chapterIndex: number[] = [];

  script.scenes.forEach((scene, index) => {
    if (index === 0 || script.scenes[index - 1].chapter !== scene.chapter) {
      chapters.push({ label: scene.chapter, href: `#escena-${index + 1}` });
    }
    chapterIndex.push(chapters.length - 1);
  });

  const lastNumber = script.scenes.length + 1;
  chapters.push({ label: script.statusChapter, href: `#escena-${lastNumber}` });

  const notOpen = project.cta.intent === "requenadesk";
  const academic = project.category === "academic";

  return (
    <article className={styles.reader} style={{ "--accent": script.accent } as CSSProperties}>
      {/* ── Portada ── */}
      <section
        id="portada"
        data-chapter-index={0}
        aria-labelledby="comic-titulo"
        className={`${sceneShell} scroll-mt-36 md:scroll-mt-20 gap-8 py-8 md:grid md:grid-cols-[minmax(0,23rem)_1fr] md:items-center md:gap-12 md:py-12`}
      >
        <div className="w-full max-w-[19rem] self-center shadow-[8px_8px_0_var(--foreground)] md:max-w-none">
          <ProjectCover slug={project.slug} size="lg" priority />
        </div>
        <div className="flex flex-col items-start gap-5">
          <p className={styles.tag}>Cómic · {script.scenes.length + 1} escenas</p>
          <h1
            id="comic-titulo"
            className={`${styles.bangers} text-[clamp(3rem,11vw,5.5rem)] leading-[0.9] text-[color:var(--foreground)]`}
          >
            {project.name}
            <span className="sr-only">: el cómic</span>
          </h1>
          <p className="font-display text-2xl leading-snug sm:text-[1.75rem]">{project.descriptor}</p>
          <StatusBadge
            status={project.status}
            label={academic ? project.statusNote : undefined}
            note={academic ? undefined : project.statusNote}
            className="!flex-wrap !whitespace-normal"
          />
          <p className={`${styles.captionBox} ${styles.tiltA} max-w-[30rem] text-[0.9375rem] leading-snug`}>
            Un storyboard: viñetas dibujadas con tipografía y formas, sin capturas ni interfaz inventada. El
            guion sale de la ficha profesional del proyecto, sin añadirle nada.
          </p>
          <a
            href="#escena-1"
            className="inline-flex min-h-12 items-center gap-2 border-[3px] border-[color:var(--foreground)] bg-[color:var(--accent)] px-5 text-base font-semibold text-[color:var(--foreground)] shadow-[4px_4px_0_var(--foreground)]"
          >
            Empezar a leer <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      {/* ── Escenas ── */}
      {script.scenes.map((scene, index) => {
        const number = index + 1;
        const headingId = `escena-${number}-titulo`;
        return (
          <section
            key={scene.id}
            id={`escena-${number}`}
            data-chapter-index={chapterIndex[index]}
            aria-labelledby={headingId}
            className={sceneFrame}
          >
            <p className="label-mono mb-3 flex items-center justify-between gap-4 text-[color:var(--surface-foreground)]">
              <span>{scene.chapter}</span>
              <span aria-label={`Escena ${number} de ${lastNumber}`}>
                {String(number).padStart(2, "0")} / {String(lastNumber).padStart(2, "0")}
              </span>
            </p>
            <div className={`${styles.reveal} ${styles.fill}`}>
              <ComicScenePanel scene={scene} motif={script.motif} headingId={headingId} />
            </div>
          </section>
        );
      })}

      {/* ── Estado actual: generado desde el catálogo, nunca guionizado ── */}
      <section
        id={`escena-${lastNumber}`}
        data-chapter-index={chapters.length - 1}
        aria-labelledby="comic-estado"
        className={`${sceneShell} scroll-mt-36 md:scroll-mt-20 py-6 md:py-8`}
      >
        <p className="label-mono mb-3 flex items-center justify-between gap-4 text-[color:var(--surface-foreground)]">
          <span>{script.statusChapter}</span>
          <span aria-label={`Escena ${lastNumber} de ${lastNumber}`}>
            {String(lastNumber).padStart(2, "0")} / {String(lastNumber).padStart(2, "0")}
          </span>
        </p>
        <div className={`${styles.panel} ${styles.reveal} flex flex-col gap-8 p-6 sm:p-10`}>
          <div className="flex flex-col items-start gap-4">
            <p className={styles.chapterWord} style={{ color: "var(--accent)" }}>
              {script.statusChapter}
            </p>
            <h2
              id="comic-estado"
              className="text-balance font-display text-[1.75rem] font-semibold leading-[1.08] tracking-tight sm:text-[2.5rem]"
            >
              Así está {project.name} hoy, sin adornos.
            </h2>
            <StatusBadge
              status={project.status}
              label={academic ? project.statusNote : undefined}
              note={academic ? undefined : project.statusNote}
              className="!flex-wrap !whitespace-normal"
            />
          </div>

          <ScopeLedger scope={project.scope} />

          <div className="flex flex-col items-start gap-4 border-t-[3px] border-[color:var(--foreground)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-start gap-2">
              <Link href={contactHref(project.cta.intent)} className={primaryButton}>
                {project.cta.label}
              </Link>
              {notOpen ? (
                <p className="max-w-[30rem] text-sm leading-snug text-[color:var(--surface-foreground)]">
                  Hoy no se pueden crear cuentas: te avisamos cuando lo abramos a otras empresas.
                </p>
              ) : null}
            </div>
            <Link
              href={projectHref(project.slug)}
              className="inline-flex min-h-11 items-center gap-2 text-base font-semibold underline decoration-2 underline-offset-4"
            >
              Ver ficha profesional <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="h-10" aria-hidden="true" />
      <ChapterIndicator chapters={chapters} />
    </article>
  );
}
