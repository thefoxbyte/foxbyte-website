"use client";

import { Fragment, type ReactNode } from "react";
import * as m from "motion/react-m";
import { useTick } from "@/lib/hooks";
import styles from "./Data.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
const sources = ["PostgreSQL", "MySQL", "MariaDB", "MongoDB", ".csv / .json"];
const steps = ["import", "check", "keep in sync", "cut over"];

export function MigrateViz() {
  const t = useTick(1400, steps.length);
  return (
    <div className={`${styles.viz} screen`} aria-hidden="true">
      <div className={styles.mig}>
        <div className={styles.srcs}>
          {sources.map((s) => (
            <span key={s} className={styles.src}>
              {s}
            </span>
          ))}
        </div>
        <div className={styles.flight}>
          {sources.map((s, i) => (
            <m.span key={s} className={styles.dot} animate={{ left: ["0%", "100%"], top: [12 + i * 30, 72], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }} />
          ))}
        </div>
        <div className={styles.dest}>
          <b>shop</b>
          <span>new branch</span>
          <span className={styles.okText}>main untouched</span>
        </div>
      </div>
      <div className={styles.flow}>
        {steps.map((s, i) => (
          <span key={s} className={t === i ? styles.on : undefined}>
            {i + 1} · {s}
          </span>
        ))}
      </div>
    </div>
  );
}

const nodes = [
  { id: "ro", x: 12, y: 22, label: "raw.orders", stage: 1, test: "" },
  { id: "rc", x: 12, y: 112, label: "raw.customers", stage: 1, test: "" },
  { id: "so", x: 170, y: 67, label: "stg_orders", stage: 2, test: "✓ not_null" },
  { id: "fr", x: 326, y: 67, label: "fct_revenue", stage: 3, test: "✓ unique" },
];
const edges = [
  { d: "M134 39C152 39 152 84 170 84", stage: 2 },
  { d: "M134 129C152 129 152 84 170 84", stage: 2 },
  { d: "M292 84H326", stage: 3 },
];

export function EtlViz() {
  const t = useTick(1200, 6);
  const on = (s: number) => t >= s;
  return (
    <div className={`${styles.viz} screen`} aria-hidden="true">
      <svg className={styles.dag} viewBox="0 0 460 160">
        {edges.map((e) => (
          <Fragment key={e.d}>
            <path d={e.d} stroke="rgba(255,255,255,.14)" strokeWidth="2" fill="none" />
            <m.path d={e.d} stroke="#ee6c4d" strokeWidth="2.4" fill="none" initial={false} animate={{ pathLength: on(e.stage) ? 1 : 0 }} transition={{ duration: 0.6 }} />
          </Fragment>
        ))}
        {nodes.map((n) => (
          <g key={n.id}>
            <m.rect x={n.x} y={n.y} width="122" height="34" rx="9" fill="rgba(255,255,255,.05)" strokeWidth="1.5" initial={false} animate={{ stroke: on(n.stage) ? "#ee6c4d" : "rgba(255,255,255,.16)" }} />
            <text x={n.x + 12} y={n.y + 21} fill="#fff">
              {n.label}
            </text>
            {n.test && on(n.stage) && (
              <m.text x={n.x + 12} y={n.y + 52} fill="#4fd1a1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {n.test}
              </m.text>
            )}
          </g>
        ))}
      </svg>
      <div className={styles.flow}>
        <span className={t >= 4 ? styles.on : undefined}>{t >= 4 ? "✓ run passed on a throwaway branch" : "running on a throwaway branch…"}</span>
      </div>
    </div>
  );
}

function Snip({ lines }: { lines: string[] }) {
  return (
    <pre className={styles.snip}>
      {lines.map((l, i) => (
        <Fragment key={l}>
          {l.startsWith("$ ") ? (
            <>
              <span className={styles.pr}>$ </span>
              {l.slice(2)}
            </>
          ) : (
            l
          )}
          {i < lines.length - 1 ? "\n" : ""}
        </Fragment>
      ))}
    </pre>
  );
}

function Card({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <m.article className={styles.card} initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, ease, delay }}>
      {children}
    </m.article>
  );
}

export function Data() {
  return (
    <section id="data" className="sec">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">Your data, moving</span>
          <h2 className="h2">Bring your data in. Shape it. Keep it flowing.</h2>
          <p className="lede">Leaving another database shouldn’t be a project. FoxByte imports from the systems you already run, and turns raw tables into clean ones with pipelines you can trust.</p>
        </div>
        <div className={styles.grid}>
          <Card delay={0}>
            <h3>Migrate from almost anything</h3>
            <p>
              Point FoxByte at PostgreSQL, MySQL, MariaDB or MongoDB, or hand it a .sql, .csv, .json or .ndjson file. Every import lands in its own branch, so you can check it before anything depends on it. For live systems, keep it in sync and cut over when you’re ready.
            </p>
            <MigrateViz />
            <Snip lines={["$ fox import --from mysql://…/shop --as shop", "$ fox import --from postgres://… --continuous --as live", "$ fox import-cutover live"]} />
          </Card>
          <Card delay={0.1}>
            <h3>
              ETL pipelines that test first<span className="tag-e">Enterprise</span>
            </h3>
            <p>Write transformations as plain SQL models and add data-quality tests in one JSON spec. Every run lands in a fresh branch first, so bad data fails a test instead of reaching your reports. Pipelines are experimental today.</p>
            <EtlViz />
            <Snip lines={["$ fox pipeline run revenue.json", "  stg_orders   ✓ not_null(order_id)", "  fct_revenue  ✓ unique(day)"]} />
          </Card>
        </div>
      </div>
    </section>
  );
}
