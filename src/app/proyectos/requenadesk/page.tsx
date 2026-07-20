import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { requenadesk } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, projectBreadcrumb, projectSchema, trimDesc } from "@/lib/seo";

export const metadata: Metadata = {
  title:       requenadesk.seoTitle,
  description: trimDesc(requenadesk.seoDescription),
  alternates:  { canonical: `${SITE_URL}/proyectos/requenadesk` },
  openGraph: {
    title:       `${requenadesk.seoTitle} | ${SITE_NAME}`,
    description: trimDesc(requenadesk.seoDescription),
    url:         `${SITE_URL}/proyectos/requenadesk`,
    type:        "article",
  },
  twitter: {
    title:       requenadesk.seoTitle,
    description: trimDesc(requenadesk.seoDescription, 120),
  },
  robots: { index: true, follow: true },
};

const breadcrumb = projectBreadcrumb("RequenaDesk", "requenadesk");

const schema = projectSchema({
  id:          "requenadesk",
  title:       "RequenaDesk",
  description: requenadesk.seoDescription,
  type:        "dashboard",
});

export default function RequenaDesksPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={requenadesk} />
    </>
  );
}
