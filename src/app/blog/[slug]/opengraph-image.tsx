import { postBySlug, posts } from "@/content/blog";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "FoxByte";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const page = postBySlug((await params).slug);
  if (!page) return ogImage({ eyebrow: "FoxByte", title: "PostgreSQL on your own servers" });
  return ogImage({ eyebrow: "Engineering notes", title: page.title });
}
