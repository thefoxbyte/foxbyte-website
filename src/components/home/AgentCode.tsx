"use client";

import { Fragment, useState, type ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { agentCode } from "@/content/home";
import styles from "./AgentCode.module.css";

type Tab = keyof typeof agentCode;
const tabs = Object.keys(agentCode) as Tab[];

function highlight(code: string): ReactNode[] {
  return code.split("\n").map((line, li, all) => {
    const parts: ReactNode[] = [];
    let rest = line;
    if (rest.startsWith("$ ")) {
      parts.push(
        <b key="p" className={styles.pr}>
          ${" "}
        </b>,
      );
      rest = rest.slice(2);
    }
    if (rest.trimStart().startsWith("#")) {
      parts.push(
        <i key="c" className={styles.cm}>
          {rest}
        </i>,
      );
    } else {
      rest.split(/("[^"]*")/g).forEach((chunk, ci) => {
        if (!chunk) return;
        parts.push(
          chunk.startsWith('"') ? (
            <b key={ci} className={styles.st}>
              {chunk}
            </b>
          ) : (
            <Fragment key={ci}>{chunk}</Fragment>
          ),
        );
      });
    }
    return (
      <Fragment key={li}>
        {parts}
        {li < all.length - 1 ? "\n" : ""}
      </Fragment>
    );
  });
}

export function AgentCode() {
  const [tab, setTab] = useState<Tab>("MCP");
  return (
    <div className={`${styles.code} screen`}>
      <div className={styles.tabs} role="tablist" aria-label="Ways to connect an agent">
        {tabs.map((k) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={`${styles.tab} ${tab === k ? styles.tabOn : ""}`} onClick={() => setTab(k)}>
            {k}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <m.pre key={tab} role="tabpanel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          {highlight(agentCode[tab])}
        </m.pre>
      </AnimatePresence>
    </div>
  );
}
