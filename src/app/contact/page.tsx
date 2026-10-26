import { Suspense } from "react";
import { ContactForm, ContactFormFromLink } from "@/components/page/ContactForm";
import { PageHero } from "@/components/page/PageHero";
import { site } from "@/content/site";
import { bugIssueHref, contactHref, securityAdvisoryHref, securityMailHref } from "@/content/contact";
import { pageMetadata } from "@/lib/metadata";
import styles from "./contact.module.css";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Talk to the FoxByte team about Enterprise, pilots, partnerships or press, report a bug, or report a vulnerability privately.",
  path: "/contact",
});

type Channel = { title: string; body: string; links: { label: string; href: string }[] };

const channels: Channel[] = [
  { title: "Email", body: "Write to us directly. We reply within 24 hours.", links: [{ label: "info@thefoxbyte.com", href: "mailto:info@thefoxbyte.com" }] },
  { title: "Enterprise", body: "Licences and support for FoxByte on your own hardware. The team that builds FoxByte replies.", links: [{ label: "Ask about Enterprise", href: contactHref("enterprise") }] },
  { title: "Bugs", body: "Open a GitHub issue, where others with the same problem can find it. For a bug that involves your own data, send it to us privately instead. Security problems never go in a public issue.", links: [{ label: "Open an issue on GitHub", href: bugIssueHref }, { label: "Report a bug privately", href: contactHref("bug") }] },
  { title: "Security", body: "Report vulnerabilities privately through GitHub, never in public. No GitHub account? Email us with Security report in the subject.", links: [{ label: "Report on GitHub", href: securityAdvisoryHref }, { label: "Email info@thefoxbyte.com", href: securityMailHref }] },
  { title: "Follow FoxByte", body: "Releases and news on X and Instagram, as @getfoxbyte.", links: [{ label: "Follow on X", href: site.x }, { label: "Instagram", href: site.instagram }] },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        hero={{ eyebrow: "Contact", title: "Talk to us", lede: "Tell us what you want your database to do. We read every message and reply within 24 hours, and Enterprise enquiries get a reply from the team that builds FoxByte." }}
        trail={[{ label: "Contact", href: "/contact" }]}
      />
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className={`wrap ${styles.grid}`}>
          <Suspense fallback={<ContactForm />}>
            <ContactFormFromLink />
          </Suspense>
          <aside className={styles.side} aria-label="Other ways to reach us">
            {channels.map((c) => (
              <div key={c.title} className={styles.channel}>
                <h2>{c.title}</h2>
                <p>{c.body}</p>
                <div className={styles.links}>
                  {c.links.map((l) => {
                    const external = l.href.startsWith("http");
                    return (
                      <a key={l.href} href={l.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {l.label} →
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
