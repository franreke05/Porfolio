import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/static/"],
      },
      // Explicit allow rules for AI answer-engine crawlers — already permitted by the
      // wildcard rule above, but stated explicitly as a clear signal for GEO/AI search.
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
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
