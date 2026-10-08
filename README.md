# ORYKAI SOFTWARE

Web del estudio en Next.js: proyectos, servicios y contacto con reserva de reunión online.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Motion
- lucide-react
- Resend para el formulario de contacto
- Vercel Analytics

## Desarrollo

```bash
npm.cmd run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Contenido editable

- Perfil, enlaces, servicios, stack, experiencia y proyectos: `src/lib/site-data.ts`
- Formulario y validación: `src/app/actions.ts`
- CV descargable: `public/francisco-requena-cv.pdf`

## Contacto/Reservas

Tres canales que entran como un único LEAD (`src/lib/leads/model.ts`): reunión online
con reserva real, llamada telefónica y mensaje escrito. No hay base de datos.

| Endpoint | Uso |
| --- | --- |
| `GET /api/form-token` | Token firmado que acompaña a cada envío (anti-bot por tiempo). |
| `GET /api/booking/availability?from=YYYY-MM-DD&days=14` | Huecos libres en UTC. |
| `POST /api/booking` | Reserva: evento en el calendario + enlace de vídeo + `.ics`. |
| `POST /api/booking/cancel` | Cancela con el token devuelto al reservar. |
| `POST /api/leads` | Llamada (`channel: "PHONE"`) o mensaje (`channel: "EMAIL"`). |

Los tipos de petición y respuesta están en `src/lib/booking/contract.ts`.

- **Horario**: `src/lib/booking/config.ts` (lunes a viernes, 11:00–13:00 Europe/Madrid,
  30 min, margen, antelación mínima y horizonte). El servidor es la única autoridad:
  regenera la rejilla y rechaza cualquier hora que no sea suya.
- **Disponibilidad**: free/busy de Google Calendar. Para bloquear festivos o vacaciones,
  crea un evento "ocupado" en el calendario.
- **Sin doble reserva**: el evento usa un id determinista por hueco y se relee para
  comprobar que es nuestro (`src/lib/booking/providers/google.ts`).
- **Anti-spam**: honeypot, tiempo mínimo de envío, comprobación de `Origin` y límites
  por visitante. Los límites en memoria son por instancia y se pierden en cada arranque
  en frío: son un freno, no una garantía. El tope real es una regla de rate limit del
  WAF de Vercel sobre `POST /api/*`.
- **Sin credenciales** la API responde `503 PROVIDER_NOT_CONFIGURED`; nunca finge éxito.

### Variables

Copia `.env.example` a `.env.local`. En producción hacen falta `RESEND_API_KEY`,
`CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `SITE_ORIGIN`, `BOOKING_SIGNING_SECRET`,
`GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN` y,
opcionalmente, `GOOGLE_CALENDAR_ID`.

### Puesta en marcha de Google (una vez)

1. Google Cloud: crea un proyecto y activa **Google Calendar API**.
2. Pantalla de consentimiento OAuth: tipo *External*, ámbitos `calendar.events` y
   `calendar.freebusy`, y publícala **In production** (en *Testing* el refresh token
   caduca a los 7 días).
3. Crea un cliente OAuth de tipo *Desktop app*.
4. Con `GOOGLE_OAUTH_CLIENT_ID` y `GOOGLE_OAUTH_CLIENT_SECRET` en el entorno, ejecuta
   `node scripts/google-auth.mjs` e inicia sesión con la cuenta dueña del calendario.
5. Guarda el refresh token que imprime en Vercel (Production). No lo subas al repositorio.

### Desarrollo local sin credenciales

- `CALENDAR_PROVIDER=memory`: calendario falso en memoria. No crea eventos, invitaciones
  ni salas; las respuestas llevan `mode: "dev-memory"` y el enlace usa `meet.invalid`.
  Se rechaza en producción.
- `BOOKING_DEV_BUSY`: instantes ISO (un hueco cada uno) o fechas `YYYY-MM-DD` (día
  completo) separados por comas, para probar huecos ocupados y días llenos.
- Sin `RESEND_API_KEY`, los avisos se escriben en `.dev-outbox/` (ignorado por git).
- `RATE_LIMIT_DEV_MULTIPLIER=20` relaja los límites durante las pruebas manuales.

## Checks

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

## Vercel

El proyecto está preparado para importarse en Vercel desde GitHub. Nombre recomendado: `francisco-requena`; fallback: `francisco-requena-portfolio`.
