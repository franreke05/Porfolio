"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { submitContactMessage } from "@/app/actions";
import { initialContactState } from "@/lib/contact";
import { ClickSpark } from "@/components/click-spark";

const projectTypes = [
  "App mobile",
  "CRM personalizado",
  "Web informativa",
  "Automatización",
  "Mantenimiento",
  "No lo tengo claro todavía",
];

const fieldClass =
  "mt-2 field-base";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <ClickSpark className="inline-flex rounded-lg" sparkColor="var(--on-primary)">
      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[color:var(--primary)] px-5 text-sm font-semibold text-[color:var(--on-primary)] transition hover:-translate-y-0.5 hover:bg-[color:var(--primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Enviando
          </>
        ) : (
          <>
            Enviar y agendar llamada
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </ClickSpark>
  );
}

type FieldErrorProps = {
  id: string;
  errors?: string[];
};

function FieldError({ id, errors }: FieldErrorProps) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p id={id} role="alert" className="mt-2 text-sm text-[color:var(--error)]">
      {errors[0]}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(
    submitContactMessage,
    initialContactState,
  );

  return (
    <form
      action={formAction}
      className="rounded-xl border border-[color:var(--border)] bg-[linear-gradient(148deg,var(--surface-elevated),var(--surface))] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6"
    >
      <div className="mb-5 rounded-md border border-[color:var(--border)] bg-[color:var(--accent-cyan-soft)] p-3 text-sm leading-6 text-[color:var(--surface-foreground)]">
        Describe el problema, el objetivo y el contexto. Con eso puedo proponerte una ruta clara.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-[color:var(--foreground)]">Nombre</span>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={fieldClass}
            placeholder="Tu nombre"
            aria-invalid={state.fieldErrors?.name?.length ? true : undefined}
            aria-describedby={state.fieldErrors?.name?.length ? "name-error" : undefined}
          />
          <FieldError id="name-error" errors={state.fieldErrors?.name} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[color:var(--foreground)]">Email</span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={fieldClass}
            placeholder="tu@email.com"
            aria-invalid={state.fieldErrors?.email?.length ? true : undefined}
            aria-describedby={state.fieldErrors?.email?.length ? "email-error" : undefined}
          />
          <FieldError id="email-error" errors={state.fieldErrors?.email} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[color:var(--foreground)]">Teléfono</span>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={fieldClass}
            placeholder="+34 ..."
            aria-invalid={state.fieldErrors?.phone?.length ? true : undefined}
            aria-describedby={state.fieldErrors?.phone?.length ? "phone-error" : undefined}
          />
          <FieldError id="phone-error" errors={state.fieldErrors?.phone} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[color:var(--foreground)]">Tipo de proyecto</span>
          <select
            id="projectType"
            name="projectType"
            required
            className={fieldClass}
            defaultValue=""
            aria-invalid={state.fieldErrors?.projectType?.length ? true : undefined}
            aria-describedby={state.fieldErrors?.projectType?.length ? "projectType-error" : undefined}
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError id="projectType-error" errors={state.fieldErrors?.projectType} />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-[color:var(--foreground)]">Objetivo principal</span>
          <input
            id="goal"
            name="goal"
            type="text"
            required
            className={fieldClass}
            placeholder="Ej. organizar clientes, lanzar una app, captar contactos..."
            aria-invalid={state.fieldErrors?.goal?.length ? true : undefined}
            aria-describedby={state.fieldErrors?.goal?.length ? "goal-error" : undefined}
          />
          <FieldError id="goal-error" errors={state.fieldErrors?.goal} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[color:var(--foreground)]">Plazo</span>
          <input
            id="timeframe"
            name="timeframe"
            type="text"
            className={fieldClass}
            placeholder="Este mes, 2-3 meses..."
            aria-invalid={state.fieldErrors?.timeframe?.length ? true : undefined}
            aria-describedby={state.fieldErrors?.timeframe?.length ? "timeframe-error" : undefined}
          />
          <FieldError id="timeframe-error" errors={state.fieldErrors?.timeframe} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[color:var(--foreground)]">Presupuesto orientativo</span>
          <input
            id="budget"
            name="budget"
            type="text"
            className={fieldClass}
            placeholder="Opcional"
            aria-invalid={state.fieldErrors?.budget?.length ? true : undefined}
            aria-describedby={state.fieldErrors?.budget?.length ? "budget-error" : undefined}
          />
          <FieldError id="budget-error" errors={state.fieldErrors?.budget} />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-[color:var(--foreground)]">Mensaje</span>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className={`${fieldClass} h-auto resize-y py-3`}
            placeholder="Cuéntame qué necesitas, qué problema quieres resolver y qué sería un buen resultado."
            aria-invalid={state.fieldErrors?.message?.length ? true : undefined}
            aria-describedby={state.fieldErrors?.message?.length ? "message-error" : undefined}
          />
          <FieldError id="message-error" errors={state.fieldErrors?.message} />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton />
        <p className="text-sm leading-6 text-[color:var(--muted)]">
          Si el formulario falla, usa email o WhatsApp.
        </p>
      </div>

      {state.message && (
        <p
          className={`mt-4 rounded-md border px-3 py-2 text-sm ${
            state.status === "success"
              ? "border-[rgba(101,214,218,0.45)] bg-[rgba(101,214,218,0.1)] text-[color:var(--foreground)]"
              : "border-[rgba(207,102,92,0.45)] bg-[rgba(207,102,92,0.1)] text-[color:var(--foreground)]"
          }`}
          aria-live="polite"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
