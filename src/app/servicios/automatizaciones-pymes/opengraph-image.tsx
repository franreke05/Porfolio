import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = "Automatización de procesos para pymes — Francisco Requena Sánchez";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Servicios · Automatización",
    title: "Automatizaciones que quitan trabajo manual",
    description: "Integraciones entre herramientas, formularios conectados y reportes automáticos para pymes.",
    tags: ["Python", "APIs REST", "PostgreSQL", "Webhooks"],
  });
}
