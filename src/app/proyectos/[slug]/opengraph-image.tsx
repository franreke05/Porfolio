import { OG_SIZE, renderOgImage } from "@/lib/og-image";
import { getProject, portfolioProjects, projectCategories, workStatusLabel } from "@/lib/portfolio";

export const alt         = "Proyecto de ORYKAI SOFTWARE";
export const size        = OG_SIZE;
export const contentType = "image/png";

// The page sets dynamicParams = false, so the image route needs the same
// list of slugs or every request to it is a 404.
export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

// One image per catalogue project. Category and status come straight from
// src/lib/portfolio.ts, so the preview can never claim more than the page.
export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return renderOgImage({
      eyebrow: "Proyectos",
      title: "Proyectos, cada uno con su estado real.",
      description: "ORYKAI SOFTWARE",
    });
  }

  const category = projectCategories.find((item) => item.id === project.category);
  const status = project.statusNote
    ? `${workStatusLabel[project.status]} · ${project.statusNote}`
    : workStatusLabel[project.status];

  return renderOgImage({
    eyebrow: category?.label ?? "Proyectos",
    title: project.name,
    description: project.descriptor,
    tags: [status, ...project.platforms.slice(0, 3)],
  });
}
