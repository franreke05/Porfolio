import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ServicePage, type ServicePageContent } from "@/components/services-tablet-experience";
import { breadcrumbSchema, buildMetadata, faqPageSchema, serviceSchema } from "@/lib/seo";

const PATH = "/servicios/desarrollo-apps-android";
const DESCRIPTION =
  "Diseñamos y desarrollamos apps móviles para Android e iOS con Kotlin Multiplatform, con Android Auto y Apple CarPlay cuando el producto vive en el coche.";

export const metadata: Metadata = buildMetadata({
  title: "Apps móviles para Android, iOS y coche",
  description: DESCRIPTION,
  path: PATH,
});

const jsonLd = [
  breadcrumbSchema([
    { name: "Servicios", path: "/servicios" },
    { name: "Apps móviles", path: PATH },
  ]),
  serviceSchema({
    name: "Desarrollo de apps móviles para Android, iOS y coche",
    description: DESCRIPTION,
    path: PATH,
    serviceType: "Desarrollo de aplicaciones móviles",
  }),
];

const content: ServicePageContent = {
  serviceId: "apps-moviles",
  crumb: "Apps móviles",
  eyebrow: "Pilar 01 · Android, iOS y coche",
  title: "Apps móviles para Android, iOS y coche.",
  lead: "Diseñamos y desarrollamos la app completa —alcance, experiencia, código y backend— sobre una base Kotlin Multiplatform compartida entre Android e iOS, con Android Auto y Apple CarPlay cuando el producto se usa conduciendo.",
  situations: [
    "Tienes una idea o un diseño y necesitas llevarlo hasta una versión que se pueda probar en un dispositivo real.",
    "Quieres estar en Android y en iOS sin mantener dos productos distintos.",
    "Tu producto se usa en el coche y necesita Android Auto o Apple CarPlay.",
    "La app maneja cuentas, suscripción o contenido de pago y sus reglas no pueden depender del teléfono del usuario.",
  ],
  scopeTitle: "Qué hacemos en una app",
  scope: [
    {
      title: "Alcance y arquitectura",
      text: "Definimos qué entra en la primera versión y cómo se reparte entre el núcleo compartido y las capas nativas.",
    },
    {
      title: "Diseño de la experiencia",
      text: "Diseñamos los flujos de móvil y de coche, o reconstruimos pantalla a pantalla el diseño que ya tengas en Figma.",
    },
    {
      title: "Desarrollo en Android e iOS",
      text: "Dominio, estado y datos en un núcleo Kotlin Multiplatform; interfaz con Compose Multiplatform y código nativo solo donde la plataforma lo exige.",
    },
    {
      title: "Backend e integración",
      text: "La app consume un backend que decide identidad, acceso y reglas de negocio. No guarda credenciales de servidor ni lógica de autorización.",
    },
    {
      title: "Pruebas en dispositivo",
      text: "Cada versión candidata se prueba en un dispositivo físico antes de llegar a tus manos.",
    },
    {
      title: "Publicación en tiendas",
      text: "La publicación en Google Play y App Store forma parte del alcance del que nos encargamos.",
    },
  ],
  proofTitle: "Proyectos que lo respaldan",
  proofIntro:
    "Dos proyectos de cliente, hoy en desarrollo. En cada uno puedes ver qué está implementado, qué está en desarrollo y qué está previsto.",
  stack: [
    "Kotlin Multiplatform",
    "Compose Multiplatform",
    "Jetpack Compose",
    "Ktor Client",
    "kotlinx.serialization",
    "MapLibre",
    "Android Auto",
    "Apple CarPlay",
  ],
  faqs: [
    {
      q: "¿Hacéis también iOS?",
      a: "Sí. Trabajamos con Kotlin Multiplatform, de modo que Android e iOS comparten dominio, estado y datos. Lo contamos con su estado real: en nuestros proyectos actuales Android va por delante, y la certificación en iOS y CarPlay de CaravanTruck Way está en desarrollo.",
    },
    {
      q: "¿Os encargáis de publicar en Google Play y App Store?",
      a: "Sí, la publicación forma parte del alcance que asumimos. En los proyectos que enseñamos está prevista y todavía no realizada, así que no la presentamos como historial.",
    },
    {
      q: "¿Cuánto tarda una app?",
      a: "Depende del alcance, y no damos un plazo antes de definirlo. Primero acotamos qué entra en la primera versión; después nos comprometemos con una fecha.",
    },
    {
      q: "¿Podemos empezar por una primera versión pequeña?",
      a: "Sí, y es lo que solemos proponer: acotar una primera versión con lo esencial y dejar el resto ordenado como siguiente alcance.",
    },
  ],
  related: [
    {
      href: "/servicios/crm-a-medida",
      label: "Software de gestión y backend a medida",
      text: "Cuando la app necesita un backend propio o un panel para administrarla.",
    },
    {
      href: "/servicios/diseno-web-empresas",
      label: "Web",
      text: "Para explicar el producto y recoger a quien quiere probarlo.",
    },
  ],
};

export default function AppsMovilesPage() {
  return (
    <>
      <JsonLd schemas={[...jsonLd, faqPageSchema(content.faqs)]} />
      <ServicePage content={content} />
    </>
  );
}
