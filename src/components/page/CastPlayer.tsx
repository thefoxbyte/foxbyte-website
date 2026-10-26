"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { parseCast, Screen, type Cast, type Cell } from "@/lib/cast";
import styles from "./CastPlayer.module.css";

type Mode = "idle" | "playing" | "done";

function runs(line: Cell[]) {
  const out: { cls: string; text: string }[] = [];
  for (const c of line) {
    const last = out[out.length - 1];
    if (last && last.cls === c.cls) last.text += c.ch;
    else out.push({ cls: c.cls, text: c.ch });
  }
  return out;
}

function render(cast: Cast, upTo: number) {
  const screen = new Screen();
  for (const e of cast.events) {
    if (e.t > upTo) break;
    screen.write(e.data);
  }
  return screen.view(cast.rows);
}

export function CastPlayer({ src, title, label }: { src: string; title: string; label: string }) {
  const reduce = useReducedMotion() ?? false;
  const box = useRef<HTMLDivElement>(null);
  const [cast, setCast] = useState<Cast | null>(null);
  const [lines, setLines] = useState<Cell[][]>([]);
  const [mode, setMode] = useState<Mode>("idle");
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  const play = useCallback(
    (c: Cast) => {
      cancelAnimationFrame(frame.current);
      if (reduce) {
        setLines(render(c, c.duration));
        setProgress(1);
        setMode("done");
        return;
      }
      const start = performance.now();
      const screen = new Screen();
      let next = 0;
      setMode("playing");
      const tick = (now: number) => {
        const elapsed = (now - start) / 1000;
        let changed = false;
        while (next < c.events.length && c.events[next].t <= elapsed) {
          screen.write(c.events[next].data);
          next++;
          changed = true;
        }
        if (changed) setLines(screen.view(c.rows).map((l) => [...l]));
        setProgress(Math.min(1, elapsed / Math.max(c.duration, 0.1)));
        if (next < c.events.length) frame.current = requestAnimationFrame(tick);
        else setMode("done");
      };
      frame.current = requestAnimationFrame(tick);
    },
    [reduce],
  );

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let loaded = false;
    const seen = new IntersectionObserver(
      (entries) => {
        if (loaded || !entries.some((e) => e.isIntersecting)) return;
        loaded = true;
        seen.disconnect();
        fetch(src)
          .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
          .then((text) => {
            const c = parseCast(text);
            setCast(c);
            play(c);
          })
          .catch(() => setMode("done"));
      },
      { threshold: 0.35 },
    );
    seen.observe(el);
    return () => {
      seen.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [src, play]);

  return (
    <div ref={box} className={`${styles.player} screen`}>
      <div className={styles.top}>
        <i />
        <i />
        <i />
        <span>{title}</span>
        {cast && mode === "done" && (
          <button type="button" className={styles.replay} onClick={() => play(cast)}>
            Replay
          </button>
        )}
      </div>
      <pre className={styles.term} style={{ minHeight: `${(cast?.rows ?? 18) * 1.5}em` }} aria-hidden="true">
        {lines.map((line, i) => (
          <div key={i} className={styles.line}>
            {line.length === 0 ? " " : runs(line).map((r, j) => (r.cls ? <span key={j} className={r.cls.split(" ").map((k) => styles[k]).join(" ")}>{r.text}</span> : r.text))}
          </div>
        ))}
      </pre>
      <div className={styles.bar} aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <p className="sr-only">{label}</p>
    </div>
  );
}
