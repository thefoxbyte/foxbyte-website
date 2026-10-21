import Link from "next/link";
import { Visual } from "@/components/page/Visual";
import { Reveal } from "@/components/page/Reveal";
import { Check } from "@/components/ui/icons";
import styles from "./BlackboxProof.module.css";

const points = [
  { strong: "Tamper-evident for free.", text: "Every entry is hash-chained to the one before it, and fox blackbox verify checks the whole chain in every edition." },
  { strong: "Insider-proof in Enterprise.", text: "Signed anchors are written on a schedule and kept where your own admins cannot rewrite them, such as an Object Lock bucket." },
  { strong: "A way back, not only evidence.", text: "Point at any entry and get main as it was just before it, as a new branch. Main is left alone." },
];

export function BlackboxProof() {
  return (
    <section id="proof" className="sec alt">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <span className="eyebrow">The Blackbox</span>
          <h2 className="h2">A record you can prove, not just a log you can read</h2>
          <p className="lede">
            Every CREATE, ALTER, DROP and GRANT is written down as it happens: who made it, person or agent, from which tool and on which branch. Clients log in as their own Postgres role, so nobody can forge who did it.
          </p>
          <ul className={styles.points}>
            {points.map((p) => (
              <li key={p.strong}>
                <Check color="var(--accent-ink)" />
                <span>
                  <b>{p.strong}</b> {p.text}
                </span>
              </li>
            ))}
          </ul>
          <div className={styles.links}>
            <Link href="/product/blackbox">How the Blackbox works →</Link>
            <a href="https://github.com/thefoxbyte/foxbyte/blob/main/docs/ledger-anchor-format.md" target="_blank" rel="noopener noreferrer">
              Anchor format spec →
            </a>
          </div>
        </div>
        <Reveal className={styles.visual}>
          <Visual name="anchor" />
        </Reveal>
      </div>
    </section>
  );
}
