import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = "FlashFix — marketplace Android para encontrar talleres mecánicos";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Caso de proyecto · Mobile",
    title: "FlashFix",
    description: "Marketplace Android que conecta usuarios con talleres mecánicos cercanos, con chat y valoraciones.",
    tags: ["Jetpack Compose", "Firebase", "Appwrite", "Google Maps"],
  });
}
