import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;

// Satori (next/og) can't resolve CSS custom properties, so these mirror the
// site's editorial paper palette (src/app/globals.css :root) as literal hex.
const PAPER   = "#f3efe4";
const INK     = "#1b1712";
const MUTED   = "#6b6152";
const BORDER  = "#d8cfba";
const SURFACE = "#ece5d4";
const PRIMARY = "#c1391f";

/**
 * Shared per-route Open Graph image layout — same visual family as the root
 * src/app/opengraph-image.tsx (top bar, FR mark, eyebrow, title, tag chips),
 * parameterized so each service/project page gets its own on-brand preview
 * instead of the one generic site-wide image. Flat editorial paper/ink
 * system, no glow/gradient blur — matches the live site's visual language.
 */
export function renderOgImage(opts: {
  eyebrow: string;
  title: string;
  description: string;
  tags?: string[];
}) {
  const { eyebrow, title, description, tags = [] } = opts;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: PAPER,
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: PRIMARY,
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "72px 80px 60px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                border: `2px solid ${INK}`,
                backgroundColor: PAPER,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: INK,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              FR
            </div>
            <span style={{ color: MUTED, fontSize: 15, letterSpacing: "0.05em" }}>
              francisco-requena.vercel.app
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 28, height: 3, backgroundColor: PRIMARY }} />
              <span
                style={{
                  color: PRIMARY,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                {eyebrow}
              </span>
            </div>

            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: INK,
                lineHeight: 1.1,
                letterSpacing: "-1.5px",
                maxWidth: 980,
              }}
            >
              {title}
            </div>

            <div style={{ fontSize: 24, color: MUTED, lineHeight: 1.4, maxWidth: 780 }}>
              {description}
            </div>
          </div>

          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    border: `1.5px solid ${BORDER}`,
                    backgroundColor: SURFACE,
                    padding: "10px 18px",
                    color: INK,
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: "monospace",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
