"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate } from "motion/react";
import * as m from "motion/react-m";
import styles from "./Intro.module.css";

const spring = { type: "spring", stiffness: 110, damping: 15 } as const;

function Wing({ variant, side }: { variant: "light" | "dark"; side: "l" | "r" }) {
  const from = side === "l" ? { x: -160, y: 40, rotate: -32, opacity: 0 } : { x: 160, y: -40, rotate: 32, opacity: 0 };
  return (
    <m.span className={styles.wing} initial={from} animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }} transition={{ ...spring, delay: side === "l" ? 0.15 : 0.35 }}>
      <Image src={`/brand/mark-${variant}-${side}.webp`} alt="" width={60} height={variant === "dark" ? 99 : 95} priority />
    </m.span>
  );
}

export function Intro() {
  const [visible, setVisible] = useState(true);
  const overlay = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  const finish = useCallback(async () => {
    if (done.current) return;
    done.current = true;
    const root = document.documentElement;
    const target = document.querySelector("[data-nav-mark]")?.getBoundingClientRect();
    const source = mark.current?.getBoundingClientRect();
    const fades: Promise<unknown>[] = [];
    if (overlay.current) fades.push(animate(overlay.current, { backgroundColor: "rgba(0,0,0,0)" }, { duration: 0.6 }).finished);
    if (target && source && mark.current) {
      const scale = target.width / source.width;
      fades.push(
        animate(
          mark.current,
          {
            x: target.left + target.width / 2 - (source.left + source.width / 2),
            y: target.top + target.height / 2 - (source.top + source.height / 2),
            scale,
          },
          { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        ).finished,
      );
    }
    const word = overlay.current?.querySelector(`.${styles.word}`);
    if (word) fades.push(animate(word, { opacity: 0 }, { duration: 0.25 }).finished);
    await Promise.all(fades);
    delete root.dataset.intro;
    setVisible(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  useEffect(() => {
    if (!document.documentElement.dataset.intro) {
      const id = window.requestAnimationFrame(() => setVisible(false));
      return () => window.cancelAnimationFrame(id);
    }
    const t = window.setTimeout(finish, 2300);
    return () => window.clearTimeout(t);
  }, [finish]);

  if (!visible) return null;

  return (
    <div ref={overlay} className={styles.intro} onClick={finish}>
      <button type="button" className={styles.skip} onClick={finish}>
        Skip intro
      </button>
      <div className={styles.inner} aria-hidden="true">
        <div ref={mark} className={styles.mark}>
          <span className={`${styles.set} light-only`}>
            <Wing variant="light" side="l" />
            <Wing variant="light" side="r" />
          </span>
          <span className={`${styles.set} dark-only`}>
            <Wing variant="dark" side="l" />
            <Wing variant="dark" side="r" />
          </span>
        </div>
        <m.span className={styles.word} initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ delay: 0.75, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <Image className="light-only" src="/brand/word-light.webp" alt="" width={246} height={62} priority />
          <Image className="dark-only" src="/brand/word-dark.webp" alt="" width={252} height={62} priority />
        </m.span>
      </div>
    </div>
  );
}
