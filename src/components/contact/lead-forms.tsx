"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type {
  EmailLeadRequest,
  Intent,
  PhoneLeadRequest,
  PreferredTime,
} from "@/lib/booking/contract";
import { TOKEN_FAILURE, firstFieldErrors, postLead, useFormToken, type ApiFailure } from "./api";
import styles from "./contact.module.css";
import {
  ConsentField,
  EMAIL_RE,
  FailureNotice,
  FieldError,
  Honeypot,
  PHONE_RE,
  SelectField,
  TextAreaField,
  TextField,
  focusFirstError,
  primaryButton,
  secondaryButton,
  type Channel,
  type ContactInfo,
} from "./fields";
import { INTENT_LABEL, INTENT_OPTIONS } from "./intents";

type SubmitState =
  | { s: "idle" }
  | { s: "submitting" }
  | { s: "error"; failure: ApiFailure }
  | { s: "success"; ref: string };

type LeadFormProps = {
  intent: Intent;
  contact: ContactInfo;
  onSwitch: (channel: Channel) => void;
};

const LEAD_NOTICE =
  "Solo usamos tus datos para responderte. Encargado del tratamiento: Resend (envío del aviso por email).";

function SuccessReceipt({
  state,
  title,
  body,
  reference,
  onReset,
  resetLabel,
}: {
  state: string;
  title: string;
  body: ReactNode;
  reference: string;
  onReset: () => void;
  resetLabel: string;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <section
      data-state={state}
      className={`${styles.slideUp} max-w-2xl border-y-2 border-[color:var(--foreground)] py-5`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 ref={heading} tabIndex={-1} className="font-display text-3xl leading-tight">
          {title}
        </h3>
        <span className="status" data-s="implemented">
          Recibido
        </span>
      </div>
      <p className="mt-3 text-lg text-[color:var(--surface-foreground)]">{body}</p>
      <p className="label-mono mt-4 text-[color:var(--muted)]">
        Referencia <span className="text-[color:var(--foreground)]">{reference}</span>
      </p>
      <button type="button" className={`${secondaryButton} mt-5 min-h-11 text-sm`} onClick={onReset}>
        {resetLabel}
      </button>
    </section>
  );
}

/* ───────────── Te llamamos ───────────── */

const TIME_OPTIONS: { value: PreferredTime; label: string }[] = [
  { value: "MORNING", label: "Mañana" },
  { value: "AFTERNOON", label: "Tarde" },
  { value: "SPECIFIC", label: "Hora concreta" },
];

const PHONE_ORDER = ["ph-name", "ph-phone", "ph-time-MORNING", "ph-note", "ph-message", "ph-consent"];

export function PhoneForm({ intent, contact, onSwitch }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState<PreferredTime | null>(null);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submit, setSubmit] = useState<SubmitState>({ s: "idle" });
  const [cooldown, setCooldown] = useState(false);
  const { getToken, invalidate } = useFormToken();

  const submitting = submit.s === "submitting";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || cooldown) return;

    const found: Record<string, string> = {};
    if (name.trim().length < 2) found["ph-name"] = "Indica tu nombre.";
    if (!PHONE_RE.test(phone.trim())) found["ph-phone"] = "Indica un teléfono válido.";
    if (!preferredTime) found["ph-time-MORNING"] = "Indica cuándo prefieres la llamada.";
    if (preferredTime === "SPECIFIC" && !note.trim()) {
      found["ph-note"] = "Indica la hora que te viene bien.";
    }
    if (!consent) found["ph-consent"] = "Debes aceptar el aviso de privacidad.";
    setErrors(found);
    if (Object.keys(found).length > 0 || !preferredTime) {
      focusFirstError(PHONE_ORDER, found);
      return;
    }

    setSubmit({ s: "submitting" });
    const formToken = await getToken();
    if (!formToken) {
      setSubmit({ s: "error", failure: TOKEN_FAILURE });
      return;
    }

    const payload: PhoneLeadRequest = {
      channel: "PHONE",
      name: name.trim(),
      phone: phone.trim(),
      preferredTime,
      intent,
      consent: true,
      formToken,
      website,
    };
    if (preferredTime === "SPECIFIC" && note.trim()) payload.preferredTimeNote = note.trim();
    if (message.trim()) payload.message = message.trim();

    const response = await postLead(payload);
    if (response.ok) {
      setSubmit({ s: "success", ref: response.data.ref });
      return;
    }

    const server = firstFieldErrors(response.fieldErrors);
    const mapped: Record<string, string> = {};
    if (server.name) mapped["ph-name"] = server.name;
    if (server.phone) mapped["ph-phone"] = server.phone;
    if (server.preferredTime) mapped["ph-time-MORNING"] = server.preferredTime;
    if (server.preferredTimeNote) mapped["ph-note"] = server.preferredTimeNote;
    if (server.message) mapped["ph-message"] = server.message;
    if (server.consent) mapped["ph-consent"] = server.consent;
    setErrors(mapped);
    if (server.formToken) invalidate();
    if (response.code === "RATE_LIMITED" && response.retryAfterSeconds) setCooldown(true);
    setSubmit({ s: "error", failure: response });
  }

  if (submit.s === "success") {
    return (
      <SuccessReceipt
        state="phone-success"
        title="Apuntado."
        body="Te llamamos en la franja que has elegido."
        reference={submit.ref}
        resetLabel="Pedir otra llamada"
        onReset={() => {
          setMessage("");
          setSubmit({ s: "idle" });
        }}
      />
    );
  }

  const timeError = errors["ph-time-MORNING"];

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="relative max-w-2xl"
      data-state={submitting ? "phone-submitting" : "phone-form"}
    >
      <fieldset disabled={submitting} className="space-y-5">
        <legend className="sr-only">Datos para que te llamemos</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="ph-name"
            label="Nombre"
            autoComplete="name"
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors["ph-name"]}
          />
          <TextField
            id="ph-phone"
            label="Teléfono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            hint="Con prefijo si no es un número español."
            error={errors["ph-phone"]}
          />
        </div>

        <fieldset aria-describedby={timeError ? "ph-time-error" : undefined}>
          <legend className="mb-1.5 text-sm font-semibold">¿Cuándo te viene mejor?</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {TIME_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[2px] border-[1.5px] border-[color:var(--foreground)] px-3 font-medium has-[:checked]:bg-[color:var(--foreground)] has-[:checked]:text-[color:var(--background)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-[color:var(--foreground)]"
              >
                <input
                  id={`ph-time-${option.value}`}
                  type="radio"
                  name="preferredTime"
                  value={option.value}
                  checked={preferredTime === option.value}
                  onChange={() => setPreferredTime(option.value)}
                  className="size-5 flex-none accent-[color:var(--primary)] outline-none"
                />
                {option.label}
              </label>
            ))}
          </div>
          <FieldError id="ph-time-error" message={timeError} />
        </fieldset>

        {preferredTime === "SPECIFIC" ? (
          <TextField
            id="ph-note"
            label="¿A qué hora?"
            maxLength={80}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            hint="Por ejemplo: «martes a partir de las 17:00»."
            error={errors["ph-note"]}
          />
        ) : null}

        <TextAreaField
          id="ph-message"
          label="¿De qué quieres hablar?"
          optional
          rows={3}
          maxLength={1000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          error={errors["ph-message"]}
        />
        <ConsentField
          id="ph-consent"
          checked={consent}
          onChange={setConsent}
          notice={LEAD_NOTICE}
          error={errors["ph-consent"]}
        />
        <Honeypot value={website} onChange={setWebsite} />
      </fieldset>

      {submit.s === "error" ? (
        <div className="mt-6" data-state="phone-error">
          <FailureNotice
            failure={submit.failure}
            contact={contact}
            others={["video", "email"]}
            onSwitch={onSwitch}
            onCooldownEnd={() => setCooldown(false)}
          />
        </div>
      ) : null}

      <div className="mt-6">
        <button
          type="submit"
          className={primaryButton}
          aria-busy={submitting}
          disabled={submitting || cooldown}
        >
          {submitting ? "Enviando…" : "Pedir que me llaméis"}
        </button>
      </div>
    </form>
  );
}

/* ───────────── Escríbenos ───────────── */

const EMAIL_ORDER = ["em-name", "em-email", "em-type", "em-message", "em-consent"];

export function EmailForm({ intent, contact, onSwitch }: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState<string>(intent === "general" ? "" : intent);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submit, setSubmit] = useState<SubmitState>({ s: "idle" });
  const [cooldown, setCooldown] = useState(false);
  const { getToken, invalidate } = useFormToken();

  const submitting = submit.s === "submitting";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || cooldown) return;

    const found: Record<string, string> = {};
    if (name.trim().length < 2) found["em-name"] = "Indica tu nombre.";
    if (!EMAIL_RE.test(email.trim())) found["em-email"] = "Indica un email válido.";
    if (message.trim().length < 10) {
      found["em-message"] = "Cuéntanos un poco más sobre el proyecto (mínimo 10 caracteres).";
    }
    if (!consent) found["em-consent"] = "Debes aceptar el aviso de privacidad.";
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(EMAIL_ORDER, found);
      return;
    }

    setSubmit({ s: "submitting" });
    const formToken = await getToken();
    if (!formToken) {
      setSubmit({ s: "error", failure: TOKEN_FAILURE });
      return;
    }

    const payload: EmailLeadRequest = {
      channel: "EMAIL",
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      intent,
      consent: true,
      formToken,
      website,
    };
    if (projectType) payload.projectType = INTENT_LABEL[projectType as Intent] ?? projectType;

    const response = await postLead(payload);
    if (response.ok) {
      setSubmit({ s: "success", ref: response.data.ref });
      return;
    }

    // The visitor's text stays exactly where it was: nothing is cleared on error.
    const server = firstFieldErrors(response.fieldErrors);
    const mapped: Record<string, string> = {};
    if (server.name) mapped["em-name"] = server.name;
    if (server.email) mapped["em-email"] = server.email;
    if (server.projectType) mapped["em-type"] = server.projectType;
    if (server.message) mapped["em-message"] = server.message;
    if (server.consent) mapped["em-consent"] = server.consent;
    setErrors(mapped);
    if (server.formToken) invalidate();
    if (response.code === "RATE_LIMITED" && response.retryAfterSeconds) setCooldown(true);
    setSubmit({ s: "error", failure: response });
  }

  if (submit.s === "success") {
    return (
      <SuccessReceipt
        state="email-success"
        title="Mensaje recibido."
        body="Te respondemos por email."
        reference={submit.ref}
        resetLabel="Escribir otro mensaje"
        onReset={() => {
          setMessage("");
          setSubmit({ s: "idle" });
        }}
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="relative max-w-2xl"
      data-state={submitting ? "email-submitting" : "email-form"}
    >
      <fieldset disabled={submitting} className="space-y-5">
        <legend className="sr-only">Tu mensaje</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="em-name"
            label="Nombre"
            autoComplete="name"
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={errors["em-name"]}
          />
          <TextField
            id="em-email"
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={120}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors["em-email"]}
          />
        </div>
        <SelectField
          id="em-type"
          label="Tipo de proyecto"
          optional
          value={projectType}
          onChange={(event) => setProjectType(event.target.value)}
          error={errors["em-type"]}
        >
          <option value="">Sin especificar</option>
          {INTENT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {INTENT_LABEL[option]}
            </option>
          ))}
        </SelectField>
        <TextAreaField
          id="em-message"
          label="Mensaje"
          rows={6}
          maxLength={2000}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          hint="Qué quieres construir, para quién y en qué punto está."
          error={errors["em-message"]}
        />
        <ConsentField
          id="em-consent"
          checked={consent}
          onChange={setConsent}
          notice={LEAD_NOTICE}
          error={errors["em-consent"]}
        />
        <Honeypot value={website} onChange={setWebsite} />
      </fieldset>

      {submit.s === "error" ? (
        <div className="mt-6" data-state="email-error">
          <FailureNotice
            failure={submit.failure}
            contact={contact}
            others={["video", "telefono"]}
            onSwitch={onSwitch}
            onCooldownEnd={() => setCooldown(false)}
          />
        </div>
      ) : null}

      <div className="mt-6">
        <button
          type="submit"
          className={primaryButton}
          aria-busy={submitting}
          disabled={submitting || cooldown}
        >
          {submitting ? "Enviando…" : "Enviar mensaje"}
        </button>
      </div>
    </form>
  );
}
