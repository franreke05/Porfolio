import Image from "next/image";

type MastheadBioProps = {
  name: string;
  role: string;
  location: string;
  portraitSrc: string;
  portraitAlt?: string;
};

/** Who leads the studio: portrait plus a mono credits strip. No CTA of its own. */
export function MastheadBio({ name, role, location, portraitSrc, portraitAlt }: MastheadBioProps) {
  return (
    <figure className="w-full max-w-[17rem]">
      <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-[color:var(--foreground)] bg-[color:var(--surface)]">
        <Image
          src={portraitSrc}
          alt={portraitAlt ?? `Retrato de ${name}`}
          fill
          sizes="(max-width: 1023px) 272px, 272px"
          className="object-cover object-[50%_52%]"
        />
      </div>
      <figcaption className="mt-3">
        <span className="block font-semibold text-[color:var(--foreground)]">{name}</span>
        <span className="label-mono mt-1 block text-[color:var(--muted)]">
          {role} · {location}
        </span>
      </figcaption>
    </figure>
  );
}
