import type { CSSProperties } from "react";
import Link from "next/link";
import { contactHref } from "@/lib/portfolio";
import { processSteps, stackGroups } from "@/lib/site-data";
import { FounderPortrait } from "./founder-portrait";
import styles from "./founder-profile.module.css";

const FOUNDER_NAME = "Francisco Requena";
const FOUNDER_ROLE = "Fundador de ORYKAI SOFTWARE";

/**
 * Every fact restates something already published on this page or in
 * src/lib/site-data.ts (siteProfile.shortBio, stackGroups, processSteps).
 * Nothing here is new information: no years, client counts or awards.
 */
const facts = [
  { label: "Base", value: "Almería, España" },
  { label: "Cómo", value: "Trabajo en remoto" },
  { label: "Stack", value: stackGroups.map((group) => group.title).join(" · ") },
  { label: "Método", value: `${processSteps.length} pasos, los mismos en todos los proyectos` },
];

/** Who leads the studio: animated portrait, facts, the four-step method and the page's CTA. */
export function FounderProfile({ portraitSrc }: { portraitSrc: string }) {
  return (
    <section className={styles.panel} aria-labelledby="perfil-fundador">
      <div className={styles.top}>
        <FounderPortrait src={portraitSrc} alt={`Retrato de ${FOUNDER_NAME}`} />

        <div className={styles.body}>
          <p className={styles.eyebrow}>Quién dirige el estudio</p>
          <h2 id="perfil-fundador" className={styles.name}>
            {FOUNDER_NAME.split(" ").map((word, index) => (
              <span key={word} className={styles.word} style={{ "--i": index } as CSSProperties}>
                {word}
                {index === 0 ? " " : ""}
              </span>
            ))}
          </h2>
          <p className={styles.role}>{FOUNDER_ROLE}</p>
          <p className={styles.lead}>
            Quien define el alcance contigo es quien diseña y escribe el código. Sin intermediarios entre lo que
            necesitas y lo que se construye.
          </p>

          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.actions}>
            <Link href={contactHref("general")} className={styles.cta}>
              Hablamos
              <span aria-hidden="true" className={styles.ctaArrow}>
                →
              </span>
            </Link>
            <Link href="/" className={styles.back}>
              Volver al showroom
            </Link>
          </div>
        </div>
      </div>

      <div id="como-trabajamos" className={styles.method}>
        <div className={styles.methodHead}>
          <h3 className={styles.methodTitle}>Cómo trabajamos</h3>
          <p className={styles.methodIntro}>
            Cuatro pasos, los mismos en todos los proyectos. El plazo se fija cuando el alcance está definido, no
            antes.
          </p>
        </div>

        <div className={styles.stepsWrap}>
          <span className={styles.track} aria-hidden="true">
            <span className={styles.line} />
          </span>
          <ol className={styles.steps}>
          {processSteps.map((step, index) => (
            <li key={step.title} className={styles.step}>
              <span className={styles.dot} aria-hidden="true" />
              <p className={styles.stepMeta}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <span>{step.output}</span>
              </p>
              <h4 className={styles.stepTitle}>{step.title}</h4>
              <p className={styles.stepText}>{step.text}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
