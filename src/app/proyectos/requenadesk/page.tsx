import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { requenadesk } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, trimDesc } from "@/lib/seo";

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

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio",       item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Proyectos",    item: `${SITE_URL}/#proyectos` },
    { "@type": "ListItem", position: 3, name: "RequenaDesk",  item: `${SITE_URL}/proyectos/requenadesk` },
  ],
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "RequenaDesk",
  description: requenadesk.seoDescription,
  creator: { "@id": `${SITE_URL}/#person` },
  applicationCategory: "BusinessApplication",
  url: `${SITE_URL}/proyectos/requenadesk`,
};

export default function RequenaDesksPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={requenadesk} />
    </>
  );
}
