import { ImageResponse } from "next/og";

export const alt = "ManuDesign — Web Engineer";
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
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#0a0a0b",
          border: "1px solid rgba(245,242,234,0.12)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 4,
            backgroundColor: "#d6a85f",
            marginBottom: 36,
          }}
        />
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            letterSpacing: -0.02,
            color: "#f5f2ea",
            lineHeight: 1.1,
          }}
        >
          ManuDesign
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            color: "#a1a1aa",
            maxWidth: 720,
            lineHeight: 1.35,
          }}
        >
          Web Engineer · Next.js · SEO tecnico · GIS / PostGIS
        </div>
      </div>
    ),
    { ...size }
  );
}
