// @vitest-environment jsdom
import type { ReactNode } from "react";
import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TagManager } from "./TagManager";

const navigation = { pathname: "/tms" };

vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));
// next/script needs the Next.js runtime; its inline form is just this script tag.
vi.mock("next/script", () => ({
  default: ({ id, children }: { id?: string; children?: ReactNode }) => <script id={id}>{children}</script>,
}));

const container = { id: "GTM-M4Q7S9NS", exclude_paths: ["/contact", "/quiz"] };
const assign = vi.fn();

beforeEach(() => {
  navigation.pathname = "/tms";
  assign.mockClear();
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, origin: "https://uptms.com", href: "https://uptms.com/tms", assign },
  });
});

afterEach(cleanup);

/**
 * Clicks a link rendered beside the container, the way the header's CTA would
 * be, and reports whether the guard took the navigation over. The listener runs
 * after the guard's (capture phase) and then stops the click, so jsdom doesn't
 * warn about navigating for the ones the guard leaves to the router.
 */
function clickLink(href: string, attributes: Record<string, string> = {}): boolean {
  const anchor = document.createElement("a");
  anchor.href = href;
  for (const [name, value] of Object.entries(attributes)) anchor.setAttribute(name, value);
  document.body.append(anchor);

  let prevented = false;
  const stop = (event: Event) => {
    prevented = event.defaultPrevented;
    event.preventDefault();
  };

  document.addEventListener("click", stop);
  anchor.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
  document.removeEventListener("click", stop);

  return prevented;
}

describe("TagManager", () => {
  it("loads nothing while analytics are off", () => {
    const { container: html } = render(<TagManager container={null} />);

    expect(html.innerHTML).toBe("");
  });

  it("loads the container with the clinic's id", () => {
    const { container: html } = render(<TagManager container={container} />);

    const script = document.getElementById("google-tag-manager");
    expect(script?.textContent).toContain("googletagmanager.com/gtm.js?id=");
    expect(script?.textContent).toContain("GTM-M4Q7S9NS");
    expect(html.innerHTML).toContain("<noscript>");
  });

  // The <noscript> fallback only survives in server-rendered markup: jsdom drops
  // the children of a noscript it renders in the browser.
  it("gives browsers without JavaScript the container iframe", () => {
    const html = renderToStaticMarkup(<TagManager container={container} />);

    expect(html).toContain("googletagmanager.com/ns.html?id=GTM-M4Q7S9NS");
    expect(renderToStaticMarkup(<TagManager container={null} />)).toBe("");
  });

  it.each(["/contact", "/quiz", "/contact/thanks"])("loads nothing on %s", (pathname) => {
    navigation.pathname = pathname;
    const { container: html } = render(<TagManager container={container} />);

    expect(html.innerHTML).toBe("");
    expect(document.getElementById("google-tag-manager")).toBeNull();
  });

  it("refuses an id the API should never have sent", () => {
    const { container: html } = render(<TagManager container={{ ...container, id: "GTM-1');alert(1);//" }} />);

    expect(html.innerHTML).toBe("");
  });

  it("reloads the document instead of carrying the container onto an excluded page", () => {
    render(<TagManager container={container} />);

    expect(clickLink("https://uptms.com/contact")).toBe(true);
    expect(assign).toHaveBeenCalledWith("https://uptms.com/contact");
  });

  it.each([
    ["an ordinary page", "https://uptms.com/tms", {}],
    ["another site", "https://example.com/contact", {}],
    ["a phone link", "tel:+12532344199", {}],
    ["a new tab", "https://uptms.com/contact", { target: "_blank" }],
  ])("leaves %s to the router", (_label, href, attributes) => {
    render(<TagManager container={container} />);

    expect(clickLink(href, attributes)).toBe(false);
    expect(assign).not.toHaveBeenCalled();
  });

  it("adds no click guard while the container is off", () => {
    render(<TagManager container={null} />);
    clickLink("https://uptms.com/contact");

    expect(assign).not.toHaveBeenCalled();
  });
});
