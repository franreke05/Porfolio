import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { flashfix } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, projectBreadcrumb, projectSchema, trimDesc } from "@/lib/seo";

export const metadata: Metadata = {
  title:       flashfix.seoTitle,
  description: trimDesc(flashfix.seoDescription),
  alternates:  { canonical: `${SITE_URL}/proyectos/flashfix` },
  openGraph: {
    title:       `${flashfix.seoTitle} | ${SITE_NAME}`,
    description: trimDesc(flashfix.seoDescription),
    url:         `${SITE_URL}/proyectos/flashfix`,
    type:        "article",
  },
  twitter: {
    title:       flashfix.seoTitle,
    description: trimDesc(flashfix.seoDescription, 120),
  },
  robots: { index: true, follow: true },
};

const breadcrumb = projectBreadcrumb("FlashFix", "flashfix");

const schema = projectSchema({
  id:          "flashfix",
  title:       "FlashFix",
  description: flashfix.seoDescription,
  type:        "mobile",
});

export default function FlashFixPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={flashfix} />
    </>
  );
}
