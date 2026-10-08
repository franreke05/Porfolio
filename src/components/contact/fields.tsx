"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";
import type { ApiFailure } from "./api";

export type Channel = "video" | "telefono" | "email";

export type ContactInfo = {
  email: string;
  mailto: string;
  phone: string;
  displayPhone: string;
};

export const CHANNEL_LABEL: Record<Channel, string> = {
  video: "Reunión",
  telefono: "Te llamamos",
  email: "Escríbenos",
};

export const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] px-5 py-2 text-base font-semibold text-[color:var(--on-primary)] shadow-[var(--shadow-hard)] transition-[transform,box-shadow,background-color] duration-100 hover:bg-[color:var(--primary-hover)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none";

export const secondaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[color:var(--foreground)] bg-transparent px-5 py-2 text-base font-semibold text-[color:var(--foreground)] transition-colors duration-100 hover:bg-[color:var(--surface-elevated)] disabled:cursor-not-allowed disabled:opacity-60";

export const textLink =
  "font-semibold underline decoration-2 underline-offset-4 hover:text-[color:var(--primary)]";

const controlBase =
  "block w-full rounded-[2px] border-[1.5px] border-[color:var(--foreground)] bg-[color:var(--background)] px-3 py-2.5 font-sans text-base text-[color:var(--foreground)] placeholder:text-[color:var(--muted)] disabled:opacity-60 aria-[invalid=true]:border-2 aria-[invalid=true]:border-[color:var(--error)]";

type FieldShellProps = {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
};

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

function FieldShell({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: FieldShellProps & { children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-[color:var(--foreground)]">{label}</span>
        {optional ? (
          <span className="label-mono text-[color:var(--muted)]">Opcional</span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-[color:var(--muted)]">
          {hint}
        </p>
      ) : null}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex gap-2 text-sm font-medium text-[color:var(--error)]">
      <span aria-hidden="true" className="font-mono">
        !
      </span>
      {message}
    </p>
  );
}

type TextFieldProps = FieldShellProps & Omit<ComponentPropsWithRef<"input">, "id">;

export function TextField({ id, label, optional, hint, error, ...input }: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        aria-required={optional ? undefined : true}
        className={`${controlBase} min-h-12`}
        {...input}
      />
    </FieldShell>
  );
}

type TextAreaProps = FieldShellProps & Omit<ComponentPropsWithRef<"textarea">, "id">;

export function TextAreaField({ id, label, optional, hint, error, ...area }: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <textarea
        id={id}
        data-lenis-prevent
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        aria-required={optional ? undefined : true}
        className={`${controlBase} min-h-28 resize-y`}
        {...area}
      />
    </FieldShell>
  );
}

type SelectFieldProps = FieldShellProps & Omit<ComponentPropsWithRef<"select">, "id">;

export function SelectField({
  id,
  label,
  optional,
  hint,
  error,
  children,
  ...select
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} hint={hint} error={error}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${controlBase} min-h-12`}
        {...select}
      >
        {children}
      </select>
    </FieldShell>
  );
}

type ConsentFieldProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  notice: string;
  error?: string;
};

export function ConsentField({ id, checked, onChange, notice, error }: ConsentFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-notice${error ? ` ${id}-error` : ""}`}
          aria-required="true"
          className="mt-0.5 size-6 flex-none rounded-[2px] accent-[color:var(--foreground)]"
        />
        <span className="text-sm font-semibold text-[color:var(--foreground)]">
          Acepto que uséis estos datos para responderme.
        </span>
      </label>
      <p id={`${id}-notice`} className="mt-1 pl-9 text-sm text-[color:var(--muted)]">
        {notice}
      </p>
      <div className="pl-9">
        <FieldError id={`${id}-error`} message={error} />
      </div>
    </div>
  );
}

/** Bots fill it; people never see it. Must travel empty. */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-auto size-px overflow-hidden">
      <label>
        Web
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    </div>
  );
}

/** Direct contact details plus the other channels: the way out of any dead end. */
export function Fallbacks({
  contact,
  others,
  onSwitch,
}: {
  contact: ContactInfo;
  others: Channel[];
  onSwitch: (channel: Channel) => void;
}) {
  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm">
        Contacto directo:{" "}
        <a href={contact.mailto} className={`${textLink} break-all`}>
          {contact.email}
        </a>{" "}
        ·{" "}
        <a href={`tel:${contact.phone}`} className={`${textLink} whitespace-nowrap`}>
          {contact.displayPhone}
        </a>
      </p>
      {others.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {others.map((channel) => (
            <button
              key={channel}
              type="button"
              className={`${secondaryButton} min-h-11 text-sm`}
              onClick={() => onSwitch(channel)}
            >
              Cambiar a «{CHANNEL_LABEL[channel]}»
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Countdown({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [left, setLeft] = useState(seconds);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);
  useEffect(() => {
    const timer = setInterval(() => {
      setLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          done.current();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <p className="mt-2 font-mono text-sm">
      {left > 0 ? `Podrás reintentarlo en ${left} s.` : "Ya puedes reintentarlo."}
    </p>
  );
}

type FailureNoticeProps = {
  failure: ApiFailure;
  contact: ContactInfo;
  others: Channel[];
  onSwitch: (channel: Channel) => void;
  onCooldownEnd?: () => void;
  children?: ReactNode;
};

/** Real error state of a submission or a load. Announced, focusable, never a fake success. */
export function FailureNotice({
  failure,
  contact,
  others,
  onSwitch,
  onCooldownEnd,
  children,
}: FailureNoticeProps) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    box.current?.focus();
  }, [failure]);

  const providerDown = failure.code === "PROVIDER_NOT_CONFIGURED";
  const showFallbacks =
    providerDown || failure.code === "PROVIDER_ERROR" || failure.code === "NETWORK";

  return (
    <div
      ref={box}
      role="alert"
      tabIndex={-1}
      data-failure={failure.code}
      className="border-2 border-[color:var(--error)] bg-[color:var(--background)] p-4"
    >
      <p className="label-mono text-[color:var(--error)]">
        {providerDown ? "Servicio no disponible" : "No se ha podido completar"}
      </p>
      <p className="mt-2 font-medium text-[color:var(--foreground)]">{failure.message}</p>
      {failure.code === "RATE_LIMITED" && failure.retryAfterSeconds ? (
        <Countdown
          key={failure.retryAfterSeconds}
          seconds={failure.retryAfterSeconds}
          onDone={onCooldownEnd ?? (() => {})}
        />
      ) : null}
      {children}
      {showFallbacks ? <Fallbacks contact={contact} others={others} onSwitch={onSwitch} /> : null}
    </div>
  );
}

/** Focuses the first field that has an error, in the order the form declares them. */
export function focusFirstError(order: string[], errors: Record<string, string>) {
  const first = order.find((id) => errors[id]);
  if (first) document.getElementById(first)?.focus();
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;
