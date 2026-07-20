import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { orykai } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, projectBreadcrumb, projectSchema, trimDesc } from "@/lib/seo";

export const metadata: Metadata = {
  title:       orykai.seoTitle,
  description: trimDesc(orykai.seoDescription),
  alternates:  { canonical: `${SITE_URL}/proyectos/orykai` },
  openGraph: {
    title:       `${orykai.seoTitle} | ${SITE_NAME}`,
    description: trimDesc(orykai.seoDescription),
    url:         `${SITE_URL}/proyectos/orykai`,
    type:        "article",
  },
  twitter: {
    title:       orykai.seoTitle,
    description: trimDesc(orykai.seoDescription, 120),
  },
  robots: { index: true, follow: true },
};

const breadcrumb = projectBreadcrumb("OryKai", "orykai");

const schema = projectSchema({
  id:          "orykai",
  title:       "OryKai",
  description: orykai.seoDescription,
  type:        "dashboard",
});

export default function OryKaiPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={orykai} />
    </>
  );
}
