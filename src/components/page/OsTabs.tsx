"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { copyText } from "@/lib/scroll";
import styles from "./OsTabs.module.css";

type Os = "macos" | "linux" | "windows";

const systems: { id: Os; label: string; shell: string; lines: string[]; note: string }[] = [
  {
    id: "macos",
    label: "macOS",
    shell: "Terminal",
    lines: ["brew install lima", "curl -fsSL https://raw.githubusercontent.com/thefoxbyte/foxbyte/main/deploy/install.sh | sh", "fox setup"],
    note: "fox setup creates a dedicated Lima VM with Docker and ZFS and brings everything up. The first run downloads Ubuntu, which takes a few minutes.",
  },
  {
    id: "linux",
    label: "Linux",
    shell: "Shell",
    lines: ["curl -fsSL https://raw.githubusercontent.com/thefoxbyte/foxbyte/main/deploy/install.sh | sh", "sudo fox start"],
    note: "The engine runs natively, with no VM. ZFS and Docker are provisioned on first start, and services listen on 127.0.0.1 only.",
  },
  {
    id: "windows",
    label: "Windows",
    shell: "PowerShell",
    lines: ["irm https://raw.githubusercontent.com/thefoxbyte/foxbyte/main/deploy/install.ps1 | iex"],
    note: "Run it in PowerShell, not Command Prompt. It installs WSL if needed, brings its own dedicated distro with btrfs, and runs fox setup. Your other WSL distros and Docker Desktop are untouched.",
  },
];

function detect(): Os {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux") && !ua.includes("android")) return "linux";
  return "macos";
}

export function OsTabs() {
  const [os, setOs] = useState<Os>("macos");
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const current = systems.find((s) => s.id === os) ?? systems[0];

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setOs(detect()));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const copy = async () => {
    await copyText(current.lines.join("\n"), preRef.current);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="tablist" aria-label="Operating system">
        {systems.map((s) => (
          <button key={s.id} type="button" role="tab" aria-selected={os === s.id} className={`${styles.tab} ${os === s.id ? styles.on : ""}`} onClick={() => setOs(s.id)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className={`${styles.panel} screen`} role="tabpanel">
        <div className={styles.bar}>
          <span>{current.shell}</span>
          <button type="button" className={styles.copy} onClick={copy}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
        <AnimatePresence mode="wait">
          <m.pre ref={preRef} key={os} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            {current.lines.map((l, i) => (
              <span key={l}>
                <span className={styles.prompt}>{os === "windows" ? "PS> " : "$ "}</span>
                {l}
                {i < current.lines.length - 1 ? "\n" : ""}
              </span>
            ))}
          </m.pre>
        </AnimatePresence>
      </div>
      <p className={styles.note}>{current.note}</p>
    </div>
  );
}
