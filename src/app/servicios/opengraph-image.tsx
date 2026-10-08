import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt         = "Servicios — ORYKAI SOFTWARE";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Servicios",
    title: "Tres pilares, cada uno con el proyecto que lo respalda.",
    description: "Apps móviles, software de gestión y backend a medida, y web.",
    tags: ["Apps móviles","Software de gestión","Web"],
  });
}
