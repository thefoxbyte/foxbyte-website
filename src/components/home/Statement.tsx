"use client";

import { useRef, type ReactNode } from "react";
import { useScroll, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { statement, statementChips } from "@/content/home";
import styles from "./Statement.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

function Word({ progress, from, to, accent, children }: { progress: MotionValue<number>; from: number; to: number; accent: boolean; children: ReactNode }) {
  const opacity = useTransform(progress, [from, to], [0.13, 1]);
  const y = useTransform(progress, [from, to], [6, 0]);
  return (
    <m.span className={accent ? styles.accent : undefined} style={{ opacity, y, display: "inline-block" }}>
      {children}
    </m.span>
  );
}

export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = statement.split(" ");

  return (
    <section id="why" className="sec">
      <div className="wrap">
        <span className="eyebrow">Built for the people who run the database</span>
        <p ref={ref} className={styles.reveal}>
          {words.map((w, i) => (
            <span key={i}>
              <Word progress={scrollYProgress} from={i / words.length} to={(i + 1) / words.length} accent={w.startsWith("*")}>
                {w.replace("*", "")}
              </Word>{" "}
            </span>
          ))}
        </p>
        <div className={styles.chips}>
          {statementChips.map((c, i) => (
            <m.div key={c.tag} className={styles.chip} initial={{ opacity: 0.3, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ delay: i * 0.08, duration: 0.6, ease }}>
              {c.text}
              <b>→ {c.tag}</b>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
