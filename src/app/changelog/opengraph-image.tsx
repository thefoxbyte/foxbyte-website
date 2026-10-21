import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "What shipped, and when";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Changelog", title: "What shipped, and when" });
}
