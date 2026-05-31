/**
 * Rich case-study content for each project.
 * Static routes (/proyectos/edutrack etc.) import from here.
 * The generic [id] route stays for backward-compatibility with long slugs.
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
  canonicalId:   "edutrack-mobile-academica",
  seoTitle:      "EduTrack: app Android para calcular notas y medias académicas",
  seoDescription:
    "App Android propia para seguimiento académico: medias ponderadas, simulador de nota necesaria y recordatorios. Kotlin, Jetpack Compose y arquitectura MVVM.",
  h1:            "EduTrack — app Android para calcular notas y medias académicas",
  summary:
    "Aplicación Android nativa para que estudiantes universitarios controlen sus notas, calculen la media ponderada de cada asignatura y sepan exactamente qué nota necesitan en el examen final. Arquitectura MVVM con Kotlin y Jetpack Compose, preparada para evolucionar hacia sincronización en la nube y modelo freemium.",
  projectType:   "Producto mobile propio",
  statusLabel:   "Laboratorio real",
  visibility:    "public",
  mockupType:    "mobile",

  metrics: [
    { label: "Plataforma",   value: "Android" },
    { label: "Estado",       value: "MVP funcional" },
    { label: "Pantallas",    value: "8+" },
    { label: "Modelo",       value: "Freemium (diseño)" },
  ],

  context:
    "Nace de un problema real: los estudiantes universitarios gestionan sus notas entre capturas de pantalla, hojas de cálculo y calculadoras de móvil. No existe una app nativa Android que combine el cálculo automático de medias ponderadas con el simulador de nota mínima necesaria y la organización jerárquica por cursos y asignaturas, sin anuncios agresivos ni funciones irrelevantes.",

  problem: {
    intro: "El flujo de seguimiento académico de la mayoría de estudiantes tiene tres problemas concretos:",
    bullets: [
      "Calculan mal las medias porque no aplican correctamente los pesos de cada evaluación.",
      "No saben cuánto necesitan sacar en el examen final dado lo que llevan hasta ese momento.",
      "Sus notas viven en tres sitios distintos y nunca tienen una vista de progreso real.",
      "Los recordatorios de examen están desconectados del tracking de notas.",
    ],
  },

  objectives: [
    "Calcular la media ponderada por asignatura de forma automática.",
    "Simular la nota mínima necesaria en el examen final dado el historial de parciales.",
    "Organizar el contenido en cursos → asignaturas → notas con jerarquía clara.",
    "Enviar recordatorios de examen fiables via WorkManager.",
    "Preparar la arquitectura para sincronización en la nube y modelo freemium.",
  ],

  solution: [
    "La app usa MVVM con ViewModel y Use Cases separados. Cada pantalla es un @Composable que observa el estado del ViewModel mediante StateFlow. La persistencia local corre sobre Room con entidades separadas para Course, Subject y Grade, lo que permite queries eficientes y relaciones 1-N sin acoplamiento.",
    "El simulador de nota calcula el mínimo necesario en el examen final dado un peso definido y las notas previas. Es lógica pura en la capa de dominio — testable sin UI ni base de datos. El cálculo se ejecuta en tiempo real conforme el usuario introduce notas.",
    "WorkManager programa notificaciones de examen incluso cuando el sistema cierra el proceso, usando constraints de red y batería para no degradar la experiencia. Las notificaciones se actualizan automáticamente si el usuario modifica las fechas de examen.",
  ],

  architecture: [
    { layer: "UI",          tech: "Jetpack Compose · Material 3",        desc: "Pantallas declarativas, tema dinámico y componentes de Material Design 3." },
    { layer: "Navegación",  tech: "Navigation Component",                 desc: "Flujo entre pantallas tipado, con argumento seguro en cada ruta." },
    { layer: "ViewModel",   tech: "StateFlow · Coroutines",              desc: "Estado observable, acciones de usuario y ciclo de vida gestionados." },
    { layer: "Dominio",     tech: "Use Cases",                            desc: "Lógica de cálculo de medias y simulador aislada y testable." },
    { layer: "Repositorio", tech: "Repository pattern",                   desc: "Abstracción sobre Room y Firebase para independencia de la fuente de datos." },
    { layer: "Datos",       tech: "Room · Firebase Firestore",            desc: "Persistencia local (Room) y cloud opcional (Firestore) bajo la misma interfaz." },
    { layer: "Tareas",      tech: "WorkManager",                          desc: "Recordatorios fiables con restricciones de batería y red." },
  ],

  features: [
    { title: "Dashboard de cursos",          desc: "Vista de progreso global con indicador de estado por asignatura y próximas fechas clave." },
    { title: "Calculadora de media",         desc: "Cálculo ponderado en tiempo real conforme se introducen notas y pesos." },
    { title: "Simulador de examen",          desc: "Calcula la nota mínima necesaria en el examen final para superar la asignatura." },
    { title: "Recordatorios WorkManager",    desc: "Notificaciones de examen que sobreviven a cierres del sistema y reinicios." },
    { title: "Historial de notas",           desc: "Registro cronológico de evaluaciones por asignatura con fecha y descripción." },
    { title: "Exportación",                  desc: "Exporta el resumen de notas a formato compartible para revisar offline." },
    { title: "Modo oscuro",                  desc: "Soporte completo con Material 3 Dynamic Color adaptado al fondo del dispositivo." },
  ],

  stack: [
    { name: "Kotlin",                  category: "Lenguaje",       purpose: "Base del proyecto, null-safety y coroutinas nativas." },
    { name: "Jetpack Compose",         category: "UI",              purpose: "Pantallas declarativas sin XML." },
    { name: "Material 3",              category: "Design system",   purpose: "Componentes y tema dinámico del sistema." },
    { name: "Room",                    category: "Base de datos",   purpose: "Persistencia local con validación en compilación." },
    { name: "Firebase Firestore",      category: "Cloud",           purpose: "Sincronización opcional en la nube." },
    { name: "Firebase Auth",           category: "Auth",            purpose: "Login para la capa freemium futura." },
    { name: "WorkManager",             category: "Tareas",          purpose: "Recordatorios de examen fiables." },
    { name: "Coroutines / StateFlow",  category: "Concurrencia",    purpose: "Estado reactivo y operaciones asíncronas." },
    { name: "Navigation Component",    category: "Navegación",      purpose: "Flujo tipado entre pantallas." },
  ],

  decisions: [
    { title: "MVVM sobre MVI",             why: "MVVM es suficiente para este alcance y más sencillo de mantener en solitario. MVI habría añadido complejidad sin beneficio real en un proyecto sin flujos de datos bidireccionales complejos." },
    { title: "Room sobre SQLite directo",  why: "Room genera el SQL, valida queries en tiempo de compilación y se integra con Flow sin código boilerplate. Menos errores y mejor DX." },
    { title: "Abstracción freemium temprana", why: "Los repositorios tienen interfaz abstracta para que la capa cloud sea intercambiable sin modificar la UI. Esto evita una refactorización mayor cuando se active el modelo de pago." },
    { title: "WorkManager sobre AlarmManager", why: "WorkManager garantiza ejecución aunque el sistema mate el proceso y respeta las restricciones de Doze Mode, algo que AlarmManager no asegura en Android 12+." },
  ],

  result: {
    summary: "MVP funcional con todas las pantallas principales, lógica de negocio testable y arquitectura preparada para la siguiente fase.",
    points: [
      "8+ pantallas con navegación completa y flujo de usuario coherente.",
      "Lógica de cálculo de medias y simulador validados manualmente.",
      "Arquitectura lista para activar sincronización cloud sin modificar UI.",
      "Cero deuda técnica: cada capa tiene responsabilidad única y definida.",
    ],
  },

  demonstrates: [
    "Capacidad de llevar un producto mobile de idea a MVP funcional sin equipo.",
    "Arquitectura Android moderna con los patrones estándar de la industria.",
    "Diseño de lógica de negocio testable e independiente de la interfaz.",
    "Planificación de producto: freemium, sincronización y escalabilidad desde el principio.",
  ],

  relatedServices: [
    { href: "/servicios/desarrollo-apps-android", label: "Desarrollo de apps Android" },
  ],
  relatedProjects: [
    { slug: "oposicontrol", title: "OposiControl", desc: "App de estudio para opositores con KMP" },
  ],
};

// ─────────────────────────────────────────────
// RequenaDesk
// ─────────────────────────────────────────────
export const requenadesk: CaseStudyData = {
  slug:          "requenadesk",
  canonicalId:   "requenadesk-crm-interno",
  seoTitle:      "RequenaDesk: CRM a medida para gestión interna de clientes",
  seoDescription:
    "CRM propio con Kotlin, Ktor y PostgreSQL para gestionar clientes, tickets, estados y reportes. Sin licencias genéricas. Panel desktop con Compose y backend REST en VPS.",
  h1:            "RequenaDesk — CRM a medida para gestión interna de clientes",
  summary:
    "Sistema de gestión interno diseñado para reemplazar el Excel-WhatsApp-notas con el que operan muchos negocios pequeños. Panel desktop con Kotlin y Compose Desktop, backend REST con Ktor y base de datos PostgreSQL desplegada en VPS propio. Roles, estados, tickets y reportes SQL.",
  projectType:   "Sistema propio / CRM",
  statusLabel:   "Sistema propio",
  visibility:    "public",
  mockupType:    "dashboard",

  metrics: [
    { label: "Backend",      value: "Ktor + REST" },
    { label: "Base de datos", value: "PostgreSQL" },
    { label: "Panel",        value: "Compose Desktop" },
    { label: "Despliegue",   value: "VPS + Caddy" },
  ],

  context:
    "La mayoría de negocios pequeños con 2-10 personas gestionan sus clientes en un Excel compartido, con incidencias en WhatsApp y tareas en notas de voz. El problema no es la herramienta, sino la ausencia de una fuente única de verdad: cada persona tiene su versión, nadie sabe el estado real de cada cliente y los reportes son manuales. RequenaDesk nace para resolver ese problema con un sistema que se adapta al negocio, no al revés.",

  problem: {
    intro: "El patrón se repite en casi todos los negocios pequeños que aún no han digitalizado su operación:",
    bullets: [
      "Los clientes viven en WhatsApp, Excel y la cabeza de alguien. Si esa persona falta, todo para.",
      "No hay trazabilidad: nadie sabe quién habló con quién, cuándo, ni qué quedó pendiente.",
      "Los CRMs genéricos (HubSpot, Notion) tienen demasiadas funciones que no se usan y les falta la específica que sí necesitan.",
      "Pagar licencias mensuales por un SaaS que el equipo no adopta es dinero perdido.",
    ],
  },

  objectives: [
    "Centralizar clientes, estados y tareas en una sola herramienta.",
    "Definir flujos de trabajo con estados configurables por tipo de cliente.",
    "Asignar roles de usuario con permisos diferenciados.",
    "Generar reportes SQL útiles para la operación diaria.",
    "Desplegar en un servidor propio sin dependencias de SaaS externos.",
  ],

  solution: [
    "El sistema se divide en dos piezas: un backend REST en Ktor que expone endpoints para todas las operaciones (clientes, tickets, usuarios, reportes) y un panel desktop en Compose Desktop que consume esa API. La separación permite que en el futuro se añada una versión web o mobile sin cambiar el backend.",
    "La base de datos PostgreSQL tiene un esquema normalizado con tablas para clientes, estados, tickets, asignaciones y logs de actividad. Los reportes se ejecutan como queries SQL parametrizadas desde el backend, lo que permite añadir nuevos informes sin modificar el panel.",
    "Caddy actúa como reverse proxy en el VPS, gestionando HTTPS automático con Let's Encrypt. El despliegue es un JAR ejecutable de Ktor con systemd para reinicio automático tras caídas o reinicios del servidor.",
  ],

  architecture: [
    { layer: "Panel desktop",  tech: "Kotlin · Compose Desktop",     desc: "Interfaz de usuario nativa, sin Electron ni frameworks web." },
    { layer: "API REST",       tech: "Ktor · JSON",                   desc: "Endpoints tipados para todas las operaciones CRUD y reportes." },
    { layer: "Auth",           tech: "JWT",                           desc: "Tokens con expiración, roles embebidos y middleware de autorización." },
    { layer: "Base de datos",  tech: "PostgreSQL · Exposed ORM",      desc: "Esquema normalizado con migraciones versionadas." },
    { layer: "Reportes",       tech: "SQL parametrizado",             desc: "Queries directas a PostgreSQL, exportables a CSV." },
    { layer: "Servidor",       tech: "VPS · Caddy · systemd",         desc: "HTTPS automático, reverse proxy y reinicio supervisado." },
  ],

  features: [
    { title: "Módulo de clientes",        desc: "Ficha completa con datos de contacto, historial de interacciones y documentos adjuntos." },
    { title: "Sistema de estados",         desc: "Pipeline configurable: cada tipo de cliente tiene sus propios estados y transiciones." },
    { title: "Tickets e incidencias",      desc: "Registro de tareas y problemas con prioridad, asignación y fecha de resolución." },
    { title: "Roles y permisos",           desc: "Admin, operador y solo lectura. El backend valida el rol en cada request." },
    { title: "Dashboard operativo",        desc: "Vista de resumen con clientes activos, tickets abiertos y actividad reciente." },
    { title: "Reportes SQL",               desc: "Informes de actividad, carga de trabajo por usuario y estado de cartera." },
    { title: "Backups automáticos",        desc: "pg_dump programado via cron con retención de 30 días." },
  ],

  stack: [
    { name: "Kotlin",           category: "Lenguaje",      purpose: "Compartido entre backend y desktop." },
    { name: "Ktor",             category: "Backend",       purpose: "Framework REST ligero y tipado." },
    { name: "Compose Desktop",  category: "UI",            purpose: "Panel nativo sin dependencias web." },
    { name: "PostgreSQL",       category: "Base de datos", purpose: "Relacional, robusto y con SQL potente para reportes." },
    { name: "Exposed ORM",      category: "ORM",           purpose: "DSL Kotlin sobre JDBC, sin magia de reflexión." },
    { name: "JWT",              category: "Auth",          purpose: "Tokens stateless con roles embebidos." },
    { name: "Caddy",            category: "Servidor",      purpose: "HTTPS automático y reverse proxy con configuración mínima." },
    { name: "VPS",              category: "Infraestructura", purpose: "Control total sobre el servidor y los datos." },
    { name: "systemd",          category: "Proceso",       purpose: "Reinicio automático del servicio Ktor." },
  ],

  decisions: [
    { title: "Compose Desktop sobre Electron", why: "Electron habría añadido un runtime de Node + Chromium (~150 MB). Compose Desktop genera un ejecutable nativo, más rápido y sin dependencias de npm." },
    { title: "Ktor sobre Spring Boot",         why: "Spring Boot es correcto pero excesivo para un backend con ~15 endpoints. Ktor tiene menos magia, startup más rápido y el mismo lenguaje que el panel." },
    { title: "PostgreSQL sobre SQLite",        why: "SQLite no escala bien con accesos concurrentes desde múltiples máquinas. PostgreSQL soporta conexiones simultáneas, transacciones ACID y queries analíticas." },
    { title: "VPS propio sobre Heroku/Railway",why: "El cliente tenía requisito de datos en servidor propio por confidencialidad. VPS da control total sobre backups, red y configuración de firewall." },
  ],

  result: {
    summary: "Sistema operativo en producción, reemplazando Excel y WhatsApp en la gestión diaria de clientes.",
    points: [
      "Gestión centralizada de clientes con trazabilidad completa de interacciones.",
      "Reportes SQL que antes requerían 2 horas de trabajo manual en Excel.",
      "Despliegue estable en VPS con HTTPS y backups automáticos.",
      "Arquitectura separada lista para añadir versión web sin reescribir el backend.",
    ],
  },

  demonstrates: [
    "Diseño de sistemas full-stack con separación clara de capas.",
    "Capacidad de construir tanto el backend como el panel de administración.",
    "Conocimiento real de PostgreSQL: esquema, queries, índices y backups.",
    "Criterio para elegir tecnología según el problema, no por moda.",
  ],

  relatedServices: [
    { href: "/servicios/crm-a-medida", label: "CRM a medida para empresas" },
    { href: "/servicios/automatizaciones-pymes", label: "Automatización de procesos" },
  ],
  relatedProjects: [
    { slug: "vinotico", title: "Vinótico", desc: "Sistema de suscripciones y área privada" },
  ],
};

// ─────────────────────────────────────────────
// Vinótico
// ─────────────────────────────────────────────
export const vinotico: CaseStudyData = {
  slug:          "vinotico",
  canonicalId:   "vinotico-area-privada",
  seoTitle:      "Vinótico: área privada y suscripciones con WooCommerce",
  seoDescription:
    "Sistema de membresía y área privada para club de vino: WooCommerce Subscriptions, control de acceso por roles y lógica de negocio personalizada con PHP.",
  h1:            "Vinótico — área privada y suscripciones con WooCommerce",
  summary:
    "Sistema de membresía para un club de suscripción: gestión de socios, área privada con beneficios exclusivos, control de acceso por plan de suscripción y lógica de negocio personalizada sobre WordPress y WooCommerce. Proyecto anonimizado.",
  projectType:   "Web + sistema de negocio",
  statusLabel:   "Caso anonimizado",
  visibility:    "anonymous",
  mockupType:    "subscription",

  metrics: [
    { label: "Plataforma",   value: "WordPress + WooCommerce" },
    { label: "Tipo",         value: "Club de suscripción" },
    { label: "Estado",       value: "Publicado" },
    { label: "Visibilidad",  value: "Anonimizado" },
  ],

  context:
    "Un club de vino por suscripción necesitaba digitalizar la gestión de socios: hasta entonces, los beneficios se enviaban manualmente, el control de acceso no existía y la renovación dependía de recordatorios por email sin automatizar. La solución debía construirse sobre la plataforma existente del cliente (WordPress) sin una migración completa.",

  problem: {
    intro: "El negocio tenía el producto validado pero la operación era completamente manual:",
    bullets: [
      "Los beneficios para socios se enviaban a mano, sin un sistema de control de acceso.",
      "No había área de socio: cada consulta llegaba por email o WhatsApp.",
      "Las renovaciones y cancelaciones dependían de un proceso manual sin trazabilidad.",
      "No existía diferenciación visible entre usuarios registrados y socios activos.",
    ],
  },

  objectives: [
    "Automatizar la gestión de suscripciones y renovaciones.",
    "Crear un área privada accesible solo a socios activos.",
    "Diferenciar el acceso por plan de suscripción.",
    "Eliminar el trabajo manual de gestión de beneficios.",
    "Mejorar la retención con una experiencia de socio más clara.",
  ],

  solution: [
    "La base del sistema es WooCommerce Subscriptions, que gestiona los cobros recurrentes, las renovaciones automáticas y las cancelaciones. Cada plan de suscripción corresponde a un rol de usuario en WordPress, lo que permite controlar el acceso a contenidos y páginas por nivel de membresía.",
    "El área privada de socio se construye como una sección de WordPress restringida por rol. Cada beneficio (selecciones mensuales, descuentos, contenido exclusivo) se presenta en una interfaz personalizada que el socio ve al iniciar sesión. Los no socios ven una página de captación con la propuesta de valor.",
    "La lógica de negocio personalizada (cambios de plan, comunicaciones automáticas, acceso a beneficios anteriores) se implementa con snippets PHP y hooks de WooCommerce, evitando plugins adicionales que habrían añadido conflictos de mantenimiento.",
  ],

  architecture: [
    { layer: "Frontend",       tech: "WordPress · Tema personalizado",   desc: "Páginas públicas, área de socio y flujo de registro." },
    { layer: "E-commerce",     tech: "WooCommerce",                      desc: "Carrito, checkout y gestión de pedidos." },
    { layer: "Suscripciones",  tech: "WooCommerce Subscriptions",        desc: "Cobro recurrente, renovaciones y cancelaciones automáticas." },
    { layer: "Control de acceso", tech: "Roles de usuario WordPress",    desc: "Cada plan asigna un rol; el contenido filtra por rol." },
    { layer: "Lógica custom",  tech: "PHP · Hooks WordPress",            desc: "Comportamientos específicos del negocio: cambios de plan, beneficios." },
    { layer: "Email",          tech: "WooCommerce Emails",               desc: "Notificaciones de renovación, cancelación y bienvenida." },
  ],

  features: [
    { title: "Suscripciones recurrentes",  desc: "Planes mensuales y anuales con cobro automático y gestión de tarjetas." },
    { title: "Área privada de socio",      desc: "Dashboard exclusivo con beneficios activos, historial y próximas entregas." },
    { title: "Control de acceso por plan", desc: "Cada nivel de membresía desbloquea contenido y beneficios diferentes." },
    { title: "Flujo de renovación",        desc: "Renovación automática con notificaciones previas y opción de pausa." },
    { title: "Gestión de beneficios",      desc: "Selecciones mensuales, descuentos y contenido exclusivo por plan." },
    { title: "UX de captación",            desc: "Página de propuesta de valor para no socios con CTA y comparativa de planes." },
  ],

  stack: [
    { name: "WordPress",               category: "CMS",           purpose: "Plataforma base del proyecto." },
    { name: "WooCommerce",             category: "E-commerce",    purpose: "Gestión de productos, pedidos y clientes." },
    { name: "WooCommerce Subscriptions", category: "Suscripciones", purpose: "Cobro recurrente y gestión de planes." },
    { name: "PHP",                     category: "Backend",       purpose: "Lógica de negocio personalizada via hooks." },
    { name: "Roles WordPress",         category: "Auth",          purpose: "Control de acceso por nivel de membresía." },
    { name: "UX/UI",                   category: "Diseño",        purpose: "Arquitectura de la experiencia de socio." },
  ],

  decisions: [
    { title: "WooCommerce Subscriptions sobre solución custom", why: "Una suscripción desde cero habría requerido integración de pasarela de pago, lógica de renovación y gestión de fallos. WooCommerce Subscriptions resuelve todo eso y el cliente ya conocía WooCommerce." },
    { title: "Roles WordPress para control de acceso",          why: "Solución nativa sin plugins adicionales. Cada plan asigna un rol, los shortcodes y condicionales nativos filtran el contenido. Menos dependencias, menos actualizaciones que gestionar." },
    { title: "PHP snippets sobre plugins adicionales",          why: "Cada plugin añadido es un vector de conflicto con actualizaciones futuras. La lógica de negocio específica va en snippets controlados, no en plugins de terceros." },
    { title: "Mantener WordPress sobre migrar a otra plataforma", why: "El cliente tenía contenido existente y equipo familiarizado con WordPress. Migrar habría triplicado el tiempo y el riesgo sin beneficio proporcional." },
  ],

  result: {
    summary: "Sistema de membresía publicado y operativo, eliminando el trabajo manual de gestión de socios.",
    points: [
      "Renovaciones automáticas que antes requerían seguimiento manual.",
      "Área privada de socio con acceso controlado por plan activo.",
      "Diferenciación visible entre usuarios registrados y socios, mejorando conversión.",
      "Lógica de negocio personalizada sin plugins adicionales que mantener.",
    ],
  },

  demonstrates: [
    "Capacidad de adaptar una plataforma existente a necesidades de negocio específicas.",
    "Conocimiento de WooCommerce, suscripciones y control de acceso en WordPress.",
    "Criterio para no sobreingeniería: usar la solución correcta para el contexto dado.",
    "Enfoque en el resultado de negocio, no solo en la solución técnica.",
  ],

  relatedServices: [
    { href: "/servicios/diseno-web-empresas", label: "Diseño web para empresas" },
    { href: "/servicios/automatizaciones-pymes", label: "Automatización de procesos" },
  ],
  relatedProjects: [
    { slug: "solsconfort", title: "Solsconfort", desc: "Web corporativa para empresa técnica" },
  ],
};

// ─────────────────────────────────────────────
// Solsconfort
// ─────────────────────────────────────────────
export const solsconfort: CaseStudyData = {
  slug:          "solsconfort",
  canonicalId:   "solsconfort-web-premium",
  seoTitle:      "Solsconfort: web profesional para empresa técnica",
  seoDescription:
    "Web corporativa para empresa de servicios técnicos: estructura SEO, diseño responsive, rendimiento optimizado y formulario de contacto. WordPress y Elementor.",
  h1:            "Solsconfort — web profesional para empresa técnica",
  summary:
    "Web corporativa diseñada para que una empresa de servicios técnicos explique con claridad qué hace, genere confianza desde la primera visita y convierta visitantes en contactos. Estructura SEO técnico, diseño responsive, rendimiento optimizado y formulario de captación.",
  projectType:   "Web corporativa",
  statusLabel:   "Caso documentado",
  visibility:    "public",
  mockupType:    "browser",

  metrics: [
    { label: "Plataforma",  value: "WordPress" },
    { label: "Rendimiento", value: "Core Web Vitals OK" },
    { label: "SEO",         value: "Estructura técnica" },
    { label: "Estado",      value: "Publicada" },
  ],

  context:
    "Una empresa de instalaciones técnicas (climatización, eficiencia energética) con años de experiencia y clientes reales, pero sin presencia digital clara. Su web anterior era genérica, lenta y no explicaba bien los servicios. Los clientes potenciales llegaban por recomendación directa, sin canal digital activo. Necesitaban una web que funcionara como herramienta de venta, no como tarjeta de visita.",

  problem: {
    intro: "La web existente tenía tres problemas que bloqueaban la captación digital:",
    bullets: [
      "No explicaba con claridad qué servicios ofrecía ni para qué cliente.",
      "Cargaba lento y no estaba adaptada a móvil, perdiendo visitas de calidad.",
      "No tenía formulario de contacto funcional ni llamada a la acción clara.",
      "Invisible en Google para las búsquedas de servicios en su área.",
    ],
  },

  objectives: [
    "Comunicar claramente los servicios y la propuesta de valor de la empresa.",
    "Generar confianza visual desde la primera visita.",
    "Tener un formulario de contacto que funcione y llegue.",
    "Optimizar el rendimiento para pasar los Core Web Vitals.",
    "Construir una estructura SEO técnica correcta desde el inicio.",
  ],

  solution: [
    "La web se estructura en bloques narrativos con jerarquía clara: quiénes son, qué hacen, por qué elegirlos y cómo contactarlos. Cada sección tiene un objetivo comercial: no son solo bloques de texto, son argumentos de venta visualmente presentados.",
    "La estructura SEO incluye metadata correcta por página, jerarquía de headings (H1 → H2 → H3), URLs descriptivas, imágenes con alt text y schema markup básico. No es SEO agresivo, es una base técnica correcta que permite posicionarse en el tiempo.",
    "El rendimiento se optimiza con imágenes comprimidas y en formato WebP, carga diferida de recursos secundarios y eliminación de plugins de WordPress innecesarios. El resultado es un LCP y CLS dentro de los rangos aceptables de Core Web Vitals.",
  ],

  architecture: [
    { layer: "CMS",          tech: "WordPress",               desc: "Gestión de contenido para que el cliente pueda actualizar sin ayuda." },
    { layer: "Constructor",  tech: "Elementor",               desc: "Diseño visual de secciones con componentes reutilizables." },
    { layer: "Formularios",  tech: "Contact Form 7",          desc: "Formulario de contacto con validación y envío a email." },
    { layer: "SEO",          tech: "Yoast SEO",               desc: "Metadata, sitemap, schema y control de indexación." },
    { layer: "Rendimiento",  tech: "WP Rocket · WebP",        desc: "Caché, lazy load y compresión de imágenes." },
    { layer: "Hosting",      tech: "Servidor WordPress",      desc: "Configuración de PHP y MySQL optimizada." },
  ],

  features: [
    { title: "Presentación de servicios",   desc: "Secciones visuales por tipo de servicio con descripción clara del beneficio para el cliente." },
    { title: "Sección de empresa",          desc: "Historia, valores y equipo para generar confianza antes del contacto." },
    { title: "Formulario de contacto",      desc: "Formulario validado con campos específicos para calificar la consulta." },
    { title: "Galería de trabajos",         desc: "Muestra de proyectos realizados con contexto del servicio prestado." },
    { title: "Optimización de velocidad",   desc: "Core Web Vitals en rango verde: LCP, FID y CLS dentro de límites aceptables." },
    { title: "SEO técnico base",            desc: "Estructura de headings, metadata, alt texts, sitemap y schema markup." },
    { title: "Responsive completo",         desc: "Adaptación correcta en móvil, tablet y desktop." },
  ],

  stack: [
    { name: "WordPress",      category: "CMS",          purpose: "Base del proyecto, gestionable por el cliente." },
    { name: "Elementor",      category: "Constructor",  purpose: "Diseño visual sin código para el cliente." },
    { name: "Yoast SEO",      category: "SEO",          purpose: "Metadata, sitemap y schema." },
    { name: "WP Rocket",      category: "Rendimiento",  purpose: "Caché y optimización de recursos." },
    { name: "Contact Form 7", category: "Formularios",  purpose: "Formulario de contacto con validación." },
    { name: "HTML / CSS",     category: "Personalización", purpose: "Ajustes específicos fuera del builder." },
    { name: "WebP",           category: "Imágenes",     purpose: "Formato comprimido para mejor rendimiento." },
  ],

  decisions: [
    { title: "WordPress sobre Next.js",         why: "El cliente necesita actualizar el contenido sin depender del desarrollador. WordPress con Elementor es la solución correcta para este perfil de cliente y este tipo de web." },
    { title: "Elementor sobre tema personalizado", why: "Elementor permite un desarrollo más rápido para este tipo de web informativa y deja al cliente con capacidad de hacer cambios sencillos de forma autónoma." },
    { title: "Contenido antes que diseño",      why: "La estructura de la web se definió primero como narrativa comercial (qué problema resuelvo, para quién, por qué yo) y después se diseñaron los bloques. El diseño sirve al mensaje, no al revés." },
    { title: "SEO técnico, no de contenido",    why: "Para una empresa de servicios locales, el SEO prioritario es tener una base técnica correcta y presencia en Google My Business, no un blog de contenido. Se hace lo que aporta valor real en este contexto." },
  ],

  result: {
    summary: "Web publicada con estructura clara, rendimiento aceptable y canal de contacto funcional.",
    points: [
      "Presentación de servicios clara y visualmente coherente.",
      "Formulario de contacto funcional que llega a la bandeja del cliente.",
      "Core Web Vitals en rango verde en mobile y desktop.",
      "Base SEO técnica correcta para posicionamiento futuro.",
    ],
  },

  demonstrates: [
    "Capacidad de construir webs que tienen un objetivo comercial, no solo un diseño bonito.",
    "Conocimiento de WordPress, optimización de rendimiento y SEO técnico básico.",
    "Enfoque en el cliente: solución apropiada al perfil, no la tecnología más avanzada.",
    "Criterio para no sobreingeniería en proyectos donde la solución sencilla es la correcta.",
  ],

  relatedServices: [
    { href: "/servicios/diseno-web-empresas", label: "Diseño web para empresas" },
  ],
  relatedProjects: [
    { slug: "vinotico", title: "Vinótico", desc: "Sistema de suscripciones con WordPress" },
  ],
};

// ─────────────────────────────────────────────
// OposiControl
// ─────────────────────────────────────────────
export const oposicontrol: CaseStudyData = {
  slug:          "oposicontrol",
  canonicalId:   "oposicontrol-study-app",
  seoTitle:      "OposiControl: app de estudio para oposiciones con Kotlin Multiplatform",
  seoDescription:
    "App mobile para preparar oposiciones: módulos, simulacros, estadísticas y progreso con Kotlin Multiplatform, Supabase y Ktor. Arquitectura multiplataforma desde el inicio.",
  h1:            "OposiControl — app de estudio para oposiciones",
  summary:
    "Aplicación mobile para opositores que convierte la preparación dispersa (PDFs, calendarios, notas) en un sistema de estudio medible. Kotlin Multiplatform comparte la lógica entre Android e iOS. Supabase gestiona la autenticación y la base de datos en la nube. Demo técnica con arquitectura de producción.",
  projectType:   "App mobile de productividad",
  statusLabel:   "Demo técnica",
  visibility:    "public",
  mockupType:    "mobile",

  metrics: [
    { label: "Arquitectura",  value: "KMP (Android + iOS)" },
    { label: "Backend",       value: "Supabase + Ktor" },
    { label: "Estado",        value: "Demo técnica" },
    { label: "Auth",          value: "Supabase Auth" },
  ],

  context:
    "La preparación de oposiciones en España es un proceso largo (1-4 años) y muy desestructurado. Los opositores saltan entre PDFs del temario, apuntes físicos, simulacros en papel y calendarios de estudio en Notion o Excel. No existe una herramienta específica que integre el temario, el progreso, los simulacros y la planificación en una sola app mobile nativa. OposiControl es la prueba de concepto técnica de esa solución.",

  problem: {
    intro: "La preparación de oposiciones tiene un problema de fragmentación que afecta a la eficiencia del estudio:",
    bullets: [
      "El temario, los apuntes y los simulacros viven en herramientas diferentes sin conexión entre sí.",
      "No hay visibilidad del progreso real: el opositor no sabe qué domina y qué necesita repasar.",
      "Los simulacros son en papel o en PDFs sueltos, sin análisis de resultados ni histórico.",
      "La planificación del estudio es manual y se abandona a las dos semanas.",
    ],
  },

  objectives: [
    "Organizar el temario por módulos con seguimiento de progreso por tema.",
    "Implementar simulacros cronometrados con corrección automática y análisis de resultados.",
    "Sincronizar el progreso en la nube para acceder desde cualquier dispositivo.",
    "Diseñar la arquitectura KMP para que la lógica funcione en Android e iOS.",
    "Preparar el backend para escalar a usuarios reales con autenticación y datos propios.",
  ],

  solution: [
    "La arquitectura KMP separa la lógica de negocio (shared module) de la UI nativa. El shared module contiene los repositorios, los use cases y los modelos de dominio. La UI Android usa Jetpack Compose, y la iOS usaría SwiftUI consumiendo el mismo shared module. Esto evita duplicar la lógica cuando se añada iOS.",
    "Supabase actúa como backend sin servidor: gestiona la autenticación (email/password y OAuth), almacena el progreso del opositor en PostgreSQL y sincroniza en tiempo real cuando se completa un módulo o un simulacro. El cliente KMP se comunica con Supabase via REST.",
    "Ktor complementa Supabase para la lógica de negocio que no se puede hacer directamente en el cliente: generación de simulacros aleatorios según el temario, cálculo de estadísticas de rendimiento por módulo y recomendaciones de repaso basadas en el historial.",
  ],

  architecture: [
    { layer: "UI Android",     tech: "Jetpack Compose",              desc: "Pantallas nativas Android con Material 3." },
    { layer: "Shared module",  tech: "Kotlin Multiplatform",         desc: "Use cases, modelos y repositorios compartidos entre plataformas." },
    { layer: "Auth + DB",      tech: "Supabase",                     desc: "Autenticación, base de datos PostgreSQL y sincronización en tiempo real." },
    { layer: "API custom",     tech: "Ktor",                         desc: "Lógica de simulacros, estadísticas y recomendaciones." },
    { layer: "Cliente HTTP",   tech: "Ktor Client (KMP)",            desc: "Cliente HTTP multiplataforma para Supabase y el API propio." },
    { layer: "DI",             tech: "Koin",                         desc: "Inyección de dependencias compartida entre módulos." },
  ],

  features: [
    { title: "Módulos de temario",          desc: "Estructura jerárquica del temario con progreso por tema y estado (pendiente/en progreso/dominado)." },
    { title: "Simulacros cronometrados",    desc: "Exámenes de práctica con tiempo límite, corrección automática y revisión de respuestas." },
    { title: "Estadísticas de rendimiento", desc: "Porcentaje de aciertos por módulo, evolución temporal y temas con más fallos." },
    { title: "Sincronización en la nube",  desc: "Progreso sincronizado con Supabase, accesible desde cualquier dispositivo." },
    { title: "Planificación de estudio",   desc: "Calendario de sesiones con horas asignadas por módulo según la fecha del examen." },
    { title: "Autenticación",              desc: "Registro y login con Supabase Auth. Datos privados por usuario." },
  ],

  stack: [
    { name: "Kotlin Multiplatform", category: "Arquitectura",   purpose: "Lógica compartida entre Android e iOS." },
    { name: "Jetpack Compose",      category: "UI Android",     purpose: "Pantallas nativas Android." },
    { name: "Supabase",             category: "Backend",        purpose: "Auth, PostgreSQL y realtime." },
    { name: "Ktor (server)",        category: "API",            purpose: "Lógica de simulacros y estadísticas." },
    { name: "Ktor Client",          category: "HTTP",           purpose: "Cliente HTTP multiplataforma." },
    { name: "Koin",                 category: "DI",             purpose: "Inyección de dependencias KMP-compatible." },
    { name: "PostgreSQL",           category: "Base de datos",  purpose: "Almacenamiento de progreso y temario (via Supabase)." },
    { name: "Coroutines / Flow",    category: "Concurrencia",   purpose: "Estado reactivo y operaciones asíncronas." },
  ],

  decisions: [
    { title: "KMP desde el inicio",             why: "Duplicar la lógica para iOS después de construir Android habría requerido reescribir todo. Empezar con KMP añade complejidad inicial pero elimina la deuda técnica futura." },
    { title: "Supabase sobre Firebase",         why: "Supabase usa PostgreSQL estándar (queries SQL completas, joins, funciones) en lugar del modelo NoSQL de Firestore. Para datos estructurados de temario y progreso, SQL es claramente mejor." },
    { title: "Ktor para lógica server-side",   why: "Supabase Edge Functions tienen limitaciones para lógica compleja (generación de simulacros, algoritmos de repetición espaciada). Ktor en servidor propio da control total." },
    { title: "Koin sobre Hilt",                why: "Hilt es solo Android. Koin es multiplataforma y funciona tanto en el shared module como en cada plataforma. No hay penalización de rendimiento en el contexto de esta app." },
  ],

  result: {
    summary: "Demo técnica con arquitectura KMP completa, autenticación funcional y módulos principales implementados.",
    points: [
      "Shared module con lógica de negocio funcional y testable en JVM.",
      "Autenticación con Supabase operativa en Android.",
      "Módulo de temario con seguimiento de progreso sincronizado en la nube.",
      "Arquitectura lista para añadir iOS sin reescribir la lógica.",
    ],
  },

  demonstrates: [
    "Conocimiento real de Kotlin Multiplatform en un proyecto con backend real, no solo tutoriales.",
    "Capacidad de diseñar una arquitectura multiplataforma pensando en la escalabilidad futura.",
    "Integración de Supabase como backend completo: auth, base de datos y realtime.",
    "Criterio para elegir KMP cuando el caso lo justifica (producto multiplataforma desde el inicio).",
  ],

  relatedServices: [
    { href: "/servicios/desarrollo-apps-android", label: "Desarrollo de apps Android" },
  ],
  relatedProjects: [
    { slug: "edutrack", title: "EduTrack", desc: "App Android para seguimiento académico" },
  ],
};

export const caseStudies: Record<string, CaseStudyData> = {
  edutrack:    edutrack,
  requenadesk: requenadesk,
  vinotico:    vinotico,
  solsconfort: solsconfort,
  oposicontrol: oposicontrol,
};
