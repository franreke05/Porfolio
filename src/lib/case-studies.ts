/**
 * Rich case-study content for each project.
 * Static routes (/proyectos/edutrack etc.) import from here.
 * All 4 are real, named projects reviewed directly from source — build
 * files, git log, README, screen inventory — not fictionalized. EduTrack
 * and FlashFix are working MVPs; OposiControl and OryKai are honestly
 * framed as active work-in-progress, matching their own internal docs.
 */

export type ArchLayer = {
  layer: string;
  tech: string;
  desc: string;
};

export type StackRow = {
  name: string;
  category: string;
  purpose: string;
};

export type Decision = {
  title: string;
  why: string;
};

export type Feature = {
  title: string;
  desc: string;
};

export type CaseStudyData = {
  // Identity & SEO
  slug: string;
  canonicalId: string;       // matches project.id in site-data
  seoTitle: string;
  seoDescription: string;
  h1: string;
  summary: string;
  tagline: string;           // short comic-cover burst line — honest, not invented
  projectType: string;
  statusLabel: string;
  visibility: "public" | "anonymous";
  mockupType: "mobile" | "dashboard" | "browser" | "subscription";

  // Sidebar metrics
  metrics: Array<{ label: string; value: string }>;

  // Content
  context: string;
  problem: { intro: string; bullets: string[] };
  objectives: string[];
  solution: string[];          // array of paragraphs
  architecture: ArchLayer[];
  features: Feature[];
  stack: StackRow[];
  decisions: Decision[];
  result: { summary: string; points: string[] };
  demonstrates: string[];

  // Internal links
  relatedServices: Array<{ href: string; label: string }>;
  relatedProjects: Array<{ slug: string; title: string; desc: string }>;
};

// ─────────────────────────────────────────────
// EduTrack
// ─────────────────────────────────────────────
export const edutrack: CaseStudyData = {
  slug:          "edutrack",
  canonicalId:   "edutrack",
  seoTitle:      "EduTrack: app Android para calcular notas y medias académicas",
  seoDescription:
    "App Android real en beta pública para seguimiento académico: medias ponderadas, simulador de nota necesaria y plan Premium ya definido. Kotlin y Jetpack Compose.",
  h1:            "EduTrack — app Android para calcular notas y medias académicas",
  tagline:       "Tu media. Tu examen. Sin sorpresas.",
  summary:
    "Aplicación Android para que estudiantes controlen sus notas, calculen la media ponderada de cada asignatura y sepan qué nota necesitan en el examen final. En beta pública (v0.3.0) desde hace más de un año, con 12 pantallas, login con Firebase y un modelo de suscripción Premium ya diseñado y listo para activar.",
  projectType:   "App mobile de productividad académica",
  statusLabel:   "Caso documentado",
  visibility:    "public",
  mockupType:    "mobile",

  metrics: [
    { label: "Plataforma",  value: "Android" },
    { label: "Estado",      value: "Beta pública v0.3" },
    { label: "Pantallas",   value: "12" },
    { label: "Actividad",   value: "80 commits · 1 año+" },
  ],

  context:
    "Nace de un problema real: los estudiantes gestionan sus notas entre capturas de pantalla, hojas de cálculo y calculadoras de móvil. No existe una app Android sencilla que combine el cálculo automático de medias ponderadas con el simulador de nota mínima necesaria, organizada por cursos y asignaturas. Lleva más de un año en desarrollo activo (80 commits) y ya tiene beta pública, con el modelo de negocio — plan Premium a 2,49 €/mes o 14,99 €/año — definido junto al producto, no como ocurrencia tardía.",

  problem: {
    intro: "El flujo de seguimiento académico de la mayoría de estudiantes tiene problemas concretos:",
    bullets: [
      "Calculan mal las medias porque no aplican correctamente los pesos de cada evaluación.",
      "No saben cuánto necesitan sacar en el examen final dado lo que llevan hasta ese momento.",
      "Sus notas viven en varios sitios distintos y nunca tienen una vista de progreso real.",
      "Gestionar varios cursos y asignaturas a la vez sin jerarquía clara genera desorden.",
    ],
  },

  objectives: [
    "Calcular la media ponderada por asignatura de forma automática.",
    "Simular la nota mínima necesaria en el examen final dado el historial de parciales.",
    "Organizar el contenido en cursos → asignaturas → notas con jerarquía clara.",
    "Diseñar un modelo Premium sostenible desde el arranque del producto, no después.",
    "Dejar la app y su ficha de Play Store listas para lanzamiento público.",
  ],

  solution: [
    "La app organiza el trabajo en paquetes por función — Inicio, Notas, Simulador, Grupos, Premium, Onboarding, Perfil, Configuración — con una capa de datos y de inyección de dependencias separada, en lugar de un único módulo monolítico. Cada pantalla es Compose puro sobre Material 3.",
    "El inicio de sesión usa Firebase Auth con Credential Manager (el flujo moderno de Google Sign-In, no la API deprecada), y los datos de usuario viven en Firebase Realtime Database y Storage. DataStore gestiona las preferencias locales.",
    "El plan Premium (2,49 €/mes o 14,99 €/año) ya está definido a nivel de producto — con AdMob para el plan gratuito — aunque la integración de Play Billing con la pantalla de pago todavía no está conectada; es el siguiente hito técnico, no una promesa vacía.",
  ],

  architecture: [
    { layer: "UI",          tech: "Jetpack Compose · Material 3",       desc: "Pantallas declarativas organizadas por función (Inicio, Notas, Simulador, Grupos, Premium…)." },
    { layer: "Navegación",  tech: "Navigation Compose",                  desc: "Flujo entre pantallas dentro de cada paquete de función." },
    { layer: "Datos",       tech: "Firebase Realtime Database · Storage", desc: "Notas, cursos y adjuntos de usuario sincronizados en la nube." },
    { layer: "Auth",        tech: "Firebase Auth · Credential Manager",   desc: "Google Sign-In con el flujo moderno de Android, no la API deprecada." },
    { layer: "Preferencias", tech: "DataStore",                          desc: "Configuración y estado local del usuario." },
    { layer: "Monetización", tech: "AdMob · Google Play Billing",        desc: "Plan gratuito con anuncios; Premium definido, integración de cobro en curso." },
  ],

  features: [
    { title: "Calculadora de media",      desc: "Cálculo ponderado por asignatura conforme se introducen notas y pesos." },
    { title: "Simulador de examen",       desc: "Calcula la nota mínima necesaria en el examen final para superar la asignatura." },
    { title: "Cursos y asignaturas",      desc: "Organización jerárquica del progreso académico por curso." },
    { title: "Grupos de clase",           desc: "Módulo dedicado para gestionar grupos, separado del resto de la app." },
    { title: "Inicio de sesión Google",   desc: "Alta y login con Credential Manager, sin fricción de contraseñas." },
    { title: "Plan Premium",              desc: "Modelo de suscripción definido (2,49 €/mes, 14,99 €/año), con AdMob en el plan gratuito." },
  ],

  stack: [
    { name: "Kotlin",                   category: "Lenguaje",      purpose: "Base del proyecto." },
    { name: "Jetpack Compose",          category: "UI",            purpose: "Pantallas declarativas sin XML." },
    { name: "Firebase Auth",            category: "Auth",          purpose: "Login con Google via Credential Manager." },
    { name: "Firebase Realtime DB",     category: "Cloud",         purpose: "Notas y datos de usuario en la nube." },
    { name: "Firebase Storage",         category: "Cloud",         purpose: "Adjuntos y archivos de usuario." },
    { name: "DataStore",                category: "Persistencia",  purpose: "Preferencias y estado local." },
    { name: "Google Play Billing",      category: "Monetización",  purpose: "Cobro del plan Premium (en integración)." },
    { name: "AdMob",                    category: "Monetización",  purpose: "Publicidad en el plan gratuito." },
    { name: "Coil",                     category: "Imágenes",      purpose: "Carga de imágenes eficiente en Compose." },
  ],

  decisions: [
    { title: "Firebase sobre backend propio",           why: "Para un producto en solitario que necesita validar demanda antes de invertir en infraestructura, Firebase da auth, base de datos y storage gestionados sin mantener un servidor." },
    { title: "Paquetes por función, no por capa técnica", why: "Organizar el código en Inicio/Notas/Simulador/Premium en lugar de en capas técnicas transversales hace más fácil trabajar en una función sin tocar las demás, algo valioso en un proyecto de mantenimiento solitario y prolongado." },
    { title: "Definir el modelo Premium antes de integrarlo", why: "Diseñar el precio, el copy de Play Store y el checklist de lanzamiento junto al producto — no después — evita que la monetización sea un parche tardío sobre una app que no fue pensada para venderse." },
    { title: "Credential Manager sobre Google Sign-In clásico", why: "Es la API que Google recomienda activamente y evita quedar con una integración deprecada justo antes del lanzamiento público." },
  ],

  result: {
    summary: "Beta pública activa con 12 pantallas, más de un año de desarrollo continuo y el negocio ya diseñado junto al producto.",
    points: [
      "12 pantallas en producción con navegación completa entre cursos, notas y simulador.",
      "80 commits desde julio de 2025, con actividad reciente — no es un proyecto abandonado.",
      "Copy de Play Store, checklist de beta y términos/privacidad ya redactados.",
      "Precio de suscripción Premium definido; integración de cobro es el siguiente hito, no una promesa sin fecha.",
    ],
  },

  demonstrates: [
    "Capacidad de sostener un producto mobile en solitario durante más de un año de desarrollo real.",
    "Visión de producto: pensar en precio, copy y checklist de lanzamiento, no solo en código.",
    "Uso de las APIs actuales de Android (Credential Manager) en lugar de las deprecadas.",
    "Organización de código pensada para mantenimiento a largo plazo, no solo para el primer sprint.",
  ],

  relatedServices: [
    { href: "/servicios/desarrollo-apps-android", label: "Desarrollo de apps Android" },
  ],
  relatedProjects: [
    { slug: "flashfix", title: "FlashFix", desc: "Marketplace mobile con backend real" },
  ],
};

// ─────────────────────────────────────────────
// FlashFix
// ─────────────────────────────────────────────
export const flashfix: CaseStudyData = {
  slug:          "flashfix",
  canonicalId:   "flashfix",
  seoTitle:      "FlashFix: marketplace Android para encontrar talleres mecánicos",
  seoDescription:
    "App Android que conecta usuarios con talleres mecánicos cercanos por geolocalización, con chat, valoraciones y panel admin. Firebase, Appwrite y Google Maps.",
  h1:            "FlashFix — marketplace Android para encontrar talleres mecánicos",
  tagline:       "Encuentra taller sin llamar a ciegas.",
  summary:
    "Marketplace Android que conecta usuarios con talleres mecánicos cercanos por geolocalización, con chat directo, valoraciones y gestión por roles (usuario, taller, administrador). MVP funcional de 17 pantallas — con una particularidad poco habitual: incluye mi propia auditoría de código documentando los problemas reales que encontré, y ya he empezado a corregirlos.",
  projectType:   "Marketplace mobile con backend real",
  statusLabel:   "Sistema propio",
  visibility:    "public",
  mockupType:    "mobile",

  metrics: [
    { label: "Pantallas",  value: "17" },
    { label: "Roles",      value: "Usuario · Taller · Admin" },
    { label: "Backend",    value: "Firebase + Appwrite" },
    { label: "Estado",     value: "MVP + auditoría propia" },
  ],

  context:
    "Encontrar un taller mecánico cercano de confianza suele significar llamar a varios talleres a ciegas, sin saber disponibilidad ni poder comparar valoraciones. FlashFix es un marketplace que resuelve eso: localiza talleres por geolocalización, permite hablar con ellos por chat y centraliza valoraciones y gestión de citas. Es un proyecto real con 17 pantallas, tres roles de usuario distintos y una particularidad que lo hace un buen caso de estudio: en febrero de 2026 hice mi propia auditoría de código, documenté los problemas reales que encontré y desde entonces he ido corrigiéndolos.",

  problem: {
    intro: "El proceso de encontrar y contactar con un taller mecánico tiene fricción real:",
    bullets: [
      "No hay forma de comparar talleres cercanos por distancia, disponibilidad o valoración antes de llamar.",
      "El contacto inicial suele ser una llamada a ciegas, sin saber si el taller puede atender.",
      "No existe un historial de valoraciones que ayude a decidir entre varias opciones.",
      "Los talleres no tienen una forma sencilla de gestionar quién les contacta ni de responder rápido.",
    ],
  },

  objectives: [
    "Buscar talleres cercanos por geolocalización con radio ajustable.",
    "Permitir chat directo entre usuario y taller dentro de la app.",
    "Sistema de valoraciones para decidir con información real.",
    "Panel de administración para gestionar usuarios y talleres.",
    "Detectar y corregir la deuda técnica real del proyecto, no solo añadir funciones.",
  ],

  solution: [
    "La app usa Google Maps y Play Services Location para localizar talleres por proximidad. Cada perfil de taller expone su ubicación, valoraciones y un canal de chat propio construido sobre Firebase Realtime Database. Las valoraciones se persisten en Room localmente.",
    "Las imágenes (fotos de perfil, del taller) se gestionan con Appwrite en lugar de Firebase Storage. La app está organizada en carpetas por funcionalidad — login, inicio, mensajes, valoraciones, panel admin — con un ViewModel por pantalla.",
    "Lo distinto de este proyecto es que documenté mi propio proceso de revisión: un README fechado en el que reconozco problemas reales — llamadas a Firebase directamente desde Composables y Activities, estado mutable compartido entre pantallas, mezcla de Material 2 y 3, y un bug crítico donde el panel de admin podía borrar usuarios en bloque. Desde entonces he migrado a Material 3 en toda la interfaz y he cifrado las preferencias sensibles con Android Security Crypto, incluyendo migración de las claves antiguas.",
  ],

  architecture: [
    { layer: "UI",           tech: "Jetpack Compose (Material 2 → 3)", desc: "Migración en curso de Material 2 a Material 3 en toda la app." },
    { layer: "Mensajería",   tech: "Firebase Realtime Database",       desc: "Chat en tiempo real entre usuario y taller." },
    { layer: "Valoraciones", tech: "Room",                             desc: "Persistencia local de reseñas y puntuaciones." },
    { layer: "Imágenes",     tech: "Appwrite",                         desc: "Almacenamiento de fotos de perfil y de taller." },
    { layer: "Ubicación",    tech: "Play Services Maps · Location",    desc: "Búsqueda de talleres por geolocalización y radio." },
    { layer: "Seguridad",    tech: "AndroidX Security Crypto",         desc: "Preferencias sensibles cifradas, con migración de datos antiguos." },
  ],

  features: [
    { title: "Búsqueda por geolocalización", desc: "Localiza talleres cercanos con radio de búsqueda ajustable." },
    { title: "Chat usuario–taller",          desc: "Conversación directa dentro de la app, sin salir a WhatsApp." },
    { title: "Valoraciones",                 desc: "Sistema de reseñas que ayuda a decidir entre talleres." },
    { title: "Roles diferenciados",          desc: "Experiencias distintas para usuario, taller y administrador." },
    { title: "Panel de administración",      desc: "Gestión de usuarios y talleres, con el bug de borrado masivo ya corregido." },
    { title: "Notificaciones",               desc: "Avisos de mensajes y actividad relevante por rol." },
  ],

  stack: [
    { name: "Jetpack Compose",             category: "UI",           purpose: "Interfaz declarativa, migrando a Material 3." },
    { name: "Firebase Realtime Database",  category: "Backend",      purpose: "Datos en tiempo real y chat." },
    { name: "Room",                        category: "Base de datos", purpose: "Persistencia local de valoraciones." },
    { name: "Appwrite",                    category: "Storage",      purpose: "Almacenamiento de imágenes." },
    { name: "Google Maps / Location",      category: "Ubicación",    purpose: "Búsqueda geolocalizada de talleres." },
    { name: "AndroidX Security Crypto",    category: "Seguridad",    purpose: "EncryptedSharedPreferences con migración." },
    { name: "Coil · Glide",                category: "Imágenes",     purpose: "Carga y caché de imágenes." },
  ],

  decisions: [
    { title: "Auditar el propio código antes de seguir añadiendo funciones", why: "Un MVP que crece sin pausa acumula deuda técnica invisible. Pararse a documentar los problemas reales — estado global, mezcla de Material 2/3, un bug crítico de borrado — antes de seguir construyendo evita que esa deuda se vuelva inmanejable." },
    { title: "Appwrite para imágenes, Firebase para datos en tiempo real", why: "Usar cada herramienta para lo que hace mejor en vez de forzarlo todo a una sola plataforma; Firebase Realtime Database encaja mejor con el chat, Appwrite da más control sobre el almacenamiento de archivos." },
    { title: "Migrar a Material 3 de forma incremental",                  why: "Reescribir toda la UI de golpe habría parado el desarrollo de funcionalidad. La migración progresiva permite seguir entregando mientras se corrige la inconsistencia visual." },
    { title: "Cifrar preferencias sensibles con migración, no de golpe",  why: "Los usuarios ya tenían datos guardados sin cifrar; el cambio incluye una ruta de migración para no perder esos datos al actualizar." },
  ],

  result: {
    summary: "MVP funcional de 17 pantallas en producción, con una auditoría de código propia documentada y correcciones activas.",
    points: [
      "17 pantallas cubriendo login, búsqueda, chat, valoraciones y panel de administración.",
      "Tres roles de usuario con experiencias diferenciadas.",
      "Bug crítico de borrado masivo de usuarios ya identificado y corregido.",
      "Migración a Material 3 y cifrado de preferencias sensibles en curso, con historial documentado del porqué.",
    ],
  },

  demonstrates: [
    "Capacidad de construir un marketplace completo con geolocalización, chat y múltiples roles.",
    "Honestidad técnica: documentar y corregir los propios errores en lugar de ocultarlos.",
    "Integración de varios servicios (Firebase, Appwrite, Google Maps) en un mismo producto.",
    "Criterio para priorizar deuda técnica real (un bug de borrado masivo) sobre features nuevas.",
  ],

  relatedServices: [
    { href: "/servicios/desarrollo-apps-android", label: "Desarrollo de apps Android" },
  ],
  relatedProjects: [
    { slug: "edutrack", title: "EduTrack", desc: "App Android para seguimiento académico" },
  ],
};

// ─────────────────────────────────────────────
// OposiControl
// ─────────────────────────────────────────────
export const oposicontrol: CaseStudyData = {
  slug:          "oposicontrol",
  canonicalId:   "oposicontrol",
  seoTitle:      "OposiControl: backoffice multiplataforma con Kotlin Multiplatform",
  seoDescription:
    "Backoffice multiplataforma (Android, iOS, escritorio) para gestionar una plataforma de oposiciones, con Kotlin Multiplatform, Clean Architecture y Supabase.",
  h1:            "OposiControl — backoffice multiplataforma con Kotlin Multiplatform",
  tagline:       "Arquitectura blindada, producto en marcha.",
  summary:
    "Panel de administración multiplataforma (Android, iOS, escritorio) para gestionar el contenido de una plataforma de oposiciones: noticias, recursos, tienda y tickets de soporte. Construido con Kotlin Multiplatform y Clean Architecture estricta sobre Supabase. En desarrollo activo — es la arquitectura la que ya está operativa, no todavía el producto completo.",
  projectType:   "Backoffice multiplataforma (KMP)",
  statusLabel:   "Demo técnica",
  visibility:    "public",
  mockupType:    "dashboard",

  metrics: [
    { label: "Arquitectura", value: "KMP · Clean Architecture" },
    { label: "Módulos",      value: "18+ Gradle modules" },
    { label: "Backend",      value: "Supabase" },
    { label: "Estado",       value: "En desarrollo" },
  ],

  context:
    "Una plataforma de contenido para opositores (noticias, recursos, tienda con tickets y ofertas, soporte) necesita un back-office que centralice la gestión de ese contenido con control de roles — sin eso, cualquier cambio implica tocar la base de datos a mano. OposiControl es ese backoffice: multiplataforma desde el diseño (Android, iOS, escritorio, con web planificada) y con una Clean Architecture aplicada de forma estricta, no solo nombrada. Es honestamente un proyecto en desarrollo activo (9 commits en el último mes) — la base arquitectónica es sólida; el producto final, todavía no.",

  problem: {
    intro: "Gestionar el contenido y la operación de una plataforma de oposiciones sin herramientas propias es frágil:",
    bullets: [
      "Publicar noticias o recursos implica editar la base de datos directamente, sin interfaz ni control.",
      "No hay gestión de roles: cualquiera con acceso a la base de datos puede hacer cualquier cambio.",
      "Los tickets de soporte y la tienda (ofertas, monedero) no tienen un panel centralizado.",
      "Sin moderación estructurada, el contenido publicado no pasa por ningún proceso de revisión.",
    ],
  },

  objectives: [
    "Construir un backoffice multiplataforma con una única base de código compartida.",
    "Aplicar Clean Architecture de forma estricta: la UI nunca toca el backend directamente.",
    "Modularizar el proyecto para que cada función crezca de forma independiente.",
    "Gestionar noticias, recursos, tienda y tickets de soporte desde un mismo panel.",
    "Dejar la base técnica lista antes de completar cada módulo funcional al 100%.",
  ],

  solution: [
    "El proyecto sigue un flujo estricto Domain → Repository → UseCases → ViewModel → UI Compose, verificado explícitamente: ningún ViewModel llama a Supabase directamente, siempre pasa por la capa de dominio. Esto se documenta como regla del proyecto, no solo como intención.",
    "Está modularizado en más de 18 módulos Gradle (core:*, domain, data, features:*), con inyección de dependencias vía Koin y networking vía Ktor sobre un módulo de backend propio. La persistencia local usa SQLDelight, generando el acceso a datos desde SQL tipado en vez de un ORM oscuro.",
    "Supabase es el backend: hay esquema SQL y migraciones versionadas comprometidas en el propio repositorio (docs/supabase/), así que la base de datos no vive solo en la cabeza del desarrollador — está documentada y reproducible.",
  ],

  architecture: [
    { layer: "UI",            tech: "Compose Multiplatform",          desc: "Interfaz compartida entre Android, iOS y escritorio, con Web planificado." },
    { layer: "ViewModel",     tech: "features:* modules",             desc: "Un módulo Gradle por función, aislado del resto." },
    { layer: "Dominio",       tech: "UseCases · domain module",       desc: "Reglas de negocio separadas de la UI y del acceso a datos." },
    { layer: "Repositorio",   tech: "Repository pattern · data module", desc: "Única puerta de entrada a Supabase; los ViewModels nunca acceden directo." },
    { layer: "Persistencia local", tech: "SQLDelight",                desc: "Acceso a datos tipado generado desde SQL, no un ORM opaco." },
    { layer: "Backend",       tech: "Supabase · Ktor",                desc: "Auth, base de datos PostgreSQL y lógica de servidor propia." },
    { layer: "DI",            tech: "Koin",                           desc: "Inyección de dependencias compartida en todos los módulos." },
  ],

  features: [
    { title: "Gestión de noticias",       desc: "Publicación y edición de contenido para la plataforma de oposiciones." },
    { title: "Recursos por especialidad", desc: "Organización de material de estudio por especialidad de oposición." },
    { title: "Tienda interna",            desc: "Gestión de tickets, monedero y ofertas — módulo en desarrollo." },
    { title: "Tickets de soporte",        desc: "Cola de soporte para gestionar incidencias de usuarios." },
    { title: "Roles y moderación",        desc: "Control de acceso por rol; cola de moderación de contenido." },
    { title: "16 pantallas construidas",  desc: "Base de pantallas ya implementada sobre la arquitectura descrita." },
  ],

  stack: [
    { name: "Kotlin Multiplatform",     category: "Arquitectura",  purpose: "Una base de código para Android, iOS y escritorio." },
    { name: "Compose Multiplatform",    category: "UI",            purpose: "Interfaz compartida entre plataformas." },
    { name: "Koin",                     category: "DI",            purpose: "Inyección de dependencias multiplataforma." },
    { name: "Ktor",                     category: "Backend",       purpose: "Cliente HTTP y módulo de backend propio." },
    { name: "SQLDelight",               category: "Persistencia",  purpose: "Acceso a datos local tipado desde SQL." },
    { name: "Supabase",                 category: "Backend",       purpose: "Auth, PostgreSQL y esquema versionado." },
  ],

  decisions: [
    { title: "Clean Architecture verificada, no solo nombrada", why: "Es fácil declarar 'usamos Clean Architecture' y luego romper la regla en el primer ViewModel con prisa. Aquí la regla — nunca llamar a Supabase desde un ViewModel — está documentada explícitamente como norma del proyecto." },
    { title: "18+ módulos Gradle en vez de un único módulo app", why: "Modularizar desde el principio cuesta más tiempo de configuración inicial, pero evita que un proyecto multiplataforma con varias features se convierta en un monolito imposible de tocar sin romper otra cosa." },
    { title: "SQLDelight sobre Room",                            why: "Room es solo Android; SQLDelight es multiplataforma y genera el acceso a datos desde SQL real, lo que encaja mejor con un proyecto KMP con targets Android, iOS y escritorio." },
    { title: "Supabase con esquema versionado en el repo",       why: "Comprometer las migraciones SQL en el propio repositorio, en vez de gestionarlas solo desde el panel de Supabase, hace que la base de datos sea reproducible y revisable como el resto del código." },
  ],

  result: {
    summary: "Arquitectura multiplataforma operativa y ya probada, con 16 pantallas construidas — el producto completo sigue en desarrollo activo.",
    points: [
      "Flujo Domain → Repository → UseCases → ViewModel aplicado y verificable en el código.",
      "18+ módulos Gradle con límites claros entre funciones.",
      "Esquema y migraciones de Supabase versionados y comprometidos en el repositorio.",
      "El panel de moderación y la tienda interna son honestamente el trabajo pendiente, no algo ya cerrado.",
    ],
  },

  demonstrates: [
    "Diseño de arquitectura multiplataforma real, no solo un proyecto KMP de ejemplo.",
    "Disciplina para modularizar un proyecto desde el inicio en vez de refactorizar después.",
    "Uso de SQLDelight y Ktor en un contexto multiplataforma genuino, con Android, iOS y escritorio como targets reales.",
    "Honestidad sobre qué parte de un proyecto está terminada y cuál sigue en construcción.",
  ],

  relatedServices: [
    { href: "/servicios/crm-a-medida", label: "CRM a medida para empresas" },
    { href: "/servicios/desarrollo-apps-android", label: "Desarrollo de apps Android" },
  ],
  relatedProjects: [
    { slug: "orykai", title: "OryKai", desc: "CRM multiplataforma para mi propia operación freelance" },
  ],
};

// ─────────────────────────────────────────────
// OryKai
// ─────────────────────────────────────────────
export const orykai: CaseStudyData = {
  slug:          "orykai",
  canonicalId:   "orykai",
  seoTitle:      "OryKai: CRM multiplataforma con Kotlin Multiplatform y Ktor",
  seoDescription:
    "CRM propio (Kotlin Multiplatform, Ktor, PostgreSQL) para gestionar clientes, tickets, tareas y facturas de mi operación freelance. MVP centrado en escritorio y servidor.",
  h1:            "OryKai — CRM multiplataforma con Kotlin Multiplatform y Ktor",
  tagline:       "El sistema que lleva mi propio negocio.",
  summary:
    "CRM que estoy construyendo para llevar mi propia operación freelance: clientes, tickets, tareas, facturas y programas, con backend Ktor + PostgreSQL y 27 pantallas ya construidas entre panel de administración y panel de cliente. El MVP se centra en escritorio y servidor, con Android como panel ligero de revisión — lo digo yo mismo en mi propio roadmap.",
  projectType:   "CRM multiplataforma (KMP)",
  statusLabel:   "Sistema propio",
  visibility:    "public",
  mockupType:    "dashboard",

  metrics: [
    { label: "Pantallas",  value: "27 (8 admin + 19 cliente)" },
    { label: "Backend",    value: "Ktor + PostgreSQL" },
    { label: "Actividad",  value: "55 commits · activo" },
    { label: "Estado",     value: "MVP en desarrollo" },
  ],

  context:
    "Llevar clientes, tickets, tareas y facturas de una operación freelance en herramientas sueltas no escala ni deja rastro de qué se ha facturado ni a quién. OryKai es el CRM que estoy construyendo para resolver eso en mi propio negocio: Kotlin Multiplatform con targets Android, iOS, escritorio y servidor, backend propio en Ktor con PostgreSQL. Es, con diferencia, el proyecto con más actividad reciente de los cuatro (55 commits entre marzo y julio de 2026) y el de backend más sustancial — 66 archivos Kotlin solo en el servidor.",

  problem: {
    intro: "Gestionar una operación freelance sin un sistema propio genera fricción real:",
    bullets: [
      "Clientes, tareas y tickets repartidos entre notas, chats y hojas sueltas sin trazabilidad.",
      "No hay un registro claro de qué se ha facturado, a quién y cuándo.",
      "Sin backend propio, cualquier automatización depende de herramientas de terceros.",
      "Un panel de administración y otro de cliente son procesos distintos que conviene separar desde el diseño.",
    ],
  },

  objectives: [
    "Centralizar clientes, tickets, tareas y facturas en un sistema propio.",
    "Construir un backend real (Ktor + PostgreSQL) en vez de depender de terceros.",
    "Separar desde el inicio el panel de administración del panel de cliente.",
    "Generar facturas en PDF directamente desde el sistema.",
    "Priorizar escritorio y servidor en el MVP, dejando Android como panel ligero por ahora — decisión explícita, no una limitación oculta.",
  ],

  solution: [
    "Las 27 pantallas construidas hasta ahora — 8 de administración y 19 de cliente — viven en un módulo Compose Multiplatform compartido (`commonMain`), consumido por las distintas plataformas. El servidor es la pieza más desarrollada: 66 archivos Kotlin en Ktor, con autenticación JWT (java-jwt) y contraseñas con BCrypt.",
    "La base de datos es PostgreSQL con HikariCP para el pool de conexiones y Flyway para las migraciones versionadas — nada de `CREATE TABLE` manual en producción. La generación de facturas usa PDFBox para producir el PDF directamente desde el servidor.",
    "El propio roadmap del proyecto documenta con honestidad qué falta: autenticación real de extremo a extremo, persistencia completa, adjuntos y notificaciones siguen siendo hitos activos, no funciones ya cerradas. Por eso el MVP se presenta centrado en escritorio y servidor — los shells nativos de Android y escritorio existen como estructura preparada, pero la app compartida es, hoy, la interfaz real.",
  ],

  architecture: [
    { layer: "UI",           tech: "Compose Multiplatform (commonMain)", desc: "27 pantallas compartidas entre admin y cliente, un único módulo UI." },
    { layer: "Servidor",     tech: "Ktor (server)",                      desc: "66 archivos Kotlin — el backend más sustancial de los cuatro proyectos." },
    { layer: "Auth",         tech: "JWT (java-jwt) · BCrypt",            desc: "Tokens firmados y contraseñas con hash, no en texto plano." },
    { layer: "Base de datos", tech: "PostgreSQL · HikariCP",             desc: "Pool de conexiones gestionado para el acceso a datos del servidor." },
    { layer: "Migraciones",  tech: "Flyway",                             desc: "Cambios de esquema versionados y reproducibles." },
    { layer: "Documentos",   tech: "PDFBox",                             desc: "Generación de facturas en PDF desde el servidor." },
  ],

  features: [
    { title: "Panel de administración", desc: "8 pantallas para gestionar clientes, tickets y operación interna." },
    { title: "Panel de cliente",        desc: "19 pantallas para que cada cliente gestione sus tickets y programas." },
    { title: "Facturación en PDF",      desc: "Generación de facturas directamente desde el servidor con PDFBox." },
    { title: "Autenticación JWT",       desc: "Tokens firmados con expiración, sin sesiones en el servidor." },
    { title: "Gestión de tareas",       desc: "Seguimiento de tareas asociadas a clientes y programas." },
    { title: "Migraciones versionadas", desc: "Cada cambio de esquema queda registrado y es reproducible con Flyway." },
  ],

  stack: [
    { name: "Kotlin Multiplatform",  category: "Arquitectura", purpose: "Android, iOS, escritorio y servidor desde una base común." },
    { name: "Ktor",                  category: "Backend",      purpose: "Servidor y cliente HTTP, mismo lenguaje que el resto del proyecto." },
    { name: "PostgreSQL",            category: "Base de datos", purpose: "Almacenamiento relacional para clientes, tickets y facturas." },
    { name: "HikariCP",              category: "Base de datos", purpose: "Pool de conexiones para el acceso concurrente a PostgreSQL." },
    { name: "Flyway",                category: "Migraciones",  purpose: "Versionado y reproducibilidad del esquema de base de datos." },
    { name: "JWT (java-jwt)",        category: "Auth",         purpose: "Autenticación stateless entre cliente y servidor." },
    { name: "BCrypt",                category: "Auth",         purpose: "Hash seguro de contraseñas." },
    { name: "PDFBox",                category: "Documentos",   purpose: "Generación de facturas en PDF." },
  ],

  decisions: [
    { title: "MVP centrado en escritorio y servidor primero", why: "Construir el backend y la lógica de negocio antes de pulir cada shell nativo evita reescribir esa lógica varias veces; Android queda como panel ligero de revisión mientras el núcleo del sistema madura." },
    { title: "Ktor tanto en servidor como en cliente",        why: "Compartir el mismo framework HTTP en las dos puntas del sistema reduce el número de herramientas distintas que mantener en un proyecto donde ya trabajo solo en cuatro plataformas." },
    { title: "Flyway en vez de migraciones manuales",         why: "En un sistema que gestiona facturas reales, no versionar los cambios de esquema es asumir un riesgo innecesario; Flyway hace que cada cambio sea reproducible y auditable." },
    { title: "Documentar en el propio roadmap qué falta",     why: "Un proyecto activo se beneficia más de un roadmap honesto sobre qué está pendiente (auth real, adjuntos, notificaciones) que de aparentar que ya está terminado." },
  ],

  result: {
    summary: "27 pantallas construidas y el backend más completo de mis cuatro proyectos — activamente en desarrollo, no un producto cerrado.",
    points: [
      "8 pantallas de administración y 19 de cliente ya implementadas sobre Compose Multiplatform.",
      "Servidor Ktor con 66 archivos Kotlin: el backend más sustancial de los cuatro casos.",
      "Facturación en PDF, autenticación JWT y migraciones versionadas ya funcionando.",
      "Auth de extremo a extremo, persistencia completa, adjuntos y notificaciones documentados como próximos hitos.",
    ],
  },

  demonstrates: [
    "Capacidad de construir un backend real (auth, base de datos, PDFs) para un sistema de negocio propio.",
    "Kotlin Multiplatform aplicado a los cuatro targets — Android, iOS, escritorio y servidor — no solo a la UI.",
    "Uso de herramientas de nivel producción (Flyway, HikariCP, BCrypt) en un proyecto personal.",
    "Transparencia sobre el estado real de un sistema en desarrollo activo, sin sobrevender el avance.",
  ],

  relatedServices: [
    { href: "/servicios/crm-a-medida", label: "CRM a medida para empresas" },
  ],
  relatedProjects: [
    { slug: "oposicontrol", title: "OposiControl", desc: "Backoffice multiplataforma con Kotlin Multiplatform" },
  ],
};

export const caseStudies: Record<string, CaseStudyData> = {
  edutrack,
  flashfix,
  oposicontrol,
  orykai,
};
