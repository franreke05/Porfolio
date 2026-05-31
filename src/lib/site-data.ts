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

export const projects: Project[] = [
  {
    id: "edutrack-mobile-academica",
    type: "personal",
    visibility: "public",
    status: "real-lab",
    title: "EduTrack-style",
    projectType: "Producto mobile propio",
    problem:
      "Los estudiantes calculan mal medias, porcentajes y notas necesarias para aprobar cuando todo vive en hojas, calculadoras y capturas dispersas.",
    solution:
      "App mobile con cursos, asignaturas, notas ponderadas, simulador de nota necesaria, recordatorios y exportación para revisar el progreso sin fricción.",
    result:
      "Producto preparado para beta, modelo freemium y arquitectura escalable para evolucionar hacia sincronización, pagos y analítica educativa.",
    stack: ["Kotlin", "Jetpack Compose", "Firebase", "Material 3", "WorkManager"],
    metrics: ["8+ pantallas", "Beta", "MVP", "Recordatorios"],
    image: "mobile",
    cta: "Ver caso",
    links: {},
  },
  {
    id: "requenadesk-crm-interno",
    type: "personal",
    visibility: "public",
    status: "own-system",
    title: "RequenaDesk-style",
    projectType: "Sistema interno / CRM",
    problem:
      "Pequeños negocios gestionan clientes, tareas e incidencias con WhatsApp, Excel y notas sueltas, perdiendo trazabilidad y prioridad operativa.",
    solution:
      "CRM personalizado con clientes, tickets, estados, roles, dashboard operativo y base de datos SQL para centralizar el trabajo diario.",
    result:
      "Sistema centralizado, mantenible y preparado para operación diaria con despliegue en VPS y capa de backend separada.",
    stack: ["Kotlin", "Compose Desktop", "Ktor", "PostgreSQL", "Caddy", "VPS"],
    metrics: ["SQL", "Roles", "Dashboard", "VPS"],
    image: "dashboard",
    cta: "Ver arquitectura",
    links: {},
  },
  {
    id: "solsconfort-web-premium",
    type: "client",
    visibility: "public",
    status: "documented-case",
    title: "Solsconfort-style",
    projectType: "Web corporativa",
    problem:
      "Una empresa necesita explicar servicios técnicos con claridad visual y generar confianza desde la primera visita.",
    solution:
      "Web responsive con secciones comerciales, estructura SEO, bloques visuales, formularios, rendimiento y jerarquía clara de servicios.",
    result:
      "Mejor claridad de servicios, experiencia visual más profesional y base preparada para captación mediante contacto directo.",
    stack: ["WordPress", "Elementor", "HTML", "CSS", "JavaScript", "SEO técnico"],
    metrics: ["Responsive", "SEO", "Formulario", "Performance"],
    image: "browser",
    cta: "Ver caso",
    links: {},
  },
  {
    id: "vinotico-area-privada",
    type: "client",
    visibility: "anonymous",
    status: "anonymous-project",
    title: "Vinótico-style",
    projectType: "Web + sistema de negocio",
    problem:
      "Un club de suscripción necesita gestionar socios, preferencias, área privada y beneficios sin depender de procesos manuales.",
    solution:
      "Sistema WordPress/WooCommerce con suscripciones, control de acceso, área de socio, ventajas y lógica de negocio personalizada.",
    result:
      "Sistema comercial más escalable, con lógica personalizada para socios y recorrido preparado para venta recurrente.",
    stack: ["WordPress", "WooCommerce", "Woo Subscriptions", "PHP", "Snippets", "UX"],
    metrics: ["Auth", "Suscripciones", "Área privada", "Roles"],
    image: "subscription",
    cta: "Solicitar demo",
    links: {},
  },
  {
    id: "oposicontrol-study-app",
    type: "personal",
    visibility: "public",
    status: "technical-demo",
    title: "OposiControl-style",
    projectType: "App mobile de productividad",
    problem:
      "Los opositores necesitan ordenar temarios, simulacros, progreso y planificación sin saltar entre calendarios, PDFs y notas sueltas.",
    solution:
      "App mobile con módulos, progreso, estadísticas, simulacros y organización de estudio para convertir sesiones dispersas en un sistema medible.",
    result:
      "Base técnica preparada para producto educativo escalable, con lógica multiplataforma y backend listo para datos de usuario.",
    stack: ["Kotlin Multiplatform", "Compose", "Supabase", "Ktor"],
    metrics: ["MVP", "Auth", "Stats", "Simulacros"],
    image: "mobile",
    cta: "Ver arquitectura",
    links: {},
  },
];

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
