import { afterEach, describe, expect, it } from "vitest";
import type { Seo } from "./content";
import { jsonLd, robotsTxt, toMetadata, toSitemap } from "./seo";

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

describe("toSitemap", () => {
  it("makes paths absolute and keeps dates, priority and images", () => {
    const rows = toSitemap(
      [
        { path: "/", type: "page", lastmod: "2026-10-01T10:00:00+00:00", priority: 1, images: [{ url: "https://cdn/hero.webp", alt: "Hero" }] },
        { path: "/conditions/ocd", type: "condition", lastmod: null, priority: 0.8, images: [] },
      ],
      "https://uptms.com",
    );

    expect(rows).toEqual([
      { url: "https://uptms.com/", lastModified: "2026-10-01T10:00:00+00:00", priority: 1, images: ["https://cdn/hero.webp"] },
      { url: "https://uptms.com/conditions/ocd", lastModified: undefined, priority: 0.8, images: undefined },
    ]);
  });
});

describe("robotsTxt", () => {
  it("disallows everything before launch", () => {
    expect(robotsTxt(null, "https://uptms.com")).toBe("User-agent: *\nDisallow: /\n");
  });

  it("serves the admin's text and adds the sitemap when it is missing", () => {
    expect(robotsTxt("User-agent: *\r\nDisallow: /admin\r\n\r\n", "https://uptms.com")).toBe("User-agent: *\nDisallow: /admin\n\nSitemap: https://uptms.com/sitemap.xml\n");
  });

  it("leaves a Sitemap line staff wrote themselves alone", () => {
    const text = "User-agent: *\nAllow: /\nsitemap: https://uptms.com/custom.xml";
    expect(robotsTxt(text, "https://uptms.com")).toBe(`${text}\n`);
  });
});
