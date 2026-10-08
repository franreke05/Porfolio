# PORTFOLIO — source of truth (keep short; reference, don't restate)

GOAL: visitor understands who we are → what we build → sees real work → trusts → contacts.
VOICE: studio ("nosotros"), Spanish (es-ES). Not "a programmer with several projects".
STACK: Next.js 16.2.6 App Router (read node_modules/next/dist/docs before coding), React 19, Tailwind 4, motion, lenis, zod, resend. Deploy: Vercel.
RUN: `npm run dev` (:3000) · gates: `npm run lint && npm run typecheck && npm run build`.
DATA: src/lib/site-data.ts (profile, services, projects) · src/lib/case-studies.ts · src/lib/seo.ts.

TAXONOMY (mandatory, proof priority top → bottom):
1. CLIENT WORK — CaravanTruck Way, OposiBot (both IN DEVELOPMENT, target: December 2026)
2. OUR PRODUCTS — RequenaDesk, EduTrack
3. CUSTOM BUSINESS SOFTWARE — OposiControl (vertical CRM/backoffice for OposiBot)
4. CASE STUDY — AgendNote
5. ACADEMIC / EXPERIMENTAL — FlashFix (interactive comic, own layout)

GLOBAL DO-NOT-CLAIM: client names/people, users, revenue, downloads, launch dates, testimonials,
logos, ratings. Every status must be one of: IMPLEMENTED / IN DEVELOPMENT / PLANNED (or the
indie ladder VISION / PROTOTYPE / IN DEVELOPMENT / RELEASED).

ROUTES AT BASELINE: / · /proyectos · /proyectos/{edutrack,flashfix,oposicontrol,orykai,[id]} ·
/servicios (+4 service pages) · /sobre-mi. MISSING: /contacto, CaravanTruck Way, OposiBot,
AgendNote, RequenaDesk pages; no auth/portal.

CONFLICTS
- OryKai vs RequenaDesk: CRMFreelance README says "OryKai software"; deploy script + product docs
  + team lead say RequenaDesk. RESOLUTION: public name = RequenaDesk; /proyectos/orykai → redirect.
- FlashFix vs FlashFlix: repo ProyectoFlashFix, app strings, README and comic art all say
  "FlashFix" (0 hits for "FlashFlix"). RESOLUTION: FlashFix.
- Site says 4 personal projects, first person singular; brief says studio with client work.
  RESOLUTION: brief wins.

Studio brand name: "ORYKAI SOFTWARE" (owner decision, DECISIONS.md REVISION 3).
UNKNOWN (human decision): legal entity, production domain for the studio.
