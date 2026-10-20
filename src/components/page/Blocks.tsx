import Link from "next/link";
import { Fragment } from "react";
import type { Block, GridItem } from "@/content/types";
import { Check, Icon } from "@/components/ui/icons";
import { FaqList } from "./FaqList";
import { JsonLd } from "./JsonLd";
import { Reveal } from "./Reveal";
import { Visual } from "./Visual";
import styles from "./Page.module.css";

export function Terminal({ lines, label }: { lines: string[]; label?: string }) {
  return (
    <pre className={`${styles.terminal} screen`} aria-label={label}>
      {lines.map((l, i) => (
        <Fragment key={`${i}-${l}`}>
          {l.startsWith("$ ") ? (
            <>
              <span className={styles.prompt}>$ </span>
              {l.slice(2)}
            </>
          ) : l.startsWith("# ") ? (
            <span className={styles.comment}>{l}</span>
          ) : (
            <span className={styles.output}>{l}</span>
          )}
          {i < lines.length - 1 ? "\n" : ""}
        </Fragment>
      ))}
    </pre>
  );
}

function Head({ block, center }: { block: Block; center?: boolean }) {
  return (
    <div className={`head ${center ? "center" : ""}`}>
      {block.eyebrow && <span className="eyebrow">{block.eyebrow}</span>}
      <h2 className="h2">{block.title}</h2>
      {block.lede && <p className="lede">{block.lede}</p>}
    </div>
  );
}

function Card({ item }: { item: GridItem }) {
  const inner = (
    <>
      {item.icon && (
        <span className={styles.cardIcon}>
          <Icon name={item.icon} />
        </span>
      )}
      <h3>
        {item.title}
        {item.tag && <span className="tag-e">{item.tag}</span>}
      </h3>
      <p>{item.body}</p>
      {item.href && <span className={styles.more}>Learn more →</span>}
    </>
  );
  return item.href ? (
    <Link href={item.href} className={`${styles.card} ${styles.cardLink}`}>
      {inner}
    </Link>
  ) : (
    <div className={styles.card}>{inner}</div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "grid":
      return (
        <>
          <Head block={block} />
          <Reveal className={`${styles.grid} ${styles[`cols${block.columns ?? 3}`]}`}>
            {block.items.map((item) => (
              <Card key={item.title} item={item} />
            ))}
          </Reveal>
        </>
      );
    case "split":
      return (
        <div className={`${styles.split} ${block.reverse ? styles.reverse : ""}`}>
          <div className={styles.splitCopy}>
            {block.eyebrow && <span className="eyebrow">{block.eyebrow}</span>}
            <h2 className="h2">{block.title}</h2>
            {block.body.map((p) => (
              <p key={p} className={styles.para}>
                {p}
              </p>
            ))}
            {block.bullets && (
              <ul className={styles.bullets}>
                {block.bullets.map((b) => (
                  <li key={b}>
                    <Check color="var(--accent-ink)" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {block.lines && <Terminal lines={block.lines} />}
          </div>
          <Reveal className={styles.splitVisual}>
            <Visual name={block.visual} />
          </Reveal>
        </div>
      );
    case "code":
      return (
        <div className={styles.codeBlock}>
          <div className={styles.splitCopy}>
            {block.eyebrow && <span className="eyebrow">{block.eyebrow}</span>}
            <h2 className="h2">{block.title}</h2>
            {block.body && <p className={styles.para}>{block.body}</p>}
            {block.note && <p className={styles.note}>{block.note}</p>}
          </div>
          <Reveal>
            <Terminal lines={block.lines} />
          </Reveal>
        </div>
      );
    case "steps":
      return (
        <>
          <Head block={block} />
          <Reveal>
            <ol className={styles.steps}>
              {block.items.map((s, i) => (
                <li key={s.title}>
                  <span className={styles.stepNo}>{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </>
      );
    case "table":
      return (
        <>
          <Head block={block} />
          <Reveal className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {block.head.map((h) => (
                    <th key={h} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((r) => (
                  <tr key={r.join("|")}>
                    {r.map((c, i) =>
                      i === 0 ? (
                        <th key={i} scope="row">
                          {c}
                        </th>
                      ) : (
                        <td key={i} className={c === "Yes" ? styles.yes : c === "—" ? styles.no : undefined}>
                          {c}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          {block.note && <p className={styles.note}>{block.note}</p>}
        </>
      );
    case "list":
      return (
        <>
          <Head block={block} />
          <Reveal>
            <ul className={styles.plainList}>
              {block.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </Reveal>
        </>
      );
    case "faq":
      return (
        <>
          <Head block={block} center />
          <FaqList items={block.items} />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: block.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            }}
          />
        </>
      );
  }
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <section key={`${b.kind}-${b.title}`} id={b.id} className={`sec ${(b.alt ?? i % 2 === 0) ? "alt" : ""} ${styles.block}`}>
          <div className="wrap">
            <BlockView block={b} />
          </div>
        </section>
      ))}
    </>
  );
}
