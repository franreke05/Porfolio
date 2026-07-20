import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { edutrack } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, projectBreadcrumb, projectSchema, trimDesc } from "@/lib/seo";

export const metadata: Metadata = {
  title:       edutrack.seoTitle,
  description: trimDesc(edutrack.seoDescription),
  alternates:  { canonical: `${SITE_URL}/proyectos/edutrack` },
  openGraph: {
    title:       `${edutrack.seoTitle} | ${SITE_NAME}`,
    description: trimDesc(edutrack.seoDescription),
    url:         `${SITE_URL}/proyectos/edutrack`,
    type:        "article",
  },
  twitter: {
    title:       edutrack.seoTitle,
    description: trimDesc(edutrack.seoDescription, 120),
  },
  robots: { index: true, follow: true },
};

const breadcrumb = projectBreadcrumb("EduTrack", "edutrack");

const schema = projectSchema({
  id:          "edutrack",
  title:       "EduTrack",
  description: edutrack.seoDescription,
  type:        "mobile",
  applicationCategory: "EducationApplication",
});

export default function EduTrackPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={edutrack} />
    </>
  );
}
