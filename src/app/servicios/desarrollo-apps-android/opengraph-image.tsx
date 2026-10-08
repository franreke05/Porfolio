import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt         = "Apps móviles para Android, iOS y coche — ORYKAI SOFTWARE";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Servicios · Apps móviles",
    title: "Apps móviles para Android, iOS y coche.",
    description: "Una base Kotlin Multiplatform compartida, con Android Auto y Apple CarPlay.",
    tags: ["Kotlin Multiplatform","Compose Multiplatform","Android Auto","Apple CarPlay"],
  });
}
