import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { edutrack } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, trimDesc } from "@/lib/seo";

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

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio",    item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Proyectos", item: `${SITE_URL}/#proyectos` },
    { "@type": "ListItem", position: 3, name: "EduTrack",  item: `${SITE_URL}/proyectos/edutrack` },
  ],
};

const schema = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "EduTrack",
  description: edutrack.seoDescription,
  creator: { "@id": `${SITE_URL}/#person` },
  applicationCategory: "EducationApplication",
  operatingSystem: "Android",
  url: `${SITE_URL}/proyectos/edutrack`,
};

export default function EduTrackPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={edutrack} />
    </>
  );
}
