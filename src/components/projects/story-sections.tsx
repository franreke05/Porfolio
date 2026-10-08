import type { StorySection } from "@/lib/portfolio";

/** Story sections in catalogue order: mono eyebrow rail + Fraunces title + body. */
export function StorySections({ story }: { story: StorySection[] }) {
  return (
    <div>
      {story.map((section, index) => (
        <section
          key={section.eyebrow}
          className="grid gap-x-8 gap-y-3 border-t border-[color:var(--border)] py-9 first:border-t-2 first:border-foreground lg:grid-cols-12 lg:py-12"
        >
          <p className="label-mono text-muted lg:col-span-3 lg:pt-2">
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")} — </span>
            {section.eyebrow}
          </p>
          <div className="lg:col-span-8">
            <h2 className="text-balance font-display text-[1.75rem] font-semibold leading-[1.12] tracking-tight text-foreground sm:text-4xl">
              {section.title}
            </h2>
            <div className="mt-5 max-w-[65ch] space-y-4 text-[1.0625rem] leading-relaxed text-[color:var(--surface-foreground)]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
