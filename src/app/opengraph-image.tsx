import { SITE_NAME } from "@/lib/seo";
import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = `${SITE_NAME} — Apps mobile, CRMs y webs para empresas`;
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Portfolio profesional",
    title: SITE_NAME,
    description: "Apps mobile · CRMs a medida · Webs rápidas · Automatizaciones",
    tags: ["Kotlin / KMP", "CRM SQL", "Next.js", "Automatizaciones"],
  });
}
