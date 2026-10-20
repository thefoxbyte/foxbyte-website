import { ContactForm } from "@/components/page/ContactForm";
import { PageHero } from "@/components/page/PageHero";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import styles from "./contact.module.css";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Talk to the FoxByte team about Enterprise, partnerships or press, or reach the community on GitHub.",
  path: "/contact",
});

const channels = [
  { title: "Questions and ideas", body: "Ask the community and the maintainers in GitHub Discussions.", href: `${site.github}/discussions`, label: "Open Discussions" },
  { title: "Bugs", body: "Found something broken? Open an issue with the steps to reproduce it.", href: `${site.github}/issues`, label: "Open an issue" },
  { title: "Security", body: "Please report vulnerabilities privately through GitHub’s security advisories, never in a public issue.", href: `${site.github}/security`, label: "Report privately" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        hero={{ eyebrow: "Contact", title: "Talk to us", lede: "Tell us what you want your database to do. We read every message, and Enterprise enquiries get a reply from the team that builds FoxByte." }}
        trail={[{ label: "Contact", href: "/contact" }]}
      />
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className={`wrap ${styles.grid}`}>
          <ContactForm />
          <aside className={styles.side} aria-label="Other ways to reach us">
            {channels.map((c) => (
              <div key={c.title} className={styles.channel}>
                <h2>{c.title}</h2>
                <p>{c.body}</p>
                <a href={c.href} target="_blank" rel="noopener noreferrer">
                  {c.label} →
                </a>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
