export type PostSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  code?: string[];
  table?: { head: string[]; rows: string[][] };
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingMinutes: number;
  tags: string[];
  sections: PostSection[];
};

export const posts: Post[] = [
  {
    slug: "what-the-blackbox-proves",
    title: "What the Blackbox proves to an auditor, and what it does not",
    description: "An auditor asks who changed the database, who approved it, and how you know the answers were not edited. What FoxByte’s Blackbox answers today, the commands that show it, and where it stops.",
    date: "2026-10-26",
    readingMinutes: 6,
    tags: ["Blackbox", "Regulated teams"],
    sections: [
      {
        paragraphs: [
          "Sooner or later someone asks three questions about a production database. Who changed it? Who approved the change? And how do you know the answers were not edited afterwards? This is what FoxByte’s Blackbox answers, the commands that show it, and, just as plainly, where it stops.",
        ],
      },
      {
        heading: "Who changed it",
        paragraphs: [
          "Every change to a table, view, index, function, type, trigger, policy or privilege is written down by event triggers inside the database, in the same transaction as the change itself. If the change rolls back, so does its entry; if it commits, the entry is there.",
          "Each entry names the login role that made it. The gateway logs every person in as their own Postgres role and every agent as an agent role, and a client cannot change its login, so that part cannot be forged. The tool, application_name, is whatever the client says it is: useful for reading, not proof. An application that shares one login between many people is recorded as that login.",
        ],
        bullets: [
          "Also recorded: TRUNCATE from anyone, an agent’s UPDATE and DELETE, once per statement, and every change the guardrails refused, as BLOCKED.",
          "Not recorded: reads, and a person’s INSERT, UPDATE and DELETE.",
        ],
        code: ["$ fox blackbox", "$ fox blackbox entries --limit 20"],
      },
      {
        heading: "How you know it was not edited",
        paragraphs: [
          "The record is an append-only table, and each entry carries a hash of the one before it. Edit or delete an entry and every hash after it stops matching, which fox blackbox verify finds in every edition.",
          "A database superuser could rewrite the rows and recompute every hash after them. That is what anchors are for. On a schedule, the engine signs a checkpoint of the chain with an Ed25519 key the database cannot read and writes it outside the database. fox blackbox integrity, or the standalone fox-verify with the public key, checks the record against them. Writing anchors is part of Enterprise; checking them is free, so an auditor never needs a licence to verify you.",
          "Anchors prove something only if they live where the people being audited cannot change them. With a remote backup target, every anchor is copied to the bucket too; make it a bucket in Object Lock compliance mode, controlled by someone other than the database administrators.",
        ],
        code: ["$ fox blackbox verify", "$ fox blackbox integrity", "$ fox blackbox anchor-key"],
      },
      {
        heading: "Who approved it",
        paragraphs: [
          "Schema changes can reach main through a change request: prepared on a branch, reviewed statement by statement, and applied in one transaction by someone allowed to manage main. An agent can ask and never approve. The request keeps who asked, who approved and what was applied, and the Blackbox keeps each statement attributed to whoever wrote it.",
          "One limit to state to your auditor today: FoxByte stops an agent approving its own request, but not a person. Someone who can manage main can ask and approve the same change, and the record shows they did both. Put the two-person rule in your process until the product enforces it.",
        ],
      },
      {
        heading: "Where it stops",
        paragraphs: ["A record is only as trustworthy as the account of its gaps. These are the Blackbox’s today."],
        bullets: [
          "A database superuser can stop the event triggers, for one session with SET event_triggers = off or SET session_replication_role = replica, or for everyone by disabling them, and what they change meanwhile is not recorded. Anchors still prove the recorded history was not rewritten; they cannot show what was never written.",
          "Roles, role memberships, databases, tablespaces and settings live outside any one database, so event triggers never see them. Nor do they record dropping a trigger, a policy, a procedure, an aggregate or a foreign table.",
          "The next release closes most of this: every five minutes a catalog scan compares the schema with what it saw last, and records what the triggers missed, and those global objects, with who made the change marked unknown.",
          "Someone with root on the machine can read the disk and the anchor key there. For them, anchors kept elsewhere are the proof, and nothing on the machine itself can be.",
        ],
      },
      {
        heading: "What to hand over",
        table: {
          head: ["The question", "The evidence", "The command"],
          rows: [
            ["Who changed the schema, and when?", "The Blackbox’s entries", "fox blackbox"],
            ["Was the record edited?", "The hash chain", "fox blackbox verify"],
            ["Was it rewritten wholesale?", "Signed anchors outside the database", "fox blackbox integrity, fox-verify"],
            ["Who approved the production change?", "The change request", "fox request show"],
            ["Who signed in or became an admin?", "The security log, chained and anchored the same way", "fox audit verify"],
            ["Can we have all of it?", "Every entry as JSON lines (Enterprise)", "fox blackbox export"],
          ],
        },
        paragraphs: ["The Blackbox page sets out the full scope, entry by entry, and the regulated teams page maps it to what auditors ask."],
      },
    ],
  },
  {
    slug: "maker-checker-schema-changes",
    title: "Maker-checker for schema changes: one asks, another approves",
    description: "Separation of duties for database changes: prepare a change on a full-size branch, review the exact statements, and apply them to main in one transaction. How FoxByte’s change requests work, and their one limit today.",
    date: "2026-10-26",
    readingMinutes: 5,
    tags: ["Change requests", "Regulated teams"],
    sections: [
      {
        paragraphs: [
          "Banks call it maker-checker; everyone else calls it review. The person or agent who prepares a change to production is not the one who puts it there, and both steps leave a record. FoxByte’s change requests are that control for schema changes.",
        ],
      },
      {
        heading: "Make the change on a branch",
        paragraphs: [
          "A branch is a full copy of main, made in seconds, so a migration is tried against real data at full size rather than a sample. Everything it runs is recorded in the branch’s Blackbox, attributed to the login that ran it.",
        ],
        code: ["$ fox branch create add-invoices-index", "$ psql \"postgresql://dbadmin:<API_KEY>@localhost:6432/add-invoices-index?sslmode=require\""],
      },
      {
        heading: "Ask, then check",
        paragraphs: [
          "fox branch request lists the statements the branch has that main does not, in the order they ran, and opens a request. Nothing is applied. A reviewer reads exactly what would run.",
        ],
        code: ["$ fox branch request add-invoices-index --to main", "$ fox request list --open", "$ fox request show 3"],
      },
      {
        heading: "Apply, all or nothing",
        paragraphs: [
          "Approving applies the statements to main in one transaction: all of them, or none. Rejecting leaves main untouched. Either can carry a note saying why.",
          "A request is refused rather than half-applied when main has changed the same object since the branch was made, when main’s guardrails would block one of its statements, or when there is nothing to apply.",
        ],
        code: ["$ fox request approve 3 --note \"Reviewed with the payments team\"", "$ fox request reject 4 --note \"Drops a column the reports still read\""],
      },
      {
        heading: "Who may approve",
        paragraphs: [
          "Approving needs the right to manage the target: an admin for main, the owner for any other branch. An agent’s key can manage nothing, so an agent can prepare and ask, and never approve its own change.",
          "The limit to know today: FoxByte does not stop a person approving their own request. Someone who can manage main can ask and approve the same change, and the record shows that they did both. Until the product enforces two people, make it a rule in your process, and check the requests list in your reviews.",
        ],
      },
      {
        heading: "What is kept",
        bullets: [
          "The request: who asked, who approved or rejected, the note, and the statements, in order.",
          "On main, the Blackbox records each applied statement, still attributed to whoever wrote it on the branch.",
          "Those Blackbox entries are hash-chained like every other, and anchored in Enterprise.",
          "Change requests carry schema only. No data moves between branches.",
        ],
      },
    ],
  },
  {
    slug: "agent-row-limit",
    title: "The agent row limit: why a row counter, and what it costs",
    description: "We measured two ways to stop an AI agent’s runaway UPDATE or DELETE on a million-row table. One refuses it in 14.5 ms on a small test VM. Here is the data, including what it costs people. It ships in the next release.",
    date: "2026-10-16",
    readingMinutes: 5,
    tags: ["Guardrails", "Benchmarks"],
    sections: [
      {
        paragraphs: [
          "Refusing an agent’s DELETE because its text has no WHERE clause is easy to get around: WHERE 1 = 1 deletes every row just as well. So FoxByte now limits agents by impact, the number of rows a statement actually changes, rather than by what the statement looks like.",
          "There were two credible ways to build that, and we measured both before choosing.",
        ],
      },
      {
        heading: "Two designs",
        bullets: [
          "A row counter: a BEFORE UPDATE OR DELETE trigger, for each row, whose WHEN clause only passes agent sessions. It counts rows per statement and table, and refuses at the first row over the limit.",
          "A transition table: an AFTER trigger, once per statement, that counts the statement’s old rows after it has run, and refuses then.",
        ],
      },
      {
        heading: "The results",
        paragraphs: ["PostgreSQL 18 in a throwaway VM with 4 CPUs and 4 GiB, a table of 1,000,000 narrow rows rebuilt before every measurement, seven interleaved rounds. Medians, in milliseconds."],
        table: {
          head: ["Case", "No guard", "Row counter", "Transition table"],
          rows: [
            ["A person updates every row", "2,443", "3,195", "2,653"],
            ["A person deletes every row", "311", "771", "476"],
            ["An agent deletes every row", "273, not refused", "14.5, refused", "505, refused"],
            ["An agent updates 50 rows", "5.8", "8.8", "5.8"],
          ],
        },
      },
      {
        heading: "Reading them",
        paragraphs: [
          "The row counter stops the damage, which is the point of a guardrail. It refuses an agent’s mass delete at row 101, in 14.5 ms, 35 times faster than the transition table, which has to delete every row and keep a copy of each before it can count them and roll back.",
          "It costs people more on bulk writes: about 0.46 µs per row deleted and 0.75 µs per row updated, against 0.17 µs and 0.21 µs for the transition table. On ordinary statements of a few rows neither is noticeable, and these were the cheapest writes PostgreSQL does, so on real tables the overhead is a smaller share.",
          "Most of that cost is PostgreSQL’s, not ours. A per-row trigger whose WHEN is the constant false already adds about 0.3 µs per deleted row, because the executor has to fetch each old row for it.",
        ],
      },
      {
        heading: "Why the WHEN clause names the login",
        paragraphs: [
          "The cheapest filter would read a session setting, but an agent can change a session setting from inside its own WHERE clause and skip the guard. The login role is the one part of a session the session cannot change, so the trigger tests that, and names it once, because every mention of session_user looks the role up again.",
        ],
      },
      {
        heading: "Using it",
        paragraphs: ["The defaults are 100 rows per table per statement and 1,000 rows per table per hour for each agent. Both can be changed per table."],
        code: ["$ fox guardrail limit --table orders 500", "$ fox guardrail budget --table orders --per 1h 5000"],
      },
    ],
  },
  {
    slug: "sell-the-making-not-the-checking",
    title: "Sell the making of anchors, not the checking",
    description: "Signed Blackbox anchors are an Enterprise feature. Verifying them is free, forever, in every edition. Here is why we drew the line there.",
    date: "2026-10-07",
    readingMinutes: 4,
    tags: ["Blackbox", "Open source"],
    sections: [
      {
        paragraphs: [
          "Every Blackbox entry is hash-chained to the one before it, so an edited or deleted row breaks the chain. That proves the record was not changed, unless someone with superuser access rewrites the rows and recomputes every hash after them.",
          "Anchors close that gap. Every few minutes, or every 500 new entries, FoxByte writes a checkpoint of the chain, a Merkle root over a range of rows, to a file outside the database, signed with a key the database cannot read. Rewriting anchored rows makes them stop matching the anchor, however carefully the chain was rebuilt.",
        ],
      },
      {
        heading: "Where the line goes",
        paragraphs: [
          "When FoxByte became two editions, writing anchors on a schedule moved to Enterprise. Checking them did not. fox blackbox integrity, the public key, and the standalone verifier fox-verify are free in every edition, and so are the security log’s own anchors.",
          "An independent verifier you have to buy is not much of an independent verifier. And anyone who anchored before upgrading, or who lets a licence lapse, must still be able to prove what they hold.",
        ],
      },
      {
        heading: "Keep them somewhere the admin cannot reach",
        paragraphs: [
          "Anchors are only as safe as where they live. By default they are written read-only beside the install, which proves nothing against the person who runs that machine. Point them at a bucket with Object Lock in compliance mode, ideally in an account the database administrators do not control, and nobody can delete or overwrite them before the retention ends, the bucket’s owner included.",
        ],
        code: ["$ fox blackbox anchor-target set s3://audit-anchors …   # next release", "$ fox blackbox anchor-key", "$ fox blackbox integrity"],
      },
      {
        heading: "The format is public",
        paragraphs: ["The anchor file format, ledger-anchor/1, is specified in the repository, so a security team that does not trust FoxByte can write its own verifier from the document alone."],
      },
    ],
  },
  {
    slug: "why-no-storage-engine",
    title: "Why FoxByte has no storage engine of its own",
    description: "FoxByte branches, rewinds and backs up PostgreSQL without replacing how Postgres stores data. The reason is one requirement we locked first: transaction speed is never traded.",
    date: "2026-09-21",
    readingMinutes: 4,
    tags: ["Architecture"],
    sections: [
      {
        paragraphs: [
          "People often ask what storage engine FoxByte uses. The answer is PostgreSQL’s. Rows, indexes and the write-ahead log are stored by PostgreSQL 18 itself, unmodified, on local disk.",
          "What FoxByte built is a storage layer around Postgres: instant copy-on-write branches, space management, and durability to object storage.",
        ],
      },
      {
        heading: "The decision",
        bullets: [
          "Transaction speed must never be compromised. It was the project’s first locked requirement.",
          "Engines that separate compute from storage put a network hop under every page read and every commit.",
          "Stock Postgres on local disk keeps native latency. Branching, backups and time travel run beside the commit path instead.",
        ],
      },
      {
        heading: "How the pieces fit",
        paragraphs: [
          "Each branch is a copy-on-write clone, a ZFS snapshot and clone on macOS and Linux or a btrfs subvolume snapshot on Windows, served by its own Postgres. A branch of any size is created in seconds and only stores what changes.",
          "Main’s write-ahead log and base backups are copied to S3-compatible storage by wal-g, which is what makes point-in-time restore and branching from just before a schema change possible. The commit never waits for it.",
        ],
      },
      {
        heading: "What it means in practice",
        bullets: [
          "Full PostgreSQL compatibility: drivers, ORMs, tools and extensions work unchanged.",
          "Nothing to maintain below Postgres; upgrades follow upstream.",
          "The honest limit: each node keeps compute and storage on one machine. Moving a branch between hosts would need networked storage, which is not built.",
        ],
      },
    ],
  },
];

export function postBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}
