import type { Metadata } from "next";
import { CancelBooking } from "@/components/contact/cancel-booking";
import type { ContactInfo } from "@/components/contact/fields";
import { siteProfile } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Cancelar reunión",
  description: "Cancela una reunión reservada.",
  robots: { index: false, follow: false },
};

const contact: ContactInfo = {
  email: siteProfile.email,
  mailto: siteProfile.links.mail,
  phone: siteProfile.phone,
  displayPhone: siteProfile.displayPhone,
};

export default function CancelPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--grid-max)] px-5 pb-24 pt-28 sm:px-8 lg:px-12 lg:pt-32">
      <p className="label-mono text-[color:var(--muted)]">Contacto · Reunión</p>
      <h1 className="mt-3 font-display text-[length:var(--text-display-sm)] leading-[1.05] tracking-tight sm:text-[length:var(--text-display-md)]">
        Cancelar reunión
      </h1>
      <div className="mt-10 max-w-2xl">
        <CancelBooking contact={contact} />
      </div>
    </div>
  );
}
