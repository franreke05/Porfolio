"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./comic.module.css";

export type ChapterLink = { label: string; href: string };

/**
 * Sticky chapter strip. Without JS it is a plain list of anchors; with JS it
 * marks the chapter on screen. It never intercepts or drives scrolling.
 */
export function ChapterIndicator({ chapters }: { chapters: ChapterLink[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter-index]"));
    if (scenes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.chapterIndex));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    scenes.forEach((scene) => observer.observe(scene));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const chip = list?.children[active] as HTMLElement | undefined;
    if (!list || !chip) return;
    list.scrollTo({ left: chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2 });
  }, [active]);

  return (
    <nav
      aria-label="Capítulos del cómic"
      className="on-ink sticky bottom-0 z-30 border-t-[3px] border-[color:var(--foreground)] bg-[color:var(--ink-bg)]"
    >
      <ol
        ref={listRef}
        className={`${styles.indicator} mx-auto flex max-w-[62rem] gap-1 overflow-x-auto px-3 sm:px-8`}
      >
        {chapters.map((chapter, index) => (
          <li key={chapter.href} className="flex-none">
            <a
              href={chapter.href}
              aria-current={index === active ? "true" : undefined}
              className={`${styles.chip} ${styles.bangers} flex min-h-11 items-center whitespace-nowrap px-3 text-base text-[color:var(--ink-fg)] outline-offset-[-3px]`}
            >
              {chapter.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
