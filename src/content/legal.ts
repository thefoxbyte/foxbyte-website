import type { PostSection } from "./blog";

export type LegalDoc = { slug: string; title: string; description: string; updated: string; sections: PostSection[] };

const repo = "https://github.com/thefoxbyte/foxbyte";

export const legalDocs: LegalDoc[] = [
  {
    slug: "licence",
    title: "Licences",
    description: "FoxByte’s core is AGPL-3.0-or-later, its client SDKs are Apache-2.0, and the Enterprise edition is source-available under a commercial licence.",
    updated: "2026-10-20",
    sections: [
      {
        paragraphs: ["FoxByte is built from one repository under three licences. The full texts live in the repository; this page summarises what they mean for you."],
      },
      {
        heading: "Core and server: AGPL-3.0-or-later",
        paragraphs: [
          "Everything in the repository except the client SDKs and the enterprise directory. You may use, study, change and share it.",
          "Using FoxByte does not make your application AGPL. Connecting over the Postgres wire protocol is not a derivative work. The copyleft applies only if you modify FoxByte itself and offer it to others as a service.",
        ],
        bullets: [`Full text: ${repo}/blob/main/LICENSE`],
      },
      {
        heading: "Client SDKs: Apache-2.0",
        paragraphs: ["The Python and TypeScript clients, so you can embed them in any application, open or closed."],
        bullets: [`Full text: ${repo}/blob/main/clients/LICENSE`],
      },
      {
        heading: "Enterprise edition: commercial, source-available",
        paragraphs: [
          "The code in the enterprise directory is published so you can read it, but it is not open source. Its features need a licence; without one, the Enterprise build behaves exactly like Standard.",
          "The Standard binary contains none of this code, which is checked against the built binary rather than the source.",
        ],
        bullets: [`Full text: ${repo}/blob/main/enterprise/LICENSE`],
      },
      {
        heading: "Contributions",
        paragraphs: ["Contributions are accepted under the contributor licence agreement in the repository."],
        bullets: [`CLA: ${repo}/blob/main/CLA.md`],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Website privacy",
    description: "What this website stores in your browser and what it sends anywhere: very little, and nothing for tracking.",
    updated: "2026-10-20",
    sections: [
      {
        paragraphs: ["This page covers the FoxByte website only. FoxByte the database runs on your own machines and does not send your data to us; how it protects your data is on the data privacy page at /privacy."],
      },
      {
        heading: "No tracking",
        paragraphs: ["The website has no analytics, no advertising and no tracking cookies. Its fonts and images are served from this site, not from third parties."],
      },
      {
        heading: "Stored in your browser",
        paragraphs: ["A few preferences are kept in your browser’s local storage and never leave it:"],
        bullets: [
          "fox-theme: whether you chose light or dark mode.",
          "foxbot-hidden: whether you hid FoxBot.",
          "fox-intro-at: when the opening animation last played on the home page, so it plays there at most once every 12 hours.",
        ],
      },
      {
        heading: "FoxBot",
        paragraphs: [
          "FoxBot, the small robot in the corner, is an animation that runs entirely in your browser. The messages it shows, such as connected or blackbox +1, are made up on the page to illustrate the product. It does not connect to any database, send anything anywhere or record what you do.",
          "Its menu can copy the install command to your clipboard, take you on a tour of the home page, or hide it. Hiding it is remembered in your browser only.",
        ],
      },
      {
        heading: "If you contact us",
        paragraphs: ["The contact form sends your name, work email, company and message to the FoxByte team so we can reply. We use it for that and nothing else."],
      },
      {
        heading: "Server logs",
        paragraphs: ["Like any website, the server that hosts these pages may keep standard request logs, such as IP address and time, for security and reliability."],
      },
    ],
  },
];

export function legalBySlug(slug: string) {
  return legalDocs.find((d) => d.slug === slug);
}
