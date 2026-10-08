/**
 * Search layer — single source of truth for metadata and JSON-LD.
 *
 * Facts come only from `src/lib/portfolio.ts` (project catalogue) and
 * `siteProfile` / `services` in `src/lib/site-data.ts`. Nothing here may add a
 * rating, a price, a launch, opening hours or a client name.
 */

import type { Metadata } from "next";
import {
  portfolioProjects,
  projectCategories,
  projectHref,
  workStatusLabel,
  type PortfolioProject,
} from "@/lib/portfolio";
import { services, siteProfile } from "@/lib/site-data";

export const SITE_URL = "https://francisco-requena.vercel.app" as const;
/** Short brand, used as the title suffix. */
export const SITE_NAME = `${siteProfile.studioName} ${siteProfile.studioTagline}`;
/** Full studio name, used for the entity and og:site_name. */
export const STUDIO_NAME = SITE_NAME;
export const SITE_LANGUAGE = "es-ES" as const;

export const STUDIO_ID = `${SITE_URL}/#studio`;
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;
const DEFAULT_OG_IMAGE = "/opengraph-image";

/** Absolute URL for a site path. */
export function canonical(path: string): string {
  if (path === "/" || path === "") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Trim to a visible-snippet length, cutting on a word boundary. */
export function trimDesc(text: string, max: number = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const body = (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:—–-]+$/, "");
  return `${body}…`;
}

/** "<Título> | <Marca>" when it fits in 60 characters, the bare title otherwise. */
export function pageTitle(title: string): string {
  const withBrand = `${title} | ${SITE_NAME}`;
  if (withBrand.length <= TITLE_MAX) return withBrand;
  return trimDesc(title, TITLE_MAX);
}

type BuildMetadataOptions = {
  /** Page title without the brand suffix. */
  title: string;
  description: string;
  /** Site-relative path, e.g. "/proyectos". Resolved against `metadataBase`. */
  path: string;
  ogType?: "website" | "article";
  /** Use `title` exactly as given (still capped at 60 characters). */
  absoluteTitle?: boolean;
  /** Keep the page out of the index (links are still followed). */
  noindex?: boolean;
  /**
   * Explicit social image path. Only for segments without their own
   * `opengraph-image.tsx`; a file-based image always wins when present.
   */
  image?: string;
};

/** The one metadata pattern of the site. */
export function buildMetadata({
  title,
  description,
  path,
  ogType = "website",
  absoluteTitle = false,
  noindex = false,
  image,
}: BuildMetadataOptions): Metadata {
  const fullTitle = absoluteTitle ? trimDesc(title, TITLE_MAX) : pageTitle(title);
  const fullDescription = trimDesc(description);
  const images = image
    ? [{ url: image, width: 1200, height: 630, alt: fullTitle }]
    : undefined;

  return {
    title: { absolute: fullTitle },
    description: fullDescription,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: path,
      siteName: STUDIO_NAME,
      locale: "es_ES",
      type: ogType,
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      ...(images && { images }),
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}

// ── Entity graph (site-wide) ────────────────────────────────

/** Technologies that appear in at least two catalogue projects. */
const sharedStack = (() => {
  const counts = new Map<string, number>();
  for (const project of portfolioProjects) {
    for (const item of new Set(project.stack)) counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return [...counts].filter(([, count]) => count >= 2).map(([item]) => item);
})();

const studioAddress = {
  "@type": "PostalAddress",
  addressLocality: "Almería",
  addressCountry: "ES",
} as const;

const salesContactPoint = {
  "@type": "ContactPoint",
  contactType: "sales",
  email: siteProfile.email,
  telephone: siteProfile.phone,
  availableLanguage: "es",
  areaServed: "ES",
  url: canonical("/contacto"),
} as const;

/** Organization (the studio) + Person (its founder) + WebSite, as one graph. */
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": STUDIO_ID,
      name: STUDIO_NAME,
      alternateName: siteProfile.studioName,
      url: SITE_URL,
      description: siteProfile.shortBio,
      founder: { "@id": PERSON_ID },
      address: studioAddress,
      areaServed: { "@type": "Country", name: "España" },
      knowsAbout: [...services.map((service) => service.title), ...sharedStack],
      contactPoint: salesContactPoint,
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: siteProfile.name,
      url: canonical("/sobre-mi"),
      worksFor: { "@id": STUDIO_ID },
      address: studioAddress,
      sameAs: [siteProfile.links.github, siteProfile.links.linkedin],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: STUDIO_NAME,
      description: siteProfile.headline,
      inLanguage: SITE_LANGUAGE,
      publisher: { "@id": STUDIO_ID },
    },
  ],
} as const;

// ── Shared builders ─────────────────────────────────────────

type Crumb = { name: string; path: string };

/** BreadcrumbList; "Inicio" is always prepended. */
export function breadcrumbSchema(crumbs: Crumb[]) {
  const all: Crumb[] = [{ name: "Inicio", path: "/" }, ...crumbs];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: canonical(crumb.path),
    })),
  };
}

/** Catalogue projects in proof order, as an ItemList. */
function projectItemList() {
  const ordered = projectCategories.flatMap((category) =>
    portfolioProjects.filter((project) => project.category === category.id),
  );
  return {
    "@type": "ItemList",
    numberOfItems: ordered.length,
    itemListElement: ordered.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.name,
      url: canonical(projectHref(project.slug)),
    })),
  };
}

function webPageBase(type: string, path: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${canonical(path)}#webpage`,
    url: canonical(path),
    name,
    description: trimDesc(description),
    inLanguage: SITE_LANGUAGE,
    isPartOf: { "@id": WEBSITE_ID },
  };
}

// ── Per-page JSON-LD ────────────────────────────────────────

export const HOME_TITLE = `${SITE_NAME} | Estudio de producto: apps y backends`;
export const HOME_DESCRIPTION =
  "Diseñamos y construimos productos digitales de principio a fin: apps móviles para Android, iOS y coche, backends y software de gestión a medida.";

/** Home: WebPage about the studio + the project list. */
export const homeJsonLd = [
  {
    ...webPageBase("WebPage", "/", HOME_TITLE, HOME_DESCRIPTION),
    about: { "@id": STUDIO_ID },
    mainEntity: projectItemList(),
  },
];

export const PROJECTS_DESCRIPTION =
  "Trabajo para clientes, productos propios, software a medida, un caso de estudio y un proyecto académico, cada uno con su estado real.";

/** /proyectos: CollectionPage + ItemList + breadcrumb. */
export const projectsIndexJsonLd = [
  {
    ...webPageBase("CollectionPage", "/proyectos", "Proyectos", PROJECTS_DESCRIPTION),
    mainEntity: projectItemList(),
  },
  breadcrumbSchema([{ name: "Proyectos", path: "/proyectos" }]),
];

function projectStatusText(project: PortfolioProject): string {
  const label = workStatusLabel[project.status];
  return project.statusNote ? `${label} (${project.statusNote})` : label;
}

/** Title for a project page, without brand suffix. */
export function projectTitle(project: PortfolioProject): string {
  return `${project.name}: ${project.descriptor}`;
}

/**
 * Project page: a CreativeWork describing our work on it (TechArticle for the
 * case study). Never a SoftwareApplication — nothing here is publicly
 * obtainable — and never an offer, a rating or a client name.
 */
export function projectJsonLd(project: PortfolioProject) {
  const path = projectHref(project.slug);
  const category = projectCategories.find((item) => item.id === project.category);
  const isCaseStudy = project.category === "case-study";
  const related = (project.related ?? [])
    .map((slug) => portfolioProjects.find((item) => item.slug === slug))
    .filter((item): item is PortfolioProject => Boolean(item));

  const work = {
    "@context": "https://schema.org",
    "@type": isCaseStudy ? "TechArticle" : "CreativeWork",
    "@id": `${canonical(path)}#work`,
    url: canonical(path),
    mainEntityOfPage: canonical(path),
    name: project.name,
    headline: trimDesc(projectTitle(project), 110),
    description: project.pitch,
    inLanguage: SITE_LANGUAGE,
    genre: project.category === "academic" ? project.descriptor : category?.label,
    creativeWorkStatus: projectStatusText(project),
    author: { "@id": STUDIO_ID },
    publisher: { "@id": STUDIO_ID },
    isPartOf: { "@id": WEBSITE_ID },
    keywords: [...project.platforms, ...project.stack].join(", "),
    audience: { "@type": "Audience", audienceType: project.audience },
    ...(project.cover && { image: canonical(project.cover.src) }),
    ...(related.length > 0 && {
      mentions: related.map((item) => ({
        "@type": "CreativeWork",
        "@id": `${canonical(projectHref(item.slug))}#work`,
        name: item.name,
        url: canonical(projectHref(item.slug)),
      })),
    }),
  };

  return [
    work,
    breadcrumbSchema([
      { name: "Proyectos", path: "/proyectos" },
      { name: project.name, path },
    ]),
  ];
}

/** Service page: Service provided by the studio. No offers, no prices. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonical(opts.path)}#service`,
    name: opts.name,
    description: trimDesc(opts.description),
    url: canonical(opts.path),
    serviceType: opts.serviceType,
    provider: { "@id": STUDIO_ID },
    areaServed: { "@type": "Country", name: "España" },
    availableLanguage: "es",
  };
}

/** /servicios: CollectionPage listing the service pillars. */
export function servicesIndexSchema(description: string) {
  return {
    ...webPageBase("CollectionPage", "/servicios", "Servicios", description),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: services.length,
      itemListElement: services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.title,
        url: canonical(service.href),
      })),
    },
  };
}

/** /sobre-mi: AboutPage whose main entity is the studio. */
export function aboutPageSchema(description: string) {
  return {
    ...webPageBase("AboutPage", "/sobre-mi", "Sobre nosotros", description),
    mainEntity: { "@id": STUDIO_ID },
  };
}

/** FAQPage from a page's own visible {q, a} list. Only use where the FAQ is rendered. */
export function faqPageSchema(faqs: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

// ── Contact (wired by the owner of src/app/contacto) ────────

const CONTACT_DESCRIPTION =
  "Cuéntanos qué quieres construir: reserva una reunión online, pide que te llamemos o escríbenos. Estamos en Almería y trabajamos en remoto.";

/** `export const metadata = contactMetadata` in src/app/contacto/page.tsx. */
export const contactMetadata: Metadata = buildMetadata({
  title: "Contacto",
  description: CONTACT_DESCRIPTION,
  path: "/contacto",
  image: DEFAULT_OG_IMAGE,
});

/** `<JsonLd schemas={contactJsonLd} />` in src/app/contacto/page.tsx. No hours, no ReserveAction. */
export const contactJsonLd = [
  {
    ...webPageBase("ContactPage", "/contacto", "Contacto", CONTACT_DESCRIPTION),
    mainEntity: {
      "@type": "Organization",
      "@id": STUDIO_ID,
      name: STUDIO_NAME,
      url: SITE_URL,
      contactPoint: salesContactPoint,
    },
  },
  breadcrumbSchema([{ name: "Contacto", path: "/contacto" }]),
];
