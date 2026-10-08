import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt         = "Automatizaciones dentro del software de gestión — ORYKAI SOFTWARE";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Servicios · Software de gestión",
    title: "Automatizaciones, dentro del software de gestión.",
    description: "Automatizamos cuando el proceso vive dentro de un sistema.",
    tags: ["Ktor","PostgreSQL","Flyway","PDFBox"],
  });
}
