import type { MetadataRoute } from "next";
import { projects } from "@/lib/site-data";
import { SITE_URL } from "@/lib/seo";

const LAST_MODIFIED = new Date("2026-05-30");

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

  const CASE_STUDY_SLUGS = ["edutrack", "requenadesk", "vinotico", "solsconfort", "oposicontrol"] as const;

  const caseStudyUrls: MetadataRoute.Sitemap = CASE_STUDY_SLUGS.map((slug) => ({
    url:             `${SITE_URL}/proyectos/${slug}`,
    lastModified:    LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority:        0.8,
  }));

  // Long-slug aliases kept for backward compatibility — lower priority, no duplicate canonicals
  const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
    url:             `${SITE_URL}/proyectos/${project.id}`,
    lastModified:    LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority:        0.5,
  }));

  return [
    {
      url:             SITE_URL,
      lastModified:    LAST_MODIFIED,
      changeFrequency: "weekly",
      priority:        1,
    },
    ...serviceUrls,
    ...caseStudyUrls,
    ...projectUrls,
  ];
}
