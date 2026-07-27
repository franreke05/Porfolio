"use client";

import { Calendar, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { MagneticButton } from "@/components/magnetic-button";
import { siteProfile } from "@/lib/site-data";

const navItems = [
  ["Proyectos", "/proyectos"],
  ["Servicios", "/servicios"],
  ["Sobre mí",  "/sobre-mi"],
] as const;

/**
 * Site-wide nav — real route links with usePathname-driven active state,
 * not the old single-page IntersectionObserver anchor tracker (this is a
 * multi-route site now, not one scrolling page). Flat paper header, no
 * blur/glow: the "2022 tech" glass nav is exactly what this rebuild retired.
 * Includes a mobile menu — with real routes instead of same-page anchors,
 * a mobile visitor on e.g. /proyectos otherwise has no way to reach
 * /servicios or /sobre-mi without a menu.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on route change — adjusted during render (React's
  // recommended pattern for resetting state when a prop changes) rather than
  // in an effect, which would cause an extra cascading render.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b-2 border-[color:var(--foreground)] bg-[color:var(--background)]"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex h-16 w-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 text-sm font-semibold text-[color:var(--foreground)]"
        >
          <span className="flex h-8 w-8 items-center justify-center border-2 border-[color:var(--foreground)] font-mono text-xs font-bold text-[color:var(--foreground)] transition-colors group-hover:bg-[color:var(--foreground)] group-hover:text-[color:var(--background)]">
            FR
          </span>
          <span className="hidden sm:inline">{siteProfile.name}</span>
        </Link>

        {/* Nav — desktop */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          {navItems.map(([label, href]) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className="group relative py-2 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
                aria-current={isActive ? "page" : undefined}
              >
                <span className={isActive ? "text-[color:var(--foreground)]" : undefined}>{label}</span>
                <span
                  className={`absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[color:var(--primary)] transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* CTA */}
          <MagneticButton href="/#contacto" rounded="none" size="sm">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Llamada</span>
          </MagneticButton>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center border-2 border-[color:var(--foreground)] text-[color:var(--foreground)] md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Nav — mobile */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Principal"
            className="border-t-2 border-[color:var(--foreground)] bg-[color:var(--background)] md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <ul className="flex flex-col divide-y divide-[color:var(--border)] px-5 sm:px-6">
              {navItems.map(([label, href]) => {
                const isActive = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex min-h-12 items-center text-base font-semibold text-[color:var(--foreground)]"
                      aria-current={isActive ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
