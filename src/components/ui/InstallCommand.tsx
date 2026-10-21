"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { site } from "@/content/site";
import { copyText } from "@/lib/scroll";
import styles from "./InstallCommand.module.css";

type Shell = "unix" | "windows";

const shells: { id: Shell; label: string; prompt: string; command: string }[] = [
  { id: "unix", label: "macOS · Linux", prompt: "$ ", command: site.install },
  { id: "windows", label: "Windows", prompt: "PS> ", command: site.installWindows },
];

export function InstallCommand({ onBand = false }: { onBand?: boolean }) {
  const [shell, setShell] = useState<Shell>("unix");
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const current = shells.find((s) => s.id === shell) ?? shells[0];

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      if (navigator.userAgent.toLowerCase().includes("win")) setShell("windows");
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const copy = async () => {
    await copyText(current.command, codeRef.current);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={`${styles.wrap} ${onBand ? styles.onBand : ""}`}>
      <div className={styles.switch} role="tablist" aria-label="Your operating system">
        {shells.map((s) => (
          <button key={s.id} type="button" role="tab" aria-selected={shell === s.id} className={shell === s.id ? styles.on : undefined} onClick={() => setShell(s.id)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className={styles.install}>
        <code ref={codeRef} className={styles.code}>
          <span className={styles.prompt}>{current.prompt}</span>
          {current.command}
        </code>
        <button type="button" className={styles.copy} onClick={copy} aria-label={copied ? "Install command copied" : "Copy install command"}>
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <m.svg key="ok" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3.2 3L13 4.5" stroke="var(--ok)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </m.svg>
            ) : (
              <m.svg key="cp" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="8.5" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 3H4a1.5 1.5 0 00-1.5 1.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </m.svg>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
