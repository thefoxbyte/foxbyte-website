import { ContactForm } from "@/components/page/ContactForm";
import { PageHero } from "@/components/page/PageHero";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import styles from "./contact.module.css";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Talk to the FoxByte team about Enterprise, pilots, partnerships or press, report a bug, or report a vulnerability privately.",
  path: "/contact",
});

const channels = [
  { title: "Enterprise", body: "Licences and support for FoxByte on your own hardware. Choose Enterprise in the form and the team that builds FoxByte replies.", href: "#contact-name", label: "Use the form", external: false },
  { title: "Bugs", body: "Found something broken? Send the steps to reproduce it through the form, choosing Bug report.", href: "#contact-topic", label: "Report a bug", external: false },
  { title: "Security", body: "Please report vulnerabilities privately through GitHub’s security advisories, never in public.", href: `${site.github}/security`, label: "Report privately", external: true },
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
                <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
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
