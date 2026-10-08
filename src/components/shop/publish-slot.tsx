/**
 * The empty slot on the shelf: a cover-shaped placeholder for the visitor's
 * own project. Purely visual — the caller wraps it or sits a link next to it.
 */
export function PublishSlot({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`@container relative flex aspect-[2/3] w-full flex-col items-center justify-center overflow-hidden border-[3px] border-dashed border-[color:var(--foreground)] bg-[color:var(--surface)] text-center ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(193,57,31,0.22) 1.2px, transparent 1.7px)",
          backgroundSize: "8px 8px",
          maskImage: "radial-gradient(circle at 50% 45%, #000 0%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 45%, #000 0%, transparent 72%)",
        }}
      />
      <span className="relative border-2 border-[color:var(--foreground)] bg-[color:var(--background)] px-[3cqw] py-[1.4cqw] font-mono text-[max(0.5625rem,3.6cqw)] font-bold uppercase tracking-[0.1em]">
        Próximo número
      </span>
      <span
        className="relative mt-[5cqw] -rotate-3 px-[4cqw] font-comic text-[21cqw] uppercase leading-[0.86] text-[color:var(--primary)]"
        style={{ WebkitTextStroke: "0.03em var(--foreground)", textShadow: "0.045em 0.055em 0 var(--foreground)", paintOrder: "stroke fill" }}
      >
        Tu proyecto
      </span>
      <span className="relative mt-[6cqw] font-comic text-[18cqw] leading-none text-[color:var(--foreground)]">+</span>
    </div>
  );
}

/** The owner's stated offer; used verbatim next to the "Publica el tuyo" CTA. */
export const PUBLISH_OFFER = "Si construimos tu producto y estás de acuerdo, también tendrá su cómic en la cartelera.";
