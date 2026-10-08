import Link from "next/link";
import { projectHref } from "@/lib/portfolio";

type Mode = "comic" | "profesional";

/**
 * Persistent "Cómic | Profesional" switch, shown at the top of both pages of
 * every project. Real links; sticky under the fixed site header on mobile.
 * It also provides the offset for that fixed header (h-16).
 */
export function ModeSwitch({ slug, active, name }: { slug: string; active: Mode; name: string }) {
  const modes: Array<{ id: Mode; label: string; href: string }> = [
    { id: "comic", label: "Cómic", href: `${projectHref(slug)}/comic` },
    { id: "profesional", label: "Profesional", href: projectHref(slug) },
  ];

  return (
    <>
      <div className="h-16" aria-hidden="true" />
      <nav
        aria-label={`Modo de lectura de ${name}`}
        className="sticky top-16 z-40 border-b-2 border-[color:var(--foreground)] bg-[color:var(--background)] md:static"
      >
        <div className="mx-auto flex w-full max-w-[77.5rem] items-center justify-between gap-4 px-5 py-2 sm:px-8">
          <p className="label-mono hidden text-[color:var(--muted)] sm:block">
            {name} · dos formas de leerlo
          </p>
          <ul className="flex w-full border-2 border-[color:var(--foreground)] shadow-[3px_3px_0_var(--foreground)] sm:w-auto">
            {modes.map((mode) => {
              const current = mode.id === active;
              return (
                <li key={mode.id} className="flex-1 sm:flex-none">
                  <Link
                    href={mode.href}
                    aria-current={current ? "page" : undefined}
                    className={`flex min-h-11 items-center justify-center gap-2 px-5 font-comic text-xl tracking-[0.06em] outline-offset-[-4px] sm:min-w-[9.5rem] ${
                      current
                        ? "bg-[color:var(--foreground)] text-[color:var(--background)] focus-visible:outline-[color:var(--background)]"
                        : "bg-[color:var(--background)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-elevated)]"
                    }`}
                  >
                    <span aria-hidden="true" className="text-sm">
                      {current ? "●" : "○"}
                    </span>
                    {mode.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
