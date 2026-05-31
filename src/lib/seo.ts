/**
 * SEO constants and helpers — single source of truth.
 * Import from here in layout.tsx, page.tsx and generateMetadata functions.
 */

export const SITE_URL  = "https://francisco-requena.vercel.app" as const;
export const SITE_NAME = "Francisco Requena Sánchez" as const;

export const AUTHOR = {
  name:     SITE_NAME,
  url:      SITE_URL,
  email:    "franciscorequenasanchez0@gmail.com",
  phone:    "+34642957572",
  location: "Almería, España",
  github:   "https://github.com/franreke05",
  linkedin: "https://www.linkedin.com/in/franciscorequenasanchez",
} as const;

/** Trim description to Google's visible limit (~155 chars). */
export function trimDesc(text: string, max = 155): string {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

/** Canonical URL builder — always returns absolute URL. */
export function canonical(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// ── JSON-LD schemas ────────────────────────────────────────

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: SITE_NAME,
  givenName: "Francisco",
  familyName: "Requena Sánchez",
  jobTitle: "Desarrollador de apps mobile y sistemas digitales",
  description:
    "Freelance especializado en apps mobile con Kotlin/KMP, CRMs personalizados con PostgreSQL y webs rápidas con Next.js para empresas y autónomos en España.",
  url: SITE_URL,
  email: AUTHOR.email,
  telephone: AUTHOR.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Almería",
    addressRegion: "Andalucía",
    addressCountry: "ES",
  },
  sameAs: [AUTHOR.github, AUTHOR.linkedin],
} as const;

export const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#service`,
  name: "Francisco Requena — Desarrollo digital freelance",
  description:
    "Desarrollo de apps mobile con Kotlin/KMP, CRMs a medida, webs informativas y automatizaciones para pequeñas y medianas empresas.",
  url: SITE_URL,
  provider: { "@id": `${SITE_URL}/#person` },
  areaServed: { "@type": "Country", name: "España" },
  availableLanguage: [{ "@type": "Language", name: "Spanish" }],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de desarrollo",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Desarrollo de apps mobile con Kotlin/KMP",
          description: "Apps Android nativas con Jetpack Compose, MVVM y arquitectura lista para evolucionar.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "CRM personalizado",
          description: "Sistemas internos a medida con roles, flujos, reportes y base de datos SQL.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Webs informativas y comerciales",
          description: "Webs rápidas con Next.js, SEO técnico y optimizadas para conversión.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Automatizaciones de negocio",
          description: "Integraciones y flujos que eliminan trabajo repetitivo en operaciones diarias.",
        },
      },
    ],
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: AUTHOR.email,
    telephone: AUTHOR.phone,
    availableLanguage: "Spanish",
  },
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: `${SITE_NAME} — Portfolio`,
  description:
    "Portfolio profesional de Francisco Requena Sánchez, desarrollador freelance de apps mobile, CRMs y webs para empresas.",
  publisher: { "@id": `${SITE_URL}/#person` },
  inLanguage: "es-ES",
} as const;

/** BreadcrumbList for a project detail page. */
export function projectBreadcrumb(projectTitle: string, projectId: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio",    item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Proyectos", item: `${SITE_URL}/#proyectos` },
      { "@type": "ListItem", position: 3, name: projectTitle, item: `${SITE_URL}/proyectos/${projectId}` },
    ],
  };
}

/** Minimal schema for a software/web project. */
export function projectSchema(opts: {
  id: string;
  title: string;
  description: string;
  type: "mobile" | "dashboard" | "browser" | "subscription";
}) {
  const schemaType =
    opts.type === "mobile" ? "MobileApplication" : "WebApplication";

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: opts.title,
    description: opts.description,
    creator: { "@id": `${SITE_URL}/#person` },
    applicationCategory: "BusinessApplication",
    url: `${SITE_URL}/proyectos/${opts.id}`,
    ...(opts.type === "mobile" && { operatingSystem: "Android" }),
  };
}
