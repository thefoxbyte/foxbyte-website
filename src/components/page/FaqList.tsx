"use client";

import { useId, useState } from "react";
import * as m from "motion/react-m";
import styles from "./FaqList.module.css";

export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  const base = useId();
  return (
    <div className={styles.faq}>
      {items.map((f, i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <div className={`${styles.q} ${isOpen ? styles.open : ""}`} key={f.q}>
            <h3>
              <button type="button" id={`${id}-q`} onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} aria-controls={id}>
                <span>{f.q}</span>
                <m.span className={styles.pm} animate={{ rotate: isOpen ? 45 : 0 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </m.span>
              </button>
            </h3>
            <div id={id} role="region" aria-labelledby={`${id}-q`} className={styles.ans}>
              <div className={styles.ansIn}>
                <p>{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
