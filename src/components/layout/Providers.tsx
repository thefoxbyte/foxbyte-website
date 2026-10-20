"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { LazyMotion, MotionConfig, domMax } from "motion/react";
import { ThemeProvider } from "@/lib/theme";
import { setLenis } from "@/lib/scroll";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11 });
    setLenis(lenis);
    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      <LazyMotion features={domMax} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
