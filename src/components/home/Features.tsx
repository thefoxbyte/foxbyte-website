"use client";

import type { MouseEvent, ReactNode } from "react";
import * as m from "motion/react-m";
import { HaArt, RequestArt, SecureArt, SleepArt, TimeScrub, TrackArt, UndoArt } from "./FeatureArt";
import styles from "./Features.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

function Card({ wide, title, enterprise, soon, body, children }: { wide?: boolean; title: string; enterprise?: boolean; soon?: boolean; body: string; children: ReactNode }) {
  const move = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <m.article className={`${styles.card} ${wide ? styles.wide : ""}`} onMouseMove={move} initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, ease }}>
      <h3>
        {title}
        {enterprise && <span className="tag-e">Enterprise</span>}
        {soon && <span className="tag-e">Coming soon</span>}
      </h3>
      <p>{body}</p>
      <div className={styles.art}>{children}</div>
    </m.article>
  );
}

export function Features() {
  return (
    <section id="features" className="sec">
      <div className="wrap">
        <div className="head">
          <span className="eyebrow">Features</span>
          <h2 className="h2">Everything a database you own should have.</h2>
          <p className="lede">Backups, time travel and high availability come built in. So does a way out of the one change you wish you hadn’t made.</p>
        </div>
        <div className={styles.bento}>
          <Card wide title="Time travel" body="Every change is archived in the background, so you can rebuild the database at any second in the archived window. It opens as a separate copy, and main never notices.">
            <TimeScrub />
          </Card>
          <Card title="Scales to zero" body="Idle branches go to sleep and wake on the next connection, at the same address.">
            <SleepArt />
          </Card>
          <Card title="High availability" body="Add a hot standby, even on a second machine, fail over automatically or in one command, and run a drill that tells you what it cost.">
            <HaArt />
          </Card>
          <Card title="Change requests" enterprise body="Bring a branch’s schema changes back to main after someone has reviewed them.">
            <RequestArt />
          </Card>
          <Card title="Secure by default" body="A fresh install exposes nothing it doesn’t have to.">
            <SecureArt />
          </Card>
          <Card wide title="Undo any change" body="Pick an entry in the Blackbox and get a fresh copy of main exactly as it was just before it. Inspect it, copy back what you need, or point your app at it.">
            <UndoArt />
          </Card>
          <Card title="Row tracking" soon body="One command will keep created_at, updated_at and who changed each row, on any table.">
            <TrackArt />
          </Card>
        </div>
      </div>
    </section>
  );
}
