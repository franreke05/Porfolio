import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const runtime     = "edge";
export const alt         = `${SITE_NAME} — Apps mobile, CRMs y webs para empresas`;
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

const SERVICES = ["Kotlin / KMP", "CRM SQL", "Next.js", "Automatizaciones"];

export default function OGImage() {
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
        {/* Top accent bar */}
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

        {/* Background radial glow — top right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 600,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(200,152,90,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Background radial glow — bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 400,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(82,208,220,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "72px 80px 60px",
            justifyContent: "space-between",
          }}
        >
          {/* Top: logo mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
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
            <span
              style={{
                color: "rgba(232,225,207,0.6)",
                fontSize: 15,
                letterSpacing: "0.05em",
              }}
            >
              francisco-requena.vercel.app
            </span>
          </div>

          {/* Middle: name + tagline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 2,
                  backgroundColor: "#52d0dc",
                  borderRadius: 1,
                }}
              />
              <span
                style={{
                  color: "#52d0dc",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Portfolio profesional
              </span>
            </div>

            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: "#e8e1cf",
                lineHeight: 1.08,
                letterSpacing: "-1.5px",
              }}
            >
              {SITE_NAME}
            </div>

            <div
              style={{
                fontSize: 26,
                color: "#7c8595",
                lineHeight: 1.4,
                maxWidth: 700,
              }}
            >
              Apps mobile · CRMs a medida · Webs rápidas · Automatizaciones
            </div>
          </div>

          {/* Bottom: service chips */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {SERVICES.map((service) => (
              <div
                key={service}
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
                {service}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
