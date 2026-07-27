export type Service = {
  id: string;
  title: string;
  summary: string;
  deliverables: string[];
  icon: "mobile" | "crm" | "web" | "support" | "automation" | "growth";
  highlight: string;
};

export type Project = {
  id: string;
  /** Short slug of this project's dedicated case-study page (src/app/proyectos/{slug}), if it has one — the canonical URL to link to. Falls back to `id` for projects without a dedicated page. */
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
  /** Commissioned comic-cover poster art for this project — a full-bleed illustrated "story" referencing the real product logo, never a raw asset or generated mockup. */
  coverSrc: string;
  coverAlt: string;
  /** Only set when the commissioned art's aspect ratio needs a non-center crop. */
  coverPosition?: string;
  /** "contain" when the art's aspect ratio is too far from 2:3 to crop without losing something worth keeping. */
  coverFit?: "cover" | "contain";
  cta: "Ver caso" | "Solicitar demo" | "Ver arquitectura";
  links: {
    demo?: string;
    repo?: string;
  };
};

export const siteProfile = {
  name: "Francisco Requena Sánchez",
  location: "Almería, España",
  email: "franciscorequenasanchez0@gmail.com",
  phone: "+34642957572",
  displayPhone: "+34 642 95 75 72",
  role: "Desarrollador full-stack especializado en apps mobile",
  headline:
    "Construyo apps móviles, CRMs y webs rápidas para negocios que necesitan ordenar operaciones, captar mejor y dejar atrás herramientas genéricas.",
  shortBio:
    "Trabajo especialmente bien cuando el proyecto necesita convertir una idea difusa en una herramienta clara, mantenible y publicable. Mi base está en Kotlin, KMP y Jetpack Compose, y la complemento con CRMs personalizados, webs informativas, automatizaciones y datos SQL.",
  cta: "Agendar llamada",
  authority:
    "Trabajo mejor cuando el proyecto necesita convertir una idea difusa en una herramienta clara, mantenible y publicable.",
  links: {
    github: "https://github.com/franreke05",
    linkedin: "https://www.linkedin.com/in/franciscorequenasanchez",
    cv: "/francisco-requena-cv.pdf",
    whatsapp:
      "https://wa.me/34642957572?text=Hola%20Francisco%2C%20quiero%20hablar%20sobre%20un%20proyecto%20digital.",
    mail: "mailto:franciscorequenasanchez0@gmail.com",
  },
} as const;

export const trustSignals = [
  "Kotlin / KMP",
  "CRMs SQL",
  "Webs rápidas",
  "Automatizaciones",
  "Publicación y mantenimiento",
];

export const services: Service[] = [
  {
    id: "apps-mobile",
    title: "Apps mobile con KMP",
    summary:
      "Aplicaciones móviles con arquitectura mantenible, pantallas claras y base preparada para evolucionar sin rehacer el producto.",
    deliverables: [
      "Kotlin Multiplatform y Android",
      "Jetpack Compose y MVVM",
      "Integración de APIs REST",
      "Publicación y mantenimiento",
    ],
    icon: "mobile",
    highlight: "Especialidad principal",
  },
  {
    id: "crm",
    title: "CRMs personalizados",
    summary:
      "Sistemas internos para ordenar clientes, tareas, incidencias y operaciones sin forzar el negocio a una plantilla genérica.",
    deliverables: [
      "Paneles de gestión",
      "Roles y flujos de trabajo",
      "Formularios y reportes",
      "Base de datos SQL",
    ],
    icon: "crm",
    highlight: "Operación diaria",
  },
  {
    id: "webs",
    title: "Webs informativas",
    summary:
      "Páginas sobrias, rápidas y fáciles de entender para explicar servicios, generar confianza y convertir visitas en conversaciones.",
    deliverables: [
      "Diseño responsive",
      "SEO técnico base",
      "Analytics y formularios",
      "Hosting en Vercel",
    ],
    icon: "web",
    highlight: "Primera impresión",
  },
  {
    id: "mantenimiento",
    title: "Mantenimiento y mejora",
    summary:
      "Acompañamiento técnico para evolucionar funcionalidades, corregir incidencias y mantener el proyecto listo para crecer.",
    deliverables: [
      "Mejora continua",
      "Soporte por prioridades",
      "Optimización de rendimiento",
      "Documentación básica",
    ],
    icon: "support",
    highlight: "Relación a largo plazo",
  },
  {
    id: "automatizaciones",
    title: "Automatizaciones",
    summary:
      "Pequeños sistemas que eliminan tareas repetitivas, conectan herramientas y reducen trabajo manual en procesos de negocio.",
    deliverables: [
      "Integraciones entre servicios",
      "Procesos internos",
      "Notificaciones y reportes",
      "Validaciones de datos",
    ],
    icon: "automation",
    highlight: "Menos trabajo manual",
  },
  {
    id: "crecimiento",
    title: "SEO, hosting y analytics",
    summary:
      "Configuración técnica para que la web cargue bien, mida lo importante y tenga una base correcta para crecer.",
    deliverables: [
      "Vercel y dominios",
      "Vercel Analytics",
      "Metadata y Open Graph",
      "Revisión de Core Web Vitals",
    ],
    icon: "growth",
    highlight: "Lanzamiento medible",
  },
];

// All 4 projects below are real, named, currently-active Android/Kotlin
// projects of Francisco's — reviewed directly from source (build files, git
// log, README, screen inventory), not fictionalized. EduTrack and FlashFix
// are working MVPs; OposiControl and OryKai are honestly framed as active
// work-in-progress, matching their own internal roadmap docs.
export const projects: Project[] = [
  {
    id: "edutrack",
    caseStudySlug: "edutrack",
    type: "personal",
    visibility: "public",
    status: "documented-case",
    title: "EduTrack",
    projectType: "App mobile de productividad académica",
    problem:
      "Los estudiantes calculan mal medias, porcentajes y la nota que necesitan para aprobar cuando todo vive en hojas sueltas, calculadoras y capturas de pantalla dispersas.",
    solution:
      "App Android con cursos, asignaturas, notas ponderadas, simulador de nota necesaria y recordatorios de exámenes, con inicio de sesión Firebase y un plan Premium ya definido.",
    result:
      "12 pantallas en producción y beta pública activa desde hace más de un año (80 commits), con copy de Play Store, checklist de lanzamiento y precios de suscripción ya preparados.",
    stack: ["Kotlin", "Jetpack Compose", "Firebase Auth", "Firebase Realtime DB", "Play Billing", "DataStore"],
    metrics: ["12 pantallas", "Beta 0.3", "Firebase", "Play Store listo"],
    image: "mobile",
    coverSrc: "/images/projects/edutrack-cover.webp",
    coverAlt: "Portada cómic de EduTrack: un lápiz atraviesa un examen suspenso hacia un aprobado",
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
    projectType: "Marketplace mobile con backend real",
    problem:
      "Encontrar un taller mecánico cercano de confianza implica llamar a varios talleres a ciegas, sin saber disponibilidad, valoraciones ni poder hablar directamente con ellos.",
    solution:
      "Marketplace Android que localiza talleres por geolocalización, permite chatear con ellos, valorarlos y gestionar todo desde paneles de usuario, taller y administrador.",
    result:
      "MVP funcional de 17 pantallas con Firebase, Appwrite y Google Maps integrados. Hice mi propia auditoría de código, documenté los problemas reales (estado global, mezcla de Material 2/3, un bug crítico) y empecé a corregirlos: la última entrega migra a Material 3 y cifra las preferencias sensibles.",
    stack: ["Jetpack Compose", "Firebase", "Room", "Appwrite", "Google Maps", "EncryptedSharedPreferences"],
    metrics: ["17 pantallas", "MVP", "Auditoría propia", "Multi-rol"],
    image: "mobile",
    coverSrc: "/images/flashfix-comic-cover-v2.png",
    coverAlt: "Portada de cómic de FlashFix con un coche deportivo, mapas y herramientas mecánicas",
    cta: "Ver caso",
    links: {},
  },
  {
    id: "oposicontrol",
    caseStudySlug: "oposicontrol",
    type: "personal",
    visibility: "public",
    status: "technical-demo",
    title: "OposiControl",
    projectType: "Backoffice multiplataforma (KMP)",
    problem:
      "Gestionar el contenido de una plataforma de oposiciones — noticias, recursos, tienda, tickets de soporte — sin un panel centralizado obliga a tocar la base de datos a mano y sin control de roles.",
    solution:
      "Backoffice multiplataforma (Android, iOS, escritorio) con Kotlin Multiplatform y Clean Architecture estricta — Domain → Repository → UseCases → ViewModel — sobre Supabase, con más de 300 archivos Kotlin repartidos en 18+ módulos Gradle.",
    result:
      "Arquitectura ya operativa y probada — es la base técnica, no el proyecto entero: el panel de moderación y la tienda siguen en desarrollo activo.",
    stack: ["Kotlin Multiplatform", "Compose Multiplatform", "Koin", "Ktor", "SQLDelight", "Supabase"],
    metrics: ["KMP", "Clean Architecture", "18+ módulos", "En desarrollo"],
    image: "dashboard",
    coverSrc: "/images/projects/oposicontrol-cover.webp",
    coverAlt: "Portada cómic de OposiControl: una torre de control blindada con un escudo de seguridad ordenando documentos",
    cta: "Ver arquitectura",
    links: {},
  },
  {
    id: "orykai",
    caseStudySlug: "orykai",
    type: "personal",
    visibility: "public",
    status: "own-system",
    title: "OryKai",
    projectType: "CRM multiplataforma (KMP)",
    problem:
      "Llevar clientes, tickets, tareas y facturas de mi propia operación freelance en herramientas sueltas no escala ni deja rastro de qué se ha facturado ni a quién.",
    solution:
      "CRM multiplataforma propio (Kotlin Multiplatform: Android, iOS, escritorio y servidor) con backend Ktor + PostgreSQL, autenticación JWT y generación de facturas en PDF.",
    result:
      "27 pantallas ya construidas entre panel de admin y panel de cliente. El MVP se centra en escritorio y servidor, con Android como panel ligero de revisión — auth, persistencia y adjuntos siguen siendo hitos activos en mi propio roadmap.",
    stack: ["Kotlin Multiplatform", "Ktor", "PostgreSQL", "Flyway", "JWT", "PDFBox"],
    metrics: ["KMP", "Ktor + PostgreSQL", "27 pantallas", "En desarrollo"],
    image: "dashboard",
    coverSrc: "/images/projects/orykai-cover.webp",
    coverAlt: "Portada cómic de OryKai: un dragón dorado envuelve facturas, monedas y un terminal de CRM",
    coverFit: "contain",
    cta: "Ver arquitectura",
    links: {},
  },
];

// Honest, in-character status word for the comic-cover indicia — never
// implies a project is finished when it's documented as in-progress.
export const projectStatusWord: Record<Project["status"], string> = {
  "technical-demo": "EN DESARROLLO",
  "documented-case": "BETA PÚBLICA",
  "own-system": "MVP",
  "anonymous-project": "ANONIMIZADO",
  "real-lab": "LABORATORIO",
};

export const projectStatusAccent: Record<Project["status"], "live" | "progress"> = {
  "technical-demo": "progress",
  "documented-case": "live",
  "own-system": "live",
  "anonymous-project": "progress",
  "real-lab": "progress",
};

export const stackGroups = [
  {
    title: "Mobile",
    items: ["KMP", "Kotlin", "Jetpack Compose", "Android Studio", "Swift"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Motion"],
  },
  {
    title: "Backend y datos",
    items: ["Python", "Java", "SQL", "PL/SQL", "APIs REST"],
  },
  {
    title: "Herramientas",
    items: ["GitHub", "GitLab", "WordPress", "Vercel", "Tickets"],
  },
];

export const experienceItems = [
  {
    company: "IMARINA",
    role: "Desarrollador de Componentes Android",
    detail:
      "Apps Android con Kotlin y Jetpack Compose, arquitectura MVVM, integración de APIs REST, mantenimiento y soporte a decisiones técnicas.",
  },
  {
    company: "Orizon Software",
    role: "Aplicación móvil FlashFix",
    detail:
      "Optimización de formularios, resolución de incidencias mediante tickets y trabajo con Bootstrap, Python, Java, GitHub y GitLab.",
  },
  {
    company: "Freelance en Malt",
    role: "Soluciones digitales personalizadas",
    detail:
      "Desarrollo y publicación de soluciones adaptadas a ideas de clientes en apps funcionales orientadas a negocio y entretenimiento.",
  },
];

export const processSteps = [
  {
    title: "Diagnóstico",
    output: "Alcance claro",
    text: "Aterrizamos problema, objetivos, usuarios y procesos reales antes de diseñar pantallas.",
  },
  {
    title: "Prototipo claro",
    output: "Flujo validado",
    text: "Definimos estructura, recorrido principal y alcance para construir solo lo que aporta valor.",
  },
  {
    title: "Desarrollo iterativo",
    output: "Bloques revisables",
    text: "Construyo por módulos: interfaz, lógica, datos, integraciones y ajustes de rendimiento.",
  },
  {
    title: "Lanzamiento y mejora",
    output: "Medición y mejora",
    text: "Publicamos, medimos, corregimos puntos débiles y dejamos una base preparada para evolucionar.",
  },
];
