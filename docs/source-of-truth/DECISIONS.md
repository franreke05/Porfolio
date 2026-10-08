# DECISIONS (team lead, post-audit) — binding for all build agents

## Truth & copy
- Project facts come ONLY from `src/lib/portfolio.ts` (typed catalogue: categories, status, scope
  ledger, delivery track, story, proof, stack, CTA+intent) and docs/source-of-truth/projects/*.md.
  Do not add facts, numbers, dates, client names, prices, durations or track-record claims.
- Voice: "nosotros", es-ES. Brand line: "Francisco Requena" + "estudio de producto".
- BANNED in visible copy: "beta pública", "en producción", "Todo publicado", "100%", "OryKai",
  "nada anonimizado", "Portfolio personal", "freelance", "3+ Años", "12+ Techs", fixed week
  estimates, "me cuentan las empresas"-style implied history, Granada geo-targeting.
- Status: only `StatusBadge` (src/components/ui/status-badge.tsx, CSS `.status[data-s]` in
  globals.css). Vermillion is action/emphasis only, never a status.
- CTAs: one primary per page → `contactHref(intent)` from portfolio.ts → `/contacto?intent=…`.
  No `/#contacto` anywhere. Primary label on home: "Reservar reunión"; secondary "Ver proyectos".

## Home (ordered)
1 Hero: H1 "Diseñamos y construimos productos digitales de principio a fin." + subhead
  "Apps móviles para Android, iOS y coche, backends y software de gestión a medida. Un estudio
  pequeño, con proyectos de cliente en desarrollo que puedes ver por dentro." + CTA pair. Right
  column: "En el taller ahora" ledger (7 projects: name · category · status; client rows first, bold).
2 Client work: two full-width ink-inverted job sheets (delivery track + scope ledger).
3 Our products + custom software. 4 How we work (4 ruled steps) + AgendNote teaser.
5 FlashFix single tilted cover, "Proyecto académico". 6 Services (3 pillars). 7 Contact band (3 channels → /contacto).
Removed from home: phone mockup, stats row, hero tech chips, embedded contact form.

## Visual system ("studio ledger")
- Keep paper / ink / one vermillion, Fraunces for h1/h2 + numerals, Geist for h3/body/UI, mono labels.
- Radius 0 (2px on inputs). Hard shadow (`--shadow-hard`) only on primary CTAs and selected booking cell.
- 2px ink rules are structural; 1px `--border` inside modules. Rows/tables over cards; ≤3 boxes per fold.
- Archetypes: CLIENT WORK = "hoja de obra" (ink-inverted, `.on-ink`, delivery-track SVG, scope ledger;
  CaravanTruck Way adds a route polyline motif) · PRODUCT = "ficha" (typographic poster, 4-step ladder,
  spec table) · CUSTOM SOFTWARE = "plano" (dot grid, annotated SVG architecture diagram) ·
  CASE STUDY = "cuaderno" (narrow measure + mono margin notes) · ACADEMIC = comic (only place for
  halftone/Bangers/tilt). No device frames or invented UI for projects without cleared screenshots.
- Motion: CSS first; `motion` only where needed; nothing server-rendered at opacity:0 for LCP text;
  honour prefers-reduced-motion. No new dependencies without asking the lead.

## Routes
/ · /proyectos (5 category sections, fixed order) · /proyectos/[slug] (one route,
generateStaticParams from portfolio.ts, dynamicParams=false, switches template on category) ·
/servicios (+ service pages) · /sobre-mi · /contacto (+ /contacto/cancelar) · not-found, error.
/proyectos/orykai → /proyectos/requenadesk (308, next.config.ts, backend owner).

## Contact
Route handlers, contract frozen: types in `src/lib/booking/contract.ts`, intents in
`src/lib/leads/model.ts`. Three channels: Reunión · Te llamamos · Escríbenos. Headline
"Cuéntanos qué quieres construir." Server is the only authority on availability; show Madrid time +
visitor local time; `mode:"dev-memory"` → visible "MODO DEMO LOCAL" banner; 503 → direct email/phone.

## Engineering rules
- Next 16: `params`/`searchParams` are Promises; read node_modules/next/dist/docs before using an API.
- Server components by default; small client islands. One `<main id="contenido">` lives in
  src/app/layout.tsx — pages must NOT render their own `<main>`.
- Do NOT edit files outside your ownership list. globals.css is lead-owned: use Tailwind utilities
  or a co-located `*.module.css`. Need a shared token/primitive? Ask the lead in your report.
- Dev server runs on :3000 — never start/stop it, never run `next build`. Verify with screenshots:
  `cd "C:/Users/franr/AppData/Local/Temp/claude/c--Users-franr-Porfolio/a0f19c3e-73e5-42fd-bdb8-b58a949b3308/scratchpad" && MSYS_NO_PATHCONV=1 node shot.cjs <prefix> <mobile|laptop|large> /path …`
  (FULL=1 for full page; output shots/<prefix>-<viewport>-<name>.png; prints status, overflow, console errors).
  Loop: change → render → screenshot → inspect (Read the PNG) → fix, at mobile AND laptop.
- Other agents are editing other files at the same time: a typecheck error in a file you do not
  own is not yours — report it, do not fix it.
- Final report ≤20 lines: files changed, evidence (screenshots inspected, checks run), open issues, requests to lead.

## REVISION 2 (owner, overrides "Visual system" + "Home" above where they conflict)
CONCEPT: the site is a COMIC SHOP ("tienda de cómics"). Every project is a comic on the shelves.
- CARTELERA: projects are shown as comic covers (posters) on shelves, never as plain rows/cards.
  Shelves = the 5 categories in the fixed proof order; client work gets the biggest covers / the
  "novedades" window. Each cover: issue number, title, one-line tagline, StatusBadge stamp, and TWO
  actions: "Leer el cómic" → /proyectos/<slug>/comic and "Ficha profesional" → /proyectos/<slug>.
- TWO MODES per project, with a persistent switch on both pages (Cómic | Profesional):
  /proyectos/<slug> = professional sheet (existing templates, canonical URL);
  /proyectos/<slug>/comic = immersive scroll comic (FlashFix already has full art; the other six
  are built from scripts in src/lib/comics.ts with CSS/SVG panels — storyboard / low-fi first).
- "Clients publish theirs": the conversion metaphor. Primary CTA wording family: "Publica el tuyo" /
  "Encarga tu cómic" → /contacto?intent=…; the contact page is "el mostrador". Real client
  self-publishing (accounts, uploads) is NOT built — it belongs to the future customer portal.
- GUARDRAILS that still hold: the hero must say in plain words what we do (H1 stays "Diseñamos y
  construimos productos digitales de principio a fin."); the metaphor decorates, it never replaces
  clarity. All truth rules, banned strings, StatusBadge, a11y, reduced motion, no invented UI/logos.
  Comic vocabulary (halftone, Bangers, tilt, bursts, offset shadows) is now allowed sitewide for
  covers, shelves and comic mode; professional sheets stay sober (the "studio ledger" archetypes).
- COVER ART: real art exists for edutrack, oposicontrol, flashfix. No image generator is available
  now: caravantruck-way, oposibot, requenadesk, agendnote get designed CSS/SVG covers (halftone,
  sunburst, Bangers title, one SVG motif each: route line + vehicle silhouette / robot + books /
  desk bell + tickets / agenda + checks; own accent colour each). No client logos, no fake UI.
  Shared component contract: `import { ProjectCover } from "@/components/shop/project-cover"` →
  `<ProjectCover slug="oposibot" size="sm" | "md" | "lg" priority? />` (2:3, server component, no links inside).
- OWNER CLARIFICATION on "publish": if a client hires us, their project ALSO gets its own comic
  in the shop. This is a real, statable offer: "Si construimos tu producto, también tendrá su
  cómic en la cartelera." Use it as the hook of the shop CTAs ("Publica el tuyo") and once on
  /contacto. It is published with the client's agreement — never promise it for confidential work,
  and never imply clients upload anything themselves.

## REVISION 3 (owner) — HOME = realistic 3D showroom. Overrides REVISION 2 for the HOME and brand.
- BRAND: the visible company name is now **ORYKAI SOFTWARE** (wordmark "ORYKAI" + small spaced
  "SOFTWARE"; minimal, premium, technical, human). Replaces "Francisco Requena · estudio de
  producto" everywhere. RequenaDesk keeps its product name.
- VISUAL GOAL = docs/source-of-truth/home-goal.png. It is the source of truth for composition,
  camera, light, materials, spacing and density of the HOME. Credible > spectacular. Space >
  decoration. 70% architecture / 20% product / 10% decoration. If in doubt, leave it empty.
- The home is ONE immersive experience: a physical ORYKAI showroom, warm late-afternoon daylight
  from tall left windows, natural matte wood, black/graphite metal, pale concrete, glass, cream,
  a few plants. No neon/RGB/cyberpunk/gaming light, no bloom, no particles, no floating cards,
  no glassmorphism, no saturated comic store.
- Four service categories (owner's offer, mandatory, in the counter's glass front, interactive):
  1 Posicionamiento de páginas webs · 2 Creación de páginas webs · 3 Automatizaciones con IA ·
  4 Apps personalizadas. Each also exists as a signed section of the shop. Only "Apps
  personalizadas" carries the catalogue for now: 7 separate slots (4 + 3), one per project, as
  PLACEHOLDERS (pale rectangle + very thin X) with geometry ready for 2:3 covers.
- Header on the scene: ORYKAI SOFTWARE · Inicio · Nuestro trabajo · Servicios · Sobre nosotros ·
  [Hablamos]. Almost invisible: no bar, no box.
- Hero copy (left, lots of negative space): micro "IDEAS · SOFTWARE · RESULTADOS" / H1 "Productos
  digitales que dejan huella" / "Diseñamos y desarrollamos software real para personas y
  empresas. Desde ideas a productos que funcionan." / CTA "Hablamos de tu proyecto".
- Scroll = camera travel inside the SAME space (frame 0 wide shot → counter → along the glass
  front → turn/dolly to the shelving → Apps personalizadas → the 7 slots). Click on a category or
  shelf moves the camera there. Smooth, never dizzying; no orbit controls.
- Other pages keep working but receive no design effort now. Truth rules and banned claims hold.

## REVISION 4 (owner) — GOLDEN MATCH
- GOLDEN_REFERENCE = docs/source-of-truth/GOLDEN_REFERENCE.png (1672×941, clean plate: no UI, white
  X placeholders). It replaces home-goal.png as the absolute visual target of FRAME 0. The UI overlay
  (header, hero copy, CTA) keeps the positions of home-goal.png.
- Visual fidelity > technical purity. Authorised: camera-projected texture on matched geometry,
  baked layers, hybrid composite, pre-rendered transition. NOT authorised: a flat <img> pretending
  to be 3D — depth and interaction must be real. The user must not notice the trick.
- Blender is not installed on this machine → strategy = CAMERA PROJECTION of the golden plate onto
  matched proxy geometry for F0 (projector depth test; occluded/out-of-frustum fragments fall back
  to the modelled PBR scene), dissolving into the real 3D scene as the camera travels.
- Gate: FRAME_0_VISUAL = PASS before effort on F1–F5. Camera locked once matched. Best-shot policy:
  never keep an iteration that scores worse than the best. After 2 iterations with <2% gain, change
  approach. No commits.
- Metrics (masked: ignore UI overlay; placeholders' inner content not penalised): landmark error
  < 2%, luminance ±5%, ΔE < 25 (ideal < 18), SSIM > 0.88 (ideal > 0.92), edge similarity; regions
  R1 left windows · R2 left wall · R3 sofa · R4 counter · R5 countertop · R6 lower display ·
  R7 product wall · R8 ceiling/lights · R9 floor/shadows · R10 background depth.
