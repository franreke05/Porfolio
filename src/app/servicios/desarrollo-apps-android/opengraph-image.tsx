import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = "Desarrollo de apps Android con Kotlin — Francisco Requena Sánchez";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Servicios · Mobile",
    title: "Apps Android con Kotlin Multiplatform",
    description: "Jetpack Compose, arquitectura MVVM y publicación en Google Play — código tuyo, sin ataduras.",
    tags: ["Kotlin", "KMP", "Jetpack Compose", "Firebase"],
  });
}
