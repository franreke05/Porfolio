"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type {
  AvailabilityResponse,
  BookingRequest,
  BookingResponse,
  DayDto,
  Intent,
  SlotDto,
} from "@/lib/booking/contract";
import {
  TOKEN_FAILURE,
  firstFieldErrors,
  getAvailability,
  postBooking,
  useFormToken,
  type ApiFailure,
} from "./api";
import { BookingCalendar, CalendarSkeleton } from "./booking-calendar";
import styles from "./contact.module.css";
import {
  ConsentField,
  EMAIL_RE,
  FailureNotice,
  Fallbacks,
  Honeypot,
  PHONE_RE,
  TextAreaField,
  TextField,
  focusFirstError,
  primaryButton,
  secondaryButton,
  textLink,
  type Channel,
  type ContactInfo,
} from "./fields";
import {
  civilDateIn,
  civilLong,
  dateLongIn,
  dayShortIn,
  monthOf,
  timeIn,
  visitorTimeZone,
} from "./time";

type Step = "day" | "time" | "details" | "done";

const STEPS: { id: Step; label: string }[] = [
  { id: "day", label: "Día" },
  { id: "time", label: "Hora" },
  { id: "details", label: "Datos" },
  { id: "done", label: "Confirmación" },
];

type LoadState =
  | { s: "loading" }
  | { s: "ready"; data: AvailabilityResponse }
  | { s: "error"; failure: ApiFailure };

type SubmitState = { s: "idle" } | { s: "submitting" } | { s: "error"; failure: ApiFailure };

type Details = {
  name: string;
  email: string;
  company: string;
  need: string;
  phone: string;
  consent: boolean;
  website: string;
};

const EMPTY_DETAILS: Details = {
  name: "",
  email: "",
  company: "",
  need: "",
  phone: "",
  consent: false,
  website: "",
};

const FIELD_ORDER = ["bk-name", "bk-email", "bk-company", "bk-need", "bk-phone", "bk-consent"];
const OTHERS: Channel[] = ["telefono", "email"];

type BookingWizardProps = {
  intent: Intent;
  contact: ContactInfo;
  onSwitch: (channel: Channel) => void;
};

function DemoBanner() {
  return (
    <p
      role="note"
      data-state="demo-banner"
      className="label-mono border-2 border-dashed border-[color:var(--foreground)] bg-[color:var(--surface)] px-3 py-2.5 leading-relaxed text-[color:var(--foreground)]"
    >
      Modo demo local — las reservas no llegan a un calendario real
    </p>
  );
}

function slotLabel(slot: SlotDto, zone: string) {
  return `${timeIn(slot.start, zone)} — ${timeIn(slot.end, zone)}`;
}

export function BookingWizard({ intent, contact, onSwitch }: BookingWizardProps) {
  const [load, setLoad] = useState<LoadState>({ s: "loading" });
  const [step, setStep] = useState<Step>("day");
  const [viewMonth, setViewMonth] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotDto | null>(null);
  const [conflict, setConflict] = useState(false);
  const [details, setDetails] = useState<Details>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submit, setSubmit] = useState<SubmitState>({ s: "idle" });
  const [cooldown, setCooldown] = useState(false);
  const [result, setResult] = useState<BookingResponse | null>(null);

  const { getToken, invalidate } = useFormToken();
  const headings = useRef<Partial<Record<Step, HTMLHeadingElement | null>>>({});
  const previousStep = useRef<Step>(step);
  const strip = useRef<HTMLDivElement>(null);

  const fetchAvailability = useCallback(async () => {
    const response = await getAvailability();
    setLoad(response.ok ? { s: "ready", data: response.data } : { s: "error", failure: response });
  }, []);

  useEffect(() => {
    let alive = true;
    void getAvailability().then((response) => {
      if (!alive) return;
      setLoad(
        response.ok ? { s: "ready", data: response.data } : { s: "error", failure: response },
      );
    });
    return () => {
      alive = false;
    };
  }, []);

  // Focus follows the flow: every step change lands on that step's heading.
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    headings.current[step]?.focus();
  }, [step]);

  const set = <K extends keyof Details>(key: K, value: Details[K]) =>
    setDetails((current) => ({ ...current, [key]: value }));

  const stepIndex = STEPS.findIndex((entry) => entry.id === step);

  const rail = (
    <>
      <ol aria-label="Pasos de la reserva" className="flex flex-wrap gap-x-5 gap-y-2">
        {STEPS.map((entry, index) => {
          const current = entry.id === step;
          const canGoBack = index < stepIndex && step !== "done";
          const body = (
            <>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span> {entry.label}
            </>
          );
          return (
            <li
              key={entry.id}
              aria-current={current ? "step" : undefined}
              className={`label-mono flex min-h-8 items-center border-b-2 ${
                current
                  ? "border-[color:var(--primary)] font-bold text-[color:var(--foreground)]"
                  : index < stepIndex
                    ? "border-[color:var(--foreground)] text-[color:var(--foreground)]"
                    : "border-transparent text-[color:var(--muted)]"
              }`}
            >
              {canGoBack ? (
                <button
                  type="button"
                  className="label-mono min-h-8 hover:text-[color:var(--primary)]"
                  onClick={() => setStep(entry.id)}
                >
                  {body}
                  <span className="sr-only"> (volver a este paso)</span>
                </button>
              ) : (
                <span>{body}</span>
              )}
            </li>
          );
        })}
      </ol>
      <p aria-live="polite" className="sr-only" data-testid="step-announcer">
        {`Paso ${stepIndex + 1} de ${STEPS.length}: ${STEPS[stepIndex].label}`}
      </p>
    </>
  );

  if (load.s === "loading") {
    return (
      <div className="space-y-6">
        {rail}
        <div className="max-w-[26rem]">
          <CalendarSkeleton />
        </div>
      </div>
    );
  }

  if (load.s === "error") {
    const down = load.failure.code === "PROVIDER_NOT_CONFIGURED";
    return (
      <div className="space-y-6" data-state={down ? "provider-not-configured" : "calendar-error"}>
        <FailureNotice
          failure={load.failure}
          contact={contact}
          others={OTHERS}
          onSwitch={onSwitch}
        >
          {down ? (
            <p className="mt-2 text-sm text-[color:var(--surface-foreground)]">
              La agenda en línea no está conectada ahora mismo, así que no podemos mostrarte huecos
              reales. Escríbenos o llámanos y cerramos la hora directamente.
            </p>
          ) : (
            <button
              type="button"
              className={`${secondaryButton} mt-4 min-h-11 text-sm`}
              onClick={() => {
                setLoad({ s: "loading" });
                void fetchAvailability();
              }}
            >
              Reintentar
            </button>
          )}
        </FailureNotice>
      </div>
    );
  }

  const data = load.data;
  const zone = data.timezone;
  const localZone = visitorTimeZone();
  const days = data.days;
  const today = civilDateIn(data.generatedAt, zone);
  const availableDates = days.filter((day) => day.slots.length > 0).map((day) => day.date);
  const demo = data.mode === "dev-memory" ? <DemoBanner /> : null;

  if (step === "done" && result) {
    return (
      <div className="space-y-6">
        {rail}
        {result.mode === "dev-memory" ? <DemoBanner /> : null}
        <Receipt
          result={result}
          localZone={localZone}
          headingRef={(node) => {
            headings.current.done = node;
          }}
        />
      </div>
    );
  }

  if (availableDates.length === 0) {
    return (
      <div className="space-y-6" data-state="no-available-days">
        {demo}
        <div className="border-2 border-[color:var(--foreground)] p-5">
          <p className="label-mono text-[color:var(--muted)]">Agenda completa</p>
          <h3 className="mt-2 text-xl font-semibold">
            No quedan huecos para reuniones en las próximas semanas.
          </h3>
          <p className="mt-2 text-[color:var(--surface-foreground)]">
            Podemos hablar igual: déjanos tu teléfono y te llamamos, o escríbenos y te respondemos
            por email.
          </p>
          <Fallbacks contact={contact} others={OTHERS} onSwitch={onSwitch} />
        </div>
      </div>
    );
  }

  const listedMonths = days.map((day) => monthOf(day.date)).sort();
  const minMonth = listedMonths[0];
  const maxMonth = listedMonths[listedMonths.length - 1];
  const month = viewMonth ?? monthOf(selectedDate ?? availableDates[0]);
  const selectedDay: DayDto | undefined = days.find((day) => day.date === selectedDate);
  const slots = selectedDay?.slots ?? [];
  const nextFreeDate = selectedDate
    ? (availableDates.find((date) => date > selectedDate) ?? availableDates[0])
    : availableDates[0];

  const zonesDiffer = (slot: SlotDto) =>
    timeIn(slot.start, localZone) !== timeIn(slot.start, zone) ||
    civilDateIn(slot.start, localZone) !== civilDateIn(slot.start, zone);

  function selectDay(date: string) {
    setSelectedDate(date);
    setViewMonth(monthOf(date));
    setSelectedSlot(null);
    setConflict(false);
    setStep("time");
    // Below `lg` the calendar collapses to a pinned week strip: bring it to the
    // top so the slot list has the whole screen.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => strip.current?.scrollIntoView({ block: "start" }));
    }
  }

  const summary = selectedSlot
    ? `Reunión · ${dayShortIn(selectedSlot.start, localZone)} · ${timeIn(selectedSlot.start, localZone)}`
    : "Reunión";

  const slotSentence = (slot: SlotDto) =>
    zonesDiffer(slot)
      ? `${timeIn(slot.start, localZone)} — tu hora local · ${timeIn(slot.start, zone)} hora peninsular (${zone})`
      : `${timeIn(slot.start, zone)} hora peninsular (${zone})`;

  function validate(): Record<string, string> {
    const found: Record<string, string> = {};
    if (details.name.trim().length < 2) found["bk-name"] = "Indica tu nombre.";
    if (!EMAIL_RE.test(details.email.trim())) found["bk-email"] = "Indica un email válido.";
    if (details.phone.trim() && !PHONE_RE.test(details.phone.trim())) {
      found["bk-phone"] = "Indica un teléfono válido.";
    }
    if (!details.consent) found["bk-consent"] = "Debes aceptar el aviso de privacidad.";
    return found;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submit.s === "submitting" || cooldown || !selectedSlot) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(FIELD_ORDER, found);
      return;
    }

    setSubmit({ s: "submitting" });
    const formToken = await getToken();
    if (!formToken) {
      setSubmit({ s: "error", failure: TOKEN_FAILURE });
      return;
    }

    // The contract has no company field: it travels as the first line of the message.
    const message = [
      details.company.trim() ? `Empresa: ${details.company.trim()}` : "",
      details.need.trim(),
    ]
      .filter(Boolean)
      .join("\n");

    const payload: BookingRequest = {
      start: selectedSlot.start,
      name: details.name.trim(),
      email: details.email.trim(),
      intent,
      visitorTimeZone: localZone,
      consent: true,
      formToken,
      website: details.website,
    };
    if (details.phone.trim()) payload.phone = details.phone.trim();
    if (message) payload.message = message;

    const response = await postBooking(payload);

    if (response.ok) {
      setResult(response.data);
      setSubmit({ s: "idle" });
      setStep("done");
      return;
    }

    if (response.code === "SLOT_UNAVAILABLE") {
      // Server truth wins: swap in the refreshed day (or reload everything) and
      // go back to the time step. The typed details stay in state.
      const refreshed = response.day;
      if (refreshed) {
        setLoad({
          s: "ready",
          data: {
            ...data,
            days: days.map((day) => (day.date === refreshed.date ? refreshed : day)),
          },
        });
      } else {
        void fetchAvailability();
      }
      setSelectedSlot(null);
      setConflict(true);
      setSubmit({ s: "idle" });
      setStep("time");
      return;
    }

    const server = firstFieldErrors(response.fieldErrors);
    const mapped: Record<string, string> = {};
    if (server.name) mapped["bk-name"] = server.name;
    if (server.email) mapped["bk-email"] = server.email;
    if (server.phone) mapped["bk-phone"] = server.phone;
    if (server.message) mapped["bk-need"] = server.message;
    if (server.consent) mapped["bk-consent"] = server.consent;
    setErrors(mapped);
    if (server.formToken) invalidate();
    if (response.code === "RATE_LIMITED" && response.retryAfterSeconds) setCooldown(true);
    setSubmit({ s: "error", failure: response });
  }

  /* ───────────── Step 3 · details ───────────── */
  if (step === "details" && selectedSlot) {
    const submitting = submit.s === "submitting";
    return (
      <div className="space-y-6" data-state={submitting ? "booking-submitting" : "details"}>
        {rail}
        {demo}

        <div className="sticky top-16 z-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-y-2 border-[color:var(--foreground)] bg-[color:var(--background)] py-2.5">
          <p className="font-mono text-sm font-semibold" data-testid="booking-summary">
            {summary}
          </p>
          <button
            type="button"
            className="min-h-11 text-sm font-semibold underline decoration-2 underline-offset-4"
            disabled={submitting}
            onClick={() => setStep("time")}
          >
            Cambiar hora
          </button>
        </div>

        <form noValidate onSubmit={onSubmit} className="relative max-w-2xl">
          <h3
            ref={(node) => {
              headings.current.details = node;
            }}
            tabIndex={-1}
            className="text-xl font-semibold"
          >
            Tus datos
          </h3>
          <p className="mt-1 text-sm text-[color:var(--surface-foreground)]">
            {slotSentence(selectedSlot)} · {data.slotMinutes} min por Google Meet.
          </p>

          <fieldset disabled={submitting} className="mt-6 space-y-5">
            <legend className="sr-only">Datos para la reunión</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id="bk-name"
                label="Nombre"
                autoComplete="name"
                maxLength={80}
                value={details.name}
                onChange={(event) => set("name", event.target.value)}
                error={errors["bk-name"]}
              />
              <TextField
                id="bk-email"
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={120}
                value={details.email}
                onChange={(event) => set("email", event.target.value)}
                hint="Aquí te llega la invitación con el enlace."
                error={errors["bk-email"]}
              />
              <TextField
                id="bk-company"
                label="Empresa"
                optional
                autoComplete="organization"
                maxLength={80}
                value={details.company}
                onChange={(event) => set("company", event.target.value)}
              />
              <TextField
                id="bk-phone"
                label="Teléfono"
                optional
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                value={details.phone}
                onChange={(event) => set("phone", event.target.value)}
                error={errors["bk-phone"]}
              />
            </div>
            <TextAreaField
              id="bk-need"
              label="¿Qué necesitas?"
              optional
              rows={3}
              maxLength={900}
              value={details.need}
              onChange={(event) => set("need", event.target.value)}
              hint="Un par de frases bastan; lo vemos en la llamada."
              error={errors["bk-need"]}
            />
            <ConsentField
              id="bk-consent"
              checked={details.consent}
              onChange={(checked) => set("consent", checked)}
              notice="Solo usamos tus datos para responderte y gestionar esta reunión. Encargados del tratamiento: Google Calendar (cita) y Resend (email)."
              error={errors["bk-consent"]}
            />
            <Honeypot value={details.website} onChange={(value) => set("website", value)} />
          </fieldset>

          {submit.s === "error" ? (
            <div className="mt-6" data-state="booking-error">
              <FailureNotice
                failure={submit.failure}
                contact={contact}
                others={OTHERS}
                onSwitch={onSwitch}
                onCooldownEnd={() => setCooldown(false)}
              >
                {submit.failure.fieldErrors?.start ? (
                  <button
                    type="button"
                    className={`${secondaryButton} mt-3 min-h-11 text-sm`}
                    onClick={() => setStep("time")}
                  >
                    Elegir otra hora
                  </button>
                ) : null}
              </FailureNotice>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className={primaryButton}
              aria-busy={submitting}
              disabled={submitting || cooldown}
            >
              {submitting ? "Reservando…" : "Confirmar reunión"}
            </button>
            <p className="text-sm text-[color:var(--muted)]">Sin compromiso. Puedes cancelarla.</p>
          </div>
        </form>
      </div>
    );
  }

  /* ───────────── Steps 1–2 · day and time ───────────── */
  const timeStep = step === "time" && selectedDate !== null;
  const noSlots = timeStep && slots.length === 0;

  return (
    <div className="space-y-6">
      {rail}
      {demo}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-14">
        <div
          ref={strip}
          data-state={timeStep ? "week-strip" : "calendar-available"}
          className={
            timeStep
              ? "scroll-mt-16max-lg:sticky max-lg:top-16 max-lg:z-10 max-lg:border-b-2 max-lg:border-[color:var(--foreground)] max-lg:bg-[color:var(--background)] max-lg:pb-3 max-lg:pt-2"
              : ""
          }
        >
          <h3
            ref={(node) => {
              headings.current.day = node;
            }}
            tabIndex={-1}
            className={`mb-4 text-xl font-semibold ${timeStep ? "max-lg:sr-only" : ""}`}
          >
            Elige día
          </h3>
          <BookingCalendar
            days={days}
            today={today}
            month={month}
            minMonth={minMonth}
            maxMonth={maxMonth}
            onMonthChange={setViewMonth}
            selected={selectedDate}
            onSelect={selectDay}
            collapsed={timeStep}
            onExpand={() => setStep("day")}
          />
        </div>

        <div>
          {!timeStep ? (
            <div className="hidden border-t-2 border-[color:var(--foreground)] pt-4 lg:block">
              <p className="label-mono text-[color:var(--muted)]">02 Hora</p>
              <p className="mt-2 max-w-sm text-[color:var(--surface-foreground)]">
                Elige un día con hueco y aquí aparecen las horas libres. Cada reunión dura{" "}
                {data.slotMinutes} minutos.
              </p>
            </div>
          ) : (
            <div
              key={selectedDate}
              className={styles.slideUp}
              data-state={
                noSlots ? "no-slots-for-day" : selectedSlot ? "slot-selected" : "day-available"
              }
            >
              <h3
                ref={(node) => {
                  headings.current.time = node;
                }}
                tabIndex={-1}
                className="text-xl font-semibold"
              >
                Elige hora
              </h3>
              <p className="mt-1 font-mono text-sm first-letter:uppercase">
                {civilLong(selectedDate)}
              </p>

              {conflict ? (
                <div
                  role="alert"
                  data-state="booking-conflict"
                  className="mt-4 border-2 border-[color:var(--error)] p-4"
                >
                  <p className="label-mono text-[color:var(--error)]">Hora ocupada</p>
                  <p className="mt-2 font-medium">
                    Esa hora se acaba de reservar mientras rellenabas el formulario. Hemos
                    actualizado los huecos del día: elige otra. Tus datos siguen guardados.
                  </p>
                </div>
              ) : null}

              {noSlots ? (
                <div className="mt-4 border-t-2 border-[color:var(--foreground)] pt-4">
                  <p className="text-lg font-semibold">Sin huecos este día</p>
                  <p className="mt-1 text-[color:var(--surface-foreground)]">
                    Ya no queda ninguna hora libre el {civilLong(selectedDate)}.
                  </p>
                  <button
                    type="button"
                    className={`${secondaryButton} mt-4`}
                    onClick={() => selectDay(nextFreeDate)}
                  >
                    Ir al siguiente día libre
                    <span className="font-mono text-sm font-normal">
                      · {dayShortIn(`${nextFreeDate}T12:00:00Z`, "UTC")}
                    </span>
                  </button>
                </div>
              ) : (
                <>
                  <p className="mt-3 text-sm text-[color:var(--surface-foreground)]">
                    {zonesDiffer(slots[0])
                      ? `Horas en tu zona (${localZone}). Debajo de cada una, la hora peninsular (${zone}).`
                      : `Horas en hora peninsular (${zone}).`}
                  </p>
                  <div
                    role="group"
                    aria-label="Horas disponibles"
                    data-lenis-prevent
                    className="mt-4 grid max-h-[22rem] grid-cols-2 gap-2 overflow-y-auto p-1 lg:max-w-md"
                  >
                    {slots.map((slot) => {
                      const active = selectedSlot?.start === slot.start;
                      const differ = zonesDiffer(slot);
                      return (
                        <button
                          key={slot.start}
                          type="button"
                          data-slot={slot.start}
                          aria-pressed={active}
                          aria-label={`${slotLabel(slot, localZone)}${
                            differ ? `, ${timeIn(slot.start, zone)} hora peninsular` : ""
                          }`}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setConflict(false);
                          }}
                          className={`flex min-h-12 flex-col items-center justify-center border-[1.5px] border-[color:var(--foreground)] px-2 py-1.5 font-mono text-sm transition-colors duration-100 ${
                            active
                              ? "bg-[color:var(--foreground)] text-[color:var(--background)]"
                              : "bg-[color:var(--background)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-elevated)]"
                          }`}
                        >
                          <span>{slotLabel(slot, localZone)}</span>
                          {differ ? (
                            <span className="text-[0.6875rem] opacity-80">
                              {timeIn(slot.start, zone)} Madrid
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="sticky bottom-0 mt-5 border-t-2 border-[color:var(--foreground)] bg-[color:var(--background)] py-3 lg:max-w-md">
                    {selectedSlot ? (
                      <>
                        <p className="font-mono text-sm font-semibold">{summary}</p>
                        <p className="mt-1 text-sm text-[color:var(--surface-foreground)]">
                          {slotSentence(selectedSlot)}
                        </p>
                        <button
                          type="button"
                          className={`${primaryButton} mt-3 w-full sm:w-auto`}
                          onClick={() => setStep("details")}
                        >
                          Continuar con mis datos
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-[color:var(--muted)]">
                        Elige una hora para continuar.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Step 4 · confirmation receipt ───────────── */

function ReceiptRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 border-b border-[color:var(--border-hover)] py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
      <dt className="label-mono pt-0.5 text-[color:var(--muted)]">{label}</dt>
      <dd className="min-w-0 text-[color:var(--foreground)]">{children}</dd>
    </div>
  );
}

function Receipt({
  result,
  localZone,
  headingRef,
}: {
  result: BookingResponse;
  localZone: string;
  headingRef: (node: HTMLHeadingElement | null) => void;
}) {
  const { booking } = result;
  const zone = booking.timezone;
  const minutes = Math.round(
    (new Date(booking.end).getTime() - new Date(booking.start).getTime()) / 60_000,
  );
  const differ =
    timeIn(booking.start, localZone) !== timeIn(booking.start, zone) ||
    civilDateIn(booking.start, localZone) !== civilDateIn(booking.start, zone);

  function downloadIcs() {
    const blob = new Blob([booking.ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `reunion-${booking.ref}.ics`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section
      aria-labelledby="receipt-title"
      data-state="booking-success"
      className={`${styles.slideUp} max-w-2xl border-t-2 border-[color:var(--foreground)]`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[color:var(--foreground)] py-4">
        <h3
          id="receipt-title"
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-3xl leading-tight"
        >
          Reunión confirmada
        </h3>
        <span className="status" data-s="implemented">
          Confirmada
        </span>
      </div>

      {result.notification === "degraded" ? (
        <p
          role="status"
          data-state="notification-degraded"
          className="border-b-2 border-[color:var(--foreground)] bg-[color:var(--surface)] px-3 py-3 text-sm font-medium"
        >
          La reunión está reservada, pero no hemos podido enviar el aviso por email. Guarda esta
          página o añade la cita a tu calendario con el botón de abajo.
        </p>
      ) : null}

      {result.notification === "degraded" ? null : (
        <p className="border-b border-[color:var(--border-hover)] py-3 text-[color:var(--surface-foreground)]">
          Te llegará la invitación de calendario por email.
        </p>
      )}

      <dl>
        <ReceiptRow label="Fecha">
          <span className="first-letter:uppercase">{dateLongIn(booking.start, localZone)}</span>
        </ReceiptRow>
        <ReceiptRow label="Hora">
          <span className="font-mono">
            {timeIn(booking.start, localZone)} — {timeIn(booking.end, localZone)}
          </span>
          {differ ? (
            <span className="block text-sm text-[color:var(--surface-foreground)]">
              tu hora local · {timeIn(booking.start, zone)} — {timeIn(booking.end, zone)} hora
              peninsular
            </span>
          ) : null}
        </ReceiptRow>
        <ReceiptRow label="Zona horaria">
          {differ ? `${localZone} (tu zona) · ${zone} (hora peninsular)` : `${zone} (hora peninsular)`}
        </ReceiptRow>
        <ReceiptRow label="Duración">{minutes} min</ReceiptRow>
        <ReceiptRow label="Modalidad">
          {booking.meetUrl ? (
            <>
              Online, por Google Meet
              <a
                href={booking.meetUrl}
                target="_blank"
                rel="noreferrer"
                className={`${textLink} block break-all font-mono text-sm`}
              >
                {booking.meetUrl.replace(/^https?:\/\//, "")}
              </a>
            </>
          ) : (
            "Online. El enlace de Google Meet llega en la invitación por email."
          )}
        </ReceiptRow>
        <ReceiptRow label="Referencia">
          <span className="font-mono">{booking.ref}</span>
        </ReceiptRow>
      </dl>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
        <button type="button" className={primaryButton} onClick={downloadIcs}>
          Añadir al calendario (.ics)
        </button>
        <Link
          href={`/contacto/cancelar#t=${encodeURIComponent(booking.cancelToken)}`}
          className={`${textLink} inline-flex min-h-11 items-center`}
        >
          Cancelar reunión
        </Link>
      </div>
    </section>
  );
}
