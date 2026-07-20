import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = "Diseño web profesional para empresas — Francisco Requena Sánchez";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Servicios · Web",
    title: "Webs rápidas y con SEO técnico",
    description: "Next.js, Core Web Vitals optimizados y diseño orientado a conversión, en Granada, Almería y España.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "SEO técnico"],
  });
}
