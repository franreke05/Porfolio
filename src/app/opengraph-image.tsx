import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt         = "ORYKAI SOFTWARE: apps móviles, backends y software a medida";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Estudio de producto",
    title: "Diseñamos y construimos productos digitales de principio a fin.",
    description: "Apps móviles para Android, iOS y coche, backends y software de gestión a medida.",
    tags: ["Apps móviles","Backend","Software de gestión","Web"],
  });
}
