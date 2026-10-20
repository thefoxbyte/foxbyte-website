"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useTheme } from "@/lib/theme";
import styles from "./Nav.module.css";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className={styles.iconBtn}
      onClick={(e) => toggle({ x: e.clientX, y: e.clientY })}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {dark ? (
          <m.svg key="sun" width="18" height="18" viewBox="0 0 24 24" fill="none" initial={{ rotate: -90, scale: 0.4, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0.4, opacity: 0 }} transition={{ duration: 0.3 }}>
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </m.svg>
        ) : (
          <m.svg key="moon" width="18" height="18" viewBox="0 0 24 24" fill="none" initial={{ rotate: 90, scale: 0.4, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: -90, scale: 0.4, opacity: 0 }} transition={{ duration: 0.3 }}>
            <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </m.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
