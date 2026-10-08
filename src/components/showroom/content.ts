import type { ContactIntent } from "@/lib/leads/model";
import { contactHref, portfolioProjects, projectHref } from "@/lib/portfolio";
import { siteProfile } from "@/lib/site-data";

/**
 * The words of the home. Shared by the server-rendered semantic layer, the
 * overlay captions and the lettering painted inside the 3D scene, so the
 * three can never disagree.
 */

/**
 * DETAIL CONTENT — the one place the owner's data goes.
 *
 * Every entry of the home (a service, a project, the founder) owns a
 * `detail.blocks` list. A block WITHOUT `content` renders as a pale
 * rectangle with a thin X and its label ("Imagen principal", "Descripción"…).
 * Fill `content` and the same block renders the real thing; no component
 * needs touching.
 *
 *   image    content: { src, alt }
 *   text     content: "one paragraph" | ["several", "paragraphs"]
 *   list     content: ["item", "item"]
 *   gallery  content: [{ src, alt }, …]
 *
 * `ratio` is a CSS aspect-ratio ("16 / 10") for the placeholder / image box.
 */
export type DetailImage = { src: string; alt: string };
export type DetailBlock =
  | { kind: "image"; label: string; ratio?: string; content?: DetailImage }
  | { kind: "text"; label: string; ratio?: string; content?: string | string[] }
  | { kind: "list"; label: string; ratio?: string; content?: string[] }
  | { kind: "gallery"; label: string; ratio?: string; content?: DetailImage[] };
export type Detail = { blocks: DetailBlock[] };

/** A fresh, empty sheet per entry: fill each entry's blocks independently. */
const emptyDetail = (): Detail => ({
  blocks: [
    { kind: "image", label: "Imagen principal", ratio: "16 / 10" },
    { kind: "text", label: "Descripción" },
    { kind: "list", label: "Qué incluye" },
    { kind: "text", label: "Resultados" },
    { kind: "gallery", label: "Galería" },
  ],
});

export type ShowroomCategory = {
  id: "posicionamiento" | "creacion" | "automatizaciones" | "apps";
  /** Hash segment: /#servicios/<slug>. */
  slug: string;
  name: string;
  /** The name broken in two for the plinth lettering. */
  lines: [string, string];
  /** The service's own page: the crawlable link behind the in-home panel. */
  href: string;
  intent: ContactIntent;
  detail: Detail;
  /** Scroll progress at which the camera faces this glass compartment. */
  progress: number;
};

export const CATEGORIES: ShowroomCategory[] = [
  {
    id: "posicionamiento",
    slug: "posicionamiento-de-paginas-webs",
    name: "Posicionamiento de páginas webs",
    lines: ["Posicionamiento", "de páginas webs"],
    href: "/servicios/diseno-web-empresas",
    intent: "web",
    detail: emptyDetail(),
    progress: 0.21,
  },
  {
    id: "creacion",
    slug: "creacion-de-paginas-webs",
    name: "Creación de páginas webs",
    lines: ["Creación", "de páginas webs"],
    href: "/servicios/diseno-web-empresas",
    intent: "web",
    detail: emptyDetail(),
    progress: 0.275,
  },
  {
    id: "automatizaciones",
    slug: "automatizaciones-con-ia",
    name: "Automatizaciones con IA",
    lines: ["Automatizaciones", "con IA"],
    href: "/servicios/automatizaciones-pymes",
    intent: "custom-software",
    detail: emptyDetail(),
    progress: 0.34,
  },
  {
    id: "apps",
    slug: "apps-personalizadas",
    name: "Apps personalizadas",
    lines: ["Apps", "personalizadas"],
    href: "/servicios/desarrollo-apps-android",
    intent: "mobile-app",
    detail: emptyDetail(),
    progress: 0.405,
  },
];

/** The seven catalogue slots: 4 above, 3 below. Names only. */
const SLOT_ORDER = [
  "caravantruck-way",
  "oposibot",
  "requenadesk",
  "edutrack",
  "oposicontrol",
  "agendnote",
  "flashfix",
];

export const SLOT_PROJECTS = SLOT_ORDER.map((slug) => {
  const project = portfolioProjects.find((item) => item.slug === slug);
  const intent: ContactIntent = project?.cta.intent ?? "general";
  return { slug, name: project?.name ?? slug, intent, detail: emptyDetail() };
});

/** The founder: a framed portrait in the room and the "Sobre nosotros" stage. */
export const FOUNDER: {
  slug: string;
  name: string;
  role: string;
  href: string;
  linkLabel: string;
  photo: string;
  print: string;
  detail: Detail;
} = {
  slug: "francisco-requena",
  name: "Francisco Requena",
  role: "Fundador",
  href: "/sobre-mi",
  linkLabel: "Ver perfil completo",
  /** Original photo (semantic layer) and the cropped, warm-graded print hung in the scene. */
  photo: "/images/francisco-requena-portrait.jpeg",
  print: "/showroom/founder.webp",
  detail: {
    blocks: [
      { kind: "text", label: "Bio" },
      { kind: "list", label: "Experiencia" },
      { kind: "list", label: "Valores" },
    ],
  },
};

export const HERO = {
  micro: "IDEAS · SOFTWARE · RESULTADOS",
  titleA: "Productos digitales",
  titleB: "que",
  titleAccent: "dejan huella",
  body: ["Diseñamos y desarrollamos software real", "para personas y empresas. Desde ideas", "a productos que funcionan."],
  cta: "Hablamos de tu proyecto",
  ctaHref: contactHref("general"),
};

/**
 * The closing plaque: what used to be the page footer, now signage inside
 * the room. `row` is the baseline in pixels on the 1024px plaque canvas, so
 * the painted lettering and its click targets share one source.
 */
export type ContactRow = {
  label: string;
  href: string;
  row: number;
  size: number;
  kind: "cta" | "contact" | "link";
  /** In the home this line moves the camera to a stage… */
  stage?: StageId;
  /** …or opens the contact sheet, instead of following `href`. */
  sheet?: boolean;
};

export const CONTACT_ROWS: ContactRow[] = [
  { kind: "cta", label: HERO.cta, href: HERO.ctaHref, row: 390, size: 50, sheet: true },
  { kind: "contact", label: siteProfile.email, href: siteProfile.links.mail, row: 512, size: 33 },
  { kind: "contact", label: siteProfile.displayPhone, href: `tel:${siteProfile.phone}`, row: 572, size: 33 },
  { kind: "link", label: "Nuestro trabajo", href: "/#trabajo", row: 690, size: 32, stage: "trabajo" },
  { kind: "link", label: "Servicios", href: "/#servicios", row: 748, size: 32, stage: "servicios" },
  { kind: "link", label: "Sobre nosotros", href: "/#nosotros", row: 806, size: 32, stage: "nosotros" },
  { kind: "link", label: "Contacto", href: "/contacto", row: 864, size: 32, sheet: true },
];
export const COPYRIGHT = "© 2026 ORYKAI SOFTWARE";

/** Progress at which the camera shows the whole glass case (the four services). */
export const SERVICES_PROGRESS = 0.072;
/** Progress at which the camera has settled on the seven slots. */
export const APPS_PROGRESS = 0.82;
/** The contact plaque. */
export const CONTACT_PROGRESS = 0.915;
/** The last frame: the founder's portrait. The scroll ends here. */
export const FOUNDER_PROGRESS = 1;
export const FOUNDER_CAPTION_FROM = 0.962;
export const CONTACT_CAPTION_FROM = 0.875;
/** From here on the catalogue caption is the one on screen. */
export const APPS_CAPTION_FROM = 0.68;
export const CATEGORY_CAPTION_FROM = 0.165;
export const CATEGORY_CAPTION_TO = 0.48;

/* ───────────────────────── stages and entries ───────────────────────── */

/** The header's destinations inside the home; also the URL hash (/#trabajo). */
export type StageId = "inicio" | "servicios" | "trabajo" | "contacto" | "nosotros";
export const STAGES: Record<StageId, { label: string; progress: number }> = {
  inicio: { label: "Inicio", progress: 0 },
  servicios: { label: "Servicios", progress: SERVICES_PROGRESS },
  trabajo: { label: "Nuestro trabajo", progress: APPS_PROGRESS },
  contacto: { label: "Contacto", progress: CONTACT_PROGRESS },
  nosotros: { label: "Sobre nosotros", progress: FOUNDER_PROGRESS },
};
export const isStage = (value: string): value is StageId => value in STAGES;

/** Which stage a scroll progress belongs to (null: between stages). */
export function stageAt(progress: number): StageId | null {
  if (progress < 0.045) return "inicio";
  if (progress < 0.49) return "servicios";
  if (progress < 0.64) return null;
  if (progress < CONTACT_CAPTION_FROM) return "trabajo";
  if (progress < FOUNDER_CAPTION_FROM) return "contacto";
  return "nosotros";
}

export type EntryGroup = "servicios" | "trabajo" | "nosotros";
/** Anything that opens the detail panel. `key` is "<group>/<slug>": the hash and the camera-focus id. */
export type ShowroomEntry = {
  key: string;
  group: EntryGroup;
  slug: string;
  eyebrow: string;
  title: string;
  /** Scroll progress the camera travels to before framing the object. */
  progress: number;
  intent: ContactIntent;
  detail: Detail;
  /** The entry's own page (crawlable; shown in the panel only when `linkLabel` is set). */
  href: string;
  linkLabel?: string;
};

export const FOUNDER_KEY = `nosotros/${FOUNDER.slug}`;
export const categoryKey = (index: number) => `servicios/${CATEGORIES[index].slug}`;
export const projectKey = (slug: string) => `trabajo/${slug}`;

export const ENTRIES: ShowroomEntry[] = [
  ...CATEGORIES.map(
    (category, index): ShowroomEntry => ({
      key: categoryKey(index),
      group: "servicios",
      slug: category.slug,
      eyebrow: "Servicios",
      title: category.name,
      progress: category.progress,
      intent: category.intent,
      detail: category.detail,
      href: category.href,
    }),
  ),
  ...SLOT_PROJECTS.map(
    (project): ShowroomEntry => ({
      key: projectKey(project.slug),
      group: "trabajo",
      slug: project.slug,
      eyebrow: "Nuestro trabajo",
      title: project.name,
      progress: APPS_PROGRESS,
      intent: project.intent,
      detail: project.detail,
      href: projectHref(project.slug),
    }),
  ),
  {
    key: FOUNDER_KEY,
    group: "nosotros",
    slug: FOUNDER.slug,
    eyebrow: "Sobre nosotros",
    title: FOUNDER.name,
    progress: FOUNDER_PROGRESS,
    intent: "general",
    detail: FOUNDER.detail,
    href: FOUNDER.href,
    linkLabel: FOUNDER.linkLabel,
  },
];
export const findEntry = (key: string) => ENTRIES.find((entry) => entry.key === key);

/** The three ways into the contact flow (which lives at /contacto). */
export const CONTACT_CHOICES = [
  { canal: "video", title: "Reunión", hint: "30 min online" },
  { canal: "telefono", title: "Te llamamos", hint: "Por teléfono" },
  { canal: "email", title: "Escríbenos", hint: "Por email" },
] as const;
export const contactChoiceHref = (canal: string, intent: ContactIntent) => `/contacto?canal=${canal}&intent=${intent}`;

/** Right-edge progress ticks. */
export const TICKS = [
  { label: "Inicio", progress: 0 },
  { label: "Servicios", progress: SERVICES_PROGRESS },
  { label: "Nuestros productos", progress: 0.57 },
  { label: "Apps personalizadas", progress: APPS_PROGRESS },
  { label: "Contacto", progress: CONTACT_PROGRESS },
  { label: "Sobre nosotros", progress: FOUNDER_PROGRESS },
] as const;

/** -1 none, 0..3 category, 4 catalogue, 5 contact, 6 founder. */
export function captionAt(progress: number): number {
  if (progress >= FOUNDER_CAPTION_FROM) return 6;
  if (progress >= CONTACT_CAPTION_FROM) return 5;
  if (progress >= APPS_CAPTION_FROM) return 4;
  if (progress < CATEGORY_CAPTION_FROM || progress > CATEGORY_CAPTION_TO) return -1;
  let best = 0;
  for (let i = 1; i < CATEGORIES.length; i += 1) {
    if (Math.abs(CATEGORIES[i].progress - progress) < Math.abs(CATEGORIES[best].progress - progress)) best = i;
  }
  return best;
}

export function tickAt(progress: number): number {
  let best = 0;
  for (let i = 1; i < TICKS.length; i += 1) {
    if (progress >= (TICKS[i - 1].progress + TICKS[i].progress) / 2) best = i;
  }
  return best;
}
