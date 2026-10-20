"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import { storySteps } from "@/content/home";
import { useMedia, useSectionProgress } from "@/lib/hooks";
import { scrollToTop } from "@/lib/scroll";
import { BranchViz, RealtimeViz, RecordViz, RefuseViz } from "./viz/StoryViz";
import styles from "./Story.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
const visuals: ComponentType[] = [BranchViz, RecordViz, RealtimeViz, RefuseViz];
const total = storySteps.length;

function StepBar({ progress, k }: { progress: MotionValue<number>; k: number }) {
  const scaleX = useTransform(progress, [k / total, (k + 1) / total], [0, 1]);
  return (
    <div className={styles.bar}>
      <m.div style={{ scaleX }} />
    </div>
  );
}

function StepLabel({ k }: { k: number }) {
  const step = storySteps[k];
  return (
    <small className={styles.label}>
      {step.key}
      {step.enterprise && <span className="tag-e">Enterprise</span>}
    </small>
  );
}

const head = (
  <div className="head">
    <span className="eyebrow">How it works</span>
    <h2 className="h2">Branch. Record. Stream. Protect.</h2>
    <p className="lede">Four things every team running Postgres wishes it had. FoxByte gives you all four, on hardware you control.</p>
  </div>
);

export function Story() {
  const ref = useRef<HTMLElement>(null);
  const wide = useMedia("(min-width: 1021px)");
  const progress = useSectionProgress(ref);
  const [active, setActive] = useState(0);

  useEffect(() => progress.on("change", (v) => setActive(Math.max(0, Math.min(total - 1, Math.floor(v * total))))), [progress]);

  const jump = (k: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + (el.offsetHeight - window.innerHeight) * (k / total + 0.04);
    scrollToTop(top);
  };

  const Visual = visuals[active];

  return (
    <section id="story" ref={ref} className={styles.story} style={{ height: wide ? `${total * 110}vh` : "auto" }}>
      {wide ? (
        <>
          <div className={`wrap ${styles.headWrap}`}>{head}</div>
          <div className={styles.sticky}>
            <div className="wrap" style={{ width: "100%" }}>
              <div className={styles.grid}>
                <div className={styles.steps}>
                  {storySteps.map((s, k) => (
                    <button key={s.key} type="button" className={`${styles.step} ${active === k ? styles.on : ""}`} onClick={() => jump(k)} aria-current={active === k ? "step" : undefined}>
                      <StepLabel k={k} />
                      <h3>{s.title}</h3>
                      <m.div initial={false} animate={{ height: active === k ? "auto" : 0, opacity: active === k ? 1 : 0 }} style={{ overflow: "hidden" }} transition={{ duration: 0.45, ease }}>
                        <p>{s.body}</p>
                      </m.div>
                      <StepBar progress={progress} k={k} />
                    </button>
                  ))}
                </div>
                <div className={`${styles.viz} screen`}>
                  <AnimatePresence mode="wait">
                    <m.div key={active} className={styles.vizLayer} initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30, scale: 0.98 }} transition={{ duration: 0.5, ease }}>
                      <Visual />
                    </m.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="sec">
          <div className="wrap">
            {head}
            <div className={styles.stack}>
              {storySteps.map((s, k) => {
                const V = visuals[k];
                return (
                  <div key={s.key} className={styles.stackItem}>
                    <div className={`${styles.step} ${styles.on}`}>
                      <StepLabel k={k} />
                      <h3>{s.title}</h3>
                      <p>{s.body}</p>
                    </div>
                    <div className={`${styles.viz} screen`}>
                      <V />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
