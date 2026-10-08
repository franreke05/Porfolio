import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./projects.module.css";

/** Page gutter + max width shared by every project surface. */
export const shell = "mx-auto w-full max-w-[77.5rem] px-5 sm:px-8";

/** Ruled block: mono label + h2 on the left rail, content on the right. */
export function Block({
  label,
  title,
  children,
  id,
}: {
  label: string;
  title: string;
  children: ReactNode;
  id: string;
}) {
  return (
    <section aria-labelledby={id} className="ledger-rule grid gap-x-8 gap-y-6 py-10 lg:grid-cols-12 lg:py-14">
      <div className="lg:col-span-3">
        <p className="label-mono text-muted">{label}</p>
        <h2
          id={id}
          className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground"
        >
          {title}
        </h2>
      </div>
      <div className="lg:col-span-9">{children}</div>
    </section>
  );
}

/** Text link with a moving arrow; 44px tall target. */
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center gap-2 font-medium underline decoration-1 underline-offset-4 ${className}`}
    >
      {children}
      <span aria-hidden="true" className={styles.arrow}>
        →
      </span>
    </Link>
  );
}
