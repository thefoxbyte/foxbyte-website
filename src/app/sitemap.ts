import type { MetadataRoute } from "next";
import { posts } from "@/content/blog";
import { legalDocs } from "@/content/legal";
import { productPages } from "@/content/product";
import { site } from "@/content/site";

type Entry = { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly"; lastModified?: string };

const core: Entry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/product", priority: 0.9, changeFrequency: "monthly" },
  { path: "/ai-agents", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/download", priority: 0.9, changeFrequency: "monthly" },
  { path: "/use-cases", priority: 0.7, changeFrequency: "monthly" },
  { path: "/security", priority: 0.7, changeFrequency: "monthly" },
  { path: "/why-foxbyte", priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs", priority: 0.8, changeFrequency: "weekly" },
  { path: "/docs/quickstart", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/changelog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/company", priority: 0.5, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    ...core,
    ...productPages.map((p) => ({ path: p.path, priority: 0.8, changeFrequency: "monthly" as const })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, priority: 0.6, changeFrequency: "yearly" as const, lastModified: p.date })),
    ...legalDocs.map((d) => ({ path: `/legal/${d.slug}`, priority: 0.3, changeFrequency: "yearly" as const, lastModified: d.updated })),
  ];
  return entries.map((e) => ({
    url: `${site.url}${e.path === "/" ? "" : e.path}`,
    lastModified: e.lastModified ? new Date(e.lastModified) : new Date(),
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
