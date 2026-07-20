import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = "EduTrack — app Android para calcular notas y medias académicas";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Caso de proyecto · Mobile",
    title: "EduTrack",
    description: "App Android para calcular notas ponderadas, medias y nota necesaria para aprobar.",
    tags: ["Kotlin", "Jetpack Compose", "Firebase", "WorkManager"],
  });
}
