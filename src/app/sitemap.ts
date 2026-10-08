import type { MetadataRoute } from "next";
import { portfolioProjects, projectHref } from "@/lib/portfolio";
import { comicHref } from "@/lib/comics";
import { canonical } from "@/lib/seo";
import { services } from "@/lib/site-data";

/**
 * Built from the catalogue, so a new project or service pillar appears here
 * without touching this file.
 *
 * `lastModified` is omitted on purpose: there is no per-page modification
 * date to read, and an invented one is worse than none.
 *
 * Not listed: /contacto/cancelar and /servicios/automatizaciones-pymes
 * (both noindex), /api/*, and any URL that redirects (see next.config.ts).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/proyectos",
    ...portfolioProjects.flatMap((project) => [projectHref(project.slug), comicHref(project.slug)]),
    "/servicios",
    ...services.map((service) => service.href),
    "/sobre-mi",
    "/contacto",
  ];

  return [...new Set(paths)].map((path) => ({ url: canonical(path) }));
}
