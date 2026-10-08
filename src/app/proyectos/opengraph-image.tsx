import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt         = "Proyectos — ORYKAI SOFTWARE";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Proyectos",
    title: "Proyectos, cada uno con su estado real.",
    description: "Trabajo para clientes, productos propios, software a medida, un caso de estudio y un proyecto académico.",
    tags: ["Implementado","En desarrollo","Previsto"],
  });
}
