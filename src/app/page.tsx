import type { Metadata } from "next";
import { HomepageActs } from "@/components/homepage-acts";
import { SITE_NAME, SITE_URL, trimDesc } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} | Desarrollo de apps mobile, CRMs y webs para empresas`,
  },
  description: trimDesc(
    "Freelance en Almería especializado en apps Android con Kotlin/KMP, CRMs personalizados con PostgreSQL y webs rápidas con Next.js. Sistemas completos, publicados y mantenidos.",
  ),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title:       `${SITE_NAME} | Apps mobile, CRMs y webs para empresas`,
    description: "Apps Android, CRMs a medida y webs rápidas para empresas que necesitan sistemas digitales reales, no plantillas genéricas.",
    url:          SITE_URL,
    type:         "website",
  },
  twitter: {
    title:       `${SITE_NAME} | Apps mobile, CRMs y webs`,
    description: "Freelance especializado en Kotlin/KMP, CRMs SQL y Next.js. Almería, disponible en remoto.",
  },
};

export default function Home() {
  return <HomepageActs />;
}
