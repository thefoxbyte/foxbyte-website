import { legalBySlug, legalDocs } from "@/content/legal";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "FoxByte";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return legalDocs.map((p) => ({ doc: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ doc: string }> }) {
  const page = legalBySlug((await params).doc);
  if (!page) return ogImage({ eyebrow: "FoxByte", title: "PostgreSQL on your own servers" });
  return ogImage({ eyebrow: "Legal", title: page.title });
}
