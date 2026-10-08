"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { contactHref } from "@/lib/portfolio";
import { siteProfile } from "@/lib/site-data";

const navItems = [
  ["Nuestro trabajo", "/proyectos"],
  ["Servicios", "/servicios"],
  ["Sobre nosotros", "/sobre-mi"],
  ["Contacto", "/contacto"],
] as const;

/** Slim site footer: brand line, navigation, public contact details, one CTA. */
export function Footer() {
  // The home ends on the last frame of the showroom: its footer content is
  // signage inside the scene (and plain HTML in the no-WebGL fallback).
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="border-t-2 border-[color:var(--foreground)] bg-[color:var(--surface)]">
      <div className="mx-auto w-full max-w-[var(--grid-max)] px-5 py-10 sm:px-8 lg:py-12">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.7fr)_minmax(0,1.1fr)] md:gap-10">
          <div>
            <p className="text-base font-bold tracking-[-0.01em]">ORYKAI</p>
            <p className="label-mono mt-1 text-[color:var(--muted)]">SOFTWARE</p>
            <Link
              href={contactHref("general")}
              className="mt-5 inline-flex min-h-11 items-center border-2 border-[color:var(--foreground)] px-4 text-sm font-semibold transition-colors duration-150 hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]"
            >
              Reservar reunión
            </Link>
          </div>

          <nav aria-label="Pie de página">
            <ul>
              {navItems.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="inline-flex min-h-9 items-center text-sm underline-offset-4 hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <address className="not-italic">
            <p className="label-mono text-[color:var(--muted)]">Contacto directo</p>
            <p className="mt-2">
              <a
                href={siteProfile.links.mail}
                className="inline-flex min-h-9 items-center break-all text-sm underline underline-offset-4"
              >
                {siteProfile.email}
              </a>
            </p>
            <p>
              <a
                href={`tel:${siteProfile.phone}`}
                className="inline-flex min-h-9 items-center text-sm underline underline-offset-4"
              >
                {siteProfile.displayPhone}
              </a>
            </p>
          </address>
        </div>

        <p className="mt-8 border-t border-[color:var(--border-hover)] pt-5 text-xs text-[color:var(--muted)]">
          © 2026 ORYKAI SOFTWARE
        </p>
      </div>
    </footer>
  );
}
