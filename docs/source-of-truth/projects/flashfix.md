TYPE: FINAL DEGREE PROJECT (PFG) — academic; not client work, not a SaaS
NAME: FlashFix (verified in repo, app strings, comic art; "FlashFlix" has zero evidence)
STATUS: academic MVP, later self-audited and partly refactored
AUDIENCE (of the app): drivers looking for a trusted nearby garage; garages; admin
STORY: ORIGIN (degree project) → PROBLEM (calling garages blind) → IDEA (geolocated marketplace + chat + ratings) → BUILD (17 screens, 3 roles) → CHALLENGES (global state, Material 2/3 mix, a critical user-deletion bug) → DECISIONS (own code audit, Material 3 migration, encrypted prefs) → RESULT (working MVP + honest lessons).
TECH: Jetpack Compose, Firebase, Room, Appwrite, Google Maps, EncryptedSharedPreferences.
TREATMENT: interactive comic / scroll story with its own layout. STORY > ANIMATION. Build by scenes: storyboard → low-fi → validate → final art.
EXISTING: src/components/flashfix-comic-reader.tsx, flashfix-comic-illustrations.tsx, flashfix-case-study.tsx, flashfix-interface-gallery.tsx; art in src/assets/flashfix-comic (13 files), capturas-flashfix (8 real screenshots), public/images/flashfix-comic-cover-v2.png.
DO-NOT-CLAIM: client, users, store release.
