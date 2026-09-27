import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050506",
          color: "#f1ece3",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#d6ff3e",
            fontSize: 22,
            letterSpacing: 4,
          }}
        >
          <span>{site.role.toUpperCase()}</span>
          <span>{site.location.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 0.9,
            }}
          >
            UZIEL CHECHIK
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 32,
              color: "#c6c1b8",
              maxWidth: 900,
            }}
          >
            {site.headline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#c6c1b8",
          }}
        >
          <span>{site.availability}</span>
          <span style={{ color: "#d6ff3e" }}>Digital Twin</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
