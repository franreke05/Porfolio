import type { Intent } from "@/lib/leads/model";

export type Service = {
  id: string;
  title: string;
  summary: string;
  deliverables: string[];
  icon: "mobile" | "crm" | "web" | "support" | "automation" | "growth";
  highlight: string;
  /** Two-digit ordinal used in pillar headers. */
  ordinal: string;
  /** Dedicated service page. */
  href: string;
  /** Primary CTA of that service page. */
  cta: { label: string; intent: Intent };
  /** Slugs in src/lib/portfolio.ts of the real projects that back this pillar. */
  proof: string[];
  /** Used when the proof is not a catalogue project (the web pillar is backed by this site). */
  proofNote?: string;
  /** "El mostrador": the comic style we recommend for this pillar. A nickname — the plain title always leads. */
  style: { name: string; why: string };
};

/** Legacy shape (imported by components the lead is removing). */
export type Project = {
  id: string;
  caseStudySlug?: string;
  type: "personal" | "client";
  visibility: "public" | "anonymous";
  status: "technical-demo" | "documented-case" | "own-system" | "anonymous-project" | "real-lab";
  title: string;
  projectType: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  metrics: string[];
  image: "mobile" | "dashboard" | "browser" | "subscription";
  coverSrc: string;
  coverAlt: string;
  coverPosition?: string;
  coverFit?: "cover" | "contain";
  cta: "Ver caso" | "Solicitar demo" | "Ver arquitectura";
  links: {
    demo?: string;
    repo?: string;
  };
};

export const siteProfile = {
  name: "Francisco Requena Sánchez",
  studioName: "ORYKAI",
  studioTagline: "SOFTWARE",
  location: "Almería, España",
  email: "franciscorequenasanchez0@gmail.com",
  phone: "+34642957572",
  displayPhone: "+34 642 95 75 72",
  role: "Estudio de producto digital",
  headline: "Diseñamos y construimos productos digitales de principio a fin.",
  shortBio:
    "Somos un estudio pequeño dirigido por Francisco Requena, con base en Almería y trabajo en remoto. Diseñamos y construimos apps móviles para Android, iOS y coche, backends y software de gestión a medida.",
  cta: "Reservar reunión",
  authority:
    "Trabajamos con proyectos de cliente en desarrollo que se pueden ver por dentro: alcance, estado real de cada pieza y lo que todavía falta.",
  links: {
    github: "https://github.com/franreke05",
    linkedin: "https://www.linkedin.com/in/franciscorequenasanchez",
    cv: "/francisco-requena-cv.pdf",
    whatsapp:
      "https://wa.me/34642957572?text=Hola%20Francisco%2C%20quiero%20hablar%20sobre%20un%20proyecto%20digital.",
    mail: "mailto:franciscorequenasanchez0@gmail.com",
  },
} as const;

/** Legacy export (imported by components the lead is removing). */
export const trustSignals = [
  "Apps móviles",
  "Android, iOS y coche",
  "Backend",
  "Software de gestión",
  "Web",
];

/**
 * The offer: three pillars. Each one names the real project that backs it
 * (slugs resolve against src/lib/portfolio.ts — never restate project facts here).
 */
export const services: Service[] = [
  {
    id: "apps-moviles",
    ordinal: "01",
    title: "Apps móviles",
    highlight: "Android, iOS y coche",
    summary:
      "Diseñamos y desarrollamos apps para Android e iOS sobre una base de código compartida, con experiencia nativa en Android Auto y Apple CarPlay cuando el producto vive en el coche.",
    deliverables: [
      "Alcance, arquitectura y diseño de la experiencia",
      "Android e iOS con Kotlin Multiplatform",
      "Android Auto y Apple CarPlay",
      "Pruebas en dispositivo real y publicación en tiendas",
    ],
    icon: "mobile",
    href: "/servicios/desarrollo-apps-android",
    cta: { label: "Hablar de mi app", intent: "mobile-app" },
    proof: ["caravantruck-way", "oposibot"],
    style: { name: "Aventura", why: "Va contigo a todas partes: en el bolsillo y en la pantalla del coche." },
  },
  {
    id: "software-gestion",
    ordinal: "02",
    title: "Software de gestión y backend a medida",
    highlight: "Backoffice, CRM y automatizaciones",
    summary:
      "Backoffice, CRM y backend hechos para una operación concreta: las reglas de negocio, los permisos y los datos viven en el servidor, y las tareas repetitivas pasan a formar parte del sistema.",
    deliverables: [
      "Backend con reglas de negocio y autorización",
      "Paneles de administración y portal de cliente",
      "Roles, permisos y rastro de lo que se hace",
      "Automatizaciones dentro del propio sistema",
    ],
    icon: "crm",
    href: "/servicios/crm-a-medida",
    cta: { label: "Hablar de mi software", intent: "custom-software" },
    proof: ["oposicontrol", "requenadesk"],
    style: { name: "Novela gráfica", why: "Tramas largas, con muchos personajes, que tienen que encajar de principio a fin." },
  },
  {
    id: "web",
    ordinal: "03",
    title: "Web",
    highlight: "Sitios que explican y convierten",
    summary:
      "Sitios que explican bien lo que haces y llevan a una conversación: estructura clara, carga rápida, accesibilidad y la base técnica de SEO resuelta desde el principio.",
    deliverables: [
      "Estructura de contenido y diseño a medida",
      "Desarrollo con Next.js y TypeScript",
      "Accesibilidad, rendimiento y SEO técnico",
      "Formularios y reserva de llamadas",
    ],
    icon: "web",
    href: "/servicios/diseno-web-empresas",
    cta: { label: "Hablar de mi web", intent: "web" },
    proof: [],
    proofNote: "Este sitio: lo hemos diseñado y desarrollado nosotros.",
    style: { name: "Línea clara", why: "Trazo limpio y sin ruido: se entiende a la primera." },
  },
];

/** Transversal line of the offer — not a fourth pillar. */
export const afterLaunch: {
  title: string;
  text: string;
  cta: { label: string; intent: Intent };
  style: { name: string; why: string };
} = {
  title: "Seguimos después del lanzamiento",
  text: "Corregimos incidencias, evolucionamos funcionalidades y retomamos productos que ya están en marcha, también cuando no los hemos construido nosotros.",
  cta: { label: "Ya tengo un producto en marcha", intent: "existing-project" },
  style: { name: "Serie continua", why: "Número a número: el trabajo sigue después del primero." },
};

// Legacy catalogue (imported by components the lead is removing). The source
// of project facts is src/lib/portfolio.ts; this copy only mirrors it.
export const projects: Project[] = [
  {
    id: "edutrack",
    caseStudySlug: "edutrack",
    type: "personal",
    visibility: "public",
    status: "technical-demo",
    title: "EduTrack",
    projectType: "App Android para controlar las notas",
    problem:
      "Calcular la media con porcentajes distintos por examen, y saber qué nota hace falta para aprobar, acaba en hojas sueltas y calculadoras.",
    solution:
      "Una app que organiza cursos y asignaturas, calcula medias ponderadas y responde a la pregunta que importa: qué necesito sacar.",
    result:
      "Producto propio en desarrollo (versión beta 0.3): 12 pantallas funcionales, con el plan Premium en desarrollo y la publicación en Google Play prevista.",
    stack: ["Kotlin", "Jetpack Compose", "Firebase Auth", "Firebase Realtime Database", "Play Billing", "DataStore"],
    metrics: ["12 pantallas", "Beta 0.3", "Android", "En desarrollo"],
    image: "mobile",
    coverSrc: "/images/projects/edutrack-cover.webp",
    coverAlt: "Ilustración de EduTrack: un lápiz atraviesa un examen suspenso hacia un aprobado",
    cta: "Ver caso",
    links: {},
  },
  {
    id: "flashfix",
    caseStudySlug: "flashfix",
    type: "personal",
    visibility: "public",
    status: "own-system",
    title: "FlashFix",
    projectType: "Proyecto de fin de grado",
    problem:
      "Encontrar un taller cercano de confianza obliga a llamar a ciegas, sin saber disponibilidad ni valoraciones.",
    solution:
      "Una app Android que localiza talleres por geolocalización, permite hablar con ellos y valorarlos, con paneles para usuario, taller y administrador.",
    result:
      "Proyecto académico sin cliente: 17 pantallas y 3 roles funcionando, con una auditoría propia del código que llevó a migrar a Material 3 y a cifrar las preferencias sensibles.",
    stack: ["Jetpack Compose", "Firebase", "Room", "Appwrite", "Google Maps", "EncryptedSharedPreferences"],
    metrics: ["17 pantallas", "3 roles", "Auditoría propia", "Académico"],
    image: "mobile",
    coverSrc: "/images/flashfix-comic-cover-v2.png",
    coverAlt: "Portada de cómic de FlashFix con un coche deportivo, mapas y herramientas mecánicas",
    cta: "Ver caso",
    links: {},
  },
  {
    id: "oposicontrol",
    caseStudySlug: "oposicontrol",
    type: "client",
    visibility: "public",
    status: "technical-demo",
    title: "OposiControl",
    projectType: "Backoffice y backend de la plataforma OposiBot",
    problem:
      "Operar una plataforma de oposiciones —contenido, noticias, recursos, tienda, tickets de soporte, usuarios— tocando la base de datos a mano y sin control de roles.",
    solution:
      "Un backoffice hecho para esa operación concreta, en Android, iOS y escritorio, sobre un backend que concentra las reglas de negocio, la autorización y el acceso a datos.",
    result:
      "Software a medida en desarrollo: arquitectura por capas y backend implementados; gestión de contenido, moderación y tienda en desarrollo.",
    stack: ["Kotlin Multiplatform", "Compose Multiplatform", "Koin", "Ktor", "SQLDelight", "Supabase"],
    metrics: ["KMP", "Arquitectura por capas", "Más de 18 módulos", "En desarrollo"],
    image: "dashboard",
    coverSrc: "/images/projects/oposicontrol-cover.webp",
    coverAlt: "Ilustración de OposiControl: una torre de control con un escudo ordenando documentos",
    cta: "Ver arquitectura",
    links: {},
  },
  {
    id: "requenadesk",
    caseStudySlug: "requenadesk",
    type: "personal",
    visibility: "public",
    status: "technical-demo",
    title: "RequenaDesk",
    projectType: "CRM y ticketing multiplataforma",
    problem:
      "Solicitudes, tickets, tareas y facturas repartidos entre herramientas sueltas: nadie sabe qué se pidió, qué se hizo ni qué se facturó.",
    solution:
      "Un único sistema con panel de administración y portal de cliente: solicitudes, tickets, tareas, seguimiento del servicio y facturación.",
    result:
      "Producto propio en desarrollo que usamos en nuestra operación con clientes: 27 pantallas entre el panel de administración y el portal de cliente. Todavía no está disponible para nuevas altas.",
    stack: ["Kotlin Multiplatform", "Compose Multiplatform", "Ktor", "PostgreSQL", "Flyway", "JWT", "PDFBox"],
    metrics: ["KMP", "Ktor + PostgreSQL", "27 pantallas", "En desarrollo"],
    image: "dashboard",
    // Legacy art path kept only so this dead export compiles; the catalogue has no cover for RequenaDesk.
    coverSrc: "/images/projects/orykai-cover.webp",
    coverAlt: "Ilustración de RequenaDesk",
    coverFit: "contain",
    cta: "Ver arquitectura",
    links: {},
  },
];

// Legacy status words (see note above). Never implies a release.
export const projectStatusWord: Record<Project["status"], string> = {
  "technical-demo": "EN DESARROLLO",
  "documented-case": "EN DESARROLLO",
  "own-system": "MVP ACADÉMICO",
  "anonymous-project": "EN DESARROLLO",
  "real-lab": "EN DESARROLLO",
};

export const projectStatusAccent: Record<Project["status"], "live" | "progress"> = {
  "technical-demo": "progress",
  "documented-case": "progress",
  "own-system": "progress",
  "anonymous-project": "progress",
  "real-lab": "progress",
};

/** What we build with. Every item appears in a project of src/lib/portfolio.ts or in this site. */
export const stackGroups = [
  {
    title: "Móvil y coche",
    items: ["Kotlin Multiplatform", "Compose Multiplatform", "Jetpack Compose", "Android Auto", "Apple CarPlay"],
  },
  {
    title: "Backend y datos",
    items: ["Ktor", "PostgreSQL", "PostGIS", "Flyway", "JWT", "Supabase", "SQLDelight"],
  },
  {
    title: "Mapas",
    items: ["MapLibre", "OpenStreetMap", "Valhalla"],
  },
  {
    title: "Web",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
];

/**
 * Founder's background before the studio. Not studio track record: shown
 * only on /sobre-mi, under the founder's name.
 */
export const experienceItems = [
  {
    company: "IMARINA",
    role: "Desarrollo de componentes Android",
    detail: "Apps Android con Kotlin y Jetpack Compose, arquitectura MVVM e integración de APIs REST.",
  },
  {
    company: "Malt",
    role: "Trabajo independiente por encargo",
    detail: "Desarrollo de apps a partir de ideas de clientes, a través de la plataforma.",
  },
];

export const processSteps = [
  {
    title: "Diagnóstico",
    output: "Alcance claro",
    text: "Aterrizamos el problema, los objetivos, los usuarios y los procesos reales antes de diseñar pantallas.",
  },
  {
    title: "Prototipo",
    output: "Flujo validado",
    text: "Definimos la estructura, el recorrido principal y el alcance para construir solo lo que aporta valor.",
  },
  {
    title: "Desarrollo por bloques",
    output: "Bloques revisables",
    text: "Construimos por módulos —interfaz, lógica, datos e integraciones— y cada bloque se revisa antes de seguir.",
  },
  {
    title: "Entrega y mejora",
    output: "Base para evolucionar",
    text: "Entregamos, corregimos lo que falla en uso real y dejamos una base preparada para seguir creciendo.",
  },
];
