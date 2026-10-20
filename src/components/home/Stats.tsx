"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { stats } from "@/content/home";
import styles from "./Stats.module.css";

function Counter({ value, decimals, unit }: { value: number; decimals: number; unit: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const control = animate(0, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: setShown });
    return () => control.stop();
  }, [inView, value]);

  return (
    <b ref={ref}>
      {shown.toFixed(decimals)}
      {unit && <small>{unit}</small>}
    </b>
  );
}

export function Stats() {
  return (
    <section className="sec alt" style={{ paddingBlock: "clamp(70px, 9vw, 110px)" }}>
      <div className="wrap">
        <div className="head center">
          <span className="eyebrow">In numbers</span>
          <h2 className="h2">Real Postgres. Real numbers.</h2>
        </div>
        <div className={styles.stats}>
          {stats.map((s) => (
            <div className={styles.stat} key={s.label}>
              <Counter value={s.value} decimals={s.decimals} unit={s.unit} />
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
