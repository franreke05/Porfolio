import type { Metadata } from "next";
import Link from "next/link";
import { contactHref } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

const routes = [
  ["Proyectos", "/proyectos", "Todos los proyectos del estudio, por tipo."],
  ["Servicios", "/servicios", "Qué construimos y cómo lo planteamos."],
  ["Estudio", "/sobre-mi", "Quiénes somos y cómo trabajamos."],
] as const;

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="mx-auto w-full max-w-[var(--grid-max)] px-5 pb-16 pt-28 sm:px-8 lg:pb-24 lg:pt-36"
    >
      <p className="label-mono text-[color:var(--muted)]">Error 404</p>
      <h1
        id="not-found-title"
        className="mt-4 max-w-3xl font-display text-[2.35rem] font-semibold leading-[1.04] tracking-[-0.015em] text-balance sm:text-5xl"
      >
        Esta página no está en el taller.
      </h1>
      <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-[color:var(--surface-foreground)]">
        Puede que la dirección haya cambiado o que el enlace esté mal escrito. Desde aquí llegas a
        todo lo demás.
      </p>

      <ul className="mt-10 max-w-2xl border-t-2 border-[color:var(--foreground)]">
        {routes.map(([label, href, line]) => (
          <li key={href} className="border-b border-[color:var(--border-hover)]">
            <Link href={href} className="group block py-4">
              <span className="block text-lg font-bold underline-offset-4 group-hover:underline">
                {label}
              </span>
              <span className="mt-0.5 block text-sm leading-6 text-[color:var(--surface-foreground)]">
                {line}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] px-5 text-sm font-semibold text-[color:var(--on-primary)] shadow-[var(--shadow-hard)] transition-colors duration-150 hover:bg-[color:var(--primary-hover)]"
        >
          Volver al inicio
        </Link>
        <Link
          href={contactHref("general")}
          className="inline-flex min-h-12 items-center justify-center border-2 border-[color:var(--foreground)] px-5 text-sm font-semibold transition-colors duration-150 hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]"
        >
          Contactar con el estudio
        </Link>
      </div>
    </section>
  );
}
