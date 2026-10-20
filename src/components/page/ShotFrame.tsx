"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { shots } from "@/content/home";
import styles from "./Page.module.css";

type Shot = (typeof shots)[number]["file"];

export function ShotFrame() {
  const [current, setCurrent] = useState<Shot>("dashboard");
  const label = shots.find((s) => s.file === current)?.label ?? "";
  return (
    <div className={styles.shotWrap}>
      <div className={styles.shotTabs} role="tablist" aria-label="Console screens">
        {shots.map((s) => (
          <button key={s.file} type="button" role="tab" aria-selected={current === s.file} className={`${styles.shotTab} ${current === s.file ? styles.shotOn : ""}`} onClick={() => setCurrent(s.file)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className={styles.frame}>
        <div className={styles.frameIn}>
          <AnimatePresence initial={false}>
            <m.div key={current} className={styles.shot} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <Image src={`/shots/${current}.webp`} alt={`FoxByte console: ${label}`} fill sizes="(max-width: 1020px) 100vw, 600px" />
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
