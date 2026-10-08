"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Mail, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useId, useRef } from "react";
import type { ContactIntent } from "@/lib/leads/model";
import { CONTACT_CHOICES, type DetailBlock, type ShowroomEntry, contactChoiceHref } from "./content";
import styles from "./showroom.module.css";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type SheetProps = {
  /** "detail": the scene stays in full view beside it. "contact": a soft dark scrim. */
  tone: "detail" | "contact";
  onClose: () => void;
  children: (titleId: string) => ReactNode;
};

/**
 * The one sheet of the home: on the right on desktop, from the bottom on a
 * phone. A modal dialog: focus moves in, Tab stays in, Escape and the scrim
 * close it, and focus goes back to whatever opened it.
 */
function Sheet({ tone, onClose, children }: SheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    const scrim = scrimRef.current;
    if (!panel || !scrim) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((item) => item.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!panel.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    // The page behind must not scroll (and move the camera) under the sheet.
    const hold = (event: Event) => event.preventDefault();
    document.addEventListener("keydown", onKeyDown);
    scrim.addEventListener("wheel", hold, { passive: false });
    scrim.addEventListener("touchmove", hold, { passive: false });
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      scrim.removeEventListener("wheel", hold);
      scrim.removeEventListener("touchmove", hold);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  return (
    <div className={styles.sheetLayer} data-tone={tone}>
      <div ref={scrimRef} className={styles.scrim} onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button type="button" className={styles.sheetClose} onClick={onClose} aria-label="Cerrar" data-autofocus>
          <X aria-hidden="true" />
        </button>
        {children(titleId)}
      </div>
    </div>
  );
}

/* ───────────────────────── detail panel ───────────────────────── */

/** Pale rectangle, thin X, tiny label: where the owner's content will go. */
function Pending({ label, ratio }: { label: string; ratio: string }) {
  return (
    <div className={styles.pending} style={{ aspectRatio: ratio }} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

const DEFAULT_RATIO: Record<DetailBlock["kind"], string> = { image: "16 / 10", text: "16 / 5", list: "16 / 6", gallery: "1 / 1" };

function Block({ block }: { block: DetailBlock }) {
  const ratio = block.ratio ?? DEFAULT_RATIO[block.kind];
  if (block.content === undefined) {
    if (block.kind === "gallery") {
      return (
        <div className={styles.gallery}>
          {[1, 2, 3].map((item) => (
            <Pending key={item} label={`${block.label} ${item}`} ratio={ratio} />
          ))}
        </div>
      );
    }
    return <Pending label={block.label} ratio={ratio} />;
  }
  if (block.kind === "image") {
    return (
      <div className={styles.media} style={{ aspectRatio: ratio }}>
        <Image src={block.content.src} alt={block.content.alt} fill sizes="(max-width: 768px) 100vw, 30rem" />
      </div>
    );
  }
  if (block.kind === "gallery") {
    return (
      <div className={styles.gallery}>
        {block.content.map((image) => (
          <div key={image.src} className={styles.media} style={{ aspectRatio: ratio }}>
            <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 33vw, 10rem" />
          </div>
        ))}
      </div>
    );
  }
  if (block.kind === "list") {
    return (
      <ul className={styles.blockList}>
        {block.content.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  const paragraphs = Array.isArray(block.content) ? block.content : [block.content];
  return (
    <div className={styles.blockText}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

type DetailPanelProps = {
  entry: ShowroomEntry;
  /** Entries of the same group, in order: prev / next walk this list. */
  siblings: ShowroomEntry[];
  onOpen: (key: string) => void;
  onContact: (entry: ShowroomEntry) => void;
  onClose: () => void;
};

export function DetailPanel({ entry, siblings, onOpen, onContact, onClose }: DetailPanelProps) {
  const index = siblings.findIndex((item) => item.key === entry.key);
  const many = siblings.length > 1;
  const step = (offset: number) => onOpen(siblings[(index + offset + siblings.length) % siblings.length].key);
  const pending = entry.detail.blocks.some((block) => block.content === undefined);

  return (
    <Sheet tone="detail" onClose={onClose}>
      {(titleId) => (
        <>
          <div className={styles.sheetScroll} key={entry.key}>
            <p className={styles.eyebrow}>
              <span>{entry.eyebrow}</span>
              {many ? (
                <span aria-label={`${index + 1} de ${siblings.length}`}>
                  {String(index + 1).padStart(2, "0")} / {String(siblings.length).padStart(2, "0")}
                </span>
              ) : null}
            </p>
            <h2 id={titleId} className={styles.sheetTitle}>
              {entry.title}
            </h2>
            {pending ? <p className={styles.srOnly}>Contenido pendiente.</p> : null}
            <div className={styles.blocks}>
              {entry.detail.blocks.map((block) => (
                <section key={block.label} className={styles.block}>
                  {block.content !== undefined ? <h3 className={styles.blockLabel}>{block.label}</h3> : null}
                  <Block block={block} />
                </section>
              ))}
            </div>
          </div>
          <div className={styles.sheetFoot}>
            {many ? (
              <div className={styles.pager}>
                <button type="button" onClick={() => step(-1)} aria-label="Anterior">
                  <ArrowLeft aria-hidden="true" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Siguiente">
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            ) : entry.linkLabel ? (
              <Link href={entry.href} className={styles.sheetLink}>
                {entry.linkLabel}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            ) : null}
            <button type="button" className={styles.sheetAction} onClick={() => onContact(entry)}>
              Hablamos de esto
              <ArrowUpRight aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </Sheet>
  );
}

/* ───────────────────────── contact sheet ───────────────────────── */

const CHOICE_ICON = { video: CalendarDays, telefono: Phone, email: Mail } as const;

export type ContactContext = { intent: ContactIntent; about?: string };

/**
 * "Hablamos": three ways in. Each continues to the flow that already lives
 * at /contacto with the channel and the context preselected.
 */
export function ContactSheet({ context, onClose }: { context: ContactContext; onClose: () => void }) {
  return (
    <Sheet tone="contact" onClose={onClose}>
      {(titleId) => (
        <div className={styles.sheetScroll}>
          <p className={styles.eyebrow}>
            <span>Hablamos</span>
          </p>
          <h2 id={titleId} className={styles.sheetTitle}>
            ¿Cómo prefieres?
          </h2>
          {context.about ? (
            <p className={styles.about}>
              <span>Sobre</span> {context.about}
            </p>
          ) : null}
          <ul className={styles.choices}>
            {CONTACT_CHOICES.map((choice) => {
              const Icon = CHOICE_ICON[choice.canal];
              return (
                <li key={choice.canal}>
                  <Link href={contactChoiceHref(choice.canal, context.intent)} className={styles.choice}>
                    <span className={styles.choiceIcon}>
                      <Icon aria-hidden="true" />
                    </span>
                    <span className={styles.choiceText}>
                      <strong>{choice.title}</strong>
                      <span>{choice.hint}</span>
                    </span>
                    <ArrowRight className={styles.choiceArrow} aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Sheet>
  );
}
