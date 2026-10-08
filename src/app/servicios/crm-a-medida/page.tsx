import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ServicePage, TextLink, type ServicePageContent } from "@/components/services-tablet-experience";
import { breadcrumbSchema, buildMetadata, faqPageSchema, serviceSchema } from "@/lib/seo";

const PATH = "/servicios/crm-a-medida";
const DESCRIPTION =
  "Backoffice, CRM y backend a medida para una operación concreta: reglas de negocio, permisos y datos en el servidor, con Ktor y PostgreSQL.";

export const metadata: Metadata = buildMetadata({
  title: "Software de gestión y backend a medida",
  description: DESCRIPTION,
  path: PATH,
});

const jsonLd = [
  breadcrumbSchema([
    { name: "Servicios", path: "/servicios" },
    { name: "Software de gestión", path: PATH },
  ]),
  serviceSchema({
    name: "Software de gestión y backend a medida",
    description: DESCRIPTION,
    path: PATH,
    serviceType: "Desarrollo de software a medida",
  }),
];

const content: ServicePageContent = {
  serviceId: "software-gestion",
  crumb: "Software de gestión",
  eyebrow: "Pilar 02 · Backoffice, CRM y backend",
  title: "Software de gestión y backend a medida.",
  lead: "Backoffice, CRM y backend hechos para una operación concreta, no para la media. Las reglas de negocio, los permisos y los datos viven en el servidor; las pantallas son las de tu proceso.",
  situations: [
    "La operación se lleva entre hojas de cálculo, mensajes y correo, y nadie sabe cuál es la versión buena.",
    "Alguien toca la base de datos a mano porque no hay una herramienta con roles y permisos.",
    "Tienes una app o una plataforma y te falta el panel para administrarla.",
    "Solicitudes, tareas y facturas viven en herramientas que no se hablan entre sí.",
  ],
  scopeTitle: "Qué construimos",
  scope: [
    {
      title: "Modelo de datos y reglas",
      text: "Empezamos por el proceso: qué se registra, quién puede hacer qué y qué debe quedar anotado.",
    },
    {
      title: "Backend",
      text: "Un servidor que concentra las reglas de negocio, la autorización y el acceso a datos, con migraciones versionadas.",
    },
    {
      title: "Paneles de administración",
      text: "Aplicaciones de escritorio y móvil para el equipo que opera, con las pantallas de su trabajo y no las de una plantilla.",
    },
    {
      title: "Portal de cliente",
      text: "Un acceso propio para que tus clientes creen solicitudes y sigan el estado de su trabajo.",
    },
    {
      title: "Automatizaciones",
      text: (
        <>
          Documentos generados en el servidor y tareas repetitivas resueltas dentro del propio sistema.{" "}
          <TextLink href="/servicios/automatizaciones-pymes">Cómo entendemos las automatizaciones</TextLink>.
        </>
      ),
    },
    {
      title: "Despliegue y operación",
      text: "Despliegue automatizado y comprobaciones de salud, para saber que el sistema sigue en pie.",
    },
  ],
  proofTitle: "Proyectos que lo respaldan",
  proofIntro:
    "Un backoffice a medida y nuestro propio CRM. Los dos están en desarrollo, con su alcance a la vista.",
  stack: [
    "Ktor",
    "PostgreSQL",
    "Flyway",
    "JWT",
    "Kotlin Multiplatform",
    "Compose Multiplatform",
    "Supabase",
    "SQLDelight",
    "PDFBox",
  ],
  faqs: [
    {
      q: "¿Por qué no usar un CRM estándar?",
      a: "Si un CRM estándar encaja con tu proceso, úsalo: es lo razonable. El software a medida tiene sentido cuando la operación tiene reglas propias y acabas doblando el proceso para adaptarlo a la herramienta.",
    },
    {
      q: "¿Puedo usar RequenaDesk en mi empresa?",
      a: "Todavía no. RequenaDesk es nuestro CRM y lo usamos en nuestra propia operación con clientes, pero aún no está disponible para nuevas altas. Si te interesa, escríbenos y te avisamos cuando lo esté.",
    },
    {
      q: "¿Cuánto tarda un proyecto de este tipo?",
      a: "Depende del alcance, y no damos un plazo antes de definirlo. Empezamos por el diagnóstico del proceso y fijamos fechas cuando sabemos qué hay que construir.",
    },
  ],
  related: [
    {
      href: "/servicios/desarrollo-apps-android",
      label: "Apps móviles",
      text: "Cuando el mismo backend tiene que atender también a una app para Android e iOS.",
    },
    {
      href: "/servicios/diseno-web-empresas",
      label: "Web",
      text: "Para la parte pública: explicar el servicio y recoger solicitudes.",
    },
  ],
};

export default function SoftwareGestionPage() {
  return (
    <>
      <JsonLd schemas={[...jsonLd, faqPageSchema(content.faqs)]} />
      <ServicePage content={content} />
    </>
  );
}
