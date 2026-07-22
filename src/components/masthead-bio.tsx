import Image from "next/image";
import Link from "next/link";

type MastheadBioProps = {
  name: string;
  role: string;
  location: string;
  status: string;
  contactHref: string;
  contactText?: string;
  portraitSrc?: string;
  portraitAlt?: string;
};

/**
 * Editorial masthead bio — a large serif name, a monospace "credits strip"
 * (role · location · status), and a bold typographic mark in place of a
 * photo (none exists — this is a deliberate typographic substitute, not a
 * fabricated image). Replaces the reactbits.dev holographic-tilt ProfileCard.
 */
export function MastheadBio({
  name,
  role,
  location,
  status,
  contactHref,
  contactText = "Contactar",
  portraitSrc,
  portraitAlt,
}: MastheadBioProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="border-2 border-[color:var(--foreground)] bg-[color:var(--surface)]">
      <div className="flex items-center justify-between gap-4 border-b-2 border-[color:var(--foreground)] px-6 py-3">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Masthead
        </span>
        <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--primary)]">
          {status}
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 px-6 py-12 text-center">
        {portraitSrc ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-[color:var(--foreground)] bg-[color:var(--background)]">
            <Image
              src={portraitSrc}
              alt={portraitAlt ?? `Retrato de ${name}`}
              fill
              sizes="(max-width: 1023px) 320px, 28vw"
              className="object-cover object-[50%_52%]"
            />
          </div>
        ) : (
          <div
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-2 border-[color:var(--foreground)] font-display text-4xl font-bold text-[color:var(--foreground)]"
            aria-hidden="true"
          >
            {initials}
          </div>
        )}

        <div>
          <h2 className="font-display text-4xl font-bold leading-tight text-[color:var(--foreground)]">
            {name}
          </h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-[color:var(--muted)]">
            {role} · {location}
          </p>
        </div>

        <Link
          href={contactHref}
          className="inline-flex items-center gap-2 rounded-md border-2 border-[color:var(--foreground)] bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--on-primary)] transition-colors hover:bg-[color:var(--primary-hover)]"
        >
          {contactText}
        </Link>
      </div>
    </div>
  );
}
