import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { Page } from "@/lib/content";
import { getSettings } from "@/lib/cms";
import { toSiteSettings } from "@/lib/site";

/** A CMS page: its blocks in order, with the clinic settings every block may need. */
export async function PageView({ page }: { page: Page }) {
  const api = await getSettings();

  return (
    <div className="flex flex-col pb-6" data-template={page.template}>
      {page.preview && (
        <p role="status" className="sticky top-0 z-40 bg-royal px-5 py-2 text-center font-display text-[15px] font-bold text-white">
          Preview of unpublished changes · visitors still see the published page
        </p>
      )}
      <BlockRenderer blocks={page.blocks} ctx={{ settings: toSiteSettings(api), api, path: page.path }} />
    </div>
  );
}
