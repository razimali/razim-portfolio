import { ImageResponse } from "next/og";

import { site } from "@/data/site";

export const alt = site.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(140deg, #050507 0%, #0b0d12 55%, #0a1420 100%)",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#38bdf8",
            fontSize: 26,
            letterSpacing: 6,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#38bdf8",
              display: "flex",
            }}
          />
          RAZIM KHOKHAR
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            <span style={{ display: "flex" }}>Computer Science Student</span>
            <span style={{ display: "flex" }}>
              Building Intelligent Software.
            </span>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#a1aab8" }}>
            Python • AI Engineering • Automation • Networking
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#6b7280" }}>
          {site.education.degree} — {site.education.school}
        </div>
      </div>
    ),
    { ...size },
  );
}
