import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export async function ogImage({ eyebrow, title, accent }: { eyebrow: string; title: string; accent?: string }) {
  const mark = await readFile(join(process.cwd(), "public/brand/mark-dark.png"));
  const src = `data:image/png;base64,${mark.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #141922 0%, #293241 100%)", color: "#ffffff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={src} width={84} height={69} alt="" />
          <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>FoxByte</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#ee6c4d" }}>{eyebrow}</span>
          <span style={{ fontSize: title.length > 60 ? 54 : 66, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>{title}</span>
          {accent && <span style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, color: "#ee6c4d" }}>{accent}</span>}
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#aeb6c3" }}>
          <span>PostgreSQL 18</span>
          <span>Blackbox</span>
          <span>Realtime</span>
          <span>Migrations</span>
          <span>On your servers</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
