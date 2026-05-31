import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { oposicontrol } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, trimDesc } from "@/lib/seo";

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

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio",        item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Proyectos",     item: `${SITE_URL}/#proyectos` },
    { "@type": "ListItem", position: 3, name: "OposiControl",  item: `${SITE_URL}/proyectos/oposicontrol` },
  ],
};

const schema = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "OposiControl",
  description: oposicontrol.seoDescription,
  creator: { "@id": `${SITE_URL}/#person` },
  applicationCategory: "EducationApplication",
  operatingSystem: "Android",
  url: `${SITE_URL}/proyectos/oposicontrol`,
};

export default function OposiControlPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={oposicontrol} />
    </>
  );
}
