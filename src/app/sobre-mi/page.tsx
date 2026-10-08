import type { Metadata } from "next";
import Link from "next/link";
import { AboutDossierExperience } from "@/components/about-dossier-experience";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumb, pageContainer } from "@/components/services-tablet-experience";
import { contactHref } from "@/lib/portfolio";
import { aboutPageSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { FounderProfile } from "./founder-profile";

const DESCRIPTION =
  "Un estudio de producto pequeño, dirigido por Francisco Requena desde Almería y en remoto: quiénes somos, cómo trabajamos y con qué construimos.";

export const metadata: Metadata = buildMetadata({
  title: "Sobre nosotros",
  description: DESCRIPTION,
  path: "/sobre-mi",
});

const jsonLd = [
  aboutPageSchema(DESCRIPTION),
  breadcrumbSchema([{ name: "Sobre nosotros", path: "/sobre-mi" }]),
];

export default function EstudioPage() {
  const ctaHref = contactHref("general");

  return (
    <>
      <JsonLd schemas={jsonLd} />

      <div className={pageContainer}>
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Sobre nosotros" }]} />

        <header className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-14">
          <div>
            <p className="label-mono text-[color:var(--muted)]">ORYKAI SOFTWARE</p>
            <h1 className="mt-4 text-balance font-display text-[2.35rem] font-bold leading-[1.02] tracking-tight text-[color:var(--foreground)] sm:text-5xl lg:text-6xl">
              Un estudio pequeño, de principio a fin.
            </h1>
          </div>
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-[color:var(--surface-foreground)]">
              Diseñamos y construimos productos digitales: apps móviles para Android, iOS y coche, backends y software
              de gestión a medida. Desde Almería, en remoto.
            </p>
          </div>
        </header>

        <FounderProfile portraitSrc="/images/francisco-requena-portrait.jpeg" />

        <AboutDossierExperience />

        <p className="mt-14 font-display text-2xl font-bold leading-tight text-[color:var(--foreground)] sm:text-3xl">
          <Link
            href={ctaHref}
            className="underline decoration-[color:var(--primary)] decoration-[3px] underline-offset-[6px] transition-colors hover:text-[color:var(--primary)]"
          >
            Cuéntanos qué quieres construir
            <span aria-hidden="true"> →</span>
          </Link>
        </p>
      </div>
    </>
  );
}
