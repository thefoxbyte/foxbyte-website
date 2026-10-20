export const site = {
  name: "FoxByte",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "FoxByte: PostgreSQL with a Blackbox, live rows and AI that never touches main",
  shortTitle: "FoxByte",
  description:
    "FoxByte is PostgreSQL on your own servers, with a Blackbox that records every change, a realtime feed of every row, one-command migrations and instant copies where people and AI work without touching main.",
  tagline: "Let AI take the wheel. Main stays in your hands.",
  github: "https://github.com/thefoxbyte/foxbyte",
  contact: "/contact",
  install: "curl -fsSL https://get.thefoxbyte.com/install.sh | sh",
  keywords: [
    "PostgreSQL",
    "Postgres branching",
    "database branching",
    "schema change audit log",
    "tamper-evident database",
    "on-premises realtime database",
    "Postgres change data capture",
    "MySQL to Postgres migration",
    "MongoDB to Postgres migration",
    "ETL pipelines",
    "database for AI agents",
    "MCP Postgres",
  ],
} as const;

export const productLinks = [
  { label: "Overview", href: "/product", line: "How FoxByte fits around Postgres", icon: "db" },
  { label: "Branching", href: "/product/branching", line: "A full copy in seconds", icon: "branch" },
  { label: "Blackbox", href: "/product/blackbox", line: "Every change, on record", icon: "box" },
  { label: "Realtime", href: "/product/realtime", line: "Every row, live, on your servers", icon: "pulse" },
  { label: "Guardrails", href: "/product/guardrails", line: "Mistakes stop before they land", icon: "shield" },
  { label: "Time travel & HA", href: "/product/time-travel", line: "Rewind, back up, fail over", icon: "rewind" },
  { label: "Web console", href: "/product/console", line: "The whole database in one tab", icon: "import" },
] as const;

export const navLinks = [
  { label: "AI agents", href: "/ai-agents" },
  { label: "Use cases", href: "/use-cases" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
] as const;

const repo = "https://github.com/thefoxbyte/foxbyte";

export const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "Branching", href: "/product/branching" },
      { label: "Blackbox", href: "/product/blackbox" },
      { label: "Realtime", href: "/product/realtime" },
      { label: "Guardrails", href: "/product/guardrails" },
      { label: "Time travel & HA", href: "/product/time-travel" },
      { label: "Web console", href: "/product/console" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "AI agents", href: "/ai-agents" },
      { label: "Use cases", href: "/use-cases" },
      { label: "Why FoxByte", href: "/why-foxbyte" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Download", href: "/download" },
      { label: "Docs", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
      { label: "Blog", href: "/blog" },
      { label: "GitHub", href: repo },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Contact", href: "/contact" },
      { label: "Licences", href: "/legal/licence" },
      { label: "Privacy", href: "/legal/privacy" },
    ],
  },
] as const;
