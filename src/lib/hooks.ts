"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";
import { useMotionValue, type MotionValue } from "motion/react";

export function useMedia(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export function useTick(ms: number, count: number): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => (t + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [ms, count]);
  return tick;
}

export function useSectionProgress(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const progress = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const range = Math.max(1, el.offsetHeight - window.innerHeight);
      progress.set(Math.max(0, Math.min(1, -el.getBoundingClientRect().top / range)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, progress]);
  return progress;
}
