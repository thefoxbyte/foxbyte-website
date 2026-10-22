import { ContentPage } from "@/components/page/ContentPage";
import { pageMetadata } from "@/lib/metadata";
import { compareDatabaseLabPage as page } from "@/content/guides";

export const metadata = pageMetadata({ ...page.meta, path: page.path });

export default function Page() {
  return <ContentPage page={page} />;
}
