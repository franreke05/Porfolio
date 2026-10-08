import type { Metadata } from "next";
import { ContactExperience } from "@/components/contact/contact-experience";
import type { Channel, ContactInfo } from "@/components/contact/fields";
import { INTENT_LABEL, parseIntent } from "@/components/contact/intents";
import { JsonLd } from "@/components/json-ld";
import { contactJsonLd, contactMetadata } from "@/lib/seo";
import { siteProfile } from "@/lib/site-data";

export const metadata: Metadata = contactMetadata;

const CHANNELS: Channel[] = ["video", "telefono", "email"];

const contact: ContactInfo = {
  email: siteProfile.email,
  mailto: siteProfile.links.mail,
  phone: siteProfile.phone,
  displayPhone: siteProfile.displayPhone,
};

type ContactPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const query = await searchParams;
  const intent = parseIntent(query.intent);
  const canal = Array.isArray(query.canal) ? query.canal[0] : query.canal;
  const initialChannel = CHANNELS.find((channel) => channel === canal) ?? null;

  return (
    <div className="mx-auto w-full max-w-[var(--grid-max)] px-5 pb-24 pt-28 sm:px-8 lg:px-12 lg:pt-32">
      <JsonLd schemas={contactJsonLd} />
      <header className="grid gap-8 pb-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
        <div>
          <p className="label-mono text-[color:var(--muted)]">
            Contacto{intent !== "general" ? ` · ${INTENT_LABEL[intent]}` : ""}
          </p>
          <h1 className="mt-3 max-w-[16ch] font-display text-[length:var(--text-display-sm)] leading-[1.02] tracking-tight sm:text-[length:var(--text-display-lg)]">
            Cuéntanos qué quieres construir.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[color:var(--surface-foreground)]">
            Elige cómo prefieres hablar. Sin compromiso: primero entendemos el problema.
          </p>
          <p className="mt-3 max-w-xl text-sm text-[color:var(--muted)]">
            Si construimos tu producto y estás de acuerdo, también tendrá su cómic en la cartelera.
          </p>
        </div>

        <div className="border-t-2 border-[color:var(--foreground)] pt-4 text-sm">
          <p className="label-mono text-[color:var(--muted)]">Hablas con Francisco</p>
          <p className="mt-2 text-[color:var(--surface-foreground)]">
            En la reunión online (30 min) repasamos qué necesitas, en qué punto está y cuál sería el
            siguiente paso.
          </p>
          <p className="mt-3 flex flex-col gap-1">
            <a
              href={contact.mailto}
              className="inline-flex min-h-11 items-center break-all font-semibold underline decoration-2 underline-offset-4 hover:text-[color:var(--primary)]"
            >
              {contact.email}
            </a>
            <a
              href={`tel:${contact.phone}`}
              className="inline-flex min-h-11 items-center font-mono font-semibold underline decoration-2 underline-offset-4 hover:text-[color:var(--primary)]"
            >
              {contact.displayPhone}
            </a>
          </p>
        </div>
      </header>

      <h2 id="channel-title" className="label-mono pb-3 text-[color:var(--foreground)]">
        ¿Cómo prefieres hablar?
      </h2>
      <ContactExperience intent={intent} initialChannel={initialChannel} contact={contact} />
    </div>
  );
}
