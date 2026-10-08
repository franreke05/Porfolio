"use client";

import { useEffect, useRef, useState } from "react";
import s from "./flashfix.module.css";

export type ComicScene = { id: string; n: number; name: string };

/**
 * Sticky chapter indicator. Plain anchors (works with JS off); the
 * observer only upgrades them with `aria-current` for the scene on screen.
 */
export function FlashfixChapterNav({ scenes }: { scenes: ComicScene[] }) {
  const [active, setActive] = useState(scenes[0]?.id);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const sections = scenes
      .map((scene) => document.getElementById(scene.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A thin band just above the middle of the viewport decides the scene.
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [scenes]);

  // Keep the current chapter visible inside the (horizontally scrollable) bar
  // without touching the page's own scroll position.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>("[aria-current]");
    if (!list || !link) return;
    const target = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, target) });
  }, [active]);

  return (
    <nav
      aria-label="Escenas del cómic"
      className="sticky top-16 z-30 border-y-2 border-[color:var(--foreground)] bg-[color:var(--foreground)]"
    >
      <ol ref={listRef} className={`${s.chapters} mx-auto flex max-w-[1240px] overflow-x-auto`}>
        {scenes.map((scene) => (
          <li key={scene.id} className="shrink-0 lg:flex-1">
            <a
              href={`#${scene.id}`}
              aria-current={active === scene.id ? "location" : undefined}
              className={`${s.chapterLink} flex min-h-11 items-center justify-center gap-2 whitespace-nowrap px-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em]`}
            >
              <span aria-hidden="true" className="opacity-70">
                {scene.n}
              </span>
              <span>
                <span className="sr-only">Escena {scene.n}: </span>
                {scene.name}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
