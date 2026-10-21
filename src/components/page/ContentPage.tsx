import type { PageContent } from "@/content/types";
import { Blocks } from "./Blocks";
import { CtaBand } from "./CtaBand";
import { PageHero } from "./PageHero";

type Crumb = { label: string; href: string };

export function ContentPage({ page, trail }: { page: PageContent; trail?: Crumb[] }) {
  return (
    <>
      <PageHero hero={page.hero} trail={trail ?? [{ label: page.crumb, href: page.path }]} />
      <Blocks blocks={page.blocks} />
      <CtaBand title={page.cta?.title ?? "Spin up a branch in seconds."} lede={page.cta?.lede ?? "Install FoxByte with one command. Bring your database over with one more."} related={page.related} docs={page.cta?.docs} />
    </>
  );
}
