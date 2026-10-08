import type { ComicBubble, ComicMotifId, ComicScene } from "@/lib/comics";
import { ComicMotif } from "./comic-motif";
import styles from "./comic.module.css";

type SceneProps = { scene: ComicScene; motif: ComicMotifId; headingId: string };

const headline =
  "text-balance font-display font-semibold leading-[1.08] tracking-tight text-[1.75rem] sm:text-[2.5rem]";

/** Generic bust: a role, never a portrait of anyone. */
function Speaker() {
  return (
    <span className={styles.speaker} aria-hidden="true">
      <svg viewBox="0 0 44 44" className="h-full w-full">
        <circle cx="22" cy="17" r="8" fill="var(--foreground)" />
        <path d="M6 46 C6 32 14 28 22 28 C30 28 38 32 38 46 Z" fill="var(--foreground)" />
      </svg>
    </span>
  );
}

function Bubbles({ bubbles }: { bubbles: ComicBubble[] }) {
  const speakers = Array.from(new Set(bubbles.map((bubble) => bubble.who)));

  return (
    <ol className="flex flex-col gap-7">
      {bubbles.map((bubble) => {
        // Each speaker keeps one side; a second speaker answers from the other.
        const right = speakers.indexOf(bubble.who) % 2 === 1;

        return (
          <li
            key={bubble.text}
            className={`${styles.pop} flex max-w-[30rem] flex-col gap-4 ${right ? "items-end self-end" : "items-start self-start"}`}
          >
            <p className={`${styles.bubble} ${right ? styles.bubbleRight : ""} text-[1.0625rem] font-medium leading-snug sm:text-lg`}>
              <span className="sr-only">{bubble.who}: </span>
              {bubble.text}
            </p>
            <span className={`flex items-center gap-2 ${right ? "flex-row-reverse pr-3" : "pl-3"}`} aria-hidden="true">
              <Speaker />
              <span className={styles.tag}>{bubble.who}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function TitleCard({ scene, headingId }: SceneProps) {
  return (
    <div className={`${styles.panel} ${styles.sunburst} flex min-h-[26rem] flex-col justify-center gap-7 p-6 sm:min-h-[30rem] sm:p-12`}>
      <p className={styles.chapterWord}>{scene.chapter}</p>
      <h2 id={headingId} className={`${styles.headlineBox} ${styles.tiltB} ${headline} max-w-[38rem] self-start`}>
        {scene.headline}
      </h2>
      {scene.caption ? (
        <p className={`${styles.captionBox} ${styles.tiltA} max-w-[34rem] self-end text-[1.0625rem] leading-snug`}>
          {scene.caption}
        </p>
      ) : null}
    </div>
  );
}

function Caption({ scene, headingId }: SceneProps) {
  return (
    <div className={`${styles.panel} ${styles.halftoneFade} flex flex-col gap-6 p-6 sm:p-10`}>
      <h2 id={headingId} className={`${headline} max-w-[36rem]`}>
        {scene.headline}
      </h2>
      {scene.caption ? (
        <p className={`${styles.captionBox} ${styles.tiltA} max-w-[38rem] text-[1.0625rem] leading-relaxed sm:text-lg`}>
          {scene.caption}
        </p>
      ) : null}
      {scene.items ? (
        <ul className="flex flex-col gap-4 sm:pl-10">
          {scene.items.map((item, index) => (
            <li
              key={item}
              className={`${styles.captionBox} ${styles.pop} ${index % 2 ? styles.tiltA : styles.tiltB} max-w-[34rem] text-base leading-snug ${index % 2 ? "self-end" : "self-start"}`}
              style={{ background: "#fff" }}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Dialogue({ scene, headingId }: SceneProps) {
  return (
    <div className={`${styles.panel} ${styles.halftoneFade} flex flex-col gap-8 p-6 sm:p-10`}>
      <div className="flex flex-col gap-4">
        <h2 id={headingId} className={`${styles.captionBox} ${styles.tiltA} self-start font-display text-2xl font-semibold leading-tight sm:text-[1.75rem]`}>
          {scene.headline}
        </h2>
        {scene.caption ? (
          <p className="max-w-[38rem] text-[1.0625rem] leading-relaxed">{scene.caption}</p>
        ) : null}
      </div>
      {scene.bubbles ? <Bubbles bubbles={scene.bubbles} /> : null}
    </div>
  );
}

function Ledger({ scene, headingId }: SceneProps) {
  return (
    <div className={`${styles.panel} flex flex-col gap-6 p-6 sm:p-10`}>
      <h2 id={headingId} className={headline}>
        {scene.headline}
      </h2>
      {scene.caption ? <p className="max-w-[38rem] text-[1.0625rem] leading-relaxed">{scene.caption}</p> : null}
      <ol className="border-t-[3px] border-[color:var(--foreground)]">
        {(scene.items ?? []).map((item, index) => (
          <li
            key={item}
            className="flex items-center gap-5 border-b-2 border-[color:var(--foreground)] py-4"
          >
            <span className={`${styles.numeral} w-9 flex-none text-center`} aria-hidden="true">
              {index + 1}
            </span>
            <span className="text-lg font-medium leading-snug sm:text-xl">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Diagram({ scene, motif, headingId }: SceneProps) {
  const wide = motif === "plano";
  return (
    <div className={`${styles.panel} grid gap-6 p-6 sm:p-10 ${wide ? "" : "md:grid-cols-2 md:items-center"}`}>
      <div className={`flex flex-col gap-5 ${wide ? "" : "md:order-2"}`}>
        <h2 id={headingId} className={headline}>
          {scene.headline}
        </h2>
        {scene.caption ? (
          <p className={`${styles.captionBox} ${styles.tiltB} max-w-[36rem] text-[1.0625rem] leading-relaxed`}>
            {scene.caption}
          </p>
        ) : null}
      </div>
      <div className={wide ? "" : "mx-auto w-full max-w-[24rem]"}>
        <ComicMotif motif={motif} />
      </div>
    </div>
  );
}

function Splash({ scene, headingId }: SceneProps) {
  return (
    <div className={`${styles.panel} ${styles.inkPanel} flex min-h-[26rem] flex-col justify-center gap-8 p-6 sm:min-h-[30rem] sm:p-12`}>
      {scene.sfx ? (
        <p className={`${styles.sfx} ${styles.pop} self-start`} aria-hidden="true">
          {scene.sfx}
        </p>
      ) : null}
      <h2 id={headingId} className="max-w-[40rem] text-balance font-display text-[2rem] font-semibold leading-[1.06] tracking-tight sm:text-[3rem]">
        {scene.headline}
      </h2>
      {scene.caption ? (
        <p className={`${styles.captionBox} ${styles.tiltA} max-w-[34rem] self-end text-[1.0625rem] leading-snug text-[color:var(--foreground)]`}>
          {scene.caption}
        </p>
      ) : null}
    </div>
  );
}

export function ComicScenePanel(props: SceneProps) {
  switch (props.scene.kind) {
    case "title-card":
      return <TitleCard {...props} />;
    case "caption":
      return <Caption {...props} />;
    case "dialogue":
      return <Dialogue {...props} />;
    case "ledger":
      return <Ledger {...props} />;
    case "diagram":
      return <Diagram {...props} />;
    case "splash":
      return <Splash {...props} />;
  }
}
