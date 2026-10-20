import type { PageContent } from "./types";

const install = { label: "Install FoxByte", href: "/download", primary: true };

export const productOverview: PageContent = {
  slug: "product",
  path: "/product",
  crumb: "Product",
  meta: {
    title: "How FoxByte works",
    description: "FoxByte keeps stock PostgreSQL 18 on local disk for native latency, and adds copy-on-write branches, the Blackbox, realtime, guardrails and backups beside the commit path.",
  },
  hero: {
    eyebrow: "Product",
    title: "Everything FoxByte adds to Postgres, and nothing it takes away",
    lede: "Transaction speed was the first requirement and it is never traded. FoxByte has no storage engine of its own: rows, indexes and the write-ahead log are stored by PostgreSQL 18 itself. What FoxByte built is everything around it.",
    ctas: [install, { label: "Read the docs", href: "/docs" }],
    visual: "architecture",
  },
  blocks: [
    {
      kind: "grid",
      eyebrow: "Capabilities",
      title: "Six things, one page each",
      lede: "Every capability maps to one job: branch, record, stream or protect.",
      items: [
        { title: "Branching", body: "A full, isolated copy of the whole database in seconds, for every developer, test or agent.", icon: "branch", href: "/product/branching" },
        { title: "Blackbox", body: "Every schema change recorded with who made it, in a hash chain nobody can quietly rewrite.", icon: "box", href: "/product/blackbox" },
        { title: "Realtime", body: "Every insert, update and delete as it commits, from your own server.", icon: "pulse", tag: "Enterprise", href: "/product/realtime" },
        { title: "Guardrails", body: "Destructive commands blocked, runaway deletes stopped at row 101.", icon: "shield", href: "/product/guardrails" },
        { title: "Time travel & HA", body: "Restore to any second, keep backups off the machine, fail over in one command.", icon: "rewind", href: "/product/time-travel" },
        { title: "Web console", body: "Dashboard, SQL editor, data grid and the Blackbox, served by the engine itself.", icon: "db", href: "/product/console" },
      ],
    },
    {
      kind: "split",
      eyebrow: "The design",
      title: "On the commit path: only Postgres",
      body: [
        "Your commits go to stock PostgreSQL on local NVMe. The only thing in front of them is a wire-protocol gateway that routes each connection by database name.",
        "Branching, backups and time travel happen beside the commit path, using a copy-on-write file system and asynchronous WAL archiving. The commit never waits for them.",
      ],
      bullets: ["One endpoint, :6432. The database name is the branch.", "TLS on by default; sslmode=require works out of the box.", "Drivers, ORMs and SQL work unchanged."],
      visual: "branch",
    },
    {
      kind: "table",
      eyebrow: "Built on",
      title: "Proven, open foundations",
      head: ["Piece", "What it does"],
      rows: [
        ["PostgreSQL 18", "Stores every row, index and log record, unmodified. Installs created on 16 keep running 16."],
        ["ZFS or btrfs", "Copy-on-write clones for branches: ZFS on macOS and Linux, btrfs on Windows."],
        ["wal-g", "Ships write-ahead log and base backups to object storage for point-in-time restore."],
        ["S3-compatible storage", "Holds backups and anchor copies, with Object Lock when you want them unchangeable."],
        ["Go", "The gateway, control plane, CLI and console server."],
      ],
    },
  ],
  related: [
    { label: "Branching", href: "/product/branching" },
    { label: "Blackbox", href: "/product/blackbox" },
    { label: "Why FoxByte", href: "/why-foxbyte" },
  ],
};

export const productPages: PageContent[] = [
  {
    slug: "branching",
    path: "/product/branching",
    crumb: "Branching",
    meta: {
      title: "Instant Postgres branching",
      description: "Copy-on-write branches of your whole PostgreSQL database: isolated, created in seconds regardless of size, suspended when idle and woken on the next connection.",
    },
    hero: {
      eyebrow: "Branching",
      title: "Branch the whole database, not a dump of it",
      lede: "fox branch create qa clones every table, index and row in seconds, whatever the size. The branch is fully isolated: its writes never touch main, and main’s never touch it.",
      ctas: [install, { label: "Branching in the docs", href: "/docs" }],
      visual: "branch",
    },
    blocks: [
      {
        kind: "split",
        eyebrow: "How it works",
        title: "You pay only for what you change",
        body: [
          "A branch is a copy-on-write clone of main served by its own Postgres: ZFS on macOS and Linux, btrfs on Windows. Blocks are shared with the parent until the branch writes to them.",
          "So a copy of a large database costs almost nothing at first, and grows only by what it changes.",
        ],
        visual: "sleep",
        reverse: true,
        bullets: ["Idle branches suspend themselves and wake on the next connection.", "Connect to …:6432/qa: the database name is the branch.", "Branches belong to whoever made them; others get “not found”."],
      },
      {
        kind: "grid",
        eyebrow: "Lifecycle",
        title: "Create, reset, compare, sleep",
        columns: 4,
        items: [
          { title: "Create", body: "A complete copy of main in seconds, with its own connection string." },
          { title: "Reset", body: "Throw away a branch’s changes and start again from its parent." },
          { title: "Diff", body: "See the schema changes that separate two branches, straight from the Blackbox." },
          { title: "Suspend", body: "Stop a branch and keep its data; the next connection wakes it." },
        ],
      },
      {
        kind: "code",
        eyebrow: "The CLI",
        title: "The whole workflow in six commands",
        body: "Every command also exists in the web console and the REST API.",
        lines: ["$ fox branch create qa", "$ fox connect qa", "$ fox branch diff main qa", "$ fox branch reset qa", "$ fox branch suspend qa", "$ fox branch delete qa"],
      },
      {
        kind: "grid",
        eyebrow: "Use cases",
        title: "What teams branch for",
        items: [
          { title: "A database per pull request", body: "Branch main for each PR, point the preview at it, delete it on merge.", icon: "branch" },
          { title: "Migration rehearsal", body: "Run the risky migration on a full-size copy first, and read what it changed.", icon: "pipe" },
          { title: "A sandbox per agent", body: "Each AI agent gets its own copy and a key that opens only that copy.", icon: "shield" },
        ],
      },
    ],
    related: [
      { label: "Blackbox", href: "/product/blackbox" },
      { label: "Time travel & HA", href: "/product/time-travel" },
      { label: "For AI agents", href: "/ai-agents" },
    ],
  },
  {
    slug: "blackbox",
    path: "/product/blackbox",
    crumb: "Blackbox",
    meta: {
      title: "Blackbox: a tamper-evident record of every schema change",
      description: "Every CREATE, ALTER, DROP and GRANT recorded with who made it, human or agent, in an append-only hash chain with signed anchors kept off the machine.",
    },
    hero: {
      eyebrow: "Blackbox",
      title: "The database’s own flight recorder",
      lede: "Every schema change is recorded as it happens and attributed to the login that made it. A change an agent made at 3am is distinguishable from one you made, and any entry is a way back.",
      ctas: [install, { label: "Anchor format", href: "https://github.com/thefoxbyte/foxbyte/blob/main/docs/ledger-anchor-format.md" }],
      visual: "record",
    },
    blocks: [
      {
        kind: "grid",
        eyebrow: "What is recorded",
        title: "Who, what and where",
        items: [
          { title: "Who", body: "The actor, an email or an agent such as agent-alice, and whether it was a person or an agent.", icon: "shield" },
          { title: "What", body: "The command, the object and the full statement, for every CREATE, ALTER, DROP and GRANT.", icon: "box" },
          { title: "Where", body: "The tool that sent it (application_name, for example cursor/opus), the branch and the session.", icon: "db" },
        ],
      },
      {
        kind: "split",
        eyebrow: "Tamper evidence",
        title: "It cannot be quietly rewritten",
        body: [
          "The table is append-only and every row is hash-chained to the one before it, so an edited or deleted entry breaks the chain and fox blackbox verify finds it.",
          "A database superuser could rewrite the rows and every hash after them. Anchors close that gap: every few minutes the engine signs a checkpoint of the chain with a key the database cannot read, and writes it outside the database. Copy them to an S3 bucket in Object Lock compliance mode and nobody can remove them, the bucket owner included.",
        ],
        bullets: ["Checking anchors is free in every edition, including the standalone fox-verify.", "Writing anchors on a schedule is Enterprise.", "Clients log in as their own Postgres role, so nobody can forge the recorded actor."],
        visual: "record",
        reverse: true,
      },
      {
        kind: "code",
        eyebrow: "Undo",
        title: "A way back, not only evidence",
        body: "Point at any entry and get a new branch holding main exactly as it was just before that change, with main left alone. It restores a base backup and replays WAL, so it takes a few minutes.",
        lines: ["$ fox blackbox entries", "$ fox blackbox branch-before 42 --as before-the-drop", "$ fox blackbox verify"],
      },
      {
        kind: "steps",
        eyebrow: "Change requests",
        title: "Bring a branch’s changes back to main",
        lede: "What is applied is the Blackbox’s own record of what ran on the branch, each statement still attributed to whoever wrote it. Schema only; no data is moved.",
        items: [
          { title: "Ask", body: "fox branch request dev --to main lists what dev has that main does not. Nothing is applied yet." },
          { title: "Review", body: "fox request show 3 prints the statements in the order they ran." },
          { title: "Approve", body: "fox request approve 3 applies them to main in one transaction. An agent can ask, never approve its own." },
        ],
      },
      {
        kind: "grid",
        eyebrow: "And the doors",
        title: "A security log beside it",
        columns: 2,
        items: [
          { title: "What it records", body: "Sign-ins and failed ones, sign-ups, API keys made and revoked, password changes, admin grants and every refused request." },
          { title: "How it is protected", body: "Chained and anchored the same way as the Blackbox, and free in every edition: fox audit and fox audit verify." },
        ],
      },
    ],
    related: [
      { label: "Guardrails", href: "/product/guardrails" },
      { label: "Security", href: "/security" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    slug: "guardrails",
    path: "/product/guardrails",
    crumb: "Guardrails",
    meta: {
      title: "Postgres guardrails: stop destructive SQL before it runs",
      description: "FoxByte blocks DROP and TRUNCATE by policy, refuses agent DELETE and UPDATE without a WHERE, and caps the rows an agent may change per statement and per hour.",
    },
    hero: {
      eyebrow: "Guardrails",
      title: "Refused, not regretted",
      lede: "A policy gate stops a destructive change before it runs. An unqualified DELETE or a DROP TABLE from an agent never reaches your data, and every refusal is recorded.",
      ctas: [install, { label: "Policy error reference", href: "https://github.com/thefoxbyte/foxbyte/blob/main/docs/policy-errors.md" }],
      visual: "refuse",
    },
    blocks: [
      {
        kind: "grid",
        eyebrow: "The rules",
        title: "Defaults that ship switched on",
        items: [
          { title: "No silent drops", body: "DROP TABLE, DROP SCHEMA and TRUNCATE are blocked by policy unless an admin overrides them, and the attempt is recorded.", icon: "shield" },
          { title: "No WHERE, no run", body: "An agent’s UPDATE or DELETE without a WHERE is refused outright.", icon: "box" },
          { title: "Row limits", body: "An agent may change at most 100 rows of a table per statement, and 1,000 rows of a table per hour.", icon: "pulse" },
        ],
      },
      {
        kind: "table",
        eyebrow: "Measured",
        title: "Why a row counter",
        lede: "PostgreSQL 18, a 1,000,000-row table, median of seven rounds, in milliseconds.",
        head: ["Case", "No guard", "Row counter", "Transition table"],
        rows: [
          ["A person updates every row", "2,443", "3,195", "2,653"],
          ["A person deletes every row", "311", "771", "476"],
          ["An agent deletes every row", "273, not refused", "14.5, refused", "505, refused"],
          ["An agent updates 50 rows", "5.8", "8.8", "5.8"],
        ],
        note: "The row counter stops an agent’s mass delete at row 101, 35 times faster than counting after the fact. It costs people a little more on bulk writes; on ordinary statements of a few rows neither design is noticeable.",
      },
      {
        kind: "code",
        eyebrow: "Tuning",
        title: "Change the limits per table",
        body: "Both limits can be set per table and per branch, and fox policy check tells you whether a statement would be blocked before you run it. An admin can let a single statement through when it really is meant.",
        lines: ["$ fox guardrail limit --table orders 500", "$ fox guardrail budget --table orders --per 1h 5000", "$ fox policy check \"DROP TABLE invoices\""],
      },
      {
        kind: "grid",
        eyebrow: "Enterprise",
        title: "Your own rules, and what a change would touch",
        columns: 2,
        items: [
          { title: "Policy rules and impact analysis", body: "Write your own rules and see what a change would affect before it runs.", tag: "Enterprise" },
          { title: "Free in every edition", body: "Reading the rules, checking a statement against them and the evaluations log." },
        ],
      },
    ],
    related: [
      { label: "Blackbox", href: "/product/blackbox" },
      { label: "For AI agents", href: "/ai-agents" },
      { label: "Engineering notes", href: "/blog/agent-row-limit" },
    ],
  },
  {
    slug: "realtime",
    path: "/product/realtime",
    crumb: "Realtime",
    meta: {
      title: "Realtime Postgres change feed, on your own servers",
      description: "A row-level change feed from your own PostgreSQL, with replay after a disconnect, bounded so it stays safe on a pool shared with main.",
    },
    hero: {
      eyebrow: "Realtime",
      tag: "Enterprise",
      title: "Every row change, live, on your servers",
      lede: "Subscribe to inserts, updates and deletes the moment they commit, straight from your own database. No third-party cloud in the middle.",
      ctas: [{ label: "Talk to us", href: "/contact", primary: true }, { label: "Compare editions", href: "/pricing" }],
      visual: "realtime",
    },
    blocks: [
      {
        kind: "steps",
        eyebrow: "Set up",
        title: "From off to streaming in four commands",
        lede: "Logical decoding is opt-in, so nothing changes on main until you ask for it.",
        items: [
          { title: "Get ready", body: "fox realtime setup readies the databases for a change feed. It restarts main once." },
          { title: "Check a table", body: "fox realtime doctor says what can stream, what needs changing and what cannot; prepare fixes it and records the change in the Blackbox." },
          { title: "Turn it on", body: "fox realtime enable orders streams a table, for every event or just the ones you pick." },
          { title: "Hand out a key", body: "fox realtime key create mints a stream-only key, and fox realtime url prints the connection string for your app." },
        ],
      },
      {
        kind: "code",
        eyebrow: "In your app",
        title: "Server-Sent Events, or one call in the SDK",
        body: "Subscribe from the TypeScript or Python SDK, or read the stream over plain HTTP. Every event carries its commit position, so the client always knows where it is.",
        lines: [
          "$ fox realtime setup --yes",
          "$ fox realtime enable orders --events insert,update,delete",
          "$ fox realtime key create main --name storefront",
          "$ fox realtime url main",
          "fox-realtime://rtk_…@127.0.0.1:8080/main?sslmode=require",
        ],
        note: "The stream lives at /realtime/v1/branches/{name}/stream on the console port. Add ?transactions=1 for begin and commit frames.",
      },
      {
        kind: "grid",
        eyebrow: "Reliable by design",
        title: "Drop off, come back, miss nothing",
        items: [
          { title: "Replay after a reconnect", body: "The feed keeps its place when the last subscriber leaves. Reconnect with ?since= and it replays what you missed; the SDKs do this for you.", icon: "rewind" },
          { title: "Bounded, so main is safe", body: "Replay is held within a WAL budget, 1 GB by default. A subscriber that falls too far behind gets a clear resync notice instead of filling the disk.", icon: "shield" },
          { title: "Survives failover", body: "Subscribers keep their place through a high-availability failover.", icon: "pulse" },
        ],
      },
      {
        kind: "grid",
        eyebrow: "Visible",
        title: "Know what streaming costs",
        columns: 2,
        items: [
          { title: "Activity meter", body: "fox realtime activity shows what keeping the feed warm has cost over the last day, and fox realtime slots shows the WAL each one holds." },
          { title: "In the console", body: "Watch changes arrive per table on the Realtime page, and turn tables on and off from there." },
        ],
      },
    ],
    related: [
      { label: "Pricing", href: "/pricing" },
      { label: "Blackbox", href: "/product/blackbox" },
      { label: "Web console", href: "/product/console" },
    ],
    cta: { title: "Realtime is part of Enterprise.", lede: "Start with Standard today and switch in place when you need the live feed." },
  },
  {
    slug: "time-travel",
    path: "/product/time-travel",
    crumb: "Time travel & HA",
    meta: {
      title: "Point-in-time restore, backups and failover for Postgres",
      description: "Continuous WAL archival, automatic base backups, restore to any second, S3 targets with Object Lock, a hot standby and a failover drill that reports what it cost.",
    },
    hero: {
      eyebrow: "Time travel & HA",
      title: "A rewind button for your data",
      lede: "Restore the database as it was at any second in the archived window, into a separate copy, without touching the live database.",
      ctas: [install, { label: "Backups in the docs", href: "/docs" }],
      visual: "timescrub",
    },
    blocks: [
      {
        kind: "grid",
        eyebrow: "Backups",
        title: "Taken for you",
        items: [
          { title: "From the first minutes", body: "A first base backup on install, then whenever the newest is older than a day, keeping the newest seven.", icon: "db" },
          { title: "Off the commit path", body: "Write-ahead log is archived continuously by wal-g. Commits never wait for it.", icon: "pulse" },
          { title: "Restore anywhere", body: "fox restore --to a timestamp or latest, into a disposable copy on its own port.", icon: "rewind" },
        ],
      },
      {
        kind: "split",
        eyebrow: "Off the machine",
        title: "Send backups where a disk failure cannot reach",
        body: [
          "By default the archive sits beside main, on the same disk. fox backup target set sends WAL, base backups and anchor copies to any S3-compatible bucket instead, and fox check warns until you do.",
          "Create the bucket with Object Lock and nothing written there can be changed or deleted before its retention ends, not even by whoever controls this machine.",
        ],
        lines: ["$ fox backup target set s3://my-bucket/fox --region eu-west-1", "$ fox restore --to '2026-08-24 15:07:00+00'"],
        visual: "undo",
      },
      {
        kind: "code",
        eyebrow: "High availability",
        title: "A standby, and the truth about failover",
        body: "A hot standby streams from main, on the same machine or a second one over TLS, and takes over with clients keeping the same connection string. Behind a witness, failover is automatic. fox ha drill kills the primary with writes in flight and writes a dated report of what was lost and how long service took to return.",
        note: "Replication is asynchronous by default, so losing the machine can cost up to a minute of writes; fox ha sync on trades a little latency for none. The standby can also serve read-only sessions.",
        lines: ["$ fox ha enable", "$ fox ha sync on", "$ fox ha drill --yes", "$ fox node join <token>"],
      },
      {
        kind: "grid",
        eyebrow: "Versions",
        title: "Upgrades on your schedule",
        columns: 2,
        items: [
          { title: "PostgreSQL 18 for new installs", body: "An install created on 16 keeps running 16. fox update never moves your data between majors behind your back." },
          { title: "Move majors when you choose", body: "fox pg upgrade shows every change first, takes an export, and keeps the old databases until you say so." },
        ],
      },
    ],
    related: [
      { label: "Blackbox", href: "/product/blackbox" },
      { label: "Security", href: "/security" },
      { label: "Branching", href: "/product/branching" },
    ],
  },
  {
    slug: "console",
    path: "/product/console",
    crumb: "Web console",
    meta: {
      title: "FoxByte web console: SQL editor, data grid and the Blackbox",
      description: "A web console served by the engine: live dashboard, SQL console with autocomplete, data grid, schema browser, Blackbox viewer, imports, realtime and API keys.",
    },
    hero: {
      eyebrow: "Web console",
      title: "The whole database, in one tab",
      lede: "The console is built into the engine and opens by itself after setup at https://localhost:8080. Nothing extra to install, in light or dark.",
      ctas: [install],
      visual: "console",
    },
    blocks: [
      {
        kind: "grid",
        eyebrow: "Tour",
        title: "What is inside",
        items: [
          { title: "Dashboard", body: "Every branch with its state, size and connection string; create, suspend, resume and delete.", icon: "db" },
          { title: "SQL console", body: "Run queries against any branch with autocomplete, history and rows you can expand as JSON.", icon: "pulse" },
          { title: "Data grid and schema", body: "Browse tables, structure and indexes, and copy a table’s CREATE script.", icon: "box" },
          { title: "Blackbox and requests", body: "Filter changes by actor, table, risk and kind; branch from before any entry; review change requests.", icon: "shield" },
          { title: "Import and pipelines", body: "Bring data in from another database or a file, and run pipelines.", icon: "import" },
          { title: "API keys", body: "Make keys for people and for AI agents, and revoke them in one click.", icon: "branch" },
        ],
      },
      {
        kind: "code",
        eyebrow: "Take results with you",
        title: "Export in the format you need",
        body: "CSV, TSV, JSON, Markdown, INSERT statements and Excel workbooks, from the console or the CLI. Query history is kept for 90 days, never the results.",
        lines: ["$ fox sql --format csv \"SELECT …\" > out.csv", "$ fox sql --format xlsx \"SELECT …\" > out.xlsx", "$ fox export \"SELECT …\" > all.csv", "$ fox history --search orders"],
      },
    ],
    related: [
      { label: "Blackbox", href: "/product/blackbox" },
      { label: "Branching", href: "/product/branching" },
      { label: "Download", href: "/download" },
    ],
  },
];

export function productBySlug(slug: string) {
  return productPages.find((p) => p.slug === slug);
}
