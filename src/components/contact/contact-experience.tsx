"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Intent } from "@/lib/booking/contract";
import { BookingWizard } from "./booking-wizard";
import { CHANNEL_LABEL, type Channel, type ContactInfo } from "./fields";
import { EmailForm, PhoneForm } from "./lead-forms";

const CHANNELS: { id: Channel; when: string; meta: string }[] = [
  {
    id: "video",
    when: "Elígela si ya tienes una idea o un alcance y quieres verlo con nosotros en pantalla.",
    meta: "30 min · Google Meet",
  },
  {
    id: "telefono",
    when: "Elígela si prefieres explicarlo de palabra y que te llamemos nosotros.",
    meta: "Por teléfono",
  },
  {
    id: "email",
    when: "Elígela si quieres dejarlo por escrito y leer la respuesta con calma.",
    meta: "Por email",
  },
];

type ContactExperienceProps = {
  intent: Intent;
  initialChannel: Channel | null;
  contact: ContactInfo;
};

export function ContactExperience({ intent, initialChannel, contact }: ContactExperienceProps) {
  const [channel, setChannel] = useState<Channel | null>(initialChannel);
  const radios = useRef<Partial<Record<Channel, HTMLButtonElement | null>>>({});
  const panel = useRef<HTMLElement>(null);

  function choose(next: Channel, reveal: boolean) {
    setChannel(next);
    // Only the channel and the intent ever reach the URL: no personal data.
    const params = new URLSearchParams();
    if (intent !== "general") params.set("intent", intent);
    params.set("canal", next);
    window.history.replaceState(null, "", `?${params.toString()}`);
    if (reveal) {
      requestAnimationFrame(() => {
        const node = panel.current;
        if (node && node.getBoundingClientRect().top > window.innerHeight * 0.6) {
          node.scrollIntoView({ block: "start" });
        }
      });
    }
  }

  function switchTo(next: Channel) {
    choose(next, false);
    requestAnimationFrame(() => {
      radios.current[next]?.focus();
      radios.current[next]?.scrollIntoView({ block: "start" });
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let target = -1;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      target = (index + 1) % CHANNELS.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      target = (index - 1 + CHANNELS.length) % CHANNELS.length;
    } else if (event.key === "Home") {
      target = 0;
    } else if (event.key === "End") {
      target = CHANNELS.length - 1;
    }
    if (target < 0) return;
    event.preventDefault();
    const next = CHANNELS[target].id;
    radios.current[next]?.focus();
    choose(next, false);
  }

  const tabStop = channel ?? CHANNELS[0].id;

  return (
    <>
      <div
        role="radiogroup"
        aria-labelledby="channel-title"
        className="border-b-2 border-[color:var(--foreground)]"
      >
        {CHANNELS.map((entry, index) => {
          const selected = entry.id === channel;
          return (
            <button
              key={entry.id}
              ref={(node) => {
                radios.current[entry.id] = node;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={entry.id === tabStop ? 0 : -1}
              data-channel={entry.id}
              onClick={() => choose(entry.id, true)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`relative grid min-h-16 w-full scroll-mt-20 grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-3 border-t-2 border-[color:var(--foreground)] px-3 py-4 text-left transition-colors duration-100 sm:px-4 lg:grid-cols-[2.5rem_14rem_minmax(0,1fr)_auto] lg:items-center lg:gap-x-6 ${
                selected
                  ? "z-[1] bg-[color:var(--foreground)] text-[color:var(--background)] shadow-[var(--shadow-hard)]"
                  : "bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--surface)]"
              }`}
            >
              <span aria-hidden="true" className="label-mono pt-1.5 lg:pt-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-xl font-semibold leading-tight">
                {CHANNEL_LABEL[entry.id]}
              </span>
              <span
                className={`col-start-2 mt-1 text-[0.9375rem] leading-snug lg:col-start-3 lg:mt-0 ${
                  selected ? "text-[color:var(--background)]" : "text-[color:var(--surface-foreground)]"
                }`}
              >
                {entry.when}
              </span>
              <span
                className={`label-mono col-start-2 mt-2 lg:col-start-4 lg:mt-0 ${
                  selected ? "text-[color:var(--background)]" : "text-[color:var(--muted)]"
                }`}
              >
                {entry.meta}
              </span>
            </button>
          );
        })}
      </div>

      <section
        ref={panel}
        aria-label={channel ? CHANNEL_LABEL[channel] : "Canal de contacto"}
        data-panel={channel ?? "none"}
        className="scroll-mt-20 pt-10"
      >
        {channel === null ? (
          <p className="label-mono text-[color:var(--muted)]">
            Elige un canal para continuar. No hay formulario hasta que decidas.
          </p>
        ) : (
          <>
            <h2 className="font-display text-[length:var(--text-heading-lg)] leading-tight">
              {channel === "video"
                ? "Reserva una reunión"
                : channel === "telefono"
                  ? "Te llamamos nosotros"
                  : "Escríbenos"}
            </h2>
            <div className="mt-6">
              {channel === "video" ? (
                <BookingWizard intent={intent} contact={contact} onSwitch={switchTo} />
              ) : channel === "telefono" ? (
                <PhoneForm intent={intent} contact={contact} onSwitch={switchTo} />
              ) : (
                <EmailForm intent={intent} contact={contact} onSwitch={switchTo} />
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
