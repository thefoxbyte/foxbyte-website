import { Blocks } from "@/components/page/Blocks";
import { CtaBand } from "@/components/page/CtaBand";
import { OsTabs } from "@/components/page/OsTabs";
import { PageHero } from "@/components/page/PageHero";
import type { Block } from "@/content/types";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Quickstart",
  description: "Install FoxByte, sign in, make an API key, create your first branch and connect any Postgres client or ORM, in about five minutes.",
  path: "/docs/quickstart",
});

const blocks: Block[] = [
  {
    kind: "steps",
    eyebrow: "Step 2",
    title: "Sign in to the console",
    lede: "When setup finishes, the console opens by itself at https://localhost:8080 with a one-time setup token already in the link.",
    items: [
      { title: "Accept the certificate", body: "A fresh install uses a self-signed certificate, so the browser warns once. Accept it, or set FOX_TLS_CERT and FOX_TLS_KEY to a real pair." },
      { title: "Create the first account", body: "Choose an email and a password. The first account can override the destructive-change guardrail, which is why it needs the token." },
      { title: "Lost the link?", body: "fox setup-token prints the token again, and fox user create <email> makes an account from the terminal." },
    ],
  },
  {
    kind: "code",
    eyebrow: "Step 3",
    title: "Make an API key",
    body: "Keys are the password for every Postgres connection and the bearer token for the API. A key is shown once, so copy it. Make one on the console’s API keys page, or from the terminal.",
    lines: ["$ fox apikey create you@example.com laptop", "$ fox apikey create you@example.com claude --agent"],
    note: "--agent makes a key for an AI agent: its changes are recorded as an agent’s and the agent guardrails apply to it.",
  },
  {
    kind: "code",
    eyebrow: "Step 4",
    title: "Check the install and make a branch",
    body: "main already has three small sample tables, users, projects and events, so there is something to branch straight away. Set FOX_NO_DEMO=1 before setup to start empty, or remove them later with fox demo drop.",
    lines: ["$ fox check", "$ fox status", "$ fox branch create qa", "$ fox sql --branch qa \"SELECT count(*) FROM users\""],
  },
  {
    kind: "code",
    eyebrow: "Step 5",
    title: "Connect any Postgres client",
    body: "Everything goes through the gateway on port 6432. The database name is the branch, and the password is your API key.",
    lines: [
      "$ psql \"postgresql://dbadmin:<API_KEY>@localhost:6432/qa?sslmode=require\"",
      "qa=> CREATE TABLE notes (id serial PRIMARY KEY, body text);",
      "$ fox blackbox qa",
      "$ fox branch delete qa",
    ],
    note: "fox blackbox qa shows the CREATE TABLE you just ran, attributed to you. Deleting the branch leaves main untouched.",
  },
  {
    kind: "code",
    eyebrow: "Step 6",
    title: "Point your app at it",
    body: "FoxByte is PostgreSQL, so every driver and ORM connects unchanged: Prisma, Drizzle, SQLAlchemy, Django, GORM, ActiveRecord and the rest. Set one environment variable.",
    lines: ["DATABASE_URL=\"postgresql://dbadmin:<API_KEY>@localhost:6432/main?sslmode=require\""],
    note: "For the REST API there are dependency-free Python and TypeScript clients, and an OpenAPI spec served by the engine at /api/openapi.yaml.",
  },
  {
    kind: "grid",
    eyebrow: "Next",
    title: "Where to go from here",
    items: [
      { title: "Blackbox", body: "What is recorded, how to verify it, and how to get main back from before any change.", icon: "box", href: "/product/blackbox" },
      { title: "Backups and time travel", body: "Send backups off the machine and restore to any second in the archived window.", icon: "rewind", href: "/product/time-travel" },
      { title: "AI agents", body: "Give an agent its own branch over MCP or HTTP.", icon: "branch", href: "/ai-agents" },
    ],
  },
];

export default function QuickstartPage() {
  return (
    <>
      <PageHero
        hero={{
          eyebrow: "Quickstart",
          title: "From nothing to a branch in five minutes",
          lede: "Install FoxByte, sign in, make a key, branch and connect. Every step is one command, on every system.",
        }}
        trail={[
          { label: "Docs", href: "/docs" },
          { label: "Quickstart", href: "/docs/quickstart" },
        ]}
      />
      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ display: "grid", gap: 18 }}>
          <span className="eyebrow">Step 1</span>
          <h2 className="h2">Install</h2>
          <OsTabs />
        </div>
      </section>
      <Blocks blocks={blocks} />
      <CtaBand
        title="That’s the whole setup."
        lede="Everything else is a fox command, a console page or a SQL statement away."
        docs={{ label: "All docs", href: "/docs" }}
        related={[
          { label: "Download", href: "/download" },
          { label: "Docs", href: "/docs" },
          { label: "Security", href: "/security" },
        ]}
      />
    </>
  );
}
