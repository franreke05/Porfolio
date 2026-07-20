import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = "CRM a medida para empresas — Francisco Requena Sánchez";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Servicios · Sistemas internos",
    title: "CRM a medida para tu empresa",
    description: "PostgreSQL, roles, flujos y reportes adaptados a tu proceso — sin licencias genéricas.",
    tags: ["PostgreSQL", "Ktor", "Compose Desktop", "VPS"],
  });
}
