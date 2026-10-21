import { whyPage as page } from "@/content/pages";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = page.hero.title;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ eyebrow: page.hero.eyebrow, title: page.hero.title });
}
