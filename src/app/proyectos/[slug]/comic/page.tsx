import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComicReader } from "@/components/comic/comic-reader";
import { FlashFixCaseStudy } from "@/components/flashfix-case-study";
import { ModeSwitch } from "@/components/projects/mode-switch";
import { comicHref, getComic } from "@/lib/comics";
import { getProject, portfolioProjects } from "@/lib/portfolio";
import { buildMetadata } from "@/lib/seo";

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
    title: `${project.name}: el cómic`,
    description: project.pitch,
    path: comicHref(project.slug),
    ogType: "article",
  });
}

export default async function ProjectComicPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const script = getComic(project.slug);

  // FlashFix is the one project with commissioned comic art.
  if (project.category === "academic") {
    return (
      <>
        <ModeSwitch slug={project.slug} name={project.name} active="comic" />
        {/* The FlashFix reader reserves its own header offset; the switch already did. */}
        <div className="-mt-16">
          <FlashFixCaseStudy />
        </div>
      </>
    );
  }

  if (!script) notFound();

  return (
    <>
      <ModeSwitch slug={project.slug} name={project.name} active="comic" />
      <ComicReader script={script} project={project} />
    </>
  );
}
