import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projectHref } from "@/lib/portfolio";
import {
  APPS_PROGRESS,
  CATEGORIES,
  CONTACT_PROGRESS,
  CONTACT_ROWS,
  COPYRIGHT,
  FOUNDER,
  FOUNDER_KEY,
  FOUNDER_PROGRESS,
  HERO,
  SLOT_PROJECTS,
  categoryKey,
  projectKey,
} from "./content";
import styles from "./showroom.module.css";

/**
 * The home's content as plain server-rendered HTML. It is what search
 * engines, screen readers and no-WebGL visitors get; the 3D scene only
 * re-stages these same elements as its overlay.
 *
 * Every link keeps a real href (crawlable, opens in a new tab as usual).
 * In the home, the client wrapper reads `data-open` / `data-contact` /
 * `data-stage` and acts in place instead: a panel, the contact sheet, a stage.
 * Only names are written here; the rest waits for the owner's content.
 */

/** Stacked page only: the pale X box that stands where content will go. */
function Pending() {
  return (
    <span className={styles.pendingNote} aria-hidden="true">
      Contenido pendiente
    </span>
  );
}

export function HeroCopy() {
  return (
    <>
      <p className={styles.micro}>{HERO.micro}</p>
      <h1 className={styles.title}>
        <span>{HERO.titleA}</span>{" "}
        <span>
          {HERO.titleB} <em>{HERO.titleAccent}</em>
        </span>
      </h1>
      <p className={styles.body}>
        {HERO.body.map((line) => (
          <span key={line}>{line} </span>
        ))}
      </p>
      <Link href={HERO.ctaHref} className={styles.cta} data-contact="general">
        {HERO.cta}
        <ArrowUpRight className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
      </Link>
    </>
  );
}

export function ShowroomSections() {
  return (
    <>
      {CATEGORIES.map((category, index) => (
        <article key={category.id} id={index === 0 ? "servicios" : undefined} className={styles.caption} data-index={index} data-progress={category.progress}>
          <p className={styles.kicker}>Servicios</p>
          <h2>{category.name}</h2>
          <Pending />
          <Link href={category.href} data-open={categoryKey(index)}>
            Ver servicio<span className={styles.srOnly}>: {category.name}</span>
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </article>
      ))}

      <article id="trabajo" className={`${styles.caption} ${styles.catalogue}`} data-index={4} data-progress={APPS_PROGRESS}>
        <p className={styles.kicker}>Nuestro trabajo</p>
        <h2>Apps personalizadas</h2>
        <ul className={styles.projects}>
          {SLOT_PROJECTS.map((project) => (
            <li key={project.slug}>
              <Link href={projectHref(project.slug)} data-open={projectKey(project.slug)}>
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
        <Pending />
      </article>

      <article id="nosotros" className={`${styles.caption} ${styles.founder}`} data-index={6} data-progress={FOUNDER_PROGRESS}>
        <p className={styles.kicker}>Sobre nosotros</p>
        <h2>{FOUNDER.name}</h2>
        <Link href={FOUNDER.href} data-open={FOUNDER_KEY} className={styles.founderLink}>
          <Image src={FOUNDER.photo} alt={`Retrato de ${FOUNDER.name}`} width={120} height={160} sizes="120px" />
          <span>
            {FOUNDER.role} · Conócenos
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </Link>
      </article>

      <footer id="contacto" className={`${styles.caption} ${styles.contact}`} data-index={5} data-progress={CONTACT_PROGRESS}>
        <h2>¿Hablamos?</h2>
        <Link href={HERO.ctaHref} className={styles.cta} data-contact="general">
          {HERO.cta}
          <ArrowUpRight className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
        </Link>
        <ul className={styles.contactList}>
          {CONTACT_ROWS.filter((row) => row.kind !== "cta").map((row) => (
            <li key={row.href}>
              {row.kind === "link" ? (
                <Link href={row.href} data-stage={row.stage} data-contact={row.sheet ? "general" : undefined}>
                  {row.label}
                </Link>
              ) : (
                <a href={row.href}>{row.label}</a>
              )}
            </li>
          ))}
        </ul>
        <p className={styles.copyright}>{COPYRIGHT}</p>
      </footer>
    </>
  );
}
