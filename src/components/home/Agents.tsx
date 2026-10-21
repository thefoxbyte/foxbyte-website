"use client";

import { Fragment } from "react";
import * as m from "motion/react-m";
import { agentPoints } from "@/content/home";
import { useTick } from "@/lib/hooks";
import { Check } from "@/components/ui/icons";
import { AgentCode } from "./AgentCode";
import styles from "./Agents.module.css";

const ease = [0.22, 1, 0.36, 1] as const;
const loop = ["copy", "work", "review", "approve"];

export function Agents() {
  const t = useTick(1300, loop.length);
  return (
    <section id="agents" className="sec alt">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <span className="eyebrow">AI, on your terms</span>
          <h2 className="h2">Let AI take control. Without touching main.</h2>
          <p className="lede">Hand an agent a real database, not a mock. It can build, break and try again on its own copy while main never feels a thing.</p>
          <ul className={styles.points}>
            {agentPoints.map((p, i) => (
              <m.li key={p} initial={{ x: -14 }} whileInView={{ x: 0 }} viewport={{ once: true, amount: 0.8 }} transition={{ delay: i * 0.1, duration: 0.6, ease }}>
                <Check color="#bb4527" />
                <span>{p}</span>
              </m.li>
            ))}
          </ul>
          <div className={styles.loop} aria-hidden="true">
            {loop.map((s, i) => (
              <Fragment key={s}>
                {i > 0 && <i />}
                <span className={t === i ? styles.on : undefined}>{s}</span>
              </Fragment>
            ))}
          </div>
        </div>
        <m.div initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease }}>
          <AgentCode />
        </m.div>
      </div>
    </section>
  );
}
