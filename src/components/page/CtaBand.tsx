import Link from "next/link";
import type { Link as LinkItem } from "@/content/types";
import { InstallCommand } from "@/components/ui/InstallCommand";
import { Magnetic } from "@/components/ui/Magnetic";
import { Arrow } from "@/components/ui/icons";
import styles from "./Page.module.css";

type CtaBandProps = { title: string; lede: string; related?: LinkItem[] };

export function CtaBand({ title, lede, related }: CtaBandProps) {
  return (
    <section className={styles.band}>
      <div className={`wrap ${styles.bandIn}`}>
        <h2>{title}</h2>
        <p className="lede">{lede}</p>
        <InstallCommand onBand />
        <div className={styles.ctas}>
          <Magnetic className="btn primary" href="/download">
            Install FoxByte
            <Arrow />
          </Magnetic>
          <Magnetic className="btn onBand" href="/docs">
            Read the docs
          </Magnetic>
        </div>
        {related && related.length > 0 && (
          <nav className={styles.related} aria-label="Related pages">
            <span>Related</span>
            {related.map((r) => (
              <Link key={r.href} href={r.href}>
                {r.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
