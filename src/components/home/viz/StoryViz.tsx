"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate } from "motion/react";
import * as m from "motion/react-m";
import { ledgerEntries } from "@/content/home";
import { useTick } from "@/lib/hooks";
import styles from "./Viz.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
const blocks = Array.from({ length: 48 }, (_, i) => i);
const writes: number[][] = [[], [8], [8, 15, 27], [8, 15, 27, 33, 40], [8, 15, 27, 33, 40, 22]];

export function BranchViz() {
  const t = useTick(1500, writes.length);
  const changed = writes[t];
  return (
    <div className={styles.in}>
      <span className={styles.title}>$ fox branch create qa</span>
      <div className={styles.blocksWrap}>
        <div className={styles.blocksCol}>
          <span className={styles.lbl}>main</span>
          <div className={styles.blocks}>
            {blocks.map((i) => (
              <div key={i} className={styles.blk} style={{ background: "#3a4558" }} />
            ))}
          </div>
        </div>
        <div className={styles.blocksCol}>
          <span className={styles.lbl}>qa</span>
          <div className={styles.blocks}>
            {blocks.map((i) => {
              const on = changed.includes(i);
              return (
                <m.div
                  key={i}
                  className={`${styles.blk} ${styles.cow}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: on ? [1.25, 1] : 1, backgroundColor: on ? "#ee6c4d" : "rgba(58,69,88,.35)" }}
                  transition={{ delay: t === 0 ? i * 0.012 : 0, duration: 0.45 }}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.cap}>
        <span>
          <b>{changed.length}</b> of 48 blocks written
        </span>
        <span>
          <b>{48 - changed.length}</b> still shared with main
        </span>
      </div>
    </div>
  );
}

export function RecordViz() {
  const t = useTick(1250, 7);
  const shown = Math.min(4, t + 1);
  const verified = t === 4;
  const tampered = t >= 5;
  return (
    <div className={styles.in}>
      <span className={styles.title}>$ fox blackbox verify</span>
      <div className={styles.chain}>
        {ledgerEntries.map((e, i) => {
          const visible = i < shown;
          const bad = tampered && i >= 1;
          return (
            <div key={e.hash}>
              {i > 0 && <m.div className={styles.link} animate={{ scaleY: visible ? 1 : 0, backgroundColor: bad ? "#ff7b66" : "#ee6c4d" }} style={{ originY: 0 }} transition={{ duration: 0.35 }} />}
              <m.div className={styles.entry} initial={{ opacity: 0, x: 30 }} animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 30, borderColor: bad ? "rgba(255,123,102,.6)" : "rgba(255,255,255,.09)" }} transition={{ duration: 0.5, ease }}>
                <span className={`${styles.who} ${e.agent ? styles.agent : ""}`}>{e.who}</span>
                <span className={styles.op} style={{ color: tampered && i === 1 ? "#ff9b88" : "#fff" }}>
                  {tampered && e.tampered ? e.tampered : e.op}
                </span>
                <span className={styles.hash}>{bad && i > 1 ? `≠ ${e.hash}` : e.hash}</span>
              </m.div>
            </div>
          );
        })}
      </div>
      <div className={styles.cap}>
        <AnimatePresence mode="wait">
          {verified && (
            <m.span key="ok" className={`${styles.badge} ${styles.badgeOk}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ✓ chain intact · 4 entries
            </m.span>
          )}
          {tampered && (
            <m.span key="bad" className={`${styles.badge} ${styles.badgeBad}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              ✗ entry 2 was edited · chain broken
            </m.span>
          )}
          {!verified && !tampered && (
            <m.span key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              recording… <b>{shown}</b> entries
            </m.span>
          )}
        </AnimatePresence>
        <span>who, what, when, which tool</span>
      </div>
    </div>
  );
}

const nextStatus: Record<string, string> = { new: "paid", paid: "packed", packed: "shipped", shipped: "delivered", delivered: "new" };
type Row = { id: number; s: string };
type Event = { k: number; id: number; from: string; to: string };

export function RealtimeViz() {
  const [rows, setRows] = useState<Row[]>([
    { id: 1041, s: "paid" },
    { id: 1042, s: "packed" },
    { id: 1043, s: "new" },
    { id: 1044, s: "shipped" },
    { id: 1045, s: "new" },
  ]);
  const [feed, setFeed] = useState<Event[]>([]);
  const [hot, setHot] = useState<{ id: number; n: number } | null>(null);
  const rowsRef = useRef(rows);

  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  useEffect(() => {
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      const current = rowsRef.current;
      const i = (n * 3 + Math.floor(n / 2)) % current.length;
      const row = current[i];
      const to = nextStatus[row.s];
      setRows(current.map((x, j) => (j === i ? { ...x, s: to } : x)));
      setHot({ id: row.id, n });
      setFeed((f) => [{ k: n, id: row.id, from: row.s, to }, ...f].slice(0, 5));
    }, 1150);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={styles.in}>
      <span className={styles.title}>$ fox realtime enable orders</span>
      <div className={styles.rt}>
        <div className={styles.rtTable}>
          <div className={styles.rtHead}>
            <span>id</span>
            <span>status</span>
          </div>
          {rows.map((r) => {
            const isHot = hot?.id === r.id;
            return (
              <m.div key={`${r.id}-${isHot ? hot.n : "s"}`} className={styles.rtRow} initial={isHot ? { backgroundColor: "rgba(238,108,77,.4)" } : false} animate={{ backgroundColor: "rgba(255,255,255,.04)" }} transition={{ duration: 1 }}>
                <span className={styles.dimText}>{r.id}</span>
                <span>{r.s}</span>
              </m.div>
            );
          })}
        </div>
        <div className={styles.rtFeed}>
          <AnimatePresence initial={false}>
            {feed.map((e) => (
              <m.div key={e.k} className={styles.ev} layout initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }}>
                <b>UPDATE</b>
                <span>
                  orders {e.id} · {e.from} → {e.to}
                </span>
              </m.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className={styles.cap}>
        <span>
          live from <b>your own server</b>
        </span>
        <span>
          reconnect and it <b>replays</b> what you missed
        </span>
      </div>
    </div>
  );
}

const rowCells = Array.from({ length: 100 }, (_, i) => i);

export function RefuseViz() {
  const [n, setN] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const control = animate(0, 101, { duration: 2.4, ease: [0.4, 0, 0.9, 0.6], onUpdate: (v) => setN(Math.floor(v)) });
    const t = window.setTimeout(() => setCycle((c) => c + 1), 5200);
    return () => {
      control.stop();
      window.clearTimeout(t);
    };
  }, [cycle]);

  const stopped = n >= 101;
  return (
    <div className={styles.in}>
      <span className={styles.title}>agent-claude · branch ai-sandbox</span>
      <div className={styles.guard}>
        <div className={styles.sql}>
          <span className={styles.kw}>DELETE FROM</span> orders <span className={styles.kw}>WHERE</span> 1 = 1;
        </div>
        <div className={styles.meter}>
          <div className={styles.meterTop}>
            <span>rows changed by this statement</span>
            <span>limit 100</span>
          </div>
          <div className={styles.meterTop} style={{ alignItems: "flex-end" }}>
            <b style={{ color: stopped ? "#ff7b66" : "#fff" }}>{Math.min(n, 101)}</b>
            <span>of 1,000,000</span>
          </div>
          <div className={styles.meterBar}>
            <div style={{ width: `${Math.min(n, 100)}%` }} />
          </div>
        </div>
        <div className={styles.rows}>
          {rowCells.map((i) => (
            <i key={i} style={{ background: i < n ? (stopped ? "rgba(255,123,102,.55)" : "rgba(238,108,77,.7)") : "rgba(255,255,255,.08)" }} />
          ))}
        </div>
      </div>
      <AnimatePresence>
        {stopped && (
          <m.div className={styles.shield} initial={{ scale: 2.2, opacity: 0, rotate: -12 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14 }}>
            <svg width="60" height="68" viewBox="0 0 64 72" fill="none" aria-hidden="true">
              <path d="M32 3l26 10v20c0 17-11 29-26 36C17 62 6 50 6 33V13z" fill="rgba(238,108,77,.16)" stroke="#ee6c4d" strokeWidth="3" />
              <path d="M21 37l8 8 15-17" stroke="#ee6c4d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </m.div>
        )}
      </AnimatePresence>
      <div className={styles.cap}>
        {stopped ? <span style={{ color: "#ff7b66" }}>✗ refused at row 101 · nothing deleted</span> : <span>counting…</span>}
        <span>
          <b>14.5 ms</b> on a million-row table
        </span>
      </div>
    </div>
  );
}

const anchorRows = [
  { id: 118, op: "ALTER TABLE orders ADD note", hash: "3b1e" },
  { id: 119, op: "CREATE INDEX ON orders (day)", hash: "8c02" },
  { id: 120, op: "GRANT SELECT ON orders", hash: "f47a" },
  { id: 121, op: "ALTER TABLE users ADD plan", hash: "19dd" },
];

export function AnchorViz() {
  const t = useTick(1300, 6);
  const shown = Math.min(anchorRows.length, t + 1);
  const sealed = t >= 3;
  const shipped = t >= 4;
  const verified = t >= 5;
  return (
    <div className={styles.in}>
      <span className={styles.title}>$ fox blackbox integrity</span>
      <div className={styles.anchor}>
        <div className={styles.anchorRows}>
          {anchorRows.map((r, i) => (
            <m.div key={r.id} className={styles.anchorRow} initial={false} animate={{ opacity: i < shown ? 1 : 0.15, borderColor: sealed && i < shown ? "rgba(238,108,77,.55)" : "rgba(255,255,255,.09)" }} transition={{ duration: 0.4 }}>
              <span className={styles.dimText}>#{r.id}</span>
              <span className={styles.op}>{r.op}</span>
              <span className={styles.hash}>{r.hash}</span>
            </m.div>
          ))}
        </div>
        <m.div className={styles.seal} initial={false} animate={{ opacity: sealed ? 1 : 0.2, scale: sealed ? 1 : 0.96 }} transition={{ duration: 0.4 }}>
          <b>checkpoint #118–121</b>
          <span>merkle root a91f…c3 · signed ✓</span>
        </m.div>
        <m.div className={styles.vault} initial={false} animate={{ opacity: shipped ? 1 : 0.2, x: shipped ? 0 : -10 }} transition={{ duration: 0.45 }}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden="true">
            <rect x="2" y="8" width="12" height="9" rx="2" stroke="#ee6c4d" strokeWidth="1.6" />
            <path d="M5 8V5.5a3 3 0 016 0V8" stroke="#ee6c4d" strokeWidth="1.6" />
          </svg>
          <span>s3://audit-anchors · Object Lock · 365 days</span>
        </m.div>
      </div>
      <div className={styles.cap}>
        <AnimatePresence mode="wait">
          {verified ? (
            <m.span key="ok" className={`${styles.badge} ${styles.badgeOk}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ✓ rows match every anchor
            </m.span>
          ) : (
            <m.span key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {shipped ? "copied off the machine…" : sealed ? "checkpoint signed…" : "recording…"}
            </m.span>
          )}
        </AnimatePresence>
        <span>proof even against a superuser</span>
      </div>
    </div>
  );
}
