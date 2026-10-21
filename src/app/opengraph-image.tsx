import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "FoxByte: every schema change, on the record.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "PostgreSQL on your own servers", title: "Every schema change,", accent: "on the record." });
}
