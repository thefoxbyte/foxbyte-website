import Link from "next/link";
import type { CSSProperties } from "react";
import type { Hero, Link as LinkItem } from "@/content/types";
import { site } from "@/content/site";
import { BranchField } from "@/components/home/BranchField";
import { Magnetic } from "@/components/ui/Magnetic";
import { Arrow } from "@/components/ui/icons";
import { JsonLd } from "./JsonLd";
import { Visual } from "./Visual";
import styles from "./Page.module.css";

type Crumb = { label: string; href: string };

function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const all = [{ label: "Home", href: "/" }, ...trail];
  return (
    <>
      <nav aria-label="Breadcrumb" className={styles.crumbs}>
        <ol>
          {all.map((c, i) => (
            <li key={c.href}>
              {i < all.length - 1 ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href === "/" ? "" : c.href}` })),
        }}
      />
    </>
  );
}

export function CtaLinks({ links }: { links: LinkItem[] }) {
  return (
    <div className={styles.ctas}>
      {links.map((l) => {
        const external = l.href.startsWith("http");
        return (
          <Magnetic key={l.label} className={`btn ${l.primary ? "primary" : "ghost"}`} href={l.href} external={external}>
            {l.label}
            {l.primary && <Arrow />}
          </Magnetic>
        );
      })}
    </div>
  );
}

export function PageHero({ hero, trail }: { hero: Hero; trail: Crumb[] }) {
  const rise = (d: string) => ({ "--d": d }) as CSSProperties;
  return (
    <section className={styles.hero}>
      <BranchField className={styles.field} />
      <div className={styles.glow} aria-hidden="true" />
      <div className={`wrap ${styles.heroIn} ${hero.visual ? styles.withVisual : ""}`}>
        <div className={styles.heroCopy}>
          <div className={styles.rise} style={rise("0s")}>
            <Breadcrumbs trail={trail} />
          </div>
          <span className={`eyebrow ${styles.rise}`} style={rise(".05s")}>
            {hero.eyebrow}
            {hero.tag && <span className="tag-e">{hero.tag}</span>}
          </span>
          <h1 className={`${styles.h1} ${styles.riseText}`} style={rise(".12s")}>
            {hero.title}
          </h1>
          <p className={`lede ${styles.riseText}`} style={rise(".24s")}>
            {hero.lede}
          </p>
          {hero.ctas && (
            <div className={styles.rise} style={rise(".34s")}>
              <CtaLinks links={hero.ctas} />
            </div>
          )}
        </div>
        {hero.visual && (
          <div className={`${styles.heroVisual} ${styles.rise}`} style={rise(".3s")}>
            <Visual name={hero.visual} />
          </div>
        )}
      </div>
    </section>
  );
}
