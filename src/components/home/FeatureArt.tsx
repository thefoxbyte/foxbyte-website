"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, useMotionValue, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useTick } from "@/lib/hooks";
import styles from "./Features.module.css";

const ticks = Array.from({ length: 49 }, (_, i) => i);
const pad = (n: number) => String(n).padStart(2, "0");

export function TimeScrub() {
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [pct, setPct] = useState(0.72);
  const width = useTransform(x, (v) => `${v}px`);

  useEffect(() => {
    const w = track.current?.offsetWidth ?? 0;
    x.set(w * 0.72);
    const control = animate(x, [w * 0.72, w * 0.55, w * 0.72], { duration: 2.6, ease: "easeInOut", delay: 0.8 });
    const off = x.on("change", (v) => setPct(Math.max(0, Math.min(1, v / Math.max(1, track.current?.offsetWidth ?? 1)))));
    return () => {
      control.stop();
      off();
    };
  }, [x]);

  const secs = Math.round(pct * 8 * 3600);
  return (
    <div className={styles.scrub}>
      <div className={styles.scrubTime}>
        <span>
          restore main as it was at{" "}
          <b>
            {pad(9 + Math.floor(secs / 3600))}:{pad(Math.floor((secs % 3600) / 60))}:{pad(secs % 60)}
          </b>
        </span>
        <span>drag the handle</span>
      </div>
      <div className={styles.track} ref={track}>
        <div className={styles.ticks}>
          {ticks.map((i) => (
            <i key={i} className={i % 12 === 0 ? styles.big : undefined} style={{ height: 10 + ((i * 37) % 17) }} />
          ))}
        </div>
        <m.div className={styles.past} style={{ width }} />
        <m.div className={styles.handle} drag="x" dragConstraints={track} dragElastic={0} dragMomentum={false} style={{ x }} whileDrag={{ scale: 1.1 }} role="slider" aria-label="Restore point" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)} tabIndex={0}>
          <i />
          <s />
        </m.div>
      </div>
      <div className={styles.scrubTime}>
        <span>09:00 · base backup</span>
        <span>17:00 · now</span>
      </div>
    </div>
  );
}

const sleepStates = [
  { label: "running", color: "#1f9d6f" },
  { label: "idle", color: "#d69e2e" },
  { label: "asleep", color: "#8792a3" },
  { label: "waking", color: "#ee6c4d" },
];

export function SleepArt() {
  const t = useTick(1300, sleepStates.length);
  const st = sleepStates[t];
  return (
    <div className={styles.sleep}>
      <div className={styles.brpill}>
        <m.span className={styles.led} animate={{ backgroundColor: st.color, scale: t === 3 ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.5 }} />
        pr-1482 ·{" "}
        <AnimatePresence mode="wait">
          <m.span key={st.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            {st.label}
          </m.span>
        </AnimatePresence>
      </div>
      {t === 2 &&
        [0, 1, 2].map((i) => (
          <m.span key={i} className={styles.zz} style={{ left: 150 + i * 14, bottom: 30, fontSize: 14 + i * 4 }} initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 0], y: -34 }} transition={{ duration: 1.2, delay: i * 0.2 }}>
            z
          </m.span>
        ))}
      {t === 3 && (
        <m.span className={`${styles.zz} ${styles.wake}`} style={{ left: 150, bottom: 26 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          ← new connection
        </m.span>
      )}
    </div>
  );
}

const haStates = [
  { a: ["primary", "serving", "var(--ok)"], b: ["standby", "streaming", "var(--muted)"], note: "fox ha drill shows what a failover costs" },
  { a: ["primary", "down", "var(--bad)"], b: ["standby", "promoting…", "var(--accent-ink)"], note: "fox ha drill shows what a failover costs" },
  { a: ["primary", "down", "var(--bad)"], b: ["primary", "serving", "var(--ok)"], note: "main reroutes · same connection string" },
];

export function HaArt() {
  const t = useTick(1500, haStates.length);
  const st = haStates[t];
  const box = ([name, state, color]: string[]) => (
    <div className={styles.node}>
      <b>{name}</b>
      <span style={{ color }}>● {state}</span>
    </div>
  );
  return (
    <div className={styles.stack}>
      <div className={styles.nodes}>
        {box(st.a)}
        <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true">
          <path d="M0 6h22M18 2l4 4-4 4" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.5" fill="none" />
        </svg>
        {box(st.b)}
      </div>
      <span className={styles.note}>{st.note}</span>
    </div>
  );
}

export function RequestArt() {
  const t = useTick(1500, 3);
  return (
    <div className={styles.stack}>
      <div className={`${styles.chip} ${styles.wrapChip}`}>
        <span className={styles.plus}>+</span> ALTER TABLE users ADD plan text
      </div>
      <div className={`${styles.chip} ${styles.wrapChip}`}>
        <span className={styles.plus}>+</span> CREATE INDEX ON orders (day)
      </div>
      <div className={styles.row}>
        <m.span className={`${styles.chip} ${styles.sel}`} animate={{ scale: t === 1 ? [1, 0.92, 1] : 1 }} transition={{ duration: 0.3 }}>
          {t === 2 ? "✓ applied" : "Approve dev → main"}
        </m.span>
        <span className={styles.note}>{t === 2 ? "one transaction · each author kept" : "schema only · your call"}</span>
      </div>
    </div>
  );
}

const secure = ["Loopback only until you open it", "TLS on, no silent fallback", "A Postgres role per person", "Signed releases with an SBOM"];

export function SecureArt() {
  return (
    <div className={styles.stack}>
      {secure.map((x, i) => (
        <m.div key={x} className={`${styles.chip} ${styles.wrapChip} ${styles.row}`} initial={{ opacity: 0.3, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.12 }}>
          <span className={styles.plus}>✓</span>
          {x}
        </m.div>
      ))}
    </div>
  );
}

const undoEntries = ["#40 CREATE INDEX", "#41 ALTER TABLE", "#42 DROP COLUMN email", "#43 GRANT"];

export function UndoArt() {
  const t = useTick(1600, 3);
  return (
    <div className={styles.stack}>
      <div className={styles.row}>
        {undoEntries.map((e, i) => (
          <m.span key={e} className={`${styles.chip} ${i === 2 && t > 0 ? styles.sel : ""}`} animate={{ y: i === 2 && t > 0 ? -4 : 0 }}>
            {e}
          </m.span>
        ))}
      </div>
      <div className={styles.undoLine}>
        <AnimatePresence>
          {t === 2 && (
            <m.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <span className={styles.pr}>$</span> fox blackbox branch-before 42 --as before-the-drop <span className={styles.plus}>✓</span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const tracked = [
  { who: "you@team.dev", at: "14:02:11" },
  { who: "priya@team.dev", at: "14:05:40" },
  { who: "agent-claude", at: "14:07:03" },
  { who: "you@team.dev", at: "14:09:58" },
];

export function TrackArt() {
  const t = useTick(1700, tracked.length);
  return (
    <div className={styles.stack}>
      <div className={`${styles.miniRow} ${styles.miniHead}`}>
        <span>id</span>
        <span>updated_at</span>
        <span>last_modified_by</span>
      </div>
      <m.div key={t} className={styles.miniRow} initial={{ backgroundColor: "rgba(238,108,77,.25)" }} animate={{ backgroundColor: "rgba(238,108,77,0)" }} transition={{ duration: 1.2 }}>
        <span>1042</span>
        <span>{tracked[t].at}</span>
        <span className={styles.ellipsis}>{tracked[t].who}</span>
      </m.div>
      <div className={styles.miniRow}>
        <span>1043</span>
        <span>13:58:20</span>
        <span>you@team.dev</span>
      </div>
    </div>
  );
}
