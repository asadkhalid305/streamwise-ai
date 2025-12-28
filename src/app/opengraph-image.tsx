import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "StreamWise AI - Intelligent Curator";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #111827, #000000)",
          color: "white",
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.2)", // Indigo
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(168, 85, 247, 0.2)", // Purple
            filter: "blur(80px)",
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            {/* Simple Play Icon */}
            <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: 24 }}
            >
                <path d="M5 3L19 12L5 21V3Z" fill="#818CF8" />
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <h1 style={{ fontSize: 64, fontWeight: "bold", margin: 0, lineHeight: 1 }}>
                    StreamWise AI
                </h1>
                <h2 style={{ fontSize: 32, fontWeight: "normal", margin: 0, opacity: 0.8, marginTop: 10 }}>
                    Intelligent Entertainment Curator
                </h2>
            </div>
        </div>
        
        <div style={{ 
            display: "flex", 
            gap: 12, 
            marginTop: 40,
            fontSize: 24,
            opacity: 0.6
        }}>
            <span style={{ background: "#374151", padding: "8px 16px", borderRadius: 8 }}>Next.js 15</span>
            <span style={{ background: "#374151", padding: "8px 16px", borderRadius: 8 }}>OpenAI Agents</span>
            <span style={{ background: "#374151", padding: "8px 16px", borderRadius: 8 }}>TMDB API</span>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
