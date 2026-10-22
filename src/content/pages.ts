import type { PageContent } from "./types";
import { site } from "./site";

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
    title: "Give every agent its own database. Keep main untouched.",
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
      lines: ["$ FOX_API_KEY=key_… fox mcp", "$ fox serve --addr :8088", "$ curl -k -H \"Authorization: Bearer $FOX_KEY\" -X POST https://localhost:8088/agents/alice/branch", "{ \"dsn\": \"postgresql://agent-alice:key_…@localhost:6432/agent-alice\" }"],
      note: "-k accepts the self-signed certificate a fresh install uses; drop it once you give FoxByte a real certificate. MCP tools: create_branch, run_sql, changes, verify_blackbox, list_branches and delete_branch. DDL an agent runs is attributed to that agent automatically.",
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
      body: ["Destructive commands are blocked by policy, and a DELETE or UPDATE without a WHERE is refused. In the next release, one that reaches past 100 rows of a table is stopped at row 101, before anything is lost."],
      bullets: ["Next release: at most 1,000 rows of a table per hour, per agent.", "Every refusal is recorded in the Blackbox.", "An agent can propose changes to main; only a person can approve them."],
      visual: "refuse",
      reverse: true,
    },
    {
      kind: "faq",
      title: "Questions about agents",
      items: [
        { q: "Which agent frameworks work?", a: "Any MCP client, or anything that can make an HTTP call and speak the Postgres wire protocol." },
        { q: "Can an agent wipe a table?", a: "Not without a WHERE, and never with TRUNCATE or DROP TABLE unless an admin overrides the policy. From the next release, not more than 100 rows in a statement either." },
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
  cta: { title: "Pick the job you need done first.", lede: "Each one starts with the same install and a single command." },
  path: "/use-cases",
  crumb: "Use cases",
  meta: {
    title: "Use cases",
    description: "How teams use FoxByte: a database per pull request, rehearsing migrations on real data, proving what changed, a maker-checker flow for schema changes, undoing mistakes and migrating from MySQL or MongoDB.",
  },
  hero: {
    eyebrow: "Use cases",
    title: "One database, six jobs it makes easy",
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
      visual: "sleep",
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
      body: ["Every schema change is hash-chained and attributed to a login. Signed anchors in an Object Lock bucket prove the recorded history was not rewritten, even by a superuser, and the security log covers who came in through the door."],
      bullets: ["fox blackbox verify and fox audit verify", "An independent verifier, fox-verify, free in every edition", "A compliance export bundle in Enterprise"],
      visual: "record",
    },
    {
      kind: "split",
      id: "maker-checker",
      eyebrow: "Regulated teams",
      title: "A schema change with four eyes on it",
      body: ["An engineer or an agent prepares the change on a branch and asks for it to go to main. Someone else reviews the exact statements and approves them, and they are applied in one transaction. The Blackbox records who wrote each statement, the request records who approved it, and the anchors prove neither record was edited."],
      bullets: ["fox branch request, fox request show, fox request approve", "An agent can ask, never approve", "Evidence an auditor can verify with fox-verify"],
      visual: "request",
      reverse: true,
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
  cta: { title: "Review it like a security team would.", lede: "Read the code, verify the release, and report anything you find privately.", docs: { label: "Report a vulnerability", href: "https://github.com/thefoxbyte/foxbyte/security" } },
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
      body: "Every release’s SHA256SUMS is signed with the FoxByte release key. The installer checks that signature wherever OpenSSL 3 is available; macOS ships LibreSSL, which cannot, so there it checks every file against SHA256SUMS and warns. Set FOX_REQUIRE_SIGNATURE=1 to refuse instead. fox update checks the signature on every update and never installs a release that fails. Each file has a GitHub build attestation, and each release an SPDX SBOM.",
      lines: [`$ ${site.install.replace(/\| sh$/, "| FOX_REQUIRE_SIGNATURE=1 sh")}`, "$ gh attestation verify fox-darwin-arm64 --repo thefoxbyte/foxbyte", "$ gh attestation verify oci://ghcr.io/thefoxbyte/postgres-walg:18 --repo thefoxbyte/foxbyte"],
    },
    {
      kind: "table",
      eyebrow: "Release key",
      title: "Check the key, not just the signature",
      head: ["What", "Value"],
      rows: [
        ["Algorithm", "Ed25519"],
        ["Public key (base64)", "aTn8b2xj53r7QjOK+K2//RBU+4OBHoxzuclxGK04WZc="],
        ["SHA-256 of the key", "f30408e212e75bff72b715db8264c076f7765b6be121e895d8a7e7b1a20ff682"],
        ["SBOM", "foxbyte-sbom.spdx.json, attached to every release"],
      ],
      note: "The same key is built into fox and into install.sh. A release signed by any other key is refused.",
    },
    {
      kind: "list",
      eyebrow: "Threat model",
      title: "Who FoxByte defends against, and where it stops",
      items: [
        "People and agents who log in through FoxByte. None of them is a superuser: they cannot stop the Blackbox, write to it, forge who they are, or reach a branch that is not theirs.",
        "Someone on the network. Services listen on loopback until you open them, TLS refuses to fall back to plain text, and sign-ins are throttled.",
        "A database superuser can stop the Blackbox’s event triggers. Signed anchors kept off the machine prove that recorded history was not rewritten; the next release also records what the triggers missed.",
        "Root on the machine can read the disk and the anchor key there. Encryption at rest is not built in yet: use full-disk encryption, and server-side encryption on the backup bucket. Anchors kept elsewhere stay the proof.",
        "No independent penetration test has been done yet. Reports go through the private process below.",
      ],
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
      lede: "Please do not open a public issue for security problems. We would rather hear first, and we answer quickly.",
      items: [
        { title: "Report", body: "Use GitHub’s private vulnerability reporting: the repository’s Security tab, then Report a vulnerability." },
        { title: "Acknowledgement", body: "Within 3 business days." },
        { title: "Assessment", body: "Severity and whether we can reproduce it, within 7 days, then updates as we fix it and credit in the release notes if you want it." },
      ],
    },
  ],
  related: [
    { label: "Blackbox", href: "/product/blackbox" },
    { label: "Data privacy", href: "/privacy" },
    { label: "Website privacy", href: "/legal/privacy" },
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
        { title: "Attribution by login", body: "Every schema change recorded with the login that made it, person or agent, which a client cannot change, and the tool the client reported.", icon: "box" },
        { title: "A record you can prove", body: "A hash chain inside the database, signed anchors outside it, and a verifier anyone can run.", icon: "shield" },
        { title: "A gate before the damage", body: "Destructive commands refused by policy, and deletes without a WHERE refused.", icon: "pulse" },
      ],
    },
    {
      kind: "split",
      eyebrow: "The trade we refused",
      title: "Local disk, by design",
      body: ["Separating compute from storage puts a network hop under every page read and every commit. FoxByte keeps stock Postgres on local disk instead, and does branching, backups and time travel beside the commit path. Today that is the design, with its trade-off: a branch lives on the machine that made it."],
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
  cta: { title: "Start with the quickstart.", lede: "Five minutes from install to a branch you can connect to.", docs: { label: "Quickstart", href: "/docs/quickstart" } },
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
    ctas: [{ label: "Quickstart", href: "/docs/quickstart", primary: true }, { label: "All docs on GitHub", href: `${repo}/tree/main/docs` }],
  },
  blocks: [
    {
      kind: "code",
      eyebrow: "Quickstart",
      title: "From nothing to a branch in four commands",
      body: "After setup the console opens by itself with a one-time setup token in the link. main already has three small sample tables, so there is something to branch straight away. On Windows, install with PowerShell; the full walk-through is in the quickstart.",
      lines: [`$ ${site.install}`, "$ fox setup", "# on Linux: sudo fox start instead of fox setup", "$ fox branch create qa", "$ psql \"postgresql://dbadmin:<API_KEY>@localhost:6432/qa?sslmode=require\""],
    },
    {
      kind: "grid",
      eyebrow: "Guides",
      title: "Start here",
      items: [
        { title: "Install and quickstart", body: "macOS, Linux and Windows, and your first branch.", icon: "import", href: "/docs/quickstart" },
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
  cta: { title: "Talk to the people who build it.", lede: "Questions about Enterprise, partnerships or the roadmap go straight to the team.", docs: { label: "Contact us", href: "/contact" } },
  path: "/company",
  crumb: "Company",
  meta: {
    title: "About",
    description: "FoxByte builds PostgreSQL you run yourself, with every schema change on record, a live feed of every row, and AI kept safely off main.",
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
      columns: 3,
      items: [
        { title: "Postgres stays Postgres", body: "The storage engine and the planner are stock PostgreSQL. Branching, backups and time travel run beside the commit path, and every guardrail’s cost is measured and published." },
        { title: "Candour over claims", body: "We publish what FoxByte is not, and the benchmarks behind every limit we ship." },
        { title: "Your machines, your data", body: "FoxByte runs where you run it, with no telemetry. Your data never leaves your machines unless you send it somewhere." },
      ],
    },
  ],
  related: [
    { label: "Why FoxByte", href: "/why-foxbyte" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
};

export const dataPrivacyPage: PageContent = {
  slug: "privacy",
  path: "/privacy",
  crumb: "Data privacy",
  meta: {
    title: "Data privacy and security",
    description: "Where your data lives with FoxByte, every connection it makes to the outside, how passwords, keys and traffic are protected, who can see what, and how to remove data.",
  },
  hero: {
    eyebrow: "Data privacy",
    title: "Your data stays on machines you control",
    lede: "FoxByte runs on your own laptop or servers. It has no telemetry, we never see your data, and nothing leaves the machine unless you send it somewhere. Here is exactly how that works, including the few connections it does make.",
    ctas: [{ label: "Security defaults", href: "/security", primary: true }, { label: "Website privacy", href: "/legal/privacy" }],
    visual: "secure",
  },
  blocks: [
    {
      kind: "grid",
      eyebrow: "Where your data lives",
      title: "On your machines, and nowhere else by default",
      columns: 4,
      items: [
        { title: "Your databases", body: "Every branch, row and index lives on the machine that runs FoxByte. There is no FoxByte cloud in the path.", icon: "db" },
        { title: "No telemetry", body: "FoxByte sends no usage data, metrics or crash reports to anyone, including us.", icon: "shield" },
        { title: "Backups", body: "Kept beside the database until you choose a bucket of your own. Then they go there and only there.", icon: "rewind" },
        { title: "Realtime", body: "The change feed streams from your own server to your own apps, with no third party in the middle.", icon: "pulse" },
      ],
    },
    {
      kind: "list",
      eyebrow: "Full disclosure",
      title: "Every connection FoxByte makes to the outside",
      lede: "None of these carries your data. Once installed, FoxByte runs without an internet connection: the update check gives up quietly and the console falls back to system fonts.",
      items: [
        "An update check. fox start asks GitHub whether a newer release exists, and fox check reports your version. It sends nothing about your data. FOX_NO_UPDATE_CHECK=1 turns it off.",
        "Downloads you ask for. Installing, fox update and fox upgrade fetch signed releases from GitHub and engine images from GitHub’s container registry.",
        "Web fonts. The console loads its fonts from Google Fonts, so your browser contacts Google when you open it.",
        "Sign-in with GitHub or Google, only if you configure it. Otherwise accounts are email and password, checked on your machine.",
        "Backups and anchor copies, only to a bucket you set with fox backup target set or fox blackbox anchor-target set.",
        "Imports, only from the source you name. Importing from private networks is for admins, and cloud metadata addresses are refused.",
      ],
    },
    {
      kind: "grid",
      eyebrow: "Protecting information",
      title: "How secrets and traffic are kept safe",
      items: [
        { title: "Encrypted in transit", body: "The console, the gateway and the Agent API all serve TLS, and a service that cannot load its certificate refuses to start rather than fall back to plain text off loopback.", icon: "shield" },
        { title: "Passwords never stored", body: "Account passwords are kept only as bcrypt hashes. Nobody can read one back, not even an admin; a forgotten password is reset from the machine itself.", icon: "box" },
        { title: "Keys shown once", body: "API keys are stored as SHA-256 hashes with a short prefix for display. Revoke one and everything using it is cut off at once.", icon: "branch" },
        { title: "Sessions hashed at rest", body: "Sign-in session tokens are stored hashed, so a copy of the accounts file does not hand out live sessions.", icon: "rewind" },
        { title: "A password per role", body: "Every account and agent logs in to Postgres as its own role with its own password. The install secret belongs to the superuser alone and never appears on a command line.", icon: "db" },
        { title: "Secrets in locked files", body: "Private keys and the backup bucket’s secret are written to files only their owner can read, and the backup secret is asked for rather than typed on a command line.", icon: "import" },
      ],
    },
    {
      kind: "grid",
      eyebrow: "Access",
      title: "Who can see what",
      columns: 2,
      items: [
        { title: "Branches belong to their maker", body: "Everyone shares main. A branch made through the console, the API or an agent is its maker’s; other people’s branches are not listed and answer “not found”, through the gateway too." },
        { title: "Agents see one branch", body: "An agent key opens its own branch and nothing else. It never holds an admin grant, and the console and control-plane API refuse it." },
        { title: "Postgres rules still apply", body: "Row-level security policies and GRANTs work exactly as they do in Postgres, for every client that connects." },
        { title: "Admin power is on the record", body: "Admin grants, sign-ins, failed sign-ins, key changes and refused requests all go into the security log, chained and verifiable." },
      ],
    },
    {
      kind: "split",
      eyebrow: "What FoxByte records",
      title: "Records about people, and how long they last",
      body: [
        "The Blackbox records every schema change with who made it, the tool and the full statement. The security log records who came in and what they were refused. Both are append-only on purpose, so plan for that: keep personal data out of schema statements.",
        "Query history keeps the SQL each person ran, never the results, for 90 days by default. fox history retention changes how long, and each person sees only their own.",
      ],
      bullets: ["Blackbox: schema changes, who, which tool", "Security log: sign-ins, keys, grants, refusals", "Query history: SQL text only, 90 days by default"],
      visual: "record",
      reverse: true,
    },
    {
      kind: "code",
      eyebrow: "Removing data",
      title: "Delete what you no longer need",
      body: "Removing data is a command away, and nothing is kept elsewhere because nothing was sent elsewhere.",
      lines: ["$ fox branch delete qa", "$ fox apikey revoke you@example.com <id>", "$ fox user delete former@example.com", "$ fox backup prune --keep 7", "$ fox uninstall"],
      note: "Backups in an Object Lock bucket cannot be deleted before their retention ends, by design. Choose the retention with that in mind.",
    },
    {
      kind: "list",
      eyebrow: "Not yet",
      title: "What FoxByte does not do for you yet",
      items: [
        "Encryption at rest. FoxByte does not add its own encryption to stored data yet. Use disk encryption on the machine (FileVault, BitLocker or LUKS) and server-side encryption on your backup bucket.",
        "Self-hosted console fonts. Until the console bundles its own fonts, opening it makes a request to Google Fonts.",
        "Compliance by itself. FoxByte gives you controls and evidence, but no product makes you compliant with a regulation on its own. Check your obligations with your counsel.",
      ],
    },
    {
      kind: "faq",
      title: "Privacy questions",
      items: [
        { q: "Can FoxByte, the company, see my data?", a: "No. FoxByte runs on your machines, sends no telemetry and has no service in the path of your data. We could not see it if we wanted to." },
        { q: "Does FoxByte work without the internet?", a: "Yes, once installed. Installing and updating need GitHub, but the database, branches, the Blackbox and the console all run offline. The update check gives up quietly and the console falls back to system fonts." },
        { q: "Where are accounts and keys kept?", a: "In a small accounts database on the machine that runs FoxByte. Passwords are bcrypt hashes, keys and session tokens are SHA-256 hashes, and none of it leaves the machine." },
        { q: "Does FoxByte make me compliant with GDPR or India’s DPDP Act?", a: "Not by itself. It helps: data stays where you put it, access is per person, and the Blackbox and security log give you evidence of who changed what. Whether that meets your obligations is a question for your counsel." },
        { q: "What does this website collect?", a: "Almost nothing: no analytics, no tracking cookies and no third-party scripts. The website privacy page lists the few preferences it keeps in your browser." },
      ],
    },
  ],
  related: [
    { label: "Security", href: "/security" },
    { label: "Website privacy", href: "/legal/privacy" },
    { label: "Blackbox", href: "/product/blackbox" },
  ],
  cta: { title: "Run it where your data already lives.", lede: "Install FoxByte on your own machine. Nothing about your data goes anywhere else.", docs: { label: "Security defaults", href: "/security" } },
};

export const regulatedPage: PageContent = {
  slug: "regulated",
  path: "/regulated",
  crumb: "Regulated teams",
  meta: {
    title: "FoxByte for regulated teams: evidence for every schema change",
    description: "A maker-checker flow for schema changes, a tamper-evident record of who changed what, and evidence an auditor can verify, on PostgreSQL that runs on your own machines.",
  },
  hero: {
    eyebrow: "Regulated teams",
    title: "Evidence your auditors can check for themselves",
    lede: "Banks, insurers, health and public-sector teams have to show who changed a database, who approved it, and that the record was not edited afterwards. FoxByte keeps that evidence beside the data, on machines you control. It helps you meet your obligations; it does not make you compliant on its own.",
    ctas: [{ label: "Talk to us", href: "/contact", primary: true }, { label: "Security", href: "/security" }],
    visual: "request",
  },
  blocks: [
    {
      kind: "steps",
      eyebrow: "Maker-checker",
      title: "One asks, another approves",
      lede: "Schema changes reach main through a change request. FoxByte stops an agent approving its own. It does not yet stop a person approving their own request, so require two people in your process: the record shows who did each step.",
      items: [
        { title: "Make", body: "An engineer or an agent prepares the change on a branch, at full size, and asks for it to go to main. Nothing is applied yet." },
        { title: "Check", body: "A reviewer reads the exact statements in the order they ran, each attributed to whoever wrote it." },
        { title: "Apply", body: "Someone with the right to manage main approves it, and the statements are applied in one transaction, or not at all." },
      ],
    },
    {
      kind: "table",
      eyebrow: "Evidence",
      title: "What an auditor asks, and where the answer is",
      head: ["The question", "Where FoxByte keeps the answer"],
      rows: [
        ["Who changed the schema, and when?", "The Blackbox: every change with the login, the time, the branch and the statement. fox blackbox"],
        ["Was that record edited afterwards?", "The hash chain (fox blackbox verify) and signed anchors kept off the machine, checked by the free fox-verify"],
        ["Who approved the production change?", "The change request: who asked, who approved, and what was applied. fox request show"],
        ["Who signed in, made keys or became an admin?", "The security log, chained and anchored the same way. fox audit verify"],
        ["Can you go back to before an incident?", "Point-in-time restore, and a branch of main as it was just before any Blackbox entry"],
        ["Where does the data live?", "On your machines. No telemetry, and backups go only where you point them"],
        ["Can you hand the evidence over?", "fox blackbox export writes every entry as JSON lines for fox-verify to check (Enterprise)"],
      ],
      note: "What the Blackbox records, and what it does not, is set out on the Blackbox page.",
    },
    {
      kind: "list",
      eyebrow: "Privacy rules",
      title: "Helps with, never a compliance claim",
      items: [
        "India’s DPDP Act, the GDPR and sector regulators’ IT rules ask for accountability, access control and the ability to show what happened. FoxByte supplies the records; meeting the rule is still your process and your lawyers’ call.",
        "Data stays where you install it. FoxByte has no hosted service and sends no telemetry.",
        "Every person and agent logs in as their own Postgres role, so access and the record follow the individual.",
        "The next release adds personal-data discovery: a scan of a branch for where it holds personal data, showing where and never the values.",
      ],
    },
    {
      kind: "list",
      eyebrow: "Not yet",
      title: "What a procurement checklist will find missing",
      items: [
        "Encryption at rest is not built in. Use full-disk encryption on the machine and server-side encryption on the backup bucket.",
        "Offline and air-gapped installs are not supported yet: the installer fetches from GitHub and GHCR.",
        "Imports come from PostgreSQL, MySQL, MariaDB, MongoDB and files, not yet Oracle or SQL Server.",
        "No independent penetration test has been done yet.",
      ],
    },
    {
      kind: "faq",
      title: "Questions from regulated teams",
      items: [
        { q: "Does FoxByte make us compliant?", a: "No product does by itself. FoxByte gives you records and controls that compliance work needs: who changed what, who approved it, and proof the record was not edited." },
        { q: "Can an AI agent change production?", a: "Not directly. An agent works on its own branch and can ask for its changes to go to main. Only a person who can manage main can approve them." },
        { q: "Can one person ask and approve the same change?", a: "Today, yes, if they can manage main, and the record shows that they did both. Put the two-person rule in your process until the product enforces it." },
        { q: "Can we run it in our own cloud account?", a: "Yes. FoxByte runs on Linux servers or VMs you control, in your data centre or your cloud account, with one primary and an optional hot standby." },
      ],
    },
  ],
  related: [
    { label: "Blackbox", href: "/product/blackbox" },
    { label: "Security", href: "/security" },
    { label: "Data privacy", href: "/privacy" },
  ],
  cta: { title: "Tell us what your auditors ask for.", lede: "We will show you where FoxByte keeps the answer, and say plainly where it does not." },
};
