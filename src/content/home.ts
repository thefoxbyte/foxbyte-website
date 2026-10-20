export const heroScript = [
  { cmd: "fox import --from mysql://…/shop --as shop", out: "✓ 48 tables imported · new branch \"shop\"", tone: "ok" },
  { cmd: "fox branch create ai-sandbox", out: "✓ ready · copy-on-write · main untouched", tone: "ok" },
  { cmd: "psql …/ai-sandbox -c \"DROP TABLE invoices\"", out: "✗ blocked by policy · BBX01", tone: "bad" },
  { cmd: "fox blackbox ai-sandbox", out: "1 change recorded · agent-claude · blocked", tone: "dim" },
] as const;

export const marqueeItems = [
  { label: "PostgreSQL", strong: true },
  { label: "MySQL", strong: true },
  { label: "MariaDB", strong: true },
  { label: "MongoDB", strong: true },
  { label: ".sql", strong: false },
  { label: ".csv", strong: false },
  { label: ".json", strong: false },
  { label: ".ndjson", strong: false },
  { label: "Prisma", strong: false },
  { label: "Drizzle", strong: false },
  { label: "SQLAlchemy", strong: false },
  { label: "Django", strong: false },
  { label: "Rails", strong: false },
  { label: "GORM", strong: false },
] as const;

export const statement =
  "You own the data and you answer for it. FoxByte gives you *a *record *of *every *change, *a *live *feed *of *every *row and *a *way *back *from *any *mistake.";

export const statementChips = [
  { text: "Every change on record", tag: "Blackbox" },
  { text: "Every row, live", tag: "Realtime" },
  { text: "From MySQL in one command", tag: "Migrations" },
  { text: "AI on a copy", tag: "Branches" },
] as const;

export const suitPieces = [
  { title: "Branches", line: "a full copy in seconds" },
  { title: "Blackbox", line: "every change on record" },
  { title: "Realtime", line: "every row, live" },
  { title: "Time travel", line: "rewind to any second" },
  { title: "Guardrails", line: "stops mistakes first" },
  { title: "Migrations", line: "in from 8 sources" },
  { title: "ETL pipelines", line: "tested before they land" },
  { title: "High availability", line: "a standby on call" },
] as const;

export const storySteps = [
  {
    key: "01 · Branch",
    title: "A full copy in seconds",
    body: "Give every developer, test run, pull request or AI agent its own complete copy of the database. Copies share storage until they change, sleep when idle, and never touch main.",
    enterprise: false,
  },
  {
    key: "02 · Blackbox",
    title: "Every change, on record",
    body: "Every CREATE, ALTER, DROP and GRANT is written down the moment it happens, with who made it and from which tool. Entries are chained, so nobody can quietly rewrite history, and any entry is a way back to main as it was just before.",
    enterprise: false,
  },
  {
    key: "03 · Realtime",
    title: "Every row, live, on your servers",
    body: "Subscribe to inserts, updates and deletes the moment they commit, straight from your own database. No third-party cloud in the middle. Drop off, reconnect, and the feed replays what you missed.",
    enterprise: true,
  },
  {
    key: "04 · Protect",
    title: "Mistakes stop before they land",
    body: "Dropping a table needs an admin. A DELETE without a WHERE is refused. An agent that tries to change more than 100 rows is stopped at row 101, and nothing is lost.",
    enterprise: false,
  },
] as const;

export const ledgerEntries = [
  { op: "CREATE TABLE notes", who: "you@team.dev", agent: false, hash: "9f2c", tampered: null },
  { op: "ALTER TABLE users ADD plan", who: "priya@team.dev", agent: false, hash: "41ab", tampered: "ALTER TABLE users ADD pl4n" },
  { op: "GRANT SELECT ON notes", who: "you@team.dev", agent: false, hash: "c07e", tampered: null },
  { op: "DROP TABLE invoices · blocked", who: "agent-claude", agent: true, hash: "e5d1", tampered: null },
] as const;

export const agentCode = {
  MCP: '{\n  "mcpServers": {\n    "foxbyte": {\n      "command": "fox",\n      "args": ["mcp"],\n      "env": { "FOX_API_KEY": "key_…" }\n    }\n  }\n}',
  HTTP: '$ fox serve --addr :8088\n$ curl -H "Authorization: Bearer $FOX_KEY" \\\n    -X POST https://localhost:8088/agents/alice/branch\n\n# a connection string that opens this one branch only\n{ "dsn": "postgresql://agent-alice:key_…@localhost:6432/agent-alice" }',
  Python:
    'from foxbyte import FoxByte\n\ndb = FoxByte(api_key="key_…")\ndb.create_branch("ai-sandbox")\nprint(db.query("ai-sandbox", "select count(*) from users"))\nprint(db.verify_blackbox("ai-sandbox"))',
} as const;

export const agentPoints = [
  "Each agent gets a full copy of your database and a key that opens that copy only.",
  "Everything it does is recorded in the Blackbox and labelled as an agent.",
  "Guardrails refuse destructive commands and runaway deletes before they run.",
  "When you like what it built, approve the change request. Only a person can say yes.",
] as const;

export const stats = [
  { value: 14.5, decimals: 1, unit: "ms", label: "to stop a runaway delete on a million-row table" },
  { value: 8, decimals: 0, unit: "", label: "ways to move in: Postgres, MySQL, MariaDB, MongoDB, SQL, CSV, JSON, NDJSON" },
  { value: 18, decimals: 0, unit: "", label: "PostgreSQL 18, stock and unmodified" },
  { value: 0, decimals: 0, unit: "", label: "changes to your drivers, ORM or SQL" },
] as const;

export const shots = [
  { label: "Dashboard", file: "dashboard" },
  { label: "SQL console", file: "console" },
  { label: "Blackbox", file: "ledger" },
  { label: "Realtime", file: "realtime" },
] as const;

export const editions = {
  standard: [
    "Instant branches that scale to zero",
    "The Blackbox and its hash chain",
    "Backups and point-in-time restore",
    "Imports from Postgres, MySQL, MariaDB and MongoDB",
    "Guardrails for people and agents",
    "Web console, MCP server and SDKs",
  ],
  enterprise: [
    "Realtime change feed, on your servers",
    "ETL pipelines with data tests",
    "Signed Blackbox anchors on a schedule",
    "Your own policy rules and impact analysis",
    "Change requests from a branch to main",
    "Compliance export bundle",
  ],
} as const;

export const faqs = [
  {
    q: "Do I need AI agents to use FoxByte?",
    a: "No. FoxByte is a full PostgreSQL platform for people first: a copy for every developer and test, the Blackbox, backups, time travel and migrations. Working safely with AI is one more thing it does well.",
  },
  {
    q: "Does my data leave my servers?",
    a: "No. FoxByte runs on your own laptop or server, and so do Realtime, the Blackbox and the console. Backups only leave the machine if you send them to a bucket you choose.",
  },
  {
    q: "Is this a new database I have to learn?",
    a: "No. It’s PostgreSQL 18, unmodified. Your drivers, ORM and SQL work as they do today. You change one connection string.",
  },
  {
    q: "How hard is it to move my existing database?",
    a: "One command. fox import brings in PostgreSQL, MySQL, MariaDB, MongoDB or files, each into its own branch. For a live system, keep it in sync and cut over when you’re ready.",
  },
  {
    q: "Can AI agents damage my data?",
    a: "They work on their own copy, never on main. Destructive commands are blocked, deletes without a WHERE are refused, and anything past 100 rows is stopped. An agent can propose changes, but only a person can approve them.",
  },
  {
    q: "Will using FoxByte make my app open source?",
    a: "No. Your app talks to FoxByte over the standard Postgres protocol, and the client SDKs are Apache-2.0. The AGPL applies only if you modify FoxByte itself and offer it as a service.",
  },
] as const;

export type BotMood = "idle" | "armour" | "replica" | "stream" | "alert" | "point";

export const botPackets: Record<string, { packets: readonly string[]; mood?: BotMood; bad?: boolean }> = {
  top: { packets: ["● connected · localhost:6432"] },
  why: { packets: ["SELECT 1  ✓ 1 row"] },
  suit: { packets: ["suit · 8/8 modules online"], mood: "armour" },
  s0: { packets: ["branch qa · ready", "replica of main ✓"], mood: "replica" },
  s1: { packets: ["blackbox +1 · chain ✓"] },
  s2: { packets: ["UPDATE orders 1042 → shipped", "INSERT orders 1046", "UPDATE orders 1043 → paid"], mood: "stream" },
  s3: { packets: ["✗ BBX01 · refused at row 101"], mood: "alert", bad: true },
  data: { packets: ["import mysql://…/shop ✓", "48 tables → branch shop"] },
  agents: { packets: ["agent key · 1 branch only"] },
  features: { packets: ["standby · streaming", "failover drill ✓"] },
  pricing: { packets: ["edition · standard ✓"] },
  faq: { packets: ["GET /docs → 200"] },
  start: { packets: ["$ fox setup"], mood: "point" },
  "/product": { packets: ["gateway :6432 · routing by name"] },
  "/product/branching": { packets: ["branch qa · ready", "replica of main ✓"], mood: "replica" },
  "/product/blackbox": { packets: ["blackbox verify · chain ✓"] },
  "/product/realtime": { packets: ["UPDATE orders 1042 → shipped", "INSERT orders 1046"], mood: "stream" },
  "/product/guardrails": { packets: ["✗ BBX01 · refused at row 101"], mood: "alert", bad: true },
  "/product/time-travel": { packets: ["restore --to 14:07:32 ✓"] },
  "/product/console": { packets: ["GET :8080 → 200"] },
  "/ai-agents": { packets: ["agent key · 1 branch only"] },
  "/use-cases": { packets: ["branch pr-1482 · ready"], mood: "replica" },
  "/pricing": { packets: ["edition · standard ✓"] },
  "/security": { packets: ["TLS ✓ · loopback only"] },
  "/why-foxbyte": { packets: ["SELECT version() → 18"] },
  "/download": { packets: ["$ fox setup"], mood: "point" },
  "/docs": { packets: ["GET /docs → 200"] },
  "/blog": { packets: ["tail -f engineering.log"] },
  "/changelog": { packets: ["fox update --check ✓"] },
  "/company": { packets: ["hello from main"] },
  "/contact": { packets: ["POST /api/contact · ready"] },
  "/legal": { packets: ["AGPL-3.0 · Apache-2.0"] },
};

export const tourStops = ["why", "suit", "story", "data", "agents", "features", "pricing", "start"] as const;
