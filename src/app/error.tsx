"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";
import { siteProfile } from "@/lib/site-data";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      aria-labelledby="error-title"
      className="mx-auto w-full max-w-[var(--grid-max)] px-5 pb-16 pt-28 sm:px-8 lg:pb-24 lg:pt-36"
    >
      <p className="label-mono text-[color:var(--muted)]">Error inesperado</p>
      <h1
        id="error-title"
        className="mt-4 max-w-3xl font-display text-[2.35rem] font-semibold leading-[1.04] tracking-[-0.015em] text-balance sm:text-5xl"
      >
        Algo ha fallado al cargar esta página.
      </h1>
      <p role="alert" className="mt-5 max-w-xl text-pretty text-base leading-7 text-[color:var(--surface-foreground)]">
        El fallo es nuestro, no tuyo. Puedes volver a intentarlo; si se repite, escríbenos y lo
        miramos.
      </p>
      {error.digest ? (
        <p className="label-mono mt-4 text-[color:var(--muted)]">Referencia: {error.digest}</p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] px-5 text-sm font-semibold text-[color:var(--on-primary)] shadow-[var(--shadow-hard)] transition-colors duration-150 hover:bg-[color:var(--primary-hover)]"
        >
          Volver a intentarlo
        </button>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center border-2 border-[color:var(--foreground)] px-5 text-sm font-semibold transition-colors duration-150 hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]"
        >
          Volver al inicio
        </Link>
      </div>

      <p className="mt-8 max-w-xl border-t border-[color:var(--border-hover)] pt-5 text-sm leading-6">
        Contacto directo:{" "}
        <a href={siteProfile.links.mail} className="break-all underline underline-offset-4">
          {siteProfile.email}
        </a>{" "}
        ·{" "}
        <a href={`tel:${siteProfile.phone}`} className="whitespace-nowrap underline underline-offset-4">
          {siteProfile.displayPhone}
        </a>
      </p>
    </section>
  );
}
