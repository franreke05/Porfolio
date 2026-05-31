# Portfolio de Francisco Requena Sánchez

Portfolio personal en Next.js para presentar servicios de apps mobile, CRMs personalizados y webs informativas.

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

## Formulario

Copia `.env.example` a `.env.local` y configura:

```bash
RESEND_API_KEY=
CONTACT_TO_EMAIL=franciscorequenasanchez0@gmail.com
CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>
```

Sin estas variables, la web muestra fallback al email y WhatsApp.

## Checks

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

## Vercel

El proyecto está preparado para importarse en Vercel desde GitHub. Nombre recomendado: `francisco-requena`; fallback: `francisco-requena-portfolio`.
