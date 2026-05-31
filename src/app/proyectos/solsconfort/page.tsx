import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { solsconfort } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, trimDesc } from "@/lib/seo";

export const metadata: Metadata = {
  title:       solsconfort.seoTitle,
  description: trimDesc(solsconfort.seoDescription),
  alternates:  { canonical: `${SITE_URL}/proyectos/solsconfort` },
  openGraph: {
    title:       `${solsconfort.seoTitle} | ${SITE_NAME}`,
    description: trimDesc(solsconfort.seoDescription),
    url:         `${SITE_URL}/proyectos/solsconfort`,
    type:        "article",
  },
  twitter: {
    title:       solsconfort.seoTitle,
    description: trimDesc(solsconfort.seoDescription, 120),
  },
  robots: { index: true, follow: true },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio",      item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Proyectos",   item: `${SITE_URL}/#proyectos` },
    { "@type": "ListItem", position: 3, name: "Solsconfort", item: `${SITE_URL}/proyectos/solsconfort` },
  ],
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Solsconfort (caso documentado)",
  description: solsconfort.seoDescription,
  creator: { "@id": `${SITE_URL}/#person` },
  url: `${SITE_URL}/proyectos/solsconfort`,
};

export default function SolsconfortPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={solsconfort} />
    </>
  );
}
