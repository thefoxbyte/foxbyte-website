import { PageHero } from "@/components/page/PageHero";
import { CtaBand } from "@/components/page/CtaBand";
import { Reveal } from "@/components/page/Reveal";
import { releases } from "@/content/changelog";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import styles from "@/components/page/Prose.module.css";

export const metadata = pageMetadata({
  title: "Changelog",
  description: "Every FoxByte release, from the first branch to multi-machine high availability, in plain English.",
  path: "/changelog",
});

export default function ChangelogPage() {
  return (
    <>
      <PageHero
        hero={{
          eyebrow: "Changelog",
          title: "What shipped, and when",
          lede: "User-visible changes in every release. Run fox update to get the latest; it checks the release signature before installing anything.",
          ctas: [{ label: "All releases on GitHub", href: `${site.github}/releases`, primary: true }],
        }}
        trail={[{ label: "Changelog", href: "/changelog" }]}
      />
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ol className={styles.timeline}>
            {releases.map((r) => (
              <li key={r.version} className={styles.release}>
                <div className={`${styles.version} ${r.version === "Unreleased" ? styles.unreleased : ""}`}>
                  <b>{r.version}</b>
                  {r.date.match(/^\d/) ? <time dateTime={r.date.slice(0, 10)}>{r.date}</time> : <span>{r.date}</span>}
                </div>
                <Reveal className={styles.notes}>
                  <h2>{r.title}</h2>
                  <ul>
                    {r.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand title="Stay on the latest." lede="fox update installs the newest release, and never one whose signature fails." />
    </>
  );
}
