import { posts } from "@/content/blog";
import { site } from "@/content/site";

export const dynamic = "force-static";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((p) => {
      const url = `${site.url}/blog/${p.slug}`;
      return `<item><title>${escape(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escape(p.description)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>FoxByte engineering notes</title><link>${site.url}/blog</link><description>How FoxByte is built and why, with the numbers behind each decision.</description><language>en</language><atom:link href="${site.url}/blog/rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
