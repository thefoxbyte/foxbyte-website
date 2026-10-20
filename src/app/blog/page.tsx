import Link from "next/link";
import { PageHero } from "@/components/page/PageHero";
import { CtaBand } from "@/components/page/CtaBand";
import { posts } from "@/content/blog";
import { pageMetadata } from "@/lib/metadata";
import styles from "@/components/page/Prose.module.css";

export const metadata = pageMetadata({
  title: "Engineering notes",
  description: "How FoxByte is built: branching Postgres without a new storage engine, tamper-evident records, and guardrails for AI agents, with the measurements behind them.",
  path: "/blog",
});

const format = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero
        hero={{ eyebrow: "Blog", title: "Engineering notes", lede: "How FoxByte is built and why, with the numbers behind each decision." }}
        trail={[{ label: "Blog", href: "/blog" }]}
      />
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className={`wrap ${styles.list}`}>
          {sorted.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className={styles.postCard}>
              <div className={styles.meta}>
                <time dateTime={p.date}>{format(p.date)}</time>
                <span>{p.readingMinutes} min read</span>
              </div>
              <h2>{p.title}</h2>
              <p>{p.description}</p>
              <div className={styles.tags}>
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <span className={styles.more}>Read the note →</span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand title="Try what you just read about." lede="Everything in these notes ships in the free edition, except where it says Enterprise." />
    </>
  );
}
