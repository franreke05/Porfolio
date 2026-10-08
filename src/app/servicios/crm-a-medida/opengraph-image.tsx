import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt         = "Software de gestión y backend a medida — ORYKAI SOFTWARE";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Servicios · Software de gestión",
    title: "Software de gestión y backend a medida.",
    description: "Backoffice, CRM y backend hechos para una operación concreta.",
    tags: ["Ktor","PostgreSQL","Kotlin Multiplatform"],
  });
}
