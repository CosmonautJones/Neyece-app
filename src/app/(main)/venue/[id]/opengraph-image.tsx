import { ImageResponse } from "next/og";
import { MOCK_VENUES, MOCK_SCORES } from "@/lib/mock-data";

export const runtime = "edge";
export const alt = "Neyece Venue";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: { id: string } }) {
  // TODO: Replace with real Supabase query when connected
  const venue = MOCK_VENUES.find((v) => v.id === params.id);
  const score = venue ? MOCK_SCORES[venue.id] : undefined;

  const name = venue?.name ?? "Venue Not Found";
  const neighborhood = venue?.neighborhood ?? "";
  const tags = ((venue?.vibe_tags as string[]) ?? []).slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "linear-gradient(135deg, #fef8f0 0%, #ffe4d6 50%, #ffd166 100%)",
          fontFamily: "sans-serif",
          padding: "48px",
        }}
      >
        {/* Score badge */}
        {score !== undefined && (
          <div
            style={{
              position: "absolute",
              top: "48px",
              right: "48px",
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              background: score >= 85 ? "#ff6b4a" : "#ffd166",
              color: score >= 85 ? "#fff" : "#1e1206",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: 800,
              border: "4px solid #1e1206",
              boxShadow: "6px 6px 0 #1e1206",
            }}
          >
            {score}
          </div>
        )}

        {/* Neyece wordmark */}
        <div
          style={{
            position: "absolute",
            top: "48px",
            left: "48px",
            fontSize: "28px",
            fontWeight: 800,
            color: "#1e1206",
            display: "flex",
          }}
        >
          N<span style={{ color: "#ff6b4a" }}>eye</span>ce
        </div>

        {/* Venue name */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            color: "#1e1206",
            lineHeight: 1.1,
            marginBottom: "12px",
            display: "flex",
          }}
        >
          {name}
        </div>

        {/* Neighborhood */}
        <div
          style={{
            fontSize: "24px",
            color: "#5c3d1e",
            marginBottom: "24px",
            display: "flex",
          }}
        >
          {neighborhood}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "12px" }}>
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                background: "#fff",
                border: "2px solid #1e1206",
                borderRadius: "24px",
                fontSize: "18px",
                fontWeight: 700,
                color: "#5c3d1e",
                boxShadow: "2px 2px 0 #1e1206",
                display: "flex",
              }}
            >
              {tag
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
