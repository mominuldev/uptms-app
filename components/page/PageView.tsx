import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Page } from "@/lib/content";
import { getSettings } from "@/lib/cms";
import { toSiteSettings } from "@/lib/site";

/**
 * Legal pages (privacy policy and the like) sit on the same inset paper
 * panel the home page uses for its specialty cards, so long text reads on a
 * soft grey surface instead of the bare page.
 */
const legalPanel = "mx-4 my-3 rounded-panel bg-paper md:my-4 lg:my-6";

/** A CMS page: its blocks in order, with the clinic settings every block may need. */
export async function PageView({ page }: { page: Page }) {
  const api = await getSettings();
  const blocks = <BlockRenderer blocks={page.blocks} ctx={{ settings: toSiteSettings(api), api, path: page.path }} />;

  return (
    <div className="flex flex-col pb-6" data-template={page.template}>
      {page.preview && (
        <p role="status" className="sticky top-0 z-40 bg-royal px-5 py-2 text-center font-display text-[15px] font-bold text-white">
          Preview of unpublished changes · visitors still see the published page
        </p>
      )}
      {page.template === "legal" ? <div className={legalPanel}>{blocks}</div> : blocks}
      {!page.preview && <JsonLd graph={page.seo.json_ld} />}
    </div>
  );
}
