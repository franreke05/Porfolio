"use client";

import dynamic from "next/dynamic";
import { type FocusEvent, type MouseEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { INTENTS } from "@/lib/leads/model";
import { type ShowroomCommand, listenToHeader, reportStage } from "./bus";
import { type ContactRow, ENTRIES, FOUNDER_KEY, STAGES, type ShowroomEntry, type StageId, TICKS, captionAt, findEntry, isStage, stageAt, tickAt } from "./content";
import { ContactSheet, type ContactContext, DetailPanel } from "./sheets";
import { createStore } from "./store";
import styles from "./showroom.module.css";

// The whole 3D bundle (three + fiber + drei) loads only in the browser, and
// only when WebGL is actually available.
const ShowroomScene = dynamic(() => import("./scene"), { ssr: false, loading: () => null });

const noop = () => () => {};

let webglSupport: boolean | null = null;
function detectWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2") ?? probe.getContext("webgl");
    webglSupport = Boolean(context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (notify: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", notify);
      return () => media.removeEventListener("change", notify);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const isQa = () => new URLSearchParams(window.location.search).has("qa");

/** Keys that scroll the page: the only ones that interrupt a camera travel. */
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);
/** Stage anchors of the stacked (no-WebGL / reduced-motion) page, in document order. */
const ANCHORS: StageId[] = ["servicios", "trabajo", "nosotros", "contacto"];

/** "#trabajo/oposibot" → that entry; "#trabajo" → that stage. */
function readHash(): { entry?: ShowroomEntry; stage?: StageId } {
  let value = window.location.hash.slice(1);
  try {
    value = decodeURIComponent(value);
  } catch {
    /* keep the raw value */
  }
  const entry = findEntry(value);
  if (entry) return { entry };
  const head = value.split("/")[0];
  return isStage(head) ? { stage: head } : {};
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Props = {
  /** Server-rendered hero copy (the page's h1 lives here). */
  hero: ReactNode;
  /** Server-rendered categories + catalogue. */
  sections: ReactNode;
};

export function ShowroomExperience({ hero, sections }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const tween = useRef(0);
  /** Stacked page: a requested stage stays marked until the visitor scrolls on (short pages cannot bring every anchor to the top). */
  const pinnedUntil = useRef(0);
  const [initialStore] = useState(createStore);
  const storeRef = useRef(initialStore);

  const webgl = useSyncExternalStore(noop, detectWebGL, () => false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const mobile = useMediaQuery("(max-width: 768px)");
  // /?qa=1 hides every HTML overlay so captures can be compared with the clean plate.
  const qa = useSyncExternalStore(noop, isQa, () => false);
  const [lost, setLost] = useState(false);
  const [ready, setReady] = useState(false);
  const [caption, setCaption] = useState(-1);
  const [tick, setTick] = useState(0);
  const [away, setAway] = useState(false);
  const [stage, setStage] = useState<StageId | null>("inicio");
  /** Key of the entry whose detail panel is open. */
  const [panel, setPanel] = useState<string | null>(null);
  const [contact, setContact] = useState<ContactContext | null>(null);

  const mode = !webgl || lost ? "static" : reduced ? "still" : "immersive";
  const immersive = mode === "immersive";

  /** Move the page (and so the camera) to a progress value, at walking pace. */
  const travelTo = useCallback((progress: number) => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const range = root.offsetHeight - stage.offsetHeight;
    const from = window.scrollY;
    const to = root.getBoundingClientRect().top + from + clamp01(progress) * range;
    const distance = to - from;
    cancelAnimationFrame(tween.current);
    if (Math.abs(distance) < 2) return;
    const duration = Math.min(2600, Math.max(800, Math.abs(distance) * 0.75));
    const started = performance.now();

    const stop = () => {
      cancelAnimationFrame(tween.current);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", onKey);
    };
    const onKey = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) stop();
    };
    const step = (now: number) => {
      const t = clamp01((now - started) / duration);
      window.scrollTo({ top: from + distance * easeInOut(t), behavior: "instant" });
      if (t < 1) tween.current = requestAnimationFrame(step);
      else stop();
    };
    // The visitor always wins: any scroll input cancels the travel.
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", onKey);
    tween.current = requestAnimationFrame(step);
  }, []);

  /** Be there at once: deep links and first paint. */
  const jumpTo = useCallback((progress: number) => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    cancelAnimationFrame(tween.current);
    const range = root.offsetHeight - stage.offsetHeight;
    window.scrollTo({ top: root.getBoundingClientRect().top + window.scrollY + clamp01(progress) * range, behavior: "instant" });
    storeRef.current.snap = true;
    storeRef.current.invalidate();
  }, []);

  const closeSheets = useCallback(() => {
    const store = storeRef.current;
    store.focus = null;
    store.lean = false;
    store.invalidate();
    setPanel(null);
    setContact(null);
  }, []);

  /** A header link, a tick or a plaque line: go to that stage of the room. */
  const goStage = useCallback(
    (next: StageId, options: { instant?: boolean; keyboard?: boolean } = {}) => {
      closeSheets();
      if (immersive) {
        if (options.instant) jumpTo(STAGES[next].progress);
        else travelTo(STAGES[next].progress);
      } else {
        pinnedUntil.current = performance.now() + 1200;
        setStage(next);
        if (next === "inicio") window.scrollTo({ top: 0, behavior: reduced || options.instant ? "instant" : "smooth" });
        else document.getElementById(next)?.scrollIntoView({ block: "start", behavior: reduced || options.instant ? "instant" : "smooth" });
      }
      // Keyboard: land on the stage's first control (its focus brings the camera along).
      if (options.keyboard && next !== "inicio") document.getElementById(next)?.querySelector<HTMLElement>("a[href], button")?.focus({ preventScroll: true });
    },
    [closeSheets, immersive, jumpTo, reduced, travelTo],
  );

  /** Open an entry's detail panel in place: the camera frames the object, the page stays. */
  const openEntry = useCallback(
    (key: string, options: { instant?: boolean } = {}) => {
      const entry = findEntry(key);
      if (!entry) return;
      const store = storeRef.current;
      store.focus = key;
      store.lean = false;
      setContact(null);
      setPanel(key);
      if (immersive) {
        if (options.instant) jumpTo(entry.progress);
        else travelTo(entry.progress);
      }
      store.invalidate();
    },
    [immersive, jumpTo, travelTo],
  );

  const openContact = useCallback((context: ContactContext) => {
    const store = storeRef.current;
    store.focus = null;
    store.lean = true;
    store.invalidate();
    setPanel(null);
    setContact(context);
  }, []);

  // Deep links: /#trabajo opens on that stage, /#trabajo/oposibot with its panel open.
  // Re-applied when the mode settles (the server render is always the stacked page).
  useEffect(() => {
    const apply = (instant: boolean) => {
      const { entry, stage: target } = readHash();
      if (entry) openEntry(entry.key, { instant });
      else if (target) goStage(target, { instant });
    };
    apply(true);
    // Once more after the browser's own anchor scroll / scroll restoration.
    const again = requestAnimationFrame(() => {
      const { entry, stage: target } = readHash();
      const progress = entry?.progress ?? (target ? STAGES[target].progress : null);
      if (immersive && progress !== null) jumpTo(progress);
    });
    const onHash = () => apply(false);
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelAnimationFrame(again);
      window.removeEventListener("hashchange", onHash);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on the mode only: the callbacks change with it.
  }, [mode]);

  // Scroll position → camera progress. Passive, no scroll-jacking: the
  // camera follows the page, never the other way round.
  useEffect(() => {
    if (!immersive) return;
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const store = storeRef.current;

    const update = () => {
      const rect = root.getBoundingClientRect();
      const range = rect.height - stage.offsetHeight;
      const progress = range > 0 ? clamp01(-rect.top / range) : 0;
      store.target = progress;
      if (rect.bottom > 0 && rect.top < window.innerHeight) store.invalidate();

      const leaving = clamp01((progress - 0.012) / 0.048);
      if (heroRef.current) {
        heroRef.current.style.opacity = String(1 - leaving);
        heroRef.current.style.transform = `translate3d(0, ${-leaving * 28}px, 0)`;
        heroRef.current.style.pointerEvents = leaving > 0.6 ? "none" : "";
      }
      if (shadeRef.current) shadeRef.current.style.opacity = String(1 - leaving);
      setCaption(captionAt(progress));
      setTick(tickAt(progress));
      setAway(progress > 0.06);
      setStage(stageAt(progress));
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || store.target > 0.08) return;
      store.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      store.pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
      store.invalidate();
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("pointermove", onPointer, { passive: true });
    const hero = heroRef.current;
    const shade = shadeRef.current;
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(tween.current);
      if (hero) hero.style.cssText = "";
      if (shade) shade.style.cssText = "";
    };
  }, [immersive]);

  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  // Stacked page (no WebGL / reduced motion): the stage is the last anchor scrolled past.
  useEffect(() => {
    if (immersive) return;
    const update = () => {
      if (performance.now() < pinnedUntil.current) return;
      let next: StageId = "inicio";
      ANCHORS.forEach((id) => {
        const anchor = document.getElementById(id);
        if (anchor && anchor.getBoundingClientRect().top < window.innerHeight * 0.45) next = id;
      });
      setStage(next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [immersive]);

  // The header marks the link of the stage on screen, and asks for stages / the contact sheet.
  useEffect(() => reportStage(stage), [stage]);
  useEffect(() => () => reportStage("inicio"), []);
  const command = useRef<(next: ShowroomCommand) => void>(() => {});
  useEffect(() => {
    command.current = (next) => {
      if (next.type === "stage") goStage(next.stage, { keyboard: next.keyboard });
      else openContact({ intent: next.intent ?? "general" });
    };
  }, [goStage, openContact]);
  useEffect(() => listenToHeader((next) => command.current(next)), []);

  // The address follows the room: #servicios, #trabajo/oposibot… without reloading or adding history.
  const hashMode = useRef<string | null>(null);
  useEffect(() => {
    // The first pass of each mode only reads the address (see the deep-link effect).
    if (hashMode.current !== mode) {
      hashMode.current = mode;
      return;
    }
    const hash = panel ? `#${panel}` : stage && stage !== "inicio" ? `#${stage}` : "";
    if (window.location.hash === hash) return;
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}${hash}`);
  }, [mode, panel, stage]);

  const entry = panel ? findEntry(panel) : undefined;
  const siblings = useMemo(() => (entry ? ENTRIES.filter((item) => item.group === entry.group) : []), [entry]);

  const onPlaque = useCallback(
    (row: ContactRow) => {
      if (row.sheet) openContact({ intent: "general" });
      else if (row.stage) goStage(row.stage);
      else window.location.assign(row.href);
    },
    [goStage, openContact],
  );

  // The server-rendered links stay real <a href> for crawlers; in the home they act in place.
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as HTMLElement).closest<HTMLElement>("[data-open], [data-contact], [data-stage]");
    if (!link || !event.currentTarget.contains(link)) return;
    const { open, contact: intent, stage: target } = link.dataset;
    if (open && findEntry(open)) {
      event.preventDefault();
      openEntry(open);
    } else if (intent !== undefined) {
      event.preventDefault();
      openContact({ intent: INTENTS.find((item) => item === intent) ?? "general" });
    } else if (target && isStage(target)) {
      event.preventDefault();
      goStage(target, { keyboard: event.detail === 0 });
    }
  };
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => setLost(true), []);

  // Keyboard users: tabbing into a caption brings the camera to its stage.
  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target.closest(`[data-open="${FOUNDER_KEY}"]`)) {
      storeRef.current.founder = true;
      storeRef.current.invalidate();
    }
    if (!immersive || panel || contact || !event.target.matches(":focus-visible")) return;
    const holder = event.target.closest<HTMLElement>("[data-progress]");
    if (holder?.dataset.progress) travelTo(Number(holder.dataset.progress));
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-mode={mode}
      data-caption={immersive ? caption : -1}
      data-away={immersive && away}
      data-qa={qa}
      data-scene-surface={immersive ? "" : undefined}
      data-sheet={panel || contact ? "open" : undefined}
      onFocusCapture={onFocus}
      onBlurCapture={(event) => {
        if (!event.target.closest(`[data-open="${FOUNDER_KEY}"]`)) return;
        storeRef.current.founder = false;
        storeRef.current.invalidate();
      }}
      onClickCapture={onClick}
    >
      {qa ? <style>{"header,nextjs-portal{display:none!important}"}</style> : null}
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.viewport} data-scene-surface={immersive ? undefined : ""}>
          {mode !== "static" ? (
            <div className={styles.canvas} data-ready={ready} aria-hidden="true">
              <ShowroomScene
                storeRef={storeRef}
                mobile={mobile}
                still={mode === "still"}
                qa={qa}
                onOpenEntry={openEntry}
                onPlaque={onPlaque}
                onReady={onReady}
                onLost={onLost}
              />
            </div>
          ) : null}
          <div className={styles.vignette} />
          <div ref={shadeRef} className={styles.shade} />
          <div className={styles.captionShade} />
          <div ref={heroRef} className={styles.hero} data-progress={0}>
            {hero}
          </div>
        </div>

        <section className={styles.sections} aria-label="Servicios, trabajo y contacto">
          {sections}
        </section>

        <nav className={styles.ticks} aria-label="Recorrido del showroom">
          {TICKS.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={styles.tick}
              aria-current={tick === index ? "step" : undefined}
              aria-label={item.label}
              onClick={() => travelTo(item.progress)}
            >
              <span aria-hidden="true">{item.label}</span>
              <span aria-hidden="true" />
            </button>
          ))}
        </nav>
      </div>

      {entry ? (
        <DetailPanel
          entry={entry}
          siblings={siblings}
          onOpen={openEntry}
          onContact={(from) => openContact({ intent: from.intent, about: from.title })}
          onClose={closeSheets}
        />
      ) : null}
      {contact ? <ContactSheet context={contact} onClose={closeSheets} /> : null}
    </div>
  );
}
