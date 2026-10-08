# ARCHITECTURE
BASELINE: static marketing site + one server action (src/app/actions.ts → Resend). No DB, no auth.
ENV present locally: only VERCEL_OIDC_TOKEN. RESEND_API_KEY not set → email cannot send locally.

TARGET SEAMS (build only what is needed now):
PUBLIC WEB → CONTACT/BOOKING → LEAD → (future) REQUENADESK
PUBLIC WEB → (future) AUTH → CUSTOMER PORTAL → ENTITLEMENTS → RequenaDesk web | secure download

LEAD: one model, three channels (EMAIL | PHONE | VIDEO_MEETING), one sink interface;
adapters: email notification now, RequenaDesk API later (no fake integration).
BOOKING: config in one module (Europe/Madrid, Mon–Fri, 11:00–13:00, 30 min, buffer configurable);
server is the only authority on availability; store UTC instants; revalidate + atomic reserve.
CALENDAR/VIDEO PROVIDER: behind an interface (free/busy, create event + meeting link).
FUTURE ENTITIES (names only, do not implement): User, Organization, Membership, Product,
Entitlement, Release, Download, Session, Subscription.
RequenaDesk is a separate Ktor + PostgreSQL system that already has accounts and a client portal;
the website must not duplicate its auth — it links / hands off to it.
