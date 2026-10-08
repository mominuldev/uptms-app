import { afterEach, describe, expect, it } from "vitest";
import type { Seo } from "./content";
import { jsonLd, toMetadata } from "./seo";

const seo: Seo = {
  title: "Deep TMS Therapy in University Place, WA | UPTMS",
  description: "When depression won’t lift…",
  canonical: "https://uptms.com/",
  robots: { index: true, follow: true, max_image_preview: "large", max_snippet: null },
  open_graph: { type: "website", title: "Deep TMS", description: "d", url: "https://uptms.com/", site_name: "UPTMS", image: { url: "https://cdn/x.jpg", width: 1200, height: 630, alt: "x" }, published_time: null, modified_time: null },
  twitter: { card: "summary_large_image", site: "@uptms" },
  json_ld: [],
};

afterEach(() => {
  delete process.env.ALLOW_INDEXING;
});

describe("toMetadata", () => {
  it("keeps everything out of search until launch", () => {
    const meta = toMetadata(seo);
    expect(meta.robots).toMatchObject({ index: false, follow: false });
    expect(meta.title).toEqual({ absolute: seo.title });
    expect(meta.alternates?.canonical).toBe("https://uptms.com/");
  });

  it("follows the page's own settings once indexing is allowed, never for previews", () => {
    process.env.ALLOW_INDEXING = "true";
    expect(toMetadata(seo).robots).toMatchObject({ index: true, follow: true });
    expect(toMetadata({ ...seo, robots: { ...seo.robots, index: false } }).robots).toMatchObject({ index: false });
    expect(toMetadata(seo, { preview: true }).robots).toMatchObject({ index: false });
  });
});

describe("jsonLd", () => {
  it("cannot be broken out of with a closing script tag", () => {
    const out = jsonLd([{ "@type": "Thing", name: "</script><script>alert(1)</script>" }]);
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out)["@graph"][0].name).toBe("</script><script>alert(1)</script>");
  });
});
