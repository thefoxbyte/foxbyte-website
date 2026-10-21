"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { marqueeItems } from "@/content/home";
import { Magnetic } from "@/components/ui/Magnetic";
import { InstallCommand } from "@/components/ui/InstallCommand";
import { Arrow } from "@/components/ui/icons";
import { BranchField } from "./BranchField";
import { HeroDemo } from "./HeroDemo";
import { HeroTiles } from "./HeroTiles";
import styles from "./Hero.module.css";

const lead = ["Every", "schema", "change,"];
const highlight = ["on", "the", "record."];
const breakAfter = lead.length - 1;

export function Hero() {
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const snx = useSpring(nx, { stiffness: 60, damping: 18 });
  const sny = useSpring(ny, { stiffness: 60, damping: 18 });
  const spot = useMotionTemplate`radial-gradient(560px circle at ${mx}px ${my}px, var(--spot), transparent 62%)`;
  const { scrollY } = useScroll();
  const blobY = useTransform(scrollY, [0, 700], [0, 160]);

  const move = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
    nx.set((e.clientX - r.left) / r.width - 0.5);
    ny.set((e.clientY - r.top) / r.height - 0.5);
  };

  const word = (w: string, i: number) => (
    <span className={styles.wm} key={`${w}-${i}`}>
      <span className={styles.w} style={{ "--i": i } as CSSProperties}>
        {w}
      </span>
    </span>
  );

  return (
    <section id="top" className={styles.hero} onMouseMove={move}>
      <BranchField className={styles.field} />
      <m.div className={styles.blob} style={{ width: 520, height: 520, left: "-8%", top: "-18%", background: "var(--blob1)", y: blobY }} animate={{ x: [0, 60, 0], scale: [1, 1.15, 1] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
      <m.div className={styles.blob} style={{ width: 620, height: 620, right: "-12%", top: "10%", background: "var(--blob2)", y: blobY }} animate={{ x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <m.div className={styles.spot} style={{ background: spot }} />
      <div className={`wrap ${styles.inner}`}>
        <HeroTiles nx={snx} ny={sny} sy={scrollY} />
        <div className={styles.copy}>
          <span className={`${styles.pill} ${styles.rise}`} style={{ "--d": "0s" } as CSSProperties}>
            <b>On-prem</b>PostgreSQL 18 · nothing phones home
          </span>
          <h1 className={styles.h1}>
            {lead.map((w, i) => (
              <span key={`${w}-${i}`}>
                {word(w, i)}
                {i === breakAfter ? <br /> : " "}
              </span>
            ))}
            <span className={styles.hl}>
              {highlight.map((w, i) => (
                <span key={w}>
                  {word(w, i + lead.length)}
                  {i < highlight.length - 1 ? " " : ""}
                </span>
              ))}
              <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 14C70 4 160 4 296 10" pathLength={1} />
              </svg>
            </span>
          </h1>
          <p className={`${styles.sub} ${styles.rise}`} style={{ "--d": ".45s" } as CSSProperties}>
            FoxByte is PostgreSQL on servers you control. Its Blackbox records who changed what, and from which tool, in a hash chain nobody can quietly rewrite. People and AI work on instant copies, so main stays exactly as you left it.
          </p>
          <div className={`${styles.ctas} ${styles.rise}`} style={{ "--d": ".6s" } as CSSProperties}>
            <Magnetic className="btn primary" to="start">
              Get started free
              <Arrow />
            </Magnetic>
            <Magnetic className="btn ghost" to="story">
              See how it works
            </Magnetic>
          </div>
          <div className={`${styles.installRow} ${styles.rise}`} style={{ "--d": ".75s" } as CSSProperties}>
            <InstallCommand />
            <div className={styles.oses}>
              <span>macOS</span>
              <span>Linux</span>
              <span>Windows</span>
              <span>Runs on your hardware</span>
            </div>
          </div>
        </div>
        <div className={`${styles.demoWrap} ${styles.rise}`} style={{ "--d": ".5s" } as CSSProperties}>
          <HeroDemo />
        </div>
      </div>
      <div className={styles.marquee}>
        <div className={`wrap ${styles.marqueeIn}`}>
          <span className={styles.marqueeLabel}>Moves in from</span>
          <div className={styles.marqueeMask}>
            <div className={styles.track}>
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span key={i} aria-hidden={i >= marqueeItems.length ? true : undefined}>
                  {item.strong ? <b>{item.label}</b> : item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
