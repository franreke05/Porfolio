import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { LenisProvider } from "@/components/lenis-provider";
import {
  SITE_NAME,
  SITE_URL,
  personSchema,
  professionalServiceSchema,
  websiteSchema,
} from "@/lib/seo";

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

// ── Global metadata (inherited by all pages unless overridden) ──
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // Pages export their own title; this template wraps it.
  title: {
    default:  `${SITE_NAME} | Desarrollo de apps mobile, CRMs y webs`,
    template: `%s | ${SITE_NAME}`,
  },

  // Default description — overridden per page.
  description:
    "Freelance especializado en apps mobile con Kotlin/KMP, CRMs personalizados y webs rápidas con Next.js para empresas y autónomos en España.",

  // `keywords` is ignored by Google. Omitted intentionally.

  authors:  [{ name: SITE_NAME, url: SITE_URL }],
  creator:  SITE_NAME,
  publisher: SITE_NAME,

  robots: {
    index:            true,
    follow:           true,
    googleBot: {
      index:          true,
      follow:         true,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },

  // Open Graph defaults — pages override title/description/url.
  openGraph: {
    siteName: SITE_NAME,
    locale:   "es_ES",
    type:     "website",
  },

  // Twitter card defaults.
  twitter: {
    card: "summary_large_image",
  },

  // Canonical defaults to root — each page sets its own.
  alternates: {
    canonical: SITE_URL,
  },

  // Mobile status bar + PWA chrome colour
  other: {
    "theme-color": "#070a10",
  },

  // Verification placeholders — fill in once verified.
  // verification: { google: "YOUR_CODE" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Site-wide JSON-LD — Person + ProfessionalService + WebSite */}
        <JsonLd schemas={[personSchema, professionalServiceSchema, websiteSchema]} />
        <LenisProvider />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
