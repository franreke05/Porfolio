"use client";

import { Calendar } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { siteProfile } from "@/lib/site-data";

const navItems = [
  ["Sistema",      "sistema"],
  ["Servicios",    "servicios"],
  ["Arquitectura", "arquitectura"],
  ["Proyectos",    "proyectos"],
  ["Proceso",      "proceso"],
  ["Sobre mí",     "sobre-mi"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const isHome   = pathname === "/";
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    if (!isHome) return; // observer only needed on home page

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.16, 0.28, 0.42] },
    );

    ["inicio", ...navItems.map(([, id]) => id as string), "contacto"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHome]);

  // On sub-pages, links go to /#section; on home, #section is fine too
  // Using /#section works on both (browser normalises same-origin anchors).
  const href = (id: string) => `/#${id}`;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-[color:var(--border)] bg-[rgba(7,10,16,0.82)] backdrop-blur-md"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 text-sm font-semibold text-[color:var(--foreground)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--primary)]/50 bg-[color:var(--surface-elevated)] font-mono text-xs font-bold text-[color:var(--primary)] transition group-hover:border-[color:var(--accent-cyan)]/70 group-hover:text-[color:var(--accent-cyan)]">
            FR
          </span>
          <span className="hidden sm:inline">{siteProfile.name}</span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-5 md:flex" aria-label="Principal">
          {navItems.map(([label, id]) => {
            const isActive = isHome && activeSection === id;
            return (
              <a
                key={id}
                href={href(id)}
                className="group relative py-2 text-sm text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
              >
                {label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-px origin-left bg-[color:var(--accent-cyan)] transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* CTA */}
        <a
          href={href("contacto")}
          className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition hover:-translate-y-px ${
            isHome && activeSection === "contacto"
              ? "border-[color:var(--primary)]/80 bg-[color:var(--accent-soft)] text-[color:var(--primary)]"
              : "border-[color:var(--border-hover)] text-[color:var(--primary)] hover:border-[color:var(--primary)]/60"
          }`}
        >
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Llamada</span>
        </a>
      </div>
    </motion.header>
  );
}
