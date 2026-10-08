// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { getSiteMenus } from "@/lib/site";
import { PrimaryNav } from "./PrimaryNav";

const { primary } = getSiteMenus();

afterEach(cleanup);

describe("PrimaryNav", () => {
  it.each([
    ["/", "Home"],
    ["/tms", "TMS"],
    ["/contact", "Contact"],
    ["/quiz", "Quiz"],
  ])("on %s only %s is the active pill", (pathname, active) => {
    render(<PrimaryNav items={primary} pathname={pathname} />);

    for (const item of primary) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link.getAttribute("aria-current")).toBe(item.label === active ? "page" : null);
    }
  });

  it("marks nothing current while the pathname is unknown", () => {
    render(<PrimaryNav items={primary} />);

    expect(screen.queryAllByRole("link").filter((link) => link.hasAttribute("aria-current"))).toHaveLength(0);
  });
});
