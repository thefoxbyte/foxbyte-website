import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Talk to the team that builds FoxByte";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: "Contact", title: "Talk to the team that builds FoxByte" });
}
