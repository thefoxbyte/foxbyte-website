import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "From nothing to a branch in five minutes";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Quickstart", title: "From nothing to a branch in five minutes" });
}
