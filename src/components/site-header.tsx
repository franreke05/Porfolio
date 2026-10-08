"use client";

import { CalendarDays, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { contactHref } from "@/lib/portfolio";
import { currentStage, sendToShowroom, subscribeToStage } from "@/components/showroom/bus";
import type { StageId } from "@/components/showroom/content";

/**
 * Everything lives in the home: each item is a stage of the showroom.
 * `href` is the real, crawlable address (/#trabajo); on the home the click
 * moves the camera instead. `section` is the route family the item still
 * stands for on the other pages.
 */
const navItems: ReadonlyArray<{ label: string; href: string; stage: StageId; section: string | null }> = [
  { label: "Inicio", href: "/", stage: "inicio", section: null },
  { label: "Nuestro trabajo", href: "/#trabajo", stage: "trabajo", section: "/proyectos" },
  { label: "Servicios", href: "/#servicios", stage: "servicios", section: "/servicios" },
  { label: "Sobre nosotros", href: "/#nosotros", stage: "nosotros", section: "/sobre-mi" },
];

const inSection = (pathname: string, section: string | null) =>
  section !== null && (pathname === section || pathname.startsWith(`${section}/`));

const plainClick = (event: MouseEvent) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

/** The pill's dot breathes slowly; the calendar tips when the pill is hovered. */
const PILL_CSS = `
@keyframes orykai-breathe{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
.orykai-pill-dot{animation:orykai-breathe 3.6s ease-in-out infinite}
.orykai-pill-icon{transition:transform .28s cubic-bezier(.2,.7,.2,1)}
.orykai-pill:hover .orykai-pill-icon,.orykai-pill:focus-visible .orykai-pill-icon{transform:rotate(-10deg) translateY(-1px)}
.orykai-pill:active{transform:scale(.97)}
@media (prefers-reduced-motion:reduce){.orykai-pill-dot{animation:none;opacity:.9}.orykai-pill-icon{transition:none}.orykai-pill:hover .orykai-pill-icon,.orykai-pill:focus-visible .orykai-pill-icon{transform:none}.orykai-pill:active{transform:none}}
`;

// The home marks the dark, scene-covered part of the page with
// [data-scene-surface]. While the header sits over it, it floats in cream
// with no bar; anywhere else it is the solid ink-on-paper bar.
const subscribeToScroll = (notify: () => void) => {
  window.addEventListener("scroll", notify, { passive: true });
  window.addEventListener("resize", notify);
  return () => {
    window.removeEventListener("scroll", notify);
    window.removeEventListener("resize", notify);
  };
};

const isOverScene = () => {
  const surface = document.querySelector("[data-scene-surface]");
  if (!surface) return false;
  const rect = surface.getBoundingClientRect();
  return rect.top <= 32 && rect.bottom >= 80;
};

/**
 * Site-wide header, no entrance animation: the brand and nav are
 * server-rendered visible. The mobile menu is a disclosure (not a modal):
 * Escape closes it and returns focus to the toggle, and focus moves to the
 * first link when it opens.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const home = pathname === "/";
  const overScene = useSyncExternalStore(subscribeToScroll, isOverScene, () => true);
  const floating = home && overScene && !open;
  // On the home the active link is the stage the camera is on.
  const stage = useSyncExternalStore(subscribeToStage, currentStage, () => "inicio" as StageId | null);

  const isActive = (item: (typeof navItems)[number]) => (home ? stage === item.stage : inSection(pathname, item.section));
  /** On the home, travel inside the room instead of navigating. */
  const toStage = (target: StageId) => (event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (!home || !plainClick(event)) return;
    if (sendToShowroom({ type: "stage", stage: target, keyboard: event.detail === 0 })) event.preventDefault();
  };
  const toContact = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!home || !plainClick(event)) return;
    if (sendToShowroom({ type: "contact" })) event.preventDefault();
  };

  // Close on route change — adjusted during render rather than in an effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    // The menu only exists below `md`; drop it if the viewport grows past that.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const ink = floating ? "text-[#f5eee1]" : "text-[color:var(--foreground)]";

  return (
    <header
      data-tone={floating ? "scene" : "solid"}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-200 ${
        floating ? "border-b border-transparent bg-transparent" : "border-b border-[color:var(--border-hover)] bg-[color:var(--background)]"
      }`}
    >
      <div
        className={`mx-auto flex w-full items-center justify-between gap-4 transition-[height] duration-200 ${
          home ? "px-5 md:px-[clamp(1.25rem,9.7vw,11rem)]" : "max-w-[var(--grid-max)] px-5 sm:px-8"
        } ${floating ? "h-[4.5rem] md:h-[6.5rem]" : "h-16"}`}
      >
        <div className="flex items-center gap-[clamp(1.5rem,5vw,5.5rem)]">
          <Link href="/" onClick={toStage("inicio")} aria-label="ORYKAI SOFTWARE, inicio" className={`flex min-h-11 flex-col items-center justify-center leading-none ${ink}`}>
            <span className="pl-[0.34em] text-[1.6rem] font-normal tracking-[0.34em] md:text-[2.05rem]">ORYKAI</span>
            <span className="mt-[0.45rem] pl-[0.62em] text-[0.56rem] font-medium tracking-[0.62em] opacity-90 md:text-[0.625rem]">SOFTWARE</span>
          </Link>

          <nav className="hidden items-center gap-[clamp(1.25rem,2.4vw,2.5rem)] md:flex" aria-label="Principal">
            {navItems.map((item) => {
              const { label, href } = item;
              const active = isActive(item);
              const tone = floating
                ? active
                  ? "border-[#f2b961] text-[#f5eee1]"
                  : "border-transparent text-[#f5eee1] hover:border-[#f5eee1]/60"
                : active
                  ? "border-[color:var(--foreground)] font-semibold text-[color:var(--foreground)]"
                  : "border-transparent text-[color:var(--surface-foreground)] hover:border-[color:var(--border-hover)] hover:text-[color:var(--foreground)]";
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={toStage(item.stage)}
                  aria-current={active ? (home ? "location" : "true") : undefined}
                  className={`inline-flex min-h-11 items-center whitespace-nowrap text-[0.9375rem] transition-colors duration-150 ${
                    floating ? "[text-shadow:0_1px_12px_rgba(20,13,7,0.85)]" : ""
                  }`}
                >
                  <span className={`border-b py-1 ${tone}`}>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <style>{PILL_CSS}</style>
          <Link
            href={contactHref("general")}
            onClick={toContact}
            aria-haspopup={home ? "dialog" : undefined}
            className={`orykai-pill inline-flex min-h-11 items-center gap-2.5 rounded-full px-5 text-[0.9375rem] font-semibold transition-[background-color,transform] duration-150 md:min-h-[3rem] md:px-7 ${
              floating
                ? "bg-[#f7f1e6] text-[#1d150e] hover:bg-white"
                : "bg-[color:var(--foreground)] text-[color:var(--background)] hover:bg-[color:var(--surface-foreground)]"
            }`}
          >
            <CalendarDays className="orykai-pill-icon hidden h-[1.05rem] w-[1.05rem] sm:block" aria-hidden="true" />
            Hablamos
            <span className={`orykai-pill-dot h-1.5 w-1.5 rounded-full ${floating ? "bg-[#c8862a]" : "bg-[#f2b961]"}`} aria-hidden="true" />
          </Link>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            className={`flex h-11 w-11 items-center justify-center md:hidden ${ink}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        ref={menuRef}
        id="mobile-nav"
        aria-label="Principal (móvil)"
        hidden={!open}
        className="border-t border-[color:var(--border-hover)] bg-[color:var(--background)] md:hidden"
      >
        <ul className="px-5 sm:px-8">
          {navItems.map((item) => (
            <li key={item.href} className="border-b border-[color:var(--border)] last:border-b-0">
              <Link
                href={item.href}
                aria-current={isActive(item) ? (home ? "location" : "true") : undefined}
                onClick={toStage(item.stage)}
                className="flex min-h-12 items-center text-base font-semibold text-[color:var(--foreground)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
