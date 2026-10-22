import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Terminal } from "@/components/page/Blocks";
import { CtaBand } from "@/components/page/CtaBand";
import { JsonLd } from "@/components/page/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { postBySlug, posts } from "@/content/blog";
import { guideLinks } from "@/content/guides";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import styles from "@/components/page/Prose.module.css";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  if (!post) return {};
  const base = pageMetadata({ title: post.title, description: post.description, path: `/blog/${post.slug}` });
  return { ...base, openGraph: { ...base.openGraph, type: "article", publishedTime: post.date, tags: post.tags } };
}

const format = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function PostPage({ params }: Props) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();
  const others = posts.filter((p) => p.slug !== post.slug);
  return (
    <>
      <PageHero
        hero={{ eyebrow: post.tags.join(" · "), title: post.title, lede: post.description }}
        trail={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <article className={styles.article}>
        <div className={`wrap ${styles.body}`}>
          <div className={styles.meta}>
            <time dateTime={post.date}>{format(post.date)}</time>
            <span>{post.readingMinutes} min read</span>
            <span>FoxByte engineering</span>
          </div>
          {post.sections.map((s, i) => (
            <section key={s.heading ?? i} className={styles.body}>
              {s.heading && <h2>{s.heading}</h2>}
              {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {s.table && (
                <div className={styles.tableWrap}>
                  <table>
                    <thead>
                      <tr>
                        {s.table.head.map((h) => (
                          <th key={h} scope="col">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((r) => (
                        <tr key={r[0]}>
                          {r.map((c, ci) => (ci === 0 ? <th key={ci} scope="row">{c}</th> : <td key={ci}>{c}</td>))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {s.code && <Terminal lines={s.code} />}
            </section>
          ))}
        </div>
      </article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          keywords: post.tags.join(", "),
          mainEntityOfPage: `${site.url}/blog/${post.slug}`,
          author: { "@type": "Organization", name: site.name, url: site.url },
          publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/brand/mark-light.png` } },
        }}
      />
      <CtaBand title="Try it on your own data." lede="Install FoxByte in a few minutes and see it for yourself." related={[...others.map((p) => ({ label: p.title, href: `/blog/${p.slug}` })), ...guideLinks]} />
    </>
  );
}
