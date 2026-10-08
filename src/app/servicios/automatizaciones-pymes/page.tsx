import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ServicePage, TextLink, type ServicePageContent } from "@/components/services-tablet-experience";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

/**
 * Not a pillar and not in the navigation: automations are part of the
 * "software de gestión y backend a medida" pillar. The URL stays reachable.
 */
const PATH = "/servicios/automatizaciones-pymes";
const DESCRIPTION =
  "No ofrecemos automatizaciones sueltas: automatizamos dentro del software de gestión y backend a medida que construimos, cuando el proceso vive en un sistema.";

export const metadata: Metadata = buildMetadata({
  title: "Automatizaciones dentro del software de gestión",
  description: DESCRIPTION,
  path: PATH,
  // A clarification of the "software de gestión" pillar, not a service of
  // its own: kept reachable for readers, out of the index and the sitemap.
  noindex: true,
});

const jsonLd = [
  breadcrumbSchema([
    { name: "Servicios", path: "/servicios" },
    { name: "Automatizaciones", path: PATH },
  ]),
];

const content: ServicePageContent = {
  serviceId: "software-gestion",
  crumb: "Automatizaciones",
  eyebrow: "Parte del pilar 02 · Software de gestión",
  title: "Automatizaciones, dentro del software de gestión.",
  lead: (
    <>
      No ofrecemos automatizaciones sueltas. Automatizamos cuando el proceso vive dentro de un sistema: es parte de
      nuestro trabajo de{" "}
      <TextLink href="/servicios/crm-a-medida">software de gestión y backend a medida</TextLink>.
    </>
  ),
  situations: [
    "Alguien copia a mano los mismos datos de un sitio a otro.",
    "Los documentos que se repiten, como las facturas, se montan uno a uno.",
    "Lo que puede o no puede hacer cada persona depende de que alguien se acuerde de la norma.",
  ],
  scopeTitle: "Qué automatizamos",
  scope: [
    {
      title: "Documentos generados en el servidor",
      text: "Por ejemplo, facturas en PDF creadas a partir de los datos que ya están en el sistema.",
    },
    {
      title: "Reglas que se aplican solas",
      text: "La autorización y las reglas de negocio las decide el backend, no cada persona en cada pantalla.",
    },
    {
      title: "Despliegue y comprobaciones",
      text: "Despliegue automatizado y comprobaciones de salud del propio sistema.",
    },
  ],
  proofTitle: "Dónde lo hacemos hoy",
  proofIntro:
    "Los dos proyectos del pilar de software de gestión. Ambos están en desarrollo, con su alcance a la vista.",
  stack: ["Ktor", "PostgreSQL", "Flyway", "PDFBox"],
  faqs: [],
  related: [
    {
      href: "/servicios/crm-a-medida",
      label: "Software de gestión y backend a medida",
      text: "El servicio del que forman parte las automatizaciones.",
    },
    {
      href: "/servicios/desarrollo-apps-android",
      label: "Apps móviles",
      text: "Cuando el sistema también tiene que llegar al móvil.",
    },
  ],
};

export default function AutomatizacionesPage() {
  return (
    <>
      <JsonLd schemas={jsonLd} />
      <ServicePage content={content} />
    </>
  );
}
