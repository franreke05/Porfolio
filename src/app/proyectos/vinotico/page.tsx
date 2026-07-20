import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { vinotico } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, projectBreadcrumb, projectSchema, trimDesc } from "@/lib/seo";

export const metadata: Metadata = {
  title:       vinotico.seoTitle,
  description: trimDesc(vinotico.seoDescription),
  alternates:  { canonical: `${SITE_URL}/proyectos/vinotico` },
  openGraph: {
    title:       `${vinotico.seoTitle} | ${SITE_NAME}`,
    description: trimDesc(vinotico.seoDescription),
    url:         `${SITE_URL}/proyectos/vinotico`,
    type:        "article",
  },
  twitter: {
    title:       vinotico.seoTitle,
    description: trimDesc(vinotico.seoDescription, 120),
  },
  robots: { index: true, follow: true },
};

const breadcrumb = projectBreadcrumb("Vinótico", "vinotico");

const schema = projectSchema({
  id:          "vinotico",
  title:       "Vinótico (caso anonimizado)",
  description: vinotico.seoDescription,
  type:        "subscription",
});

export default function VinoticoPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={vinotico} />
    </>
  );
}
