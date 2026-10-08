TYPE: CUSTOM CRM / vertical business software (built around OposiBot — NOT a generic CRM)
OWNER/RELATION: same client ecosystem as OposiBot; it is the admin/operations side and the backend authority.
STATUS: IN DEVELOPMENT
AUDIENCE: the team operating the OposiBot platform
PROBLEM: running an exam-prep platform (content, news, resources, shop, support tickets, users) by hand in the database, with no roles.
SOLUTION: multiplatform backoffice (Android, iOS, Desktop) + Ktor backend owning business rules, authorization and data access.
STRONGEST PROOF: strict Clean Architecture across 18+ Gradle modules; Ktor backend with tests; verified product-metrics / wallet scope.
TECH: Kotlin Multiplatform, Compose Multiplatform, Koin, Ktor, SQLDelight, Supabase (Auth/Postgres).
PUBLIC-SAFE FACTS: existing copy in src/lib/site-data.ts + src/lib/case-studies.ts (reviewed from source).
DO-NOT-CLAIM: generic CRM (that is RequenaDesk), finished, client name.
ASSETS: public/images/projects/oposicontrol-cover.webp
UNKNOWNS: screenshots cleared for publication.
