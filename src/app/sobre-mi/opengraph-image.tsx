import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt         = "El estudio — ORYKAI SOFTWARE";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "El estudio",
    title: "Un estudio de producto pequeño.",
    description: "Dirigido por Francisco Requena desde Almería y en remoto.",
    tags: ["Almería","Remoto"],
  });
}
