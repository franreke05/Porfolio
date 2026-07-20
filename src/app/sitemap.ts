import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const LAST_MODIFIED = new Date("2026-07-20");

const SERVICE_SLUGS = [
  "desarrollo-apps-android",
  "crm-a-medida",
  "diseno-web-empresas",
  "automatizaciones-pymes",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const serviceUrls: MetadataRoute.Sitemap = [
    {
      url:             `${SITE_URL}/servicios`,
      lastModified:    LAST_MODIFIED,
      changeFrequency: "monthly",
      priority:        0.85,
    },
    ...SERVICE_SLUGS.map((slug) => ({
      url:             `${SITE_URL}/servicios/${slug}`,
      lastModified:    LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority:        0.8,
    })),
  ];

  const CASE_STUDY_SLUGS = ["edutrack", "flashfix", "oposicontrol", "orykai"] as const;

  const caseStudyUrls: MetadataRoute.Sitemap = CASE_STUDY_SLUGS.map((slug) => ({
    url:             `${SITE_URL}/proyectos/${slug}`,
    lastModified:    LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority:        0.8,
  }));

  // Legacy long-slug ids and aliases now 301-redirect to the short slugs above
  // (see src/app/proyectos/[id]/page.tsx) — intentionally not listed here, a
  // sitemap should never contain a redirecting URL.
  return [
    {
      url:             SITE_URL,
      lastModified:    LAST_MODIFIED,
      changeFrequency: "weekly",
      priority:        1,
    },
    {
      url:             `${SITE_URL}/proyectos`,
      lastModified:    LAST_MODIFIED,
      changeFrequency: "monthly",
      priority:        0.9,
    },
    {
      url:             `${SITE_URL}/sobre-mi`,
      lastModified:    LAST_MODIFIED,
      changeFrequency: "monthly",
      priority:        0.7,
    },
    ...serviceUrls,
    ...caseStudyUrls,
  ];
}
