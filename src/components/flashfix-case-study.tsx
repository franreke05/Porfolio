import { FlashFixComicReader } from "@/components/flashfix-comic-reader";
import { getProject } from "@/lib/portfolio";

/**
 * FlashFix's page IS the comic: no shared header, no template. It opens on
 * the cover and tells the degree project in eight scenes. Facts come from
 * the catalogue (`getProject("flashfix")`); the layout provides `<main>`.
 */
export function FlashfixCaseStudy() {
  const project = getProject("flashfix");
  if (!project) return null;
  return <FlashFixComicReader project={project} />;
}

/** Previous casing of the export, kept so existing imports keep working. */
export { FlashfixCaseStudy as FlashFixCaseStudy };
