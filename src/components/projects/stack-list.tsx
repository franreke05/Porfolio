/** Stack as a mono table: ordinal + technology, two columns from sm up. */
export function StackList({ stack }: { stack: string[] }) {
  return (
    <ol className="grid font-mono text-sm sm:grid-cols-2 sm:gap-x-8">
      {stack.map((item, index) => (
        <li
          key={item}
          className="flex items-baseline gap-4 border-b border-[color:var(--border)] py-3 text-foreground"
        >
          <span aria-hidden="true" className="w-6 flex-none text-xs text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          {item}
        </li>
      ))}
    </ol>
  );
}

/** Proof points as a numbered list with display numerals. */
export function ProofList({ proof }: { proof: string[] }) {
  return (
    <ol>
      {proof.map((item, index) => (
        <li
          key={item}
          className="flex items-baseline gap-5 border-b border-[color:var(--border)] py-4 first:pt-0"
        >
          <span aria-hidden="true" className="w-8 flex-none font-display text-2xl leading-none text-muted">
            {index + 1}
          </span>
          <p className="max-w-[62ch] text-base leading-relaxed text-foreground">{item}</p>
        </li>
      ))}
    </ol>
  );
}
