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
        code: ["$ fox blackbox anchor-target set s3://audit-anchors …", "$ fox blackbox anchor-key", "$ fox blackbox integrity"],
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
