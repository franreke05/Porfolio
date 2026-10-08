TYPE: CLIENT WORK / professional software
OWNER/RELATION: private client owns the repo and product; we design + build it (16-week contract from 2026-08-03).
STATUS: IN DEVELOPMENT (week 9–10 of 16; client field-testing Android candidates; target December 2026)
AUDIENCE: drivers of motorhomes, trucks and vans in Spain and Portugal
PROBLEM: car GPS apps route large vehicles onto roads they cannot take (height / weight / width / axle limits).
SOLUTION: offline-first GPS navigation with vehicle-profile routing, native Android Auto and Apple CarPlay.
STRONGEST PROOF: real-device certification loop + client road tests feeding fixes (field evidence overrides lab evidence); axle-load routing; honest "no data → no warning" handling.
TECH: Kotlin Multiplatform, Compose Multiplatform, Android, iOS, Android Auto (Car App Library), CarPlay, MapLibre, OpenStreetMap, Valhalla (behind a RoutingEngine abstraction), Ktor backend, PostgreSQL/PostGIS (Supabase), JWT auth, Stripe webhooks, Sentry, host + connected-device test suites.
PUBLIC-SAFE FACTS: the stack above; shared KMP core with native in-car layers; maps / routing / navigation separated; offline map packages; ~31 logical screens planned; Android is ahead of iOS.
IMPLEMENTED: shared domain, routing + maps on Android, vehicle profile, offline MapLibre, backend core, test suites, client APK candidates.
IN DEVELOPMENT: field-safety hardening, axle-load routing, iOS / CarPlay certification.
PLANNED: store release, remaining contract milestones.
DO-NOT-CLAIM: client name or people, launch, users, store availability, "iOS verified", metrics.
ASSETS: C:\Users\franr\OneDrive\Desktop\CaravanTruckWay\Proyecto (caravantruck_way_logo.svg, Logito.png, Mapa*Screen05.png, Ruta*.svg) — client-owned; nothing copied into this repo without owner confirmation.
UNKNOWNS: client permission and wording for a public case study; which screens are cleared for publication.
