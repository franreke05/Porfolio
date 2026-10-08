import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ServicePage, type ServicePageContent } from "@/components/services-tablet-experience";
import { breadcrumbSchema, buildMetadata, faqPageSchema, serviceSchema } from "@/lib/seo";

const PATH = "/servicios/diseno-web-empresas";
const DESCRIPTION =
  "Diseñamos y desarrollamos sitios web con Next.js: estructura clara, carga rápida, accesibilidad y SEO técnico desde el principio.";

export const metadata: Metadata = buildMetadata({
  title: "Diseño y desarrollo web",
  description: DESCRIPTION,
  path: PATH,
});

const jsonLd = [
  breadcrumbSchema([
    { name: "Servicios", path: "/servicios" },
    { name: "Web", path: PATH },
  ]),
  serviceSchema({
    name: "Diseño y desarrollo web",
    description: DESCRIPTION,
    path: PATH,
    serviceType: "Diseño y desarrollo web",
  }),
];

const content: ServicePageContent = {
  serviceId: "web",
  crumb: "Web",
  eyebrow: "Pilar 03 · Web",
  title: "Webs que explican bien lo que haces.",
  lead: "Diseñamos y desarrollamos sitios con estructura clara, carga rápida y un camino corto hasta la conversación. La referencia es esta misma web: la hemos hecho nosotros.",
  situations: [
    "Tu web no deja claro qué haces ni para quién.",
    "Recibe visitas, pero no lleva a ningún contacto.",
    "Es lenta o incómoda de usar en el móvil.",
    "Necesitas algo más que páginas: un formulario que funcione o una reserva de llamadas.",
  ],
  scopeTitle: "Qué hacemos en una web",
  scope: [
    {
      title: "Estructura y contenido",
      text: "Decidimos qué tiene que entender el visitante y qué acción queremos que tome antes de diseñar nada.",
    },
    {
      title: "Diseño a medida",
      text: "Un sistema visual propio, sin plantillas, pensado primero para el móvil.",
    },
    {
      title: "Desarrollo",
      text: "Next.js, React y TypeScript, con las páginas renderizadas en el servidor.",
    },
    {
      title: "Accesibilidad y rendimiento",
      text: "HTML semántico, navegación por teclado, contraste suficiente y respeto por la preferencia de movimiento reducido.",
    },
    {
      title: "SEO técnico",
      text: "Metadatos, datos estructurados, mapa del sitio y enlaces internos resueltos desde el principio.",
    },
    {
      title: "Contacto y reservas",
      text: "Formularios y reserva de reuniones con la disponibilidad decidida en el servidor.",
    },
  ],
  proofTitle: "La prueba es este sitio",
  proofIntro:
    "Hoy nuestro trabajo de cliente son apps y software de gestión. En web, la referencia que podemos enseñar es la que estás leyendo.",
  proofExtra: (
    <div className="border-b border-[color:var(--border)] pb-5">
      <h3 className="font-display text-2xl font-bold leading-tight text-[color:var(--foreground)]">Este sitio</h3>
      <p className="mt-1 text-sm text-[color:var(--muted)]">Web del estudio</p>
      <p className="mt-3 max-w-2xl leading-7 text-[color:var(--surface-foreground)]">
        Diseñado y desarrollado por el estudio con Next.js, React, TypeScript y Tailwind CSS. La estructura, las
        páginas de proyecto y el contacto con reserva de reunión son parte del trabajo.
      </p>
    </div>
  ),
  stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  faqs: [
    {
      q: "¿Qué webs habéis hecho?",
      a: "Esta. Es la referencia que podemos enseñar hoy y preferimos decirlo así: nuestro trabajo de cliente actual son apps móviles y software de gestión.",
    },
    {
      q: "¿Garantizáis posiciones en Google?",
      a: "No. Dejamos resuelta la base técnica para que un buscador pueda rastrear y entender el sitio; la posición depende también del contenido y de la competencia.",
    },
    {
      q: "¿Cuánto tarda una web?",
      a: "Depende del alcance, y no damos un plazo antes de definirlo. Buena parte del calendario depende de cuándo estén listos los textos y las decisiones de contenido.",
    },
  ],
  related: [
    {
      href: "/servicios/desarrollo-apps-android",
      label: "Apps móviles",
      text: "Cuando lo que hay detrás de la web es un producto para Android, iOS o coche.",
    },
    {
      href: "/servicios/crm-a-medida",
      label: "Software de gestión y backend a medida",
      text: "Cuando las solicitudes que llegan por la web tienen que acabar en un sistema y no en un buzón.",
    },
  ],
};

export default function WebPage() {
  return (
    <>
      <JsonLd schemas={[...jsonLd, faqPageSchema(content.faqs)]} />
      <ServicePage content={content} />
    </>
  );
}
