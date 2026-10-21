import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Install FoxByte on macOS, Linux or Windows";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Download", title: "Install FoxByte on macOS, Linux or Windows" });
}
