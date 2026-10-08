import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Bangers, Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { LenisProvider } from "@/components/lenis-provider";
import { SiteHeader } from "@/components/site-header";
import { SITE_NAME, SITE_URL, STUDIO_NAME, siteGraph } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets:  ["latin"],
  display:  "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets:  ["latin"],
  display:  "swap",
});

// Display face for headlines and comic-cover mastheads — a real editorial
// serif with optical sizing and italics, replacing the dark-tech geometric
// sans this site used before.
const fraunces = Fraunces({
  variable:      "--font-fraunces",
  subsets:       ["latin"],
  display:       "swap",
  axes:          ["opsz", "SOFT", "WONK"],
});

// Kept deliberately local to the comic moments: it has the hand-lettered,
// energetic voice of an action burst without taking over the portfolio's
// editorial typography.
const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// ── Global metadata (inherited by all pages unless overridden) ──
// Pages build theirs with buildMetadata() from "@/lib/seo", which sets the
// title, description, canonical, Open Graph and Twitter card in one place.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // Fallback for pages that only export a plain title.
  title: {
    default:  STUDIO_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Estudio de producto digital: apps móviles para Android, iOS y coche, backends y software de gestión a medida.",

  authors:   [{ name: STUDIO_NAME, url: SITE_URL }],
  creator:   STUDIO_NAME,
  publisher: STUDIO_NAME,

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:  true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  openGraph: {
    siteName: STUDIO_NAME,
    locale:   "es_ES",
    type:     "website",
  },

  twitter: {
    card: "summary_large_image",
  },

  // No default canonical on purpose: a page that forgot its own would
  // silently canonicalise to the home page.

  // Mobile status bar + PWA chrome colour
  other: {
    "theme-color": "#f3efe4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-ES"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${bangers.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Site-wide JSON-LD — Organization (studio) + Person (founder) + WebSite */}
        <JsonLd schemas={[siteGraph]} />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:border-2 focus:border-[color:var(--foreground)] focus:bg-[color:var(--background)] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-[color:var(--foreground)]"
        >
          Saltar al contenido
        </a>
        <LenisProvider />
        <SiteHeader />
        {/* The one <main> of the site: pages must not render their own. */}
        <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
