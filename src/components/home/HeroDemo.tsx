"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { heroScript } from "@/content/home";
import styles from "./Hero.module.css";

type ScriptState = { i: number; c: number; out: boolean };

function useTypedScript(reduce: boolean): ScriptState {
  const [state, setState] = useState<ScriptState>(() => (reduce ? { i: heroScript.length, c: 0, out: false } : { i: 0, c: 0, out: false }));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const wait = document.documentElement.dataset.intro ? 1250 : 700;
    const t = window.setTimeout(() => setStarted(true), wait);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!started || reduce) return;
    const line = heroScript[state.i];
    let delay: number;
    let next: ScriptState;
    if (!line) {
      delay = 3400;
      next = { i: 0, c: 0, out: false };
    } else if (state.c < line.cmd.length) {
      delay = 22 + Math.random() * 36;
      next = { i: state.i, c: state.c + 1, out: false };
    } else if (!state.out) {
      delay = 380;
      next = { ...state, out: true };
    } else {
      delay = 1150;
      next = { i: state.i + 1, c: 0, out: false };
    }
    const t = window.setTimeout(() => setState(next), delay);
    return () => window.clearTimeout(t);
  }, [state, started, reduce]);

  return state;
}

export function HeroDemo() {
  const reduce = useReducedMotion() ?? false;
  const s = useTypedScript(reduce);
  const stage = Math.min(4, s.i + (s.out ? 1 : 0));
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 16 });
  const sry = useSpring(ry, { stiffness: 120, damping: 16 });

  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };

  const draw = (on: boolean) => ({ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 });

  return (
    <m.div
      className={`${styles.demo} screen`}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      onMouseMove={move}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <div className={styles.demoTop}>
        <i />
        <i />
        <i />
        <span>you@laptop — zsh</span>
      </div>
      <m.div className={styles.term} key={stage === 3 ? "shake" : "still"} animate={stage === 3 ? { x: [0, -7, 7, -5, 5, -2, 0] } : {}} transition={{ duration: 0.45 }} aria-hidden="true">
        {heroScript.map((line, k) => {
          if (k > s.i) return null;
          const full = k < s.i;
          const typed = full ? line.cmd : line.cmd.slice(0, s.c);
          const showOut = full || (k === s.i && s.out);
          return (
            <div key={line.cmd}>
              <div className={styles.ln}>
                <span className={styles.pr}>$ </span>
                {typed}
                {k === s.i && !s.out && <span className={styles.caret} />}
              </div>
              {showOut && (
                <m.div className={`${styles.ln} ${styles[line.tone]}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                  {line.out}
                </m.div>
              )}
            </div>
          );
        })}
        {s.i >= heroScript.length && (
          <div className={styles.ln}>
            <span className={styles.pr}>$ </span>
            <span className={styles.caret} />
          </div>
        )}
      </m.div>
      <p className="sr-only">
        A terminal creates a copy of main for an AI agent, records an ALTER TABLE in the Blackbox, blocks a DROP TABLE by policy, and verifies the Blackbox hash chain, while main stays untouched.
      </p>
      <svg className={styles.tree} viewBox="0 0 460 160" aria-hidden="true">
        <path d="M20 92H440" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".9" />
        <circle cx="20" cy="92" r="6" fill="#fff" />
        <text x="14" y="114" className={styles.tw}>
          main
        </text>
        <text x="380" y="84">
          untouched
        </text>
        <m.path d="M150 92C188 92 192 40 234 40H430" stroke="#ee6c4d" strokeWidth="2.5" fill="none" strokeLinecap="round" initial={draw(false)} animate={draw(stage >= 1)} transition={{ duration: stage >= 1 ? 1.1 : 0.25 }} />
        {stage >= 1 && (
          <m.text x="242" y="28" className={styles.tw} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            ai-sandbox
          </m.text>
        )}
        {stage >= 2 && (
          <m.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} style={{ originX: "262px", originY: "40px" }}>
            <circle cx="262" cy="40" r="7" fill="#4fd1a1" />
            <text x="224" y="66">ALTER · on record</text>
          </m.g>
        )}
        {stage >= 3 && (
          <m.g initial={{ opacity: 0, scale: 1.8 }} animate={{ opacity: 1, scale: 1 }} style={{ originX: "330px", originY: "40px" }}>
            <circle cx="330" cy="40" r="9" fill="#ff7b66" />
            <path d="M326 36l8 8M334 36l-8 8" stroke="#141922" strokeWidth="2.2" strokeLinecap="round" />
            <text x="345" y="60" fill="#ff9b88">
              DROP blocked
            </text>
          </m.g>
        )}
        {stage >= 4 && (
          <m.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <rect x="296" y="114" width="146" height="30" rx="8" fill="rgba(238,108,77,.14)" stroke="#ee6c4d" strokeOpacity=".6" />
            <text x="308" y="133" className={styles.tw}>
              Blackbox · chain ✓
            </text>
          </m.g>
        )}
      </svg>
    </m.div>
  );
}
