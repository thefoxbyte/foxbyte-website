"use client";

import dynamic from "next/dynamic";

const FoxBot = dynamic(() => import("./FoxBot").then((mod) => mod.FoxBot), { ssr: false });

export function LazyFoxBot() {
  return <FoxBot />;
}
