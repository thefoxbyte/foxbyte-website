import type { FeatureIcon } from "@/components/ui/icons";

export type VisualKey =
  | "branch"
  | "record"
  | "realtime"
  | "refuse"
  | "anchor"
  | "migrate"
  | "etl"
  | "agentCode"
  | "architecture"
  | "timescrub"
  | "undo"
  | "ha"
  | "sleep"
  | "request"
  | "secure"
  | "track"
  | "console";

export type Link = { label: string; href: string; primary?: boolean };

type BlockBase = { id?: string; eyebrow?: string; title: string; lede?: string; alt?: boolean };

export type GridItem = { title: string; body: string; icon?: FeatureIcon; tag?: string; href?: string };

export type Block =
  | (BlockBase & { kind: "grid"; columns?: 2 | 3 | 4; items: GridItem[] })
  | (BlockBase & { kind: "split"; body: string[]; bullets?: string[]; visual: VisualKey; reverse?: boolean; lines?: string[] })
  | (BlockBase & { kind: "code"; body?: string; lines: string[]; note?: string })
  | (BlockBase & { kind: "steps"; items: { title: string; body: string }[] })
  | (BlockBase & { kind: "table"; head: string[]; rows: string[][]; note?: string })
  | (BlockBase & { kind: "list"; items: string[] })
  | (BlockBase & { kind: "faq"; items: { q: string; a: string }[] })
  | (BlockBase & { kind: "cast"; src: string; body?: string; screen: string; label: string });

export type Hero = { eyebrow: string; title: string; lede: string; ctas?: Link[]; visual?: VisualKey; tag?: string };

export type PageContent = {
  slug: string;
  path: string;
  meta: { title: string; description: string };
  crumb: string;
  hero: Hero;
  blocks: Block[];
  related?: Link[];
  cta?: { title: string; lede: string; docs?: Link };
};
