import type { Metadata } from "next";
import { site } from "@/content/site";

export function pageMetadata({ title, description, path, noindex }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, siteName: site.name, title: `${title} | FoxByte`, description, locale: "en_US" },
    twitter: { card: "summary_large_image", title: `${title} | FoxByte`, description },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
