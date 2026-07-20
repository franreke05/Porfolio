import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const runtime     = "edge";
export const alt         = "Vinótico — área privada y suscripciones con WooCommerce (caso anonimizado)";
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function OGImage() {
  return renderOgImage({
    eyebrow: "Caso de proyecto · Web + negocio (anonimizado)",
    title: "Vinótico",
    description: "Área privada y sistema de suscripciones para un club de socios, con WordPress/WooCommerce.",
    tags: ["WordPress", "WooCommerce", "PHP", "Suscripciones"],
  });
}
