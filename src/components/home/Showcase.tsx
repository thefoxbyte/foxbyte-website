"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { shots } from "@/content/home";
import styles from "./Showcase.module.css";

type Shot = (typeof shots)[number]["file"];

export function Showcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [26, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const [current, setCurrent] = useState<Shot>("dashboard");
  const label = shots.find((s) => s.file === current)?.label ?? "";

  return (
    <section className={`sec ${styles.showcase}`} ref={ref}>
      <div className="wrap">
        <div className="head center">
          <span className="eyebrow">The console</span>
          <h2 className="h2">A console that ships inside the database</h2>
          <p className="lede">Dashboard, SQL editor, Blackbox viewer and a live change feed, served by FoxByte itself. Nothing extra to install.</p>
        </div>
        <div className={styles.tabs} role="tablist" aria-label="Console screens">
          {shots.map((s) => (
            <button key={s.file} type="button" role="tab" aria-selected={current === s.file} className={`${styles.tab} ${current === s.file ? styles.on : ""}`} onClick={() => setCurrent(s.file)}>
              {s.label}
            </button>
          ))}
        </div>
        <div className={styles.persp}>
          <m.div className={styles.frame} style={{ rotateX, scale, y }}>
            <div className={styles.frameIn}>
              <AnimatePresence initial={false}>
                <m.div key={current} className={styles.shot} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                  <Image src={`/shots/${current}.webp`} alt={`FoxByte console: ${label}`} fill sizes="(max-width: 1240px) 100vw, 1180px" />
                </m.div>
              </AnimatePresence>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
