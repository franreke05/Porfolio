"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { postCancel, type ApiFailure } from "./api";
import { primaryButton, secondaryButton, textLink, type ContactInfo } from "./fields";

type CancelState =
  | { s: "confirm" }
  | { s: "submitting" }
  | { s: "cancelled" }
  | { s: "error"; failure: ApiFailure };

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/** The token lives in the URL fragment, which browsers never send to a server. */
function tokenFromHash(hash: string): string {
  const raw = new URLSearchParams(hash.replace(/^#/, "")).get("t") ?? "";
  return raw.trim();
}

export function CancelBooking({ contact }: { contact: ContactInfo }) {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => null,
  );
  // A different fragment is a different booking: start from a clean state.
  return <CancelFlow key={hash ?? "pending"} hash={hash} contact={contact} />;
}

function CancelFlow({ hash, contact }: { hash: string | null; contact: ContactInfo }) {
  const [state, setState] = useState<CancelState>({ s: "confirm" });
  const heading = useRef<HTMLHeadingElement>(null);
  const settled = state.s === "cancelled" || state.s === "error";

  useEffect(() => {
    if (settled) heading.current?.focus();
  }, [settled, state]);

  const directContact = (
    <p className="mt-4 text-sm">
      Contacto directo:{" "}
      <a href={contact.mailto} className={`${textLink} break-all`}>
        {contact.email}
      </a>{" "}
      ·{" "}
      <a href={`tel:${contact.phone}`} className={`${textLink} whitespace-nowrap`}>
        {contact.displayPhone}
      </a>
    </p>
  );

  if (hash === null) {
    return (
      <p role="status" className="label-mono text-[color:var(--muted)]">
        Comprobando el enlace…
      </p>
    );
  }

  const token = tokenFromHash(hash);

  if (!token || (state.s === "error" && state.failure.code === "INVALID_TOKEN")) {
    return (
      <section data-state="cancel-invalid" className="border-t-2 border-[color:var(--foreground)] pt-5">
        <p className="label-mono text-[color:var(--error)]">Enlace no válido</p>
        <h2 ref={heading} tabIndex={-1} className="mt-2 font-display text-3xl leading-tight">
          No podemos cancelar con este enlace.
        </h2>
        <p className="mt-3 text-[color:var(--surface-foreground)]">
          {token
            ? "El enlace ha caducado, está incompleto o la reunión ya se canceló. Si la reunión sigue en tu calendario, escríbenos y la anulamos."
            : "Falta el código de cancelación. Abre el enlace completo de la invitación o de la página de confirmación."}
        </p>
        {directContact}
        <Link href="/contacto" className={`${secondaryButton} mt-6`}>
          Volver a contacto
        </Link>
      </section>
    );
  }

  if (state.s === "cancelled") {
    return (
      <section data-state="cancel-done" className="border-t-2 border-[color:var(--foreground)] pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 ref={heading} tabIndex={-1} className="font-display text-3xl leading-tight">
            Reunión cancelada.
          </h2>
          <span className="status" data-s="planned">
            Cancelada
          </span>
        </div>
        <p className="mt-3 text-[color:var(--surface-foreground)]">
          Hemos liberado la hora. Si quieres, puedes reservar otra cuando te venga bien.
        </p>
        <Link href="/contacto?canal=video" className={`${primaryButton} mt-6`}>
          Reservar otra reunión
        </Link>
      </section>
    );
  }

  const submitting = state.s === "submitting";

  async function cancel() {
    setState({ s: "submitting" });
    const response = await postCancel(token);
    setState(response.ok ? { s: "cancelled" } : { s: "error", failure: response });
  }

  return (
    <section
      data-state={submitting ? "cancel-submitting" : state.s === "error" ? "cancel-error" : "cancel-confirm"}
      className="border-t-2 border-[color:var(--foreground)] pt-5"
    >
      <h2 ref={heading} tabIndex={-1} className="font-display text-3xl leading-tight">
        ¿Cancelamos la reunión?
      </h2>
      <p className="mt-3 text-[color:var(--surface-foreground)]">
        Se anulará la reunión y la hora quedará libre. No se puede deshacer, pero puedes
        reservar otra después.
      </p>

      {state.s === "error" ? (
        <div role="alert" className="mt-5 border-2 border-[color:var(--error)] p-4">
          <p className="label-mono text-[color:var(--error)]">No se ha podido cancelar</p>
          <p className="mt-2 font-medium">{state.failure.message}</p>
          {directContact}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          type="button"
          className={primaryButton}
          aria-busy={submitting}
          disabled={submitting}
          onClick={cancel}
        >
          {submitting ? "Cancelando…" : state.s === "error" ? "Reintentar" : "Sí, cancelar reunión"}
        </button>
        <Link href="/contacto" className={secondaryButton}>
          Mantener la reunión
        </Link>
      </div>
    </section>
  );
}
