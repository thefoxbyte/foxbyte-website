import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page/PageHero";
import { legalBySlug, legalDocs } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";
import styles from "@/components/page/Prose.module.css";

type Props = { params: Promise<{ doc: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocs.map((d) => ({ doc: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = legalBySlug((await params).doc);
  return doc ? pageMetadata({ title: doc.title, description: doc.description, path: `/legal/${doc.slug}` }) : {};
}

function linkify(text: string) {
  const match = text.match(/^(.*?)(https:\/\/\S+)$/);
  if (!match) return text;
  return (
    <>
      {match[1]}
      <a href={match[2]} target="_blank" rel="noopener noreferrer">
        {match[2].replace("https://", "")}
      </a>
    </>
  );
}

export default async function LegalPage({ params }: Props) {
  const doc = legalBySlug((await params).doc);
  if (!doc) notFound();
  return (
    <>
      <PageHero
        hero={{ eyebrow: "Legal", title: doc.title, lede: doc.description }}
        trail={[
          { label: "Legal", href: "/legal/licence" },
          { label: doc.title, href: `/legal/${doc.slug}` },
        ]}
      />
      <article className={styles.article}>
        <div className={`wrap ${styles.body}`}>
          <div className={styles.meta}>
            <span>
              Last updated <time dateTime={doc.updated}>{doc.updated}</time>
            </span>
          </div>
          {doc.sections.map((s, i) => (
            <section key={s.heading ?? i} className={styles.body}>
              {s.heading && <h2>{s.heading}</h2>}
              {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
              {s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{linkify(b)}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
