import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt         = "Diseño y desarrollo web — ORYKAI SOFTWARE";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Servicios · Web",
    title: "Webs que explican bien lo que haces.",
    description: "Estructura clara, carga rápida, accesibilidad y SEO técnico desde el principio.",
    tags: ["Next.js","React","TypeScript","Tailwind CSS"],
  });
}
