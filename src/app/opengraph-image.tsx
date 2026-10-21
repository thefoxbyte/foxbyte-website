import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "FoxByte: Let AI take the wheel. Main stays in your hands.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "PostgreSQL on your own servers", title: "Let AI take the wheel.", accent: "Main stays in your hands." });
}
