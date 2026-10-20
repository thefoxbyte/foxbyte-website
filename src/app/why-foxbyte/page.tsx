import { ContentPage } from "@/components/page/ContentPage";
import { pageMetadata } from "@/lib/metadata";
import { whyPage as page } from "@/content/pages";

export const metadata = pageMetadata({ ...page.meta, path: page.path });

export default function Page() {
  return <ContentPage page={page} />;
}
