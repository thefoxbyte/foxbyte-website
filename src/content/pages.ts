import type { PageContent } from "./types";

const repo = "https://github.com/thefoxbyte/foxbyte";
const install = { label: "Install FoxByte", href: "/download", primary: true };

export const aiAgentsPage: PageContent = {
  slug: "ai-agents",
  path: "/ai-agents",
  crumb: "AI agents",
  meta: {
    title: "A Postgres database per AI agent, over MCP or HTTP",
    description: "Give every AI agent its own disposable copy of your PostgreSQL database through the Model Context Protocol or a simple HTTP API, with its changes recorded and its destructive SQL refused.",
  },
  hero: {
    eyebrow: "AI agents",
    title: "Let AI take control. Without touching main.",
    lede: "Each agent gets an isolated copy of your database in seconds, runs real SQL against real data, and leaves behind a record of everything it changed. When you like what it built, you approve it.",
    ctas: [install, { label: "MCP setup guide", href: `${repo}/blob/main/docs/mcp.md` }],
    visual: "agentCode",
  },
  blocks: [
    {
      kind: "steps",
      eyebrow: "The loop",
      title: "Copy, work, review, approve",
      items: [
        { title: "Copy", body: "create_branch gives the agent a full copy of the database and a key that opens only that copy." },
        { title: "Work", body: "run_sql runs anything Postgres accepts, inside the guardrails." },
        { title: "Review", body: "changes shows exactly what the agent altered, straight from the Blackbox." },
        { title: "Approve or discard", body: "Turn the work into a change request for a person to approve, or delete_branch and the key goes with it." },
      ],
    },
    {
      kind: "code",
      eyebrow: "Two ways in",
      title: "MCP for agent frameworks, HTTP for everything else",
      body: "fox mcp speaks the Model Context Protocol on stdio, so any MCP client can drive it through one standard interface. The Agent Branch API hands back a ready connection string over HTTP.",
      lines: ["$ FOX_API_KEY=key_… fox mcp", "$ fox serve --addr :8088", "$ curl -H \"Authorization: Bearer $FOX_KEY\" -X POST https://localhost:8088/agents/alice/branch", "{ \"dsn\": \"postgresql://agent-alice:key_…@localhost:6432/agent-alice\" }"],
      note: "MCP tools: create_branch, run_sql, changes, verify_blackbox, list_branches and delete_branch. DDL an agent runs is attributed to that agent automatically.",
    },
    {
      kind: "grid",
      eyebrow: "Agent keys",
      title: "Keys that know they belong to an agent",
      items: [
        { title: "One branch only", body: "A key from the Agent Branch API opens its own branch and nothing else. Deleting the branch revokes it.", icon: "branch" },
        { title: "Recorded as an agent", body: "Everything it does is labelled as an agent’s, and the agent guardrails apply to it.", icon: "box" },
        { title: "Never an admin", body: "An agent key never holds your admin grant; the console and the control-plane API refuse it.", icon: "shield" },
      ],
    },
    {
      kind: "split",
      eyebrow: "Guardrails",
      title: "It can experiment. It cannot wreck.",
      body: ["Destructive commands are blocked by policy. A DELETE or UPDATE without a WHERE is refused, and one that reaches past 100 rows of a table is stopped at row 101, before anything is lost."],
      bullets: ["At most 1,000 rows of a table per hour, per agent.", "Every refusal is recorded in the Blackbox.", "An agent can propose changes to main; only a person can approve them."],
      visual: "refuse",
      reverse: true,
    },
    {
      kind: "faq",
      title: "Questions about agents",
      items: [
        { q: "Which agent frameworks work?", a: "Any MCP client, or anything that can make an HTTP call and speak the Postgres wire protocol." },
        { q: "Can an agent wipe a table?", a: "Not without a WHERE, not more than 100 rows in a statement, and never with TRUNCATE or DROP TABLE unless an admin overrides the policy." },
        { q: "Does one agent see another agent’s data?", a: "No. Its key opens only its own branch, and other people’s branches answer “not found”." },
        { q: "Is the agent’s work lost when its branch is deleted?", a: "Its schema changes can be turned into a change request first. Approving it applies the same statements to main, still attributed to the agent." },
      ],
    },
  ],
  related: [
    { label: "Guardrails", href: "/product/guardrails" },
    { label: "Blackbox", href: "/product/blackbox" },
    { label: "Branching", href: "/product/branching" },
  ],
  cta: { title: "Hand your agent its first database.", lede: "Install FoxByte, make an agent key, and point your MCP client at fox mcp." },
};

export const useCasesPage: PageContent = {
  slug: "use-cases",
  path: "/use-cases",
  crumb: "Use cases",
  meta: {
    title: "Use cases",
    description: "How teams use FoxByte: a database per pull request, rehearsing migrations on real data, proving what changed, undoing mistakes and migrating from MySQL or MongoDB.",
  },
  hero: {
    eyebrow: "Use cases",
    title: "One database, five jobs it makes easy",
    lede: "From preview environments to audits, the same three ideas do the work: copy instantly, record everything, and refuse what cannot be undone.",
    ctas: [install],
  },
  blocks: [
    {
      kind: "split",
      id: "preview",
      eyebrow: "Preview environments",
      title: "A database for every pull request",
      body: ["Branch main when a pull request opens, point the preview deployment at it, and delete it on merge. Each preview gets real, full-size data, and idle previews cost nothing while they sleep."],
      lines: ["$ fox branch create pr-1482", "$ fox branch delete pr-1482"],
      visual: "branch",
    },
    {
      kind: "split",
      id: "migrations",
      eyebrow: "Migrations",
      title: "Rehearse the migration on real data",
      body: ["Run it on a branch at full size, read exactly what it changed in the Blackbox, then bring it to main with a change request someone approves."],
      visual: "request",
      reverse: true,
    },
    {
      kind: "split",
      id: "audit",
      eyebrow: "Audit and compliance",
      title: "Prove what changed, and who changed it",
      body: ["Every schema change is hash-chained and attributed to a login. Signed anchors in an Object Lock bucket prove the record even against a superuser, and the security log covers who came in through the door."],
      bullets: ["fox blackbox verify and fox audit verify", "An independent verifier, fox-verify, free in every edition", "A compliance export bundle in Enterprise"],
      visual: "record",
    },
    {
      kind: "split",
      id: "undo",
      eyebrow: "Recovery",
      title: "Undo the change you should not have made",
      body: ["fox blackbox branch-before restores main as it was just before any entry, into a new branch. Inspect it, copy back what you need, or point your app at it."],
      visual: "undo",
      reverse: true,
    },
    {
      kind: "split",
      id: "migrate-in",
      eyebrow: "Moving in",
      title: "Move in from MySQL, MongoDB or another Postgres",
      body: ["Every import lands in a fresh branch, so it is safe and reversible. For a live system, keep it in sync with logical replication and cut over when you are ready. Free in every edition."],
      lines: ["$ fox import --from mysql://user:pw@host/db --as legacy", "$ fox import --from mongodb://host/db --as events", "$ fox import --from postgres://… --continuous --as live", "$ fox import-cutover live"],
      visual: "migrate",
    },
  ],
  related: [
    { label: "Branching", href: "/product/branching" },
    { label: "Blackbox", href: "/product/blackbox" },
    { label: "Pricing", href: "/pricing" },
  ],
};

export const pricingPage: PageContent = {
  slug: "pricing",
  path: "/pricing",
  crumb: "Pricing",
  meta: {
    title: "Pricing and editions",
    description: "Branching, backups, the Blackbox and guardrails are free and open source. Enterprise adds Realtime, signed anchors, policy rules, change requests, compliance export and ETL pipelines.",
  },
  hero: {
    eyebrow: "Pricing",
    title: "Safety is free. Scale is Enterprise.",
    lede: "Two editions built from one codebase. The command is fox either way, and moving between them never touches your data.",
    ctas: [install, { label: "Talk to us", href: "/contact" }],
  },
  blocks: [
    {
      kind: "table",
      eyebrow: "Feature by feature",
      title: "Standard and Enterprise",
      head: ["Capability", "Standard", "Enterprise"],
      rows: [
        ["Branching, gateway, backups, point-in-time restore", "Yes", "Yes"],
        ["Blackbox: the hash-chained record of every schema change", "Yes", "Yes"],
        ["Agent guardrails: TRUNCATE blocked, row limits, no DELETE without WHERE", "Yes", "Yes"],
        ["Imports from Postgres, MySQL, MariaDB, MongoDB and files", "Yes", "Yes"],
        ["Checking anchors: fox blackbox integrity, fox-verify", "Yes", "Yes"],
        ["The security log and its anchors", "Yes", "Yes"],
        ["Reading rules, checking a statement, listing and rejecting requests", "Yes", "Yes"],
        ["Realtime row-level change feed", "—", "Yes"],
        ["Writing signed Blackbox anchors on a schedule", "—", "Yes"],
        ["Writing policy rules and impact analysis", "—", "Yes"],
        ["Asking for and applying change requests", "—", "Yes"],
        ["Blackbox export, the compliance bundle", "—", "Yes"],
        ["ETL pipelines (experimental)", "—", "Yes"],
      ],
      note: "Standard is AGPL-3.0 and free. Enterprise is source-available under a commercial licence, licensed per machine.",
    },
    {
      kind: "grid",
      eyebrow: "The principle",
      title: "Why safety stays free",
      columns: 2,
      items: [
        { title: "Checking is never paid", body: "An independent verifier you have to buy is not much of an independent verifier. Anyone who anchored before upgrading can always check the anchors they hold." },
        { title: "Paid means new capability", body: "Enterprise adds things Standard never had. Nothing you rely on in Standard is ever taken away to sell it back." },
      ],
    },
    {
      kind: "code",
      eyebrow: "Upgrade",
      title: "Switch editions in place",
      body: "The upgrade shows the Enterprise licence and asks you to accept it before downloading anything, checks the signed release, and replaces fox on both sides of the VM. Databases, accounts, keys and settings are not touched.",
      lines: ["$ fox upgrade --edition enterprise", "$ fox upgrade --edition standard"],
    },
    {
      kind: "faq",
      title: "Licensing questions",
      items: [
        { q: "Does using FoxByte make my application AGPL?", a: "No. Connecting over the Postgres wire protocol is not a derivative work, and the client SDKs are Apache-2.0. The AGPL applies only if you modify FoxByte itself and offer it to others as a service." },
        { q: "What happens without a licence?", a: "The Enterprise build behaves exactly like Standard. Your data and the free features keep working." },
        { q: "Can I go back to Standard?", a: "Yes. fox upgrade --edition standard switches back at the version you have." },
        { q: "Is there a hosted version?", a: "Not yet. FoxByte runs on your own machines today." },
      ],
    },
  ],
  related: [
    { label: "Download", href: "/download" },
    { label: "Licence", href: "/legal/licence" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { title: "Start free. Upgrade when you need it.", lede: "Standard has everything you need to branch, record and protect." },
};

export const securityPage: PageContent = {
  slug: "security",
  path: "/security",
  crumb: "Security",
  meta: {
    title: "Security: secure defaults, signed releases and tamper-evident logs",
    description: "Loopback by default, TLS with no silent fallback, a Postgres role per person, sign-in throttling, Ed25519-signed releases with an SBOM, and an anchored security log.",
  },
  hero: {
    eyebrow: "Security",
    title: "A fresh install exposes nothing it does not have to",
    lede: "FoxByte runs on infrastructure you control, and its defaults assume the network is not your friend. Here is what it does out of the box, and how to report a problem.",
    ctas: [install, { label: "Report a vulnerability", href: `${repo}/security` }],
    visual: "secure",
  },
  blocks: [
    {
      kind: "grid",
      eyebrow: "Defaults",
      title: "Secure before you touch a setting",
      items: [
        { title: "Loopback only", body: "The console, gateway and Agent API listen on 127.0.0.1 until you choose otherwise.", icon: "shield" },
        { title: "TLS, no silent fallback", body: "A service that cannot load its certificate refuses to start rather than serve plain text off loopback.", icon: "box" },
        { title: "First account needs a token", body: "The first sign-up needs a one-time setup token, and sign-up closes after it.", icon: "branch" },
        { title: "Brakes on guessing", body: "Ten failed sign-ins in 15 minutes hold further attempts; request bodies and connections are capped.", icon: "pulse" },
        { title: "Branches belong to their maker", body: "Other people’s branches are not listed and answer “not found”, through the gateway too.", icon: "db" },
        { title: "A password per role", body: "Each account and agent logs in to Postgres with its own password; there are no superuser switches in release builds.", icon: "rewind" },
      ],
    },
    {
      kind: "code",
      eyebrow: "Supply chain",
      title: "Verify what you install",
      body: "Every release’s SHA256SUMS is signed with the FoxByte release key. The installer checks it, and fox update never installs a release that fails. Each file has a GitHub build attestation, and each release an SPDX SBOM.",
      lines: ["$ gh attestation verify fox-darwin-arm64 --repo thefoxbyte/foxbyte", "$ gh attestation verify oci://ghcr.io/thefoxbyte/postgres-walg:18 --repo thefoxbyte/foxbyte"],
    },
    {
      kind: "grid",
      eyebrow: "Evidence",
      title: "Logs you can prove",
      columns: 2,
      items: [
        { title: "Blackbox", body: "Every schema change, hash-chained and anchored outside the database.", href: "/product/blackbox" },
        { title: "Security log", body: "Sign-ins, keys, password changes, admin grants and refused requests, chained and anchored the same way." },
      ],
    },
    {
      kind: "steps",
      eyebrow: "Disclosure",
      title: "Report a vulnerability privately",
      lede: "Please do not open a public issue for security problems. FoxByte is pre-1.0 hardening in places, and we would rather hear first.",
      items: [
        { title: "Report", body: "Use GitHub’s private vulnerability reporting: the repository’s Security tab, then Report a vulnerability." },
        { title: "Acknowledgement", body: "Within 3 business days." },
        { title: "Assessment", body: "Severity and whether we can reproduce it, within 7 days, then updates as we fix it and credit in the release notes if you want it." },
      ],
    },
  ],
  related: [
    { label: "Blackbox", href: "/product/blackbox" },
    { label: "Download", href: "/download" },
    { label: "Privacy", href: "/legal/privacy" },
  ],
};

export const whyPage: PageContent = {
  slug: "why-foxbyte",
  path: "/why-foxbyte",
  crumb: "Why FoxByte",
  meta: {
    title: "Why FoxByte",
    description: "Others branch Postgres too. FoxByte adds what happens after the branch exists: attribution, a tamper-evident record, a live feed and a policy gate, on your own servers.",
  },
  hero: {
    eyebrow: "Why FoxByte",
    title: "We did not invent branching Postgres",
    lede: "The copy-on-write-clone-as-a-database idea is Database Lab’s, and Neon, Supabase and PlanetScale all branch in some form. What is ours is what happens after the branch exists.",
    ctas: [install],
  },
  blocks: [
    {
      kind: "grid",
      eyebrow: "What is ours",
      title: "After the branch exists",
      items: [
        { title: "Attribution you cannot forge", body: "Every schema change recorded with the login that made it, person or agent, and the tool it came from.", icon: "box" },
        { title: "A record you can prove", body: "A hash chain inside the database, signed anchors outside it, and a verifier anyone can run.", icon: "shield" },
        { title: "A gate before the damage", body: "Destructive commands refused by policy, runaway deletes stopped at row 101.", icon: "pulse" },
      ],
    },
    {
      kind: "split",
      eyebrow: "The trade we refused",
      title: "Speed first, always",
      body: ["Separating compute from storage puts a network hop under every page read and every commit. FoxByte keeps stock Postgres on local disk instead, and does branching, backups and time travel beside the commit path."],
      visual: "architecture",
    },
    {
      kind: "list",
      eyebrow: "Candour",
      title: "What FoxByte is not",
      items: [
        "Single primary. Each node keeps compute and storage on one machine; a standby can run on a second machine, but there is no sharding and no networked storage yet.",
        "One standby. High availability is a primary and a hot standby with a witness, not a multi-region cluster.",
        "Not a vector database. It is PostgreSQL, with pgvector bundled for when you need embeddings.",
        "One shared instance. Accounts own their branches and share main; there are no per-project quotas yet.",
      ],
    },
  ],
  related: [
    { label: "Product", href: "/product" },
    { label: "Use cases", href: "/use-cases" },
    { label: "Engineering notes", href: "/blog" },
  ],
  cta: { title: "Judge it on your own data.", lede: "Install FoxByte and import a copy of the database you already run." },
};

export const docsPage: PageContent = {
  slug: "docs",
  path: "/docs",
  crumb: "Docs",
  meta: {
    title: "Documentation",
    description: "Quickstart, connecting your app, MCP and agents, the Blackbox and anchors, backups and high availability, policy errors, Postgres versions and Windows setup.",
  },
  hero: {
    eyebrow: "Docs",
    title: "Documentation",
    lede: "Everything you need to install FoxByte, connect your app and run it in production. The full reference lives with the code on GitHub.",
    ctas: [{ label: "Quickstart", href: `${repo}#quickstart`, primary: true }, { label: "All docs on GitHub", href: `${repo}/tree/main/docs` }],
  },
  blocks: [
    {
      kind: "code",
      eyebrow: "Quickstart",
      title: "From nothing to a branch in four commands",
      body: "After setup the console opens by itself with a one-time setup token in the link. main already has three small sample tables, so there is something to branch straight away.",
      lines: ["$ curl -fsSL https://raw.githubusercontent.com/thefoxbyte/foxbyte/main/deploy/install.sh | sh", "$ fox setup", "$ fox branch create qa", "$ psql \"postgresql://dbadmin:<API_KEY>@localhost:6432/qa?sslmode=require\""],
    },
    {
      kind: "grid",
      eyebrow: "Guides",
      title: "Start here",
      items: [
        { title: "Install and quickstart", body: "macOS, Linux and Windows, and your first branch.", icon: "import", href: `${repo}#install` },
        { title: "Connect your app", body: "One connection string for every driver and ORM.", icon: "db", href: `${repo}#connect-your-app` },
        { title: "MCP and agents", body: "Point an MCP client at fox mcp, and the full tool reference.", icon: "branch", href: `${repo}/blob/main/docs/mcp.md` },
        { title: "Blackbox anchors", body: "The anchor file format, and how to verify a ledger independently.", icon: "box", href: `${repo}/blob/main/docs/ledger-anchor-format.md` },
        { title: "Policy errors", body: "What each refusal means and how to resolve it.", icon: "shield", href: `${repo}/blob/main/docs/policy-errors.md` },
        { title: "Windows setup", body: "Prerequisites and troubleshooting for WSL2.", icon: "pulse", href: `${repo}/blob/main/docs/windows-setup.md` },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Reference",
      title: "Go deeper",
      columns: 2,
      items: [
        { title: "PostgreSQL versions", body: "Which majors run, and how to move an install to a newer one.", href: `${repo}/blob/main/docs/postgres-versions.md` },
        { title: "Python and TypeScript SDKs", body: "Dependency-free clients, and the OpenAPI spec served at /api/openapi.yaml.", href: `${repo}/tree/main/clients` },
        { title: "Guardrail benchmark", body: "How the agent row limit was chosen, and what it costs.", href: "/blog/agent-row-limit" },
        { title: "Changelog", body: "What shipped in every release.", href: "/changelog" },
      ],
    },
  ],
  related: [
    { label: "Download", href: "/download" },
    { label: "Changelog", href: "/changelog" },
    { label: "Blog", href: "/blog" },
  ],
};

export const companyPage: PageContent = {
  slug: "company",
  path: "/company",
  crumb: "Company",
  meta: {
    title: "About",
    description: "FoxByte builds PostgreSQL you run yourself, with every change on record, a live feed of every row, and AI kept safely off main.",
  },
  hero: {
    eyebrow: "Company",
    title: "We build the database you can hand the keys to",
    lede: "Code now writes to databases faster than anyone can review it. FoxByte exists so the people who own the data can let that happen without losing track of it.",
    ctas: [{ label: "Contact us", href: "/contact", primary: true }, { label: "GitHub", href: repo }],
  },
  blocks: [
    {
      kind: "grid",
      eyebrow: "Commitments",
      title: "Open by default",
      items: [
        { title: "Open source core", body: "The engine is AGPL-3.0 and the client SDKs are Apache-2.0. Read every line of what runs your data.", icon: "box" },
        { title: "Paid means new", body: "Enterprise features are new capability, never something taken out of the free edition.", icon: "branch" },
        { title: "Safety stays free", body: "The Blackbox, its hash chain, the guardrails and every verifier are in every edition.", icon: "shield" },
      ],
    },
    {
      kind: "grid",
      eyebrow: "How we build",
      title: "Principles in the code",
      columns: 2,
      items: [
        { title: "Speed is never traded", body: "Nothing new is allowed onto the commit path. Branching, backups and time travel run beside it." },
        { title: "Candour over claims", body: "We publish what FoxByte is not, and the benchmarks behind every limit we ship." },
        { title: "Your machines, your data", body: "FoxByte runs where you run it. Nothing phones home." },
        { title: "Names that never move", body: "What is written into your data never carries the product’s name, so a rename never touches an install." },
      ],
    },
  ],
  related: [
    { label: "Why FoxByte", href: "/why-foxbyte" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
};
