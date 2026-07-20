import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = "Solsconfort — web profesional para empresa técnica";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Caso de proyecto · Web corporativa",
    title: "Solsconfort",
    description: "Web corporativa clara y rápida para explicar servicios técnicos y generar confianza.",
    tags: ["WordPress", "SEO técnico", "Performance", "Formularios"],
  });
}
