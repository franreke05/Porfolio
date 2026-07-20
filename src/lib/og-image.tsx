import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Shared per-route Open Graph image layout — same visual family as the root
 * src/app/opengraph-image.tsx (accent bar, radial glows, FR mark, eyebrow,
 * title, tag chips), parameterized so each service/project page gets its own
 * on-brand preview instead of the one generic site-wide image.
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
          backgroundColor: "#070a10",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #52d0dc, #c8985a)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 600,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(200,152,90,0.12) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 400,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(82,208,220,0.08) 0%, transparent 70%)",
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: "1.5px solid rgba(200,152,90,0.6)",
                backgroundColor: "rgba(200,152,90,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#c8985a",
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "-0.5px",
              }}
            >
              FR
            </div>
            <span style={{ color: "rgba(232,225,207,0.6)", fontSize: 15, letterSpacing: "0.05em" }}>
              francisco-requena.vercel.app
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 28, height: 2, backgroundColor: "#52d0dc", borderRadius: 1 }} />
              <span
                style={{
                  color: "#52d0dc",
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
                color: "#e8e1cf",
                lineHeight: 1.1,
                letterSpacing: "-1.5px",
                maxWidth: 980,
              }}
            >
              {title}
            </div>

            <div style={{ fontSize: 24, color: "#7c8595", lineHeight: 1.4, maxWidth: 780 }}>
              {description}
            </div>
          </div>

          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    border: "1px solid rgba(28,42,60,1)",
                    backgroundColor: "rgba(18,29,46,0.8)",
                    borderRadius: 8,
                    padding: "10px 18px",
                    color: "#b2ab9a",
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
