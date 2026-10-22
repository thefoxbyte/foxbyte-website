import type { PageContent } from "./types";

const install = { label: "Install FoxByte", href: "/download", primary: true };

export const auditLogPage: PageContent = {
  slug: "postgres-audit-log",
  path: "/postgres-audit-log",
  crumb: "Postgres audit log",
  meta: {
    title: "A tamper-evident audit log for PostgreSQL schema changes",
    description: "Record every PostgreSQL schema and privilege change with the login that made it, person or AI agent, in a hash-chained log with signed anchors. How it compares with pgAudit and audit tables built on event triggers.",
  },
  hero: {
    eyebrow: "Postgres audit log",
    title: "An audit log for Postgres that can prove itself",
    lede: "Most Postgres audit logs tell you what happened. FoxByte’s Blackbox also shows whether the record was edited afterwards, attributes each change to a login, and gives you a way back to just before it.",
    ctas: [install, { label: "How the Blackbox works", href: "/product/blackbox" }],
    visual: "record",
  },
  blocks: [
    {
      kind: "table",
      eyebrow: "Compared",
      title: "Three ways to audit schema changes in Postgres",
      head: ["", "pgAudit", "Your own event triggers", "FoxByte Blackbox"],
      rows: [
        ["Where the record lives", "The PostgreSQL server log", "A table you design", "An append-only table in the database"],
        ["Shows an edit made afterwards", "No", "Only if you build it", "Yes: every entry is hash-chained to the one before"],
        ["Proof against a superuser", "No", "No", "Signed anchors kept off the machine (Enterprise)"],
        ["Who made the change", "The database role", "Whatever you capture", "The login role, person or agent, and the tool the client reported"],
        ["Stops a destructive change", "No", "If you write it", "DROP and TRUNCATE blocked by policy, with the attempt recorded"],
        ["A way back", "No", "No", "A branch of main as it was just before any entry"],
        ["Reads and data writes", "Yes, when configured", "If you write it", "No reads; TRUNCATE by anyone, and agents’ UPDATE and DELETE"],
      ],
      note: "pgAudit is the right tool when you need every read in a log. The Blackbox is for proving who changed the schema and that nobody rewrote the story since.",
    },
    {
      kind: "code",
      eyebrow: "In practice",
      title: "Read it, check it, prove it",
      body: "fox blackbox lists the changes with who made them. fox blackbox verify recomputes the hash chain, so an edited or deleted entry shows. fox blackbox integrity checks the entries against the signed anchors written outside the database, and the standalone fox-verify does the same for an auditor who does not trust your machine.",
      lines: ["$ fox blackbox", "$ fox blackbox verify", "$ fox blackbox integrity"],
    },
    {
      kind: "grid",
      eyebrow: "Each entry",
      title: "What one entry holds",
      items: [
        { title: "Who", body: "The login role, which a client cannot change, and whether it is a person or an agent.", icon: "shield" },
        { title: "What", body: "The command, the object and the full statement, and whether it was applied, flagged or blocked.", icon: "box" },
        { title: "Where and when", body: "The branch, the session, the time, and the tool as the client reported it.", icon: "db" },
      ],
    },
    {
      kind: "faq",
      title: "Questions about auditing Postgres",
      items: [
        { q: "Does it slow Postgres down?", a: "A schema change writes one entry in the same transaction. People’s reads and data writes are not recorded, so they pay nothing; an agent’s UPDATE or DELETE adds one entry per statement." },
        { q: "Can a superuser hide a change?", a: "A superuser can stop the event triggers that write the record. Signed anchors kept off the machine prove that recorded history was not rewritten, and the next release adds a scan that records changes the triggers missed." },
        { q: "Is it free?", a: "Recording, verifying and the independent verifier are free in every edition. Writing signed anchors on a schedule is part of Enterprise." },
        { q: "Can I use it with my existing database?", a: "Bring the database over with fox import, from PostgreSQL, MySQL, MariaDB, MongoDB or files. Every schema change from then on is recorded." },
      ],
    },
  ],
  related: [
    { label: "Blackbox", href: "/product/blackbox" },
    { label: "Regulated teams", href: "/regulated" },
    { label: "Security", href: "/security" },
  ],
  cta: { title: "Put your schema on the record.", lede: "Every schema change is recorded from the moment you install. Verifying it is free.", docs: { label: "Anchor format", href: "https://github.com/thefoxbyte/foxbyte/blob/main/docs/ledger-anchor-format.md" } },
};

export const branchingGuidePage: PageContent = {
  slug: "postgres-branching",
  path: "/postgres-branching",
  crumb: "Postgres branching",
  meta: {
    title: "Self-hosted Postgres branching: a full copy of your database in seconds",
    description: "Branch a PostgreSQL database on your own servers: complete, writable copies made with copy-on-write storage, one connection string each, asleep when idle. How it works and what it costs.",
  },
  hero: {
    eyebrow: "Postgres branching",
    title: "Branch your Postgres database on your own servers",
    lede: "A branch is a complete, writable copy of your database, made in seconds on machines you control. Nothing is copied until it changes, each branch gets its own connection string, and idle branches sleep.",
    ctas: [install, { label: "Branching in detail", href: "/product/branching" }],
    visual: "branch",
  },
  blocks: [
    {
      kind: "steps",
      eyebrow: "How it works",
      title: "Copy-on-write, then a Postgres of its own",
      items: [
        { title: "Snapshot and clone", body: "The data directory lives on ZFS, or btrfs in the Windows distro. A branch is a clone of a snapshot of it, so making one copies no data." },
        { title: "Its own Postgres", body: "Each branch runs its own PostgreSQL, so a heavy query or a broken migration on one never touches another." },
        { title: "One address", body: "The gateway routes by database name: the same host and port, with the branch’s name as the database." },
      ],
    },
    {
      kind: "code",
      eyebrow: "Day to day",
      title: "Make it, use it, throw it away",
      body: "Branch main, or another branch, connect with the branch’s name as the database, reset it to its parent when you want a clean copy, and delete it when you are done. A branch nobody uses is suspended, and wakes on the next connection.",
      lines: ["$ fox branch create qa", "$ psql \"postgresql://dbadmin:<API_KEY>@localhost:6432/qa?sslmode=require\"", "$ fox branch reset qa", "$ fox branch delete qa"],
    },
    {
      kind: "list",
      eyebrow: "Why on your own servers",
      title: "What self-hosting changes",
      items: [
        "Your data never leaves your machines to make a copy of it, so a branch of production data stays as private as production.",
        "No bill per branch or per hour: a branch costs the disk its changes use.",
        "Once installed, branching works without an internet connection.",
        "It is stock PostgreSQL 18, so every extension, driver and tool you use today works on a branch.",
      ],
    },
    {
      kind: "faq",
      title: "Questions about branching",
      items: [
        { q: "Does a bigger database take longer to branch?", a: "Making a branch copies no data, so it does not grow with the database. What grows is the disk each branch uses as it changes." },
        { q: "Are branches isolated from each other?", a: "Yes. Each runs its own PostgreSQL, and other people’s branches are not listed and answer “not found”, through the gateway too." },
        { q: "Can I branch from the past?", a: "On main, yes: from just before any Blackbox entry, or by restoring to any second in the archived window." },
        { q: "Can AI agents get their own branch?", a: "Yes. The Agent Branch API and fox mcp hand each agent its own branch and a key that opens nothing else." },
      ],
    },
  ],
  related: [
    { label: "Branching", href: "/product/branching" },
    { label: "AI agents", href: "/ai-agents" },
    { label: "Use cases", href: "/use-cases" },
  ],
  cta: { title: "Spin up a branch in seconds.", lede: "Install FoxByte in a few minutes, then fox branch create." },
};

export const compareDatabaseLabPage: PageContent = {
  slug: "compare-database-lab",
  path: "/compare/database-lab",
  crumb: "FoxByte vs Database Lab",
  meta: {
    title: "FoxByte vs Database Lab Engine: self-hosted Postgres clones compared",
    description: "Database Lab Engine and FoxByte both make copy-on-write clones of PostgreSQL on your own servers. Where they differ: what each is for, licences, a tamper-evident record and guardrails for agents.",
  },
  hero: {
    eyebrow: "Compare",
    title: "FoxByte and Database Lab Engine",
    lede: "Both make thin, copy-on-write clones of PostgreSQL on your own servers, and the idea of a clone as a database is Database Lab’s. Database Lab gives you copies of a database that runs elsewhere; FoxByte is the database, with a record of every change and guardrails around it.",
    ctas: [install, { label: "Why FoxByte", href: "/why-foxbyte" }],
    visual: "branch",
  },
  blocks: [
    {
      kind: "table",
      eyebrow: "Side by side",
      title: "Where they differ",
      head: ["", "FoxByte", "Database Lab Engine"],
      rows: [
        ["Copy-on-write clones", "Yes, on ZFS or btrfs", "Yes, on ZFS or LVM; about 10 s for 1 TiB, by its own figure"],
        ["What it is for", "The database your app runs on, with branches of it", "Clones of an existing database, for development and testing"],
        ["Licence", "AGPL-3.0, with a commercial Enterprise edition", "Apache-2.0 Community Edition"],
        ["Tamper-evident record of schema changes", "Yes: a hash chain, and signed anchors in Enterprise", "Not documented"],
        ["Guardrails for agents", "DROP and TRUNCATE blocked, DML without WHERE refused", "Not documented; clones are isolated"],
        ["MCP for agents", "fox mcp: branches, SQL, the record", "PostgresAI’s MCP covers issues and reports, not clones"],
      ],
      note: "Database Lab facts from its own documentation and README, read on 22 October 2026. Tell us if one is out of date.",
    },
    {
      kind: "grid",
      eyebrow: "Choosing",
      title: "Which one fits",
      columns: 2,
      items: [
        { title: "Choose Database Lab when", body: "Your production database runs elsewhere and stays there, and you want fast clones of it for development, testing and checking queries, under Apache-2.0." },
        { title: "Choose FoxByte when", body: "You want the database itself to keep a provable record of every schema change, stop destructive SQL from people and agents, and give everyone a branch." },
      ],
    },
  ],
  related: [
    { label: "Why FoxByte", href: "/why-foxbyte" },
    { label: "Postgres branching", href: "/postgres-branching" },
    { label: "Blackbox", href: "/product/blackbox" },
  ],
  cta: { title: "See the difference on your own data.", lede: "Install FoxByte in a few minutes and branch your database." },
};

export const guidePages = [auditLogPage, branchingGuidePage, compareDatabaseLabPage];
export const guideLinks = guidePages.map((p) => ({ label: p.crumb, href: p.path }));
