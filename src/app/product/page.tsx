import { ContentPage } from "@/components/page/ContentPage";
import { pageMetadata } from "@/lib/metadata";
import { productOverview as page } from "@/content/product";

export const metadata = pageMetadata({ ...page.meta, path: page.path });

export default function Page() {
  return <ContentPage page={page} />;
}
