import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = "RequenaDesk — CRM a medida para gestión interna de clientes";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Caso de proyecto · CRM",
    title: "RequenaDesk",
    description: "CRM a medida con clientes, tickets, roles y dashboard operativo sobre PostgreSQL.",
    tags: ["Kotlin", "Ktor", "PostgreSQL", "Compose Desktop"],
  });
}
