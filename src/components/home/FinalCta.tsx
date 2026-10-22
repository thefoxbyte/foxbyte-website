"use client";

import { useRef } from "react";
import Image from "next/image";
import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { site } from "@/content/site";
import { Magnetic } from "@/components/ui/Magnetic";
import { InstallCommand } from "@/components/ui/InstallCommand";
import { Arrow, Icon, type FeatureIcon } from "@/components/ui/icons";
import styles from "./FinalCta.module.css";

const drifters: { icon: FeatureIcon; left: string; top: string; delay: number }[] = [
  { icon: "branch", left: "9%", top: "24%", delay: 0 },
  { icon: "db", left: "86%", top: "18%", delay: 1.2 },
  { icon: "import", left: "16%", top: "74%", delay: 2.1 },
  { icon: "box", left: "82%", top: "70%", delay: 0.6 },
  { icon: "pulse", left: "28%", top: "10%", delay: 1.6 },
  { icon: "pipe", left: "70%", top: "88%", delay: 2.6 },
];

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-80, 160]);

  return (
    <section id="start" className={styles.final} ref={ref}>
      <m.div className={styles.wing} style={{ left: "-4%", y: leftY, rotate: -8 }} aria-hidden="true">
        <Image src="/brand/mark-dark-l.webp" alt="" width={297} height={491} />
      </m.div>
      <m.div className={styles.wing} style={{ right: "-4%", y: rightY, rotate: 8 }} aria-hidden="true">
        <Image src="/brand/mark-dark-r.webp" alt="" width={298} height={491} />
      </m.div>
      {drifters.map((d) => (
        <div key={d.icon} className={styles.drift} style={{ left: d.left, top: d.top, animationDelay: `-${d.delay}s`, animationDuration: `${6 + d.delay}s` }} aria-hidden="true">
          <div className={styles.tile}>
            <Icon name={d.icon} />
          </div>
        </div>
      ))}
      <div className={`wrap ${styles.inner}`}>
        <span className={`eyebrow ${styles.eyebrow}`}>Get started</span>
        <m.h2 initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          Your data. Your servers. <span className={styles.accent}>Your rules.</span>
        </m.h2>
        <p className={`lede ${styles.lede}`}>Install FoxByte in a few minutes. Bring your database over with one command.</p>
        <InstallCommand onBand />
        <div className={styles.ctas}>
          <Magnetic className="btn primary" href="/docs/quickstart">
            Read the quickstart
            <Arrow />
          </Magnetic>
          <Magnetic className="btn onBand" href={site.github} external>
            Star on GitHub
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
