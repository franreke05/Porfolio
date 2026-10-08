import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// /_next/ is deliberately NOT disallowed: crawlers need the CSS and JS there
// to render the pages.
const DISALLOW = ["/api/", "/contacto/cancelar"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      // AI answer engines, named explicitly. A crawler obeys only its most
      // specific group, so the disallow list is repeated here.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ClaudeBot",
          "Google-Extended",
          "PerplexityBot",
          "CCBot",
          "Applebot-Extended",
          "Amazonbot",
        ],
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
