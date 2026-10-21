import { productBySlug, productPages } from "@/content/product";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "FoxByte";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return productPages.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const page = productBySlug((await params).slug);
  if (!page) return ogImage({ eyebrow: "FoxByte", title: "PostgreSQL on your own servers" });
  return ogImage({ eyebrow: page.hero.eyebrow, title: page.hero.title });
}
