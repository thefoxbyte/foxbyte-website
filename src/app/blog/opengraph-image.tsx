import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Engineering notes";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Blog", title: "Engineering notes" });
}
