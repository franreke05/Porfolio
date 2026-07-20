import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = "OryKai — CRM multiplataforma con Kotlin Multiplatform y Ktor";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Caso de proyecto · CRM",
    title: "OryKai",
    description: "CRM multiplataforma propio: clientes, tickets, facturas, con backend Ktor + PostgreSQL.",
    tags: ["Kotlin Multiplatform", "Ktor", "PostgreSQL", "JWT"],
  });
}
