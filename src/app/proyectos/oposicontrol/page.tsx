import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { oposicontrol } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, projectBreadcrumb, projectSchema, trimDesc } from "@/lib/seo";

export const metadata: Metadata = {
  title:       oposicontrol.seoTitle,
  description: trimDesc(oposicontrol.seoDescription),
  alternates:  { canonical: `${SITE_URL}/proyectos/oposicontrol` },
  openGraph: {
    title:       `${oposicontrol.seoTitle} | ${SITE_NAME}`,
    description: trimDesc(oposicontrol.seoDescription),
    url:         `${SITE_URL}/proyectos/oposicontrol`,
    type:        "article",
  },
  twitter: {
    title:       oposicontrol.seoTitle,
    description: trimDesc(oposicontrol.seoDescription, 120),
  },
  robots: { index: true, follow: true },
};

const breadcrumb = projectBreadcrumb("OposiControl", "oposicontrol");

const schema = projectSchema({
  id:          "oposicontrol",
  title:       "OposiControl",
  description: oposicontrol.seoDescription,
  type:        "mobile",
  applicationCategory: "EducationApplication",
});

export default function OposiControlPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={oposicontrol} />
    </>
  );
}
