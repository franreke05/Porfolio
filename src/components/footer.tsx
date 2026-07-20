"use client";

import { BriefcaseBusiness, Code2, Mail, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { ContactForm } from "@/components/contact-form";
import { MotionSection } from "@/components/motion-section";
import { siteProfile } from "@/lib/site-data";

/**
 * Persistent contact surface, rendered once in layout.tsx on every route —
 * not a homepage funnel step. The "¿Hablamos?" heading is the one restrained
 * SFX-lettering comic touch allowed outside the project covers.
 */
export function Footer() {
  return (
    <footer id="contacto" className="border-t-2 border-[color:var(--foreground)] bg-[color:var(--surface)] px-5 py-16 sm:px-8 lg:px-12 lg:py-20 xl:px-16 2xl:px-24">
      <div className="grid w-full gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <MotionSection as="div">
          <div>
            <p className="section-eyebrow mb-4">Contacto</p>
            <h2 className="comic-action-word text-4xl text-[color:var(--foreground)] sm:text-5xl">
              ¿Hablamos?
            </h2>
            <p className="mt-5 max-w-md text-pretty leading-7 text-[color:var(--muted)]">
              No hay precios cerrados porque cada app, CRM o web depende del alcance real. El
              primer paso es entender el problema y decidir la ruta más sensata.
            </p>
            <div className="mt-7 grid gap-3">
              <ContactLink href={siteProfile.links.mail} icon={Mail} label={siteProfile.email} />
              <ContactLink href={siteProfile.links.whatsapp} icon={MessageCircle} label={siteProfile.displayPhone} external />
              <ContactLink href={siteProfile.links.linkedin} icon={BriefcaseBusiness} label="LinkedIn" external />
              <ContactLink href={siteProfile.links.github} icon={Code2} label="GitHub" external />
            </div>
          </div>
        </MotionSection>

        <MotionSection as="div" delay={0.08}>
          <ContactForm />
        </MotionSection>
      </div>

      <div className="mt-16 flex w-full flex-col gap-3 border-t border-[color:var(--border)] pt-6 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {siteProfile.name}. Portfolio personal.</p>
        <p className="font-mono text-xs">Next.js · Vercel · TypeScript</p>
      </div>
    </footer>
  );
}

function ContactLink({
  href,
  icon: Icon,
  label,
  external,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  external?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex items-center gap-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] p-3 text-sm text-[color:var(--surface-foreground)] transition-colors hover:border-[color:var(--foreground)] hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--primary)]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 break-words">{label}</span>
    </motion.a>
  );
}
