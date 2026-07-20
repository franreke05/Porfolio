import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CaseStudyTemplate } from "@/components/case-study-template";
import { solsconfort } from "@/lib/case-studies";
import { SITE_NAME, SITE_URL, projectBreadcrumb, projectSchema, trimDesc } from "@/lib/seo";

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

const breadcrumb = projectBreadcrumb("Solsconfort", "solsconfort");

// Was previously mistyped as WebSite (that type describes a domain/site, not a
// product) — WebApplication correctly describes a delivered web product.
const schema = projectSchema({
  id:          "solsconfort",
  title:       "Solsconfort (caso documentado)",
  description: solsconfort.seoDescription,
  type:        "browser",
});

export default function SolsconfortPage() {
  return (
    <>
      <JsonLd schemas={[breadcrumb, schema]} />
      <CaseStudyTemplate data={solsconfort} />
    </>
  );
}
