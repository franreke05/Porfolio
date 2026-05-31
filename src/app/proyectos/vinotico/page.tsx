import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { vinotico } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, trimDesc } from "@/lib/seo";

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

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio",    item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Proyectos", item: `${SITE_URL}/#proyectos` },
    { "@type": "ListItem", position: 3, name: "Vinótico",  item: `${SITE_URL}/proyectos/vinotico` },
  ],
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Vinótico (caso anonimizado)",
  description: vinotico.seoDescription,
  creator: { "@id": `${SITE_URL}/#person` },
  applicationCategory: "BusinessApplication",
  url: `${SITE_URL}/proyectos/vinotico`,
};

export default function VinoticoPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={vinotico} />
    </>
  );
}
