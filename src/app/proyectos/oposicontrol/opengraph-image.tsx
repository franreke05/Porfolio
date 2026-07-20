import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = "OposiControl — app de estudio para oposiciones con Kotlin Multiplatform";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Caso de proyecto · Mobile",
    title: "OposiControl",
    description: "App de productividad para opositores: temarios, simulacros, progreso y planificación.",
    tags: ["Kotlin Multiplatform", "Compose", "Supabase", "Ktor"],
  });
}
