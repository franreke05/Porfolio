/**
 * Comic scripts for the six projects that have no commissioned comic art.
 *
 * Every line here is a rephrasing of src/lib/portfolio.ts (story, problem,
 * solution, proof, scope, delivery, statusNote). No new facts, numbers, names,
 * dates or outcomes; speakers are generic roles, never a client's name.
 *
 * The closing "ESTADO ACTUAL" scene is NOT scripted: the reader builds it from
 * the project's live `status` and `scope`, so it can never drift from the catalogue.
 */

export type ComicSceneKind =
  | "title-card"
  | "caption"
  | "dialogue"
  | "ledger"
  | "diagram"
  | "splash";

export type ComicBubble = { who: string; text: string };

export type ComicScene = {
  id: string;
  /** Chapter of the arc, e.g. "PROBLEMA". Consecutive scenes share a chapter. */
  chapter: string;
  kind: ComicSceneKind;
  headline: string;
  caption?: string;
  bubbles?: ComicBubble[];
  /** Short lettering drawn in Bangers. */
  sfx?: string;
  items?: string[];
};

export type ComicMotifId = "route" | "plano" | "frontera" | "mostrador" | "pesos" | "ciclo";

export type ComicScript = {
  slug: string;
  /** Light per-project accent: ink text must stay readable on top of it. */
  accent: string;
  /** SVG motif used by this comic's "diagram" scenes. */
  motif: ComicMotifId;
  /** Chapter name of the generated closing scene. */
  statusChapter: string;
  scenes: ComicScene[];
};

const scripts: ComicScript[] = [
  // ── CaravanTruck Way: PROBLEMA DEL CLIENTE → RETO → PRODUCTO → NUESTRO TRABAJO → INGENIERÍA → ESTADO ACTUAL
  {
    slug: "caravantruck-way",
    accent: "#e4572e",
    motif: "route",
    statusChapter: "ESTADO ACTUAL",
    scenes: [
      {
        id: "gps-de-turismo",
        chapter: "PROBLEMA DEL CLIENTE",
        kind: "title-card",
        headline: "Un GPS de turismo no sabe lo que mide un camión.",
        caption:
          "Los navegadores pensados para turismos mandan a un vehículo grande por calles, túneles y puentes por los que no cabe o no puede circular.",
      },
      {
        id: "planificar-dos-veces",
        chapter: "PROBLEMA DEL CLIENTE",
        kind: "dialogue",
        headline: "Planificar dos veces",
        caption:
          "Quien conduce una autocaravana o un camión planifica dos veces: una con el navegador y otra a mano.",
        bubbles: [
          { who: "Conductor", text: "El navegador ya me ha dado la ruta." },
          { who: "Conductor", text: "Ahora me toca comprobar a mano que es practicable." },
        ],
      },
      {
        id: "un-riesgo",
        chapter: "PROBLEMA DEL CLIENTE",
        kind: "splash",
        sfx: "¡ALTO!",
        headline: "Un túnel bajo o un puente con límite de peso no son una molestia. Son un riesgo.",
        caption: "Altura, anchura, peso y carga por eje no entran en el cálculo de un navegador de turismo.",
      },
      {
        id: "el-reto",
        chapter: "RETO",
        kind: "title-card",
        headline: "Rutas fiables, sin cobertura y en la pantalla del coche.",
      },
      {
        id: "tres-exigencias",
        chapter: "RETO",
        kind: "ledger",
        headline: "Tres exigencias a la vez",
        items: [
          "Calcular rutas con restricciones reales de vehículo.",
          "Seguir funcionando sin conexión.",
          "Conducción nativa en Android Auto y CarPlay, que imponen sus propias reglas de interfaz.",
        ],
      },
      {
        id: "el-vehiculo-decide",
        chapter: "PRODUCTO",
        kind: "diagram",
        headline: "El vehículo decide la ruta.",
        caption:
          "El conductor define su vehículo una vez. A partir de ahí, el perfil condiciona cada cálculo.",
      },
      {
        id: "sin-red",
        chapter: "PRODUCTO",
        kind: "dialogue",
        headline: "Sin red y en la pantalla del coche",
        bubbles: [
          { who: "Conductor", text: "¿Y cuando me quede sin cobertura?" },
          { who: "El equipo", text: "Los mapas se descargan por paquetes: se usan sin red." },
          { who: "El equipo", text: "Y la navegación continúa en la pantalla del coche." },
        ],
      },
      {
        id: "nuestro-trabajo",
        chapter: "NUESTRO TRABAJO",
        kind: "title-card",
        headline: "Del alcance a la versión que prueba el cliente.",
        caption: "Llevamos el proyecto completo.",
      },
      {
        id: "lo-que-hacemos",
        chapter: "NUESTRO TRABAJO",
        kind: "ledger",
        headline: "Lo que llevamos",
        items: [
          "Definición de alcance y arquitectura.",
          "Diseño de la experiencia móvil y de coche.",
          "Desarrollo de la app y del backend.",
          "Infraestructura y pruebas en dispositivo.",
        ],
      },
      {
        id: "la-carretera-manda",
        chapter: "NUESTRO TRABAJO",
        kind: "dialogue",
        headline: "La carretera manda",
        caption:
          "Las pruebas en carretera del cliente mandan sobre las de laboratorio, y vuelven al equipo como correcciones priorizadas.",
        bubbles: [
          { who: "El equipo", text: "Cada versión candidata se certifica en un dispositivo real antes de llegarte." },
          { who: "El equipo", text: "Después llega la prueba en carretera, que manda sobre el laboratorio." },
          { who: "El equipo", text: "Si falla en ruta, la versión se reabre." },
        ],
      },
      {
        id: "nucleo-compartido",
        chapter: "INGENIERÍA",
        kind: "caption",
        headline: "Un núcleo compartido y capas nativas donde hacen falta.",
        caption:
          "El dominio, el estado y los datos viven en un núcleo Kotlin Multiplatform común a Android e iOS. Solo es nativo lo que las plataformas de coche obligan a que lo sea.",
        items: [
          "Mapas, cálculo de rutas y navegación son piezas separadas.",
          "El motor de rutas está detrás de una abstracción propia.",
          "Puede sustituirse sin reescribir la interfaz ni el perfil de vehículo.",
        ],
      },
      {
        id: "dato-ausente",
        chapter: "INGENIERÍA",
        kind: "splash",
        sfx: "SIN INVENTAR",
        headline: "Si el mapa no tiene el dato de una restricción, la app no inventa un aviso.",
        caption: "Lo trata como dato ausente.",
      },
    ],
  },

  // ── OposiBot: PROBLEMA DEL CLIENTE → RETO → PRODUCTO → NUESTRO TRABAJO → INGENIERÍA → ESTADO ACTUAL
  {
    slug: "oposibot",
    accent: "#6fcbb2",
    motif: "frontera",
    statusChapter: "ESTADO ACTUAL",
    scenes: [
      {
        id: "de-fiar-por-dentro",
        chapter: "PROBLEMA DEL CLIENTE",
        kind: "title-card",
        headline: "Una app con cuentas y suscripción tiene que ser de fiar por dentro.",
        caption: "Hay un diseño completo que respetar y unas reglas que no pueden depender del teléfono.",
      },
      {
        id: "lo-que-pide",
        chapter: "PROBLEMA DEL CLIENTE",
        kind: "dialogue",
        headline: "Lo que necesita el cliente",
        bubbles: [
          { who: "El equipo", text: "La app tiene que respetar el diseño al detalle." },
          { who: "El equipo", text: "Y sus reglas no pueden saltarse desde el dispositivo." },
        ],
      },
      {
        id: "no-en-el-movil",
        chapter: "PROBLEMA DEL CLIENTE",
        kind: "splash",
        sfx: "¡EN EL SERVIDOR!",
        headline: "Identidad, acceso y economía tienen que decidirse en el servidor.",
        caption:
          "Una app de estudio con cuentas, suscripción y contenido de pago no puede fiar sus reglas al teléfono del usuario.",
      },
      {
        id: "dos-exigencias",
        chapter: "RETO",
        kind: "ledger",
        headline: "Fidelidad por fuera, autoridad por dentro",
        items: [
          "Reproducir con fidelidad el diseño del cliente, en Android y en iOS.",
          "Delegar toda decisión de negocio en un backend propio.",
        ],
      },
      {
        id: "una-sola-autoridad",
        chapter: "PRODUCTO",
        kind: "title-card",
        headline: "Una app, dos plataformas, una sola autoridad.",
      },
      {
        id: "la-app-pregunta",
        chapter: "PRODUCTO",
        kind: "diagram",
        headline: "La app pregunta. El backend decide.",
        caption:
          "La app se encarga de la experiencia: navegación, estado y presentación. Todo lo que afecta a identidad, permisos o dinero lo resuelve el backend.",
      },
      {
        id: "misma-base",
        chapter: "PRODUCTO",
        kind: "dialogue",
        headline: "Android e iOS, una base de código",
        bubbles: [
          { who: "Opositor", text: "Yo estudio en Android." },
          { who: "Opositor", text: "Y yo en iOS." },
          { who: "El equipo", text: "Las dos comparten una misma base de código Kotlin Multiplatform." },
        ],
      },
      {
        id: "fronteras-claras",
        chapter: "NUESTRO TRABAJO",
        kind: "title-card",
        headline: "Fidelidad al diseño y fronteras claras.",
        caption:
          "Construimos la app en Kotlin Multiplatform para Android e iOS y la integramos con el backend que también desarrollamos dentro del mismo ecosistema.",
      },
      {
        id: "contra-figma",
        chapter: "NUESTRO TRABAJO",
        kind: "dialogue",
        headline: "Pantalla a pantalla contra el diseño",
        bubbles: [
          { who: "El equipo", text: "El diseño del cliente se inventaría elemento a elemento." },
          { who: "El equipo", text: "Y cada pantalla se verifica contra él antes de darse por buena." },
        ],
      },
      {
        id: "no-toca-la-base",
        chapter: "INGENIERÍA",
        kind: "splash",
        sfx: "¡FRONTERA!",
        headline: "El cliente móvil no toca la base de datos.",
        caption:
          "La app consume contratos del backend y maneja sus errores; no contiene credenciales de servidor ni lógica de autorización.",
      },
      {
        id: "oposicontrol",
        chapter: "INGENIERÍA",
        kind: "caption",
        headline: "Una separación con consecuencias",
        caption:
          "Esa separación es la que permite administrar la plataforma desde OposiControl sin tocar la app.",
      },
    ],
  },

  // ── RequenaDesk: PROBLEMA → VISIÓN → PRODUCTO → HOJA DE RUTA
  {
    slug: "requenadesk",
    accent: "#b1a6ee",
    motif: "mostrador",
    statusChapter: "ESTADO ACTUAL",
    scenes: [
      {
        id: "herramientas-sueltas",
        chapter: "PROBLEMA",
        kind: "title-card",
        headline: "Todo repartido entre herramientas sueltas.",
        caption: "Solicitudes, tickets, tareas y facturas, cada cosa en un sitio distinto.",
      },
      {
        id: "nadie-sabe",
        chapter: "PROBLEMA",
        kind: "splash",
        sfx: "¿¿DÓNDE??",
        headline: "Nadie sabe qué se pidió, qué se hizo ni qué se facturó.",
      },
      {
        id: "el-crm-que-necesitabamos",
        chapter: "VISIÓN",
        kind: "title-card",
        headline: "El CRM que necesitábamos para trabajar con nuestros clientes.",
        caption: "RequenaDesk nace de nuestra propia operación.",
      },
      {
        id: "todo-registrado",
        chapter: "VISIÓN",
        kind: "dialogue",
        headline: "Un sitio donde todo queda registrado",
        bubbles: [
          { who: "El cliente", text: "Aquí pido." },
          { who: "El estudio", text: "Aquí respondemos." },
          { who: "El estudio", text: "Y todo queda registrado." },
        ],
      },
      {
        id: "generico",
        chapter: "VISIÓN",
        kind: "caption",
        headline: "Genérico a propósito",
        caption: "Es un CRM genérico, no atado a ningún sector.",
      },
      {
        id: "dos-lados",
        chapter: "PRODUCTO",
        kind: "diagram",
        headline: "Administración por un lado, portal de cliente por otro.",
        caption:
          "El equipo trabaja desde una aplicación de escritorio. El cliente entra a su portal para crear solicitudes, seguir su trabajo y consultar el servicio.",
      },
      {
        id: "un-unico-sistema",
        chapter: "PRODUCTO",
        kind: "ledger",
        headline: "Un único sistema",
        items: [
          "Solicitudes.",
          "Tickets.",
          "Tareas.",
          "Seguimiento del servicio.",
          "Facturación, con facturas en PDF.",
        ],
      },
      {
        id: "lo-usamos",
        chapter: "PRODUCTO",
        kind: "caption",
        headline: "Lo usamos nosotros",
        caption: "Está desplegado y en uso para gestionar nuestra relación con clientes.",
        items: [
          "Backend propio con migraciones versionadas, despliegue automatizado y comprobaciones de salud.",
          "27 pantallas entre el panel de administración y el portal de cliente.",
        ],
      },
      {
        id: "de-interna-a-producto",
        chapter: "HOJA DE RUTA",
        kind: "title-card",
        headline: "De herramienta interna a producto.",
        caption:
          "El siguiente paso es abrirlo a otras empresas, con acceso por cuenta y utilidades de negocio adicionales.",
      },
      {
        id: "todavia-no",
        chapter: "HOJA DE RUTA",
        kind: "splash",
        sfx: "TODAVÍA NO",
        headline: "Todavía no está disponible para nuevas altas.",
      },
    ],
  },

  // ── EduTrack: PROBLEMA → VISIÓN → PRODUCTO → HOJA DE RUTA
  {
    slug: "edutrack",
    accent: "#7db9ea",
    motif: "pesos",
    statusChapter: "ESTADO ACTUAL",
    scenes: [
      {
        id: "la-pregunta",
        chapter: "PROBLEMA",
        kind: "title-card",
        headline: "«¿Qué necesito sacar para aprobar?»",
        caption: "Es la pregunta que se hace cualquier estudiante antes de un examen.",
      },
      {
        id: "pesa-distinto",
        chapter: "PROBLEMA",
        kind: "dialogue",
        headline: "Cada prueba pesa distinto",
        caption: "Casi nunca hay una respuesta rápida.",
        bubbles: [
          { who: "Estudiante", text: "Cada examen cuenta un porcentaje distinto." },
          { who: "Estudiante", text: "¿Y qué nota me hace falta para aprobar?" },
        ],
      },
      {
        id: "hojas-sueltas",
        chapter: "PROBLEMA",
        kind: "splash",
        sfx: "¡¿CUÁNTO?!",
        headline: "La cuenta acaba en hojas sueltas y calculadoras.",
      },
      {
        id: "la-pregunta-que-importa",
        chapter: "VISIÓN",
        kind: "title-card",
        headline: "Una app que responde a la pregunta que importa.",
        caption: "Organiza cursos y asignaturas, calcula medias ponderadas y dice qué necesitas sacar.",
      },
      {
        id: "la-media-a-la-vista",
        chapter: "PRODUCTO",
        kind: "diagram",
        headline: "La media, siempre a la vista.",
        caption:
          "EduTrack organiza el curso por asignaturas y periodos y calcula la media con sus pesos.",
      },
      {
        id: "simulador",
        chapter: "PRODUCTO",
        kind: "dialogue",
        headline: "El simulador y los recordatorios",
        bubbles: [
          { who: "Estudiante", text: "¿Qué necesito en lo que me queda por examinar?" },
          { who: "La app", text: "Simulo la nota necesaria." },
          { who: "La app", text: "Y te recuerdo el examen." },
        ],
      },
      {
        id: "lo-que-hay",
        chapter: "PRODUCTO",
        kind: "ledger",
        headline: "Lo que hay hoy",
        items: [
          "12 pantallas funcionales.",
          "Textos de tienda, lista de lanzamiento y borradores legales ya preparados.",
          "Plan Premium definido sobre la facturación de Google Play.",
        ],
      },
      {
        id: "de-beta-a-tienda",
        chapter: "HOJA DE RUTA",
        kind: "title-card",
        headline: "De beta a tienda.",
        caption: "La app funciona en versión beta.",
      },
      {
        id: "lo-que-queda",
        chapter: "HOJA DE RUTA",
        kind: "caption",
        headline: "Lo que queda",
        caption: "Cerrar el plan Premium y publicar en Google Play.",
      },
    ],
  },

  // ── OposiControl: PROBLEMA → SOLUCIÓN → INGENIERÍA → ESTADO
  {
    slug: "oposicontrol",
    accent: "#cbd662",
    motif: "plano",
    statusChapter: "ESTADO",
    scenes: [
      {
        id: "no-desde-la-base",
        chapter: "PROBLEMA",
        kind: "title-card",
        headline: "Una plataforma no se opera desde la base de datos.",
        caption: "Contenido, noticias, recursos, tienda, tickets de soporte, usuarios.",
      },
      {
        id: "a-mano",
        chapter: "PROBLEMA",
        kind: "dialogue",
        headline: "Operar a mano",
        caption: "Sin una herramienta propia, la operación se convierte en consultas manuales.",
        bubbles: [
          { who: "Operación", text: "Hay una noticia nueva, un recurso, un ticket…" },
          { who: "Operación", text: "¿Y hay que tocar la base de datos a mano cada vez?" },
        ],
      },
      {
        id: "permisos-y-rastro",
        chapter: "PROBLEMA",
        kind: "splash",
        sfx: "¿QUIÉN FUE?",
        headline: "Cada cambio necesita a alguien con permisos concretos y un rastro de lo que hizo.",
      },
      {
        id: "crm-vertical",
        chapter: "SOLUCIÓN",
        kind: "title-card",
        headline: "Un CRM vertical, hecho para una sola operación.",
        caption:
          "OposiControl no es un CRM genérico: sus pantallas y sus reglas son las de la plataforma OposiBot.",
      },
      {
        id: "plano",
        chapter: "SOLUCIÓN",
        kind: "diagram",
        headline: "Un backend, dos clientes",
        caption: "El mismo backend que usa el backoffice es el que atiende a la app móvil.",
      },
      {
        id: "lo-que-gobierna",
        chapter: "SOLUCIÓN",
        kind: "ledger",
        headline: "Lo que gobierna",
        caption: "Un backoffice en Android, iOS y escritorio.",
        items: ["Contenido.", "Tienda.", "Soporte.", "Permisos."],
      },
      {
        id: "cada-uno-en-su-modulo",
        chapter: "INGENIERÍA",
        kind: "title-card",
        headline: "Dominio, casos de uso y presentación, cada uno en su módulo.",
        caption:
          "La separación por capas se mantiene en la estructura del proyecto, no solo en la intención.",
      },
      {
        id: "hacia-el-dominio",
        chapter: "INGENIERÍA",
        kind: "caption",
        headline: "Las dependencias van siempre hacia el dominio.",
        items: [
          "Arquitectura por capas estricta repartida en más de 18 módulos.",
          "Backend con su propia batería de tests.",
          "Es la autoridad de datos de la que depende la app OposiBot.",
        ],
      },
    ],
  },

  // ── AgendNote: PUNTO DE PARTIDA → MÉTODO → LO QUE NO SE HIZO → RESULTADO
  {
    slug: "agendnote",
    accent: "#f2a0be",
    motif: "ciclo",
    statusChapter: "ESTADO ACTUAL",
    scenes: [
      {
        id: "funcionaba",
        chapter: "PUNTO DE PARTIDA",
        kind: "title-card",
        headline: "Una app que funcionaba, sin pruebas de que estuviera bien hecha.",
        caption: "AgendNote ya tenía sus cuatro pantallas principales.",
      },
      {
        id: "la-pregunta-era-otra",
        chapter: "PUNTO DE PARTIDA",
        kind: "dialogue",
        headline: "La pregunta era otra",
        bubbles: [
          { who: "El equipo", text: "Funciona." },
          { who: "El equipo", text: "Ya. ¿Y qué habría que demostrar para entregársela a alguien?" },
        ],
      },
      {
        id: "todavia-no-es-producto",
        chapter: "PUNTO DE PARTIDA",
        kind: "splash",
        sfx: "¿Y LAS PRUEBAS?",
        headline: "Una app que ya funciona no es todavía un producto.",
        caption:
          "Le faltan criterio de diseño verificado, límites de arquitectura y una revisión de seguridad.",
      },
      {
        id: "inventariar-auditar",
        chapter: "MÉTODO",
        kind: "title-card",
        headline: "Inventariar, auditar y solo después construir.",
      },
      {
        id: "el-orden",
        chapter: "MÉTODO",
        kind: "ledger",
        headline: "El orden",
        items: [
          "Inventario de cada pantalla, a partir del código real.",
          "Tres auditorías escritas: diseño, arquitectura y seguridad.",
          "Un plan por fases.",
        ],
      },
      {
        id: "test-primero",
        chapter: "MÉTODO",
        kind: "diagram",
        headline: "Test, fallo confirmado, implementación.",
        caption: "Cada funcionalidad nueva siguió el mismo orden.",
      },
      {
        id: "ios-no-verificado",
        chapter: "LO QUE NO SE HIZO",
        kind: "title-card",
        headline: "Decir que iOS está verificado.",
      },
      {
        id: "pendiente",
        chapter: "LO QUE NO SE HIZO",
        kind: "caption",
        headline: "Pendiente, y dicho así",
        caption:
          "El código de iOS está escrito con el mismo cuidado que el de Android, pero no se compiló durante la auditoría. Se documenta como pendiente en lugar de darlo por bueno.",
      },
      {
        id: "de-39-a-90",
        chapter: "RESULTADO",
        kind: "splash",
        sfx: "39 → 90",
        headline: "De 39 a 90 tests unitarios, escritos antes que la implementación.",
      },
      {
        id: "lo-que-dejo",
        chapter: "RESULTADO",
        kind: "ledger",
        headline: "Lo que dejó el proceso",
        items: [
          "La auditoría de seguridad encontró y corrigió una fuga real: errores internos del backend llegaban al usuario.",
          "Un sistema de diseño propio, con reducción de movimiento y objetivos táctiles de 48 dp.",
        ],
      },
    ],
  },
];

export const comicScripts: Record<string, ComicScript> = Object.fromEntries(
  scripts.map((script) => [script.slug, script]),
);

export const getComic = (slug: string): ComicScript | undefined => comicScripts[slug];

export const comicHref = (slug: string) => `/proyectos/${slug}/comic`;
