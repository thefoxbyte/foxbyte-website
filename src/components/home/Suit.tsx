"use client";

import { useRef } from "react";
import { useMotionValue, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { suitPieces } from "@/content/home";
import { useMedia, useSectionProgress } from "@/lib/hooks";
import { Icon, type FeatureIcon } from "@/components/ui/icons";
import styles from "./Suit.module.css";

const count = suitPieces.length;
const orbit: { icon: FeatureIcon; left: string; top: string }[] = [
  { icon: "db", left: "50%", top: "0%" },
  { icon: "pulse", left: "100%", top: "50%" },
  { icon: "shield", left: "50%", top: "100%" },
  { icon: "rewind", left: "0%", top: "50%" },
];

function geometry(i: number) {
  const a = (i / count) * Math.PI * 2 - Math.PI / 2 + Math.PI / count;
  return { a, fx: 50 + Math.cos(a) * 40, fy: 50 + Math.sin(a) * 37, start: i * 0.06, end: i * 0.06 + 0.36 };
}

function Piece({ p, i }: { p: MotionValue<number>; i: number }) {
  const { a, fx, fy, start, end } = geometry(i);
  const side = i % 2 ? 1 : -1;
  const x = useTransform(p, [start, end], [Math.cos(a) * 900 + side * 120, 0]);
  const y = useTransform(p, [start, end], [Math.sin(a) * 620 - side * 160, 0]);
  const rotate = useTransform(p, [start, end], [side * 140, 0]);
  const scale = useTransform(p, [start, end], [1.7, 1]);
  const opacity = useTransform(p, [start, start + 0.06], [0, 1]);
  const flash = useTransform(p, [end - 0.01, end + 0.03, end + 0.12], [0, 1, 0]);
  const piece = suitPieces[i];
  return (
    <div className={styles.piecePos} style={{ left: `${fx}%`, top: `${fy}%` }}>
      <m.div className={styles.piece} style={{ x, y, rotate, scale, opacity }}>
        <m.span className={styles.lock} style={{ opacity: flash }} />
        <b>{piece.title}</b>
        <span>{piece.line}</span>
      </m.div>
    </div>
  );
}

function Spoke({ p, i }: { p: MotionValue<number>; i: number }) {
  const { fx, fy, end } = geometry(i);
  const pathLength = useTransform(p, [end, end + 0.08], [0, 1]);
  return <m.line x1="50" y1="50" x2={fx} y2={fy} stroke="#ee6c4d" strokeOpacity=".45" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ pathLength }} />;
}

function Core({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.5, 0.95], [0.15, 1]);
  const scale = useTransform(p, [0.9, 0.97, 1], [1, 1.06, 1]);
  return (
    <m.div className={styles.core} style={{ scale }}>
      <m.div className={styles.glow} style={{ opacity }} />
      <span>inside</span>
      <b>PostgreSQL 18</b>
      <span>stock · unmodified</span>
    </m.div>
  );
}

const head = (
  <div className="head center">
    <span className={`eyebrow ${styles.eyebrow}`}>Not just Postgres</span>
    <h2 className="h2">Postgres, suited up.</h2>
    <p className={`lede ${styles.lede}`}>
      Inside is the PostgreSQL you already trust, untouched: the same storage engine, the same planner, on your own disk. FoxByte builds the suit around it, and every capability Postgres was missing locks into place.
    </p>
  </div>
);

export function Suit() {
  const ref = useRef<HTMLElement>(null);
  const wide = useMedia("(min-width: 1021px) and (min-height: 760px)");
  const progress = useSectionProgress(ref);
  const done = useTransform(progress, [0.86, 0.94], [0, 1]);
  const settled = useMotionValue(1);

  return (
    <section id="suit" ref={ref} className={styles.suit} style={{ height: wide ? "260vh" : "auto" }} aria-label="Postgres, suited up">
      {wide ? (
        <div className={styles.sticky}>
          <div className="wrap" style={{ width: "100%" }}>
            {head}
            <div className={styles.stage}>
              <div className={`${styles.hud} ${styles.hudA}`} />
              <div className={`${styles.hud} ${styles.hudB}`} />
              <div className={styles.orbit} aria-hidden="true">
                {orbit.map((o) => (
                  <div key={o.icon} className={styles.orbitTile} style={{ left: o.left, top: o.top }}>
                    <div className={styles.tile}>
                      <Icon name={o.icon} />
                    </div>
                  </div>
                ))}
              </div>
              <svg className={styles.spokes} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {suitPieces.map((piece, i) => (
                  <Spoke key={piece.title} p={progress} i={i} />
                ))}
              </svg>
              <Core p={progress} />
              {suitPieces.map((piece, i) => (
                <Piece key={piece.title} p={progress} i={i} />
              ))}
              <m.span className={styles.suited} style={{ opacity: done }}>
                ✓ suited up · same Postgres inside
              </m.span>
            </div>
          </div>
        </div>
      ) : (
        <div className="sec">
          <div className="wrap">
            {head}
            <div className={styles.coreMobile}>
              <div className={`${styles.hud} ${styles.hudA}`} style={{ width: 240, height: 240, margin: "-120px 0 0 -120px" }} />
              <Core p={settled} />
            </div>
            <div className={styles.grid}>
              {suitPieces.map((piece, i) => (
                <m.div
                  key={piece.title}
                  className={styles.piece}
                  initial={{ x: i % 2 ? 80 : -80, rotate: i % 2 ? 20 : -20 }}
                  whileInView={{ x: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ type: "spring", stiffness: 140, damping: 16, delay: (i % 2) * 0.08 }}
                >
                  <b>{piece.title}</b>
                  <span>{piece.line}</span>
                </m.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
