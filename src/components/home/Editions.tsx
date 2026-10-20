"use client";

import * as m from "motion/react-m";
import { editions } from "@/content/home";
import { site } from "@/content/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { Arrow, Check } from "@/components/ui/icons";
import styles from "./Editions.module.css";

const ease = [0.22, 1, 0.36, 1] as const;

function Item({ text, color, i }: { text: string; color: string; i: number }) {
  return (
    <m.li initial={{ opacity: 0.3, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
      <Check color={color} />
      <span>{text}</span>
    </m.li>
  );
}

export function Editions() {
  return (
    <section id="pricing" className="sec alt">
      <div className="wrap">
        <div className="head center">
          <span className="eyebrow">Editions</span>
          <h2 className="h2">Safety is free. Always.</h2>
          <p className="lede">The Blackbox, backups and guardrails are in every edition. Enterprise adds the live feed, pipelines and controls growing teams ask for next.</p>
        </div>
        <div className={styles.grid}>
          <m.article className={styles.ed} initial={{ opacity: 0.3, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease }}>
            <div>
              <h3>Standard</h3>
              <p className={styles.price}>
                <b>Free</b>open source, AGPL-3.0
              </p>
            </div>
            <ul>
              {editions.standard.map((x, i) => (
                <Item key={x} text={x} color="#c14a2b" i={i} />
              ))}
            </ul>
            <Magnetic className="btn ghost" to="start">
              Install Standard
              <Arrow />
            </Magnetic>
            <p className={styles.note}>Using FoxByte doesn’t make your app AGPL. The SDKs are Apache-2.0.</p>
          </m.article>
          <m.article className={`${styles.ed} ${styles.ent}`} initial={{ opacity: 0.3, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease, delay: 0.1 }}>
            <div>
              <h3>Enterprise</h3>
              <p className={styles.price}>
                <b>Let’s talk</b>licensed per machine
              </p>
            </div>
            <ul>
              <li>
                <Check />
                <span className={styles.plus}>Everything in Standard, plus</span>
              </li>
              {editions.enterprise.map((x, i) => (
                <Item key={x} text={x} color="#ee6c4d" i={i} />
              ))}
            </ul>
            <Magnetic className="btn primary" href={site.contact}>
              Contact sales
              <Arrow />
            </Magnetic>
            <p className={styles.note}>Upgrade in place with one command. Your data, accounts and keys stay put.</p>
          </m.article>
        </div>
      </div>
    </section>
  );
}
