import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/page/ContentPage";
import { pageMetadata } from "@/lib/metadata";
import { productBySlug, productPages } from "@/content/product";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return productPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = productBySlug((await params).slug);
  return page ? pageMetadata({ ...page.meta, path: page.path }) : {};
}

export default async function ProductPage({ params }: Props) {
  const page = productBySlug((await params).slug);
  if (!page) notFound();
  return (
    <ContentPage
      page={page}
      trail={[
        { label: "Product", href: "/product" },
        { label: page.crumb, href: page.path },
      ]}
    />
  );
}
