type FaqDisclosureProps = {
  index: number;
  question: string;
  answer: string;
};

/**
 * One FAQ item on native <details>/<summary>: keyboard and assistive-tech
 * support for free, the answer is in the HTML, and the indicator is CSS only.
 */
export function FaqDisclosure({ index, question, answer }: FaqDisclosureProps) {
  return (
    <details className="group border-t border-[color:var(--foreground)] last:border-b">
      <summary className="grid cursor-pointer list-none grid-cols-[1.75rem_minmax(0,1fr)_auto] items-start gap-3 py-5 marker:content-none sm:gap-5 [&::-webkit-details-marker]:hidden">
        <span className="pt-1.5 font-mono text-[11px] font-bold text-[color:var(--muted)]" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-lg font-semibold leading-snug text-[color:var(--foreground)]">{question}</h3>
        <span
          className="flex h-7 w-7 items-center justify-center border border-[color:var(--foreground)] font-mono text-lg leading-none text-[color:var(--foreground)] transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <div className="pb-6 pl-10 pr-10 sm:pl-12 sm:pr-14">
        <p className="max-w-2xl leading-7 text-[color:var(--muted)]">{answer}</p>
      </div>
    </details>
  );
}
