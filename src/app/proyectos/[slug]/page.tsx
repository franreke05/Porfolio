import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { AcademicTemplate } from "@/components/projects/academic-template";
import { BlueprintTemplate } from "@/components/projects/blueprint-template";
import { ClientWorkTemplate } from "@/components/projects/client-work-template";
import { ModeSwitch } from "@/components/projects/mode-switch";
import { NotebookTemplate } from "@/components/projects/notebook-template";
import { ProductTemplate } from "@/components/projects/product-template";
import { getProject, portfolioProjects, projectHref, type PortfolioProject } from "@/lib/portfolio";
import { buildMetadata, projectJsonLd, projectTitle } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return buildMetadata({
    title: projectTitle(project),
    description: project.pitch,
    path: projectHref(project.slug),
    ogType: "article",
  });
}

function ProjectTemplate({ project }: { project: PortfolioProject }) {
  switch (project.category) {
    case "client-work":
      return <ClientWorkTemplate project={project} />;
    case "product":
      return <ProductTemplate project={project} />;
    case "custom-software":
      return <BlueprintTemplate project={project} />;
    case "case-study":
      return <NotebookTemplate project={project} />;
    case "academic":
      return <AcademicTemplate project={project} />;
  }
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <JsonLd schemas={projectJsonLd(project)} />
      <ModeSwitch slug={project.slug} name={project.name} active="profesional" />
      <ProjectTemplate project={project} />
    </>
  );
}
