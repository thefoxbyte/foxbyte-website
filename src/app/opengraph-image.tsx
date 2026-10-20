import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "FoxByte: Let AI take the wheel. Main stays in your hands.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const mark = await readFile(join(process.cwd(), "public/brand/mark-dark.png"));
  const src = `data:image/png;base64,${mark.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #141922 0%, #293241 100%)", color: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={src} width={96} height={79} alt="" />
          <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>FoxByte</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Let AI take the wheel.</span>
          <span style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: "#ee6c4d" }}>Main stays in your hands.</span>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 26, color: "#aeb6c3" }}>
          <span>PostgreSQL 18</span>
          <span>Blackbox</span>
          <span>Realtime</span>
          <span>Migrations</span>
          <span>On your servers</span>
        </div>
      </div>
    ),
    size,
  );
}
