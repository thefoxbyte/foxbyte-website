import { site } from "./site";

export type ContactTopic = { slug: string; label: string; question: string; prompt: string };

export const contactTopics: ContactTopic[] = [
  { slug: "enterprise", label: "Enterprise", question: "What would you like FoxByte to do for you?", prompt: "How many machines, which features you need, and when you need them." },
  { slug: "partnership", label: "Partnership", question: "What would you like to do together?", prompt: "Who you are, and what you would like to build or offer with FoxByte." },
  { slug: "bug", label: "Bug report", question: "What went wrong?", prompt: "What you ran, what happened, what you expected, and the output of fox version. Security problems go to the Security route instead." },
  { slug: "press", label: "Press", question: "What would you like to know?", prompt: "Your publication, your deadline, and your questions." },
  { slug: "other", label: "Other", question: "Your message", prompt: "Tell us what is on your mind." },
];

export const contactHref = (topic: string) => `/contact?topic=${topic}#contact-form`;

const issueBody = [
  "**What you ran**",
  "",
  "",
  "**What happened**",
  "",
  "",
  "**What you expected**",
  "",
  "",
  "**Output of `fox version`**",
  "",
  "",
  "**System** (macOS, Linux or Windows, and its version)",
  "",
].join("\n");

export const bugIssueHref = `${site.github}/issues/new?labels=bug&body=${encodeURIComponent(issueBody)}`;
export const securityAdvisoryHref = `${site.github}/security/advisories/new`;
export const securityMailHref = `mailto:info@thefoxbyte.com?subject=${encodeURIComponent("Security report")}`;
