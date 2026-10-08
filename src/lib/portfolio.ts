/**
 * Canonical project catalogue for the studio site.
 *
 * Every fact here is traced to docs/source-of-truth/projects/*.md. Nothing in
 * this file may claim a launch, users, revenue, a client's name or a store
 * release: statuses are limited to the two ladders below.
 */

import type { ContactIntent } from "@/lib/leads/model";

export type ProjectCategoryId =
  | "client-work"
  | "product"
  | "custom-software"
  | "case-study"
  | "academic";

/** Status of a piece of scope. The only three values a project page may show. */
export type WorkStatus = "implemented" | "in-development" | "planned";

/** Ladder for our own products. */
export type ProductStage = "vision" | "prototype" | "in-development" | "released";

export const workStatusLabel: Record<WorkStatus, string> = {
  implemented: "Implementado",
  "in-development": "En desarrollo",
  planned: "Previsto",
};

export const productStages: Array<{ id: ProductStage; label: string }> = [
  { id: "vision", label: "Visión" },
  { id: "prototype", label: "Prototipo" },
  { id: "in-development", label: "En desarrollo" },
  { id: "released", label: "Publicado" },
];

export type ProjectCategory = {
  id: ProjectCategoryId;
  /** Two-digit ordinal used in section headers ("01 — Trabajo para clientes"). */
  ordinal: string;
  label: string;
  descriptor: string;
};

/** Fixed proof order: client work first, academic last. */
export const projectCategories: ProjectCategory[] = [
  {
    id: "client-work",
    ordinal: "01",
    label: "Trabajo para clientes",
    descriptor: "Productos que construimos para terceros, hoy en desarrollo.",
  },
  {
    id: "product",
    ordinal: "02",
    label: "Nuestros productos",
    descriptor: "Software que ideamos, construimos y usamos nosotros.",
  },
  {
    id: "custom-software",
    ordinal: "03",
    label: "Software de gestión a medida",
    descriptor: "Backoffice y lógica de negocio hechos para una operación concreta.",
  },
  {
    id: "case-study",
    ordinal: "04",
    label: "Caso de estudio",
    descriptor: "Cómo pensamos, auditamos y endurecemos un producto.",
  },
  {
    id: "academic",
    ordinal: "05",
    label: "Académico",
    descriptor: "De dónde venimos, contado sin maquillaje.",
  },
];

export type ScopeItem = {
  label: string;
  /** Where it lives: "Android", "iOS", "Backend", "Común (KMP)"… */
  area: string;
  status: WorkStatus;
};

export type StorySection = {
  /** Mono eyebrow, e.g. "El problema del cliente". */
  eyebrow: string;
  title: string;
  body: string[];
};

export type DeliveryPhase = {
  label: string;
  status: WorkStatus;
};

export type PortfolioProject = {
  slug: string;
  name: string;
  category: ProjectCategoryId;
  /** One line under the name: what kind of thing this is. */
  descriptor: string;
  /** Who owns it and what our role is. Never names a client. */
  relation: string;
  /** Overall status shown next to the name everywhere. */
  status: WorkStatus;
  /** Only for our own products. */
  stage?: ProductStage;
  /** Short qualifier appended to the status ("objetivo: diciembre de 2026"). */
  statusNote?: string;
  pitch: string;
  audience: string;
  problem: string;
  solution: string;
  /** Verifiable proof points, most convincing first. */
  proof: string[];
  platforms: string[];
  stack: string[];
  scope: ScopeItem[];
  /** Only for client work: the delivery track. */
  delivery?: DeliveryPhase[];
  story: StorySection[];
  /** Slugs of related projects (e.g. OposiBot ↔ OposiControl). */
  related?: string[];
  cta: { label: string; intent: ContactIntent };
  /** Existing commissioned cover art, when one is still valid for this project. */
  cover?: { src: string; alt: string };
};

export const portfolioProjects: PortfolioProject[] = [
  // ───────────────────────── 01 · Client work ─────────────────────────
  {
    slug: "caravantruck-way",
    name: "CaravanTruck Way",
    category: "client-work",
    descriptor: "Navegación GPS para vehículos grandes",
    relation: "Proyecto para cliente. Diseño y desarrollo completos a cargo del estudio.",
    status: "in-development",
    statusNote: "objetivo: diciembre de 2026",
    pitch:
      "Navegación GPS offline para autocaravanas, camiones y furgonetas, con rutas calculadas según el perfil del vehículo y experiencia nativa en Android Auto y Apple CarPlay.",
    audience: "Conductores de autocaravanas, camiones y furgonetas en España y Portugal.",
    problem:
      "Los navegadores pensados para turismos mandan a un vehículo grande por calles, túneles y puentes por los que no cabe o no puede circular: altura, anchura, peso y carga por eje no entran en el cálculo.",
    solution:
      "Una app de navegación que parte del vehículo: su perfil decide la ruta, los mapas funcionan sin cobertura y la conducción se sigue desde la pantalla del coche.",
    proof: [
      "Cada versión candidata se certifica en dispositivo real antes de llegar al cliente.",
      "Las pruebas en carretera del cliente mandan sobre las de laboratorio: un fallo en ruta reabre la versión.",
      "Si el mapa no tiene el dato de una restricción, la app no inventa un aviso: lo trata como dato ausente.",
    ],
    platforms: ["Android", "iOS", "Android Auto", "Apple CarPlay", "Backend"],
    stack: [
      "Kotlin Multiplatform",
      "Compose Multiplatform",
      "MapLibre",
      "OpenStreetMap",
      "Valhalla",
      "Ktor",
      "PostgreSQL / PostGIS",
      "JWT",
      "Sentry",
    ],
    scope: [
      { label: "Dominio compartido y perfil de vehículo", area: "Común (KMP)", status: "implemented" },
      { label: "Mapas offline y cálculo de rutas", area: "Android", status: "implemented" },
      { label: "Backend, autenticación y geodatos", area: "Backend", status: "implemented" },
      { label: "Suites de test en host y en dispositivo", area: "Calidad", status: "implemented" },
      { label: "Rutas por carga por eje", area: "Común (KMP)", status: "in-development" },
      { label: "Endurecimiento tras pruebas en carretera", area: "Android", status: "in-development" },
      { label: "Certificación en iOS y CarPlay", area: "iOS", status: "in-development" },
      { label: "Publicación en tiendas", area: "Android · iOS", status: "planned" },
    ],
    delivery: [
      { label: "Arquitectura y alcance", status: "implemented" },
      { label: "Mapas y rutas", status: "implemented" },
      { label: "Backend", status: "implemented" },
      { label: "Android en carretera", status: "in-development" },
      { label: "iOS y CarPlay", status: "in-development" },
      { label: "Entrega", status: "planned" },
    ],
    story: [
      {
        eyebrow: "El problema del cliente",
        title: "Un GPS de turismo no sabe lo que mide un camión.",
        body: [
          "Quien conduce una autocaravana o un camión planifica dos veces: una con el navegador y otra comprobando a mano que la ruta es practicable. Un túnel bajo o un puente con límite de peso no son una molestia, son un riesgo.",
        ],
      },
      {
        eyebrow: "El reto",
        title: "Rutas fiables, sin cobertura y en la pantalla del coche.",
        body: [
          "El producto tiene que calcular rutas con restricciones reales de vehículo, seguir funcionando sin conexión y ofrecer una experiencia de conducción nativa en Android Auto y CarPlay, que imponen sus propias reglas de interfaz.",
        ],
      },
      {
        eyebrow: "El producto",
        title: "El vehículo decide la ruta.",
        body: [
          "El conductor define su vehículo una vez. A partir de ahí el perfil condiciona cada cálculo, los mapas se descargan por paquetes para usarse sin red y la navegación continúa en la pantalla del coche.",
        ],
      },
      {
        eyebrow: "Nuestro trabajo",
        title: "Del alcance a la versión que prueba el cliente.",
        body: [
          "Llevamos el proyecto completo: definición de alcance y arquitectura, diseño de la experiencia móvil y de coche, desarrollo de la app y del backend, infraestructura y pruebas en dispositivo.",
          "Cada versión que recibe el cliente sale de un ciclo de certificación en un dispositivo físico, y sus pruebas en carretera vuelven al equipo como correcciones priorizadas.",
        ],
      },
      {
        eyebrow: "Ingeniería",
        title: "Un núcleo compartido y capas nativas donde hacen falta.",
        body: [
          "El dominio, el estado y los datos viven en un núcleo Kotlin Multiplatform común a Android e iOS. Solo es nativo lo que las plataformas de coche obligan a que lo sea.",
          "Mapas, cálculo de rutas y navegación son piezas separadas: el motor de rutas está detrás de una abstracción propia, de modo que puede sustituirse sin reescribir la interfaz ni el perfil de vehículo.",
        ],
      },
    ],
    cover: {
      src: "/images/projects/caravantruck-way-cover.webp",
      alt: "Portada de cómic de CaravanTruck Way: una autocaravana y un camión por una carretera de montaña que rodea un túnel bajo",
    },
    cta: { label: "Quiero una app así", intent: "mobile-app" },
  },
  {
    slug: "oposibot",
    name: "OposiBot",
    category: "client-work",
    descriptor: "App móvil de estudio para opositores",
    relation: "Proyecto para cliente. Desarrollo de la app móvil a cargo del estudio.",
    status: "in-development",
    statusNote: "objetivo: diciembre de 2026",
    pitch:
      "App móvil de estudio para opositores, en Android e iOS con Kotlin Multiplatform, con un backend como única autoridad sobre los datos.",
    audience: "Personas que preparan oposiciones en España.",
    problem:
      "Una app de estudio con cuentas, suscripción y contenido de pago no puede fiar sus reglas al teléfono del usuario: identidad, acceso y economía tienen que decidirse en el servidor.",
    solution:
      "Una app para Android e iOS que reproduce con fidelidad el diseño del cliente y delega toda decisión de negocio en un backend propio, administrado desde OposiControl.",
    proof: [
      "La app nunca accede a la base de datos: consume un backend que decide identidad, acceso y reglas.",
      "La interfaz se reconstruye pantalla a pantalla contra el diseño en Figma del cliente, con inventario de cada elemento.",
      "Android e iOS comparten una misma base de código Kotlin Multiplatform.",
    ],
    platforms: ["Android", "iOS"],
    stack: [
      "Kotlin Multiplatform",
      "Compose Multiplatform",
      "Ktor Client",
      "kotlinx.serialization",
      "Corrutinas",
      "Almacenamiento seguro de sesión",
    ],
    scope: [
      { label: "Arranque e identidad visual", area: "Común (KMP)", status: "implemented" },
      { label: "Acceso y onboarding", area: "Común (KMP)", status: "implemented" },
      { label: "Pantalla de suscripción", area: "Común (KMP)", status: "implemented" },
      { label: "Inicio y «Mi colección»", area: "Común (KMP)", status: "implemented" },
      { label: "Reconstrucción del resto de pantallas desde Figma", area: "Común (KMP)", status: "in-development" },
      { label: "Consumo de datos reales por vertical", area: "Integración", status: "in-development" },
      { label: "Verificación en iOS", area: "iOS", status: "planned" },
      { label: "Publicación", area: "Android · iOS", status: "planned" },
    ],
    delivery: [
      { label: "Base y acceso", status: "implemented" },
      { label: "Pantallas principales", status: "implemented" },
      { label: "Reconstrucción desde Figma", status: "in-development" },
      { label: "Datos reales", status: "in-development" },
      { label: "iOS", status: "planned" },
      { label: "Entrega", status: "planned" },
    ],
    story: [
      {
        eyebrow: "El problema del cliente",
        title: "Una app con cuentas y suscripción tiene que ser de fiar por dentro.",
        body: [
          "El proyecto parte de un diseño completo y de un producto con cuentas y suscripción. Hace falta una app que respete ese diseño al detalle y cuyas reglas no puedan saltarse desde el dispositivo.",
        ],
      },
      {
        eyebrow: "El producto",
        title: "Una app, dos plataformas, una sola autoridad.",
        body: [
          "La app se encarga de la experiencia: navegación, estado y presentación. Todo lo que afecta a identidad, permisos o dinero lo resuelve el backend.",
        ],
      },
      {
        eyebrow: "Nuestro trabajo",
        title: "Fidelidad al diseño y fronteras claras.",
        body: [
          "Construimos la app en Kotlin Multiplatform para Android e iOS y la integramos con el backend que también desarrollamos dentro del mismo ecosistema.",
          "El diseño del cliente se inventaría elemento a elemento y cada pantalla se verifica contra él antes de darse por buena.",
        ],
      },
      {
        eyebrow: "Ingeniería",
        title: "El cliente móvil no toca la base de datos.",
        body: [
          "La app consume contratos del backend y maneja sus errores; no contiene credenciales de servidor ni lógica de autorización. Esa separación es la que permite administrar la plataforma desde OposiControl sin tocar la app.",
        ],
      },
    ],
    related: ["oposicontrol"],
    cta: { label: "Quiero una app así", intent: "mobile-app" },
  },

  // ───────────────────────── 02 · Our products ─────────────────────────
  {
    slug: "requenadesk",
    name: "RequenaDesk",
    category: "product",
    descriptor: "CRM y ticketing multiplataforma",
    relation: "Producto propio. Lo usamos en nuestra operación con clientes.",
    status: "in-development",
    stage: "in-development",
    statusNote: "desplegado y en uso interno",
    pitch:
      "CRM y ticketing multiplataforma con portal de cliente y facturas en PDF. Lo usamos en nuestra propia operación.",
    audience:
      "Hoy, nuestros clientes a través de su portal. Más adelante, pequeñas empresas que quieran un CRM sencillo.",
    problem:
      "Solicitudes, tickets, tareas y facturas repartidos entre herramientas sueltas: nadie sabe qué se pidió, qué se hizo ni qué se facturó.",
    solution:
      "Un único sistema con panel de administración y portal de cliente: solicitudes, tickets, tareas, seguimiento del servicio y facturación.",
    proof: [
      "Está desplegado y en uso para gestionar nuestra relación con clientes.",
      "Backend propio con migraciones versionadas, despliegue automatizado y comprobaciones de salud.",
      "27 pantallas entre el panel de administración y el portal de cliente.",
    ],
    platforms: ["Escritorio", "Android", "Servidor"],
    stack: [
      "Kotlin Multiplatform",
      "Compose Multiplatform",
      "Ktor",
      "PostgreSQL",
      "Flyway",
      "JWT",
      "PDFBox",
    ],
    scope: [
      { label: "Panel de administración", area: "Escritorio", status: "implemented" },
      { label: "Portal de cliente: solicitudes, tickets y tareas", area: "Portal", status: "implemented" },
      { label: "Facturas en PDF", area: "Servidor", status: "implemented" },
      { label: "Revisión rápida desde el móvil", area: "Android", status: "in-development" },
      { label: "Utilidades de negocio para empresas", area: "Portal", status: "planned" },
      { label: "Acceso para nuevas empresas", area: "Producto", status: "planned" },
    ],
    story: [
      {
        eyebrow: "Visión",
        title: "El CRM que necesitábamos para trabajar con nuestros clientes.",
        body: [
          "RequenaDesk nace de nuestra propia operación: un sitio donde el cliente pide, nosotros respondemos y todo queda registrado. Es un CRM genérico, no atado a ningún sector.",
        ],
      },
      {
        eyebrow: "Producto",
        title: "Administración por un lado, portal de cliente por otro.",
        body: [
          "El equipo trabaja desde una aplicación de escritorio. El cliente entra a su portal para crear solicitudes, seguir su trabajo y consultar el servicio.",
        ],
      },
      {
        eyebrow: "Hoja de ruta",
        title: "De herramienta interna a producto.",
        body: [
          "El siguiente paso es abrirlo a otras empresas, con acceso por cuenta y utilidades de negocio adicionales. Todavía no está disponible para nuevas altas.",
        ],
      },
    ],
    cta: { label: "Avísame cuando esté disponible", intent: "requenadesk" },
  },
  {
    slug: "edutrack",
    name: "EduTrack",
    category: "product",
    descriptor: "App Android para controlar las notas",
    relation: "Producto propio, sin cliente externo.",
    status: "in-development",
    stage: "in-development",
    statusNote: "versión beta 0.3",
    pitch:
      "App Android para estudiantes: notas ponderadas, simulador de la nota que necesitas y recordatorios de examen.",
    audience: "Estudiantes de secundaria y universidad.",
    problem:
      "Calcular la media con porcentajes distintos por examen, y saber qué nota hace falta para aprobar, acaba en hojas sueltas y calculadoras.",
    solution:
      "Una app que organiza cursos y asignaturas, calcula medias ponderadas y responde a la pregunta que importa: qué necesito sacar.",
    proof: [
      "12 pantallas funcionales.",
      "Textos de tienda, lista de lanzamiento y borradores legales ya preparados.",
      "Plan Premium definido sobre la facturación de Google Play.",
    ],
    platforms: ["Android"],
    stack: [
      "Kotlin",
      "Jetpack Compose",
      "Firebase Auth",
      "Firebase Realtime Database",
      "Play Billing",
      "DataStore",
    ],
    scope: [
      { label: "Cursos, asignaturas y notas ponderadas", area: "Android", status: "implemented" },
      { label: "Simulador de nota necesaria", area: "Android", status: "implemented" },
      { label: "Recordatorios de examen", area: "Android", status: "implemented" },
      { label: "Inicio de sesión", area: "Android", status: "implemented" },
      { label: "Plan Premium", area: "Android", status: "in-development" },
      { label: "Publicación en Google Play", area: "Android", status: "planned" },
    ],
    story: [
      {
        eyebrow: "Problema",
        title: "«¿Qué necesito sacar para aprobar?»",
        body: [
          "Es la pregunta que se hace cualquier estudiante antes de un examen, y casi nunca tiene una respuesta rápida cuando cada prueba pesa distinto.",
        ],
      },
      {
        eyebrow: "Producto",
        title: "La media, siempre a la vista.",
        body: [
          "EduTrack organiza el curso por asignaturas y periodos, calcula la media con sus pesos y simula la nota necesaria en lo que queda por examinar.",
        ],
      },
      {
        eyebrow: "Hoja de ruta",
        title: "De beta a tienda.",
        body: [
          "La app funciona en versión beta. Queda cerrar el plan Premium y publicar en Google Play.",
        ],
      },
    ],
    cover: {
      src: "/images/projects/edutrack-cover.webp",
      alt: "Ilustración de EduTrack: un lápiz atraviesa un examen suspenso hacia un aprobado",
    },
    cta: { label: "Quiero una app así", intent: "mobile-app" },
  },

  // ───────────────────── 03 · Custom business software ─────────────────────
  {
    slug: "oposicontrol",
    name: "OposiControl",
    category: "custom-software",
    descriptor: "Backoffice y backend de la plataforma OposiBot",
    relation: "Software a medida dentro del ecosistema de OposiBot. En desarrollo por el estudio.",
    status: "in-development",
    pitch:
      "Backoffice multiplataforma y backend que gobiernan contenido, tienda, soporte y permisos de la plataforma OposiBot.",
    audience: "El equipo que opera la plataforma OposiBot.",
    problem:
      "Operar una plataforma de oposiciones —contenido, noticias, recursos, tienda, tickets de soporte, usuarios— tocando la base de datos a mano y sin control de roles.",
    solution:
      "Un backoffice hecho para esa operación concreta, en Android, iOS y escritorio, sobre un backend que concentra las reglas de negocio, la autorización y el acceso a datos.",
    proof: [
      "Arquitectura por capas estricta repartida en más de 18 módulos.",
      "Backend con su propia batería de tests.",
      "Es la autoridad de datos de la que depende la app OposiBot.",
    ],
    platforms: ["Android", "iOS", "Escritorio", "Backend"],
    stack: [
      "Kotlin Multiplatform",
      "Compose Multiplatform",
      "Koin",
      "Ktor",
      "SQLDelight",
      "Supabase",
    ],
    scope: [
      { label: "Arquitectura por capas y módulos", area: "Común (KMP)", status: "implemented" },
      { label: "Backend: reglas, autorización y datos", area: "Backend", status: "implemented" },
      { label: "Métricas de producto y monedero", area: "Backend", status: "implemented" },
      { label: "Gestión de contenido y recursos", area: "Backoffice", status: "in-development" },
      { label: "Moderación y tickets de soporte", area: "Backoffice", status: "in-development" },
      { label: "Tienda", area: "Backoffice", status: "in-development" },
    ],
    story: [
      {
        eyebrow: "El problema",
        title: "Una plataforma no se opera desde la base de datos.",
        body: [
          "Cada noticia, recurso, producto de tienda o ticket necesita a alguien con permisos concretos y un rastro de lo que hizo. Sin una herramienta propia, eso se convierte en consultas manuales.",
        ],
      },
      {
        eyebrow: "La solución",
        title: "Un CRM vertical, hecho para una sola operación.",
        body: [
          "OposiControl no es un CRM genérico: sus pantallas y sus reglas son las de la plataforma OposiBot. El mismo backend que usa el backoffice es el que atiende a la app móvil.",
        ],
      },
      {
        eyebrow: "Ingeniería",
        title: "Dominio, casos de uso y presentación, cada uno en su módulo.",
        body: [
          "La separación por capas se mantiene en la estructura del proyecto, no solo en la intención: cada funcionalidad tiene su módulo y sus dependencias van siempre hacia el dominio.",
        ],
      },
    ],
    related: ["oposibot"],
    cover: {
      src: "/images/projects/oposicontrol-cover.webp",
      alt: "Ilustración de OposiControl: una torre de control con un escudo ordenando documentos",
    },
    cta: { label: "Necesito un backoffice a medida", intent: "custom-software" },
  },

  // ───────────────────────── 04 · Case study ─────────────────────────
  {
    slug: "agendnote",
    name: "AgendNote",
    category: "case-study",
    descriptor: "Agenda y tareas, documentada como proceso",
    relation: "Proyecto propio. Lo usamos para enseñar cómo trabajamos.",
    status: "implemented",
    statusNote: "iOS sin verificar",
    pitch:
      "Agenda y tareas en Kotlin Multiplatform, documentada como proceso: auditorías de diseño, arquitectura y seguridad, y de 39 a 90 tests.",
    audience: "Personas que organizan su día con tareas y agenda.",
    problem:
      "Una app que ya funciona no es todavía un producto: le faltan criterio de diseño verificado, límites de arquitectura y una revisión de seguridad.",
    solution:
      "Un proceso de profesionalización por fases, con inventario de pantallas, auditorías escritas y cada cambio acompañado de su test.",
    proof: [
      "De 39 a 90 tests unitarios, escritos antes que la implementación.",
      "La auditoría de seguridad encontró y corrigió una fuga real: errores internos del backend llegaban al usuario.",
      "Sistema de diseño propio con reducción de movimiento y objetivos táctiles de 48 dp.",
    ],
    platforms: ["Android", "iOS"],
    stack: ["Kotlin Multiplatform", "Compose Multiplatform", "Supabase"],
    scope: [
      { label: "Agenda, calendario, etiquetas y ajustes", area: "Común (KMP)", status: "implemented" },
      { label: "Fechas límite, subtareas y recordatorios múltiples", area: "Común (KMP)", status: "implemented" },
      { label: "Repeticiones con fecha o número de fin", area: "Común (KMP)", status: "implemented" },
      { label: "Captura rápida en lenguaje natural y listas inteligentes", area: "Común (KMP)", status: "implemented" },
      { label: "Plantillas y exportación", area: "Común (KMP)", status: "implemented" },
      { label: "Verificación en iOS", area: "iOS", status: "planned" },
    ],
    story: [
      {
        eyebrow: "Punto de partida",
        title: "Una app que funcionaba, sin pruebas de que estuviera bien hecha.",
        body: [
          "AgendNote ya tenía sus cuatro pantallas principales. La pregunta era otra: qué habría que demostrar para entregársela a alguien.",
        ],
      },
      {
        eyebrow: "Método",
        title: "Inventariar, auditar y solo después construir.",
        body: [
          "Primero se inventarió cada pantalla a partir del código real. Después se escribieron tres auditorías —diseño, arquitectura y seguridad— y un plan por fases.",
          "Cada funcionalidad nueva siguió el mismo orden: test, fallo confirmado, implementación.",
        ],
      },
      {
        eyebrow: "Lo que no se hizo",
        title: "Decir que iOS está verificado.",
        body: [
          "El código de iOS está escrito con el mismo cuidado que el de Android, pero no se compiló durante la auditoría. Se documenta como pendiente en lugar de darlo por bueno.",
        ],
      },
    ],
    cta: { label: "Quiero auditar mi app", intent: "existing-project" },
  },

  // ───────────────────────── 05 · Academic ─────────────────────────
  {
    slug: "flashfix",
    name: "FlashFix",
    category: "academic",
    descriptor: "Proyecto de fin de grado",
    relation: "Proyecto académico (PFG). Sin cliente.",
    status: "implemented",
    statusNote: "MVP académico",
    pitch:
      "Proyecto de fin de grado: un marketplace de talleres con 17 pantallas y 3 roles, contado como cómic interactivo junto a su propia auditoría.",
    audience: "Conductores que buscan un taller de confianza, talleres y administración.",
    problem:
      "Encontrar un taller cercano de confianza obliga a llamar a ciegas, sin saber disponibilidad ni valoraciones.",
    solution:
      "Una app Android que localiza talleres por geolocalización, permite hablar con ellos y valorarlos, con paneles para usuario, taller y administrador.",
    proof: [
      "17 pantallas y 3 roles funcionando.",
      "Auditoría propia del código, con los problemas reales documentados.",
      "Migración a Material 3 y cifrado de preferencias sensibles a raíz de esa auditoría.",
    ],
    platforms: ["Android"],
    stack: [
      "Jetpack Compose",
      "Firebase",
      "Room",
      "Appwrite",
      "Google Maps",
      "EncryptedSharedPreferences",
    ],
    scope: [
      { label: "Búsqueda de talleres por geolocalización", area: "Android", status: "implemented" },
      { label: "Chat y valoraciones", area: "Android", status: "implemented" },
      { label: "Paneles de usuario, taller y administrador", area: "Android", status: "implemented" },
      { label: "Auditoría propia del código", area: "Calidad", status: "implemented" },
      { label: "Migración a Material 3 y cifrado de preferencias", area: "Android", status: "implemented" },
    ],
    story: [
      {
        eyebrow: "Origen",
        title: "No había cliente: había un proyecto de fin de grado.",
        body: [
          "FlashFix es un trabajo académico. Lo enseñamos porque muestra de dónde venimos y cómo revisamos nuestro propio código.",
        ],
      },
      {
        eyebrow: "Construcción",
        title: "17 pantallas y tres roles.",
        body: [
          "La app localiza talleres cercanos, permite hablar con ellos y valorarlos, y da un panel distinto a conductor, taller y administrador.",
        ],
      },
      {
        eyebrow: "Retos y decisiones",
        title: "Auditar lo que ya funcionaba.",
        body: [
          "El MVP funcionaba, pero por dentro tenía estado global repartido, mezcla de Material 2 y 3 y un fallo crítico en el borrado de usuarios.",
          "Lo documentamos en una auditoría propia y empezamos a corregirlo: migración a Material 3 y cifrado de las preferencias sensibles.",
        ],
      },
    ],
    cover: {
      src: "/images/flashfix-comic-cover-v2.png",
      alt: "Portada de cómic de FlashFix con un coche deportivo, mapas y herramientas mecánicas",
    },
    cta: { label: "Hablemos de tu proyecto", intent: "general" },
  },
];

export const projectHref = (slug: string) => `/proyectos/${slug}`;

export const getProject = (slug: string) =>
  portfolioProjects.find((project) => project.slug === slug);

export const projectsByCategory = (category: ProjectCategoryId) =>
  portfolioProjects.filter((project) => project.category === category);

export const contactHref = (intent: ContactIntent = "general") =>
  `/contacto?intent=${intent}`;
