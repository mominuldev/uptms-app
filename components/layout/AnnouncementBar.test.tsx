// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { settings } from "@/test/site-fixtures";
import { AnnouncementBar } from "./AnnouncementBar";

afterEach(cleanup);

describe("AnnouncementBar", () => {
  it("renders nothing while the announcement is off", () => {
    const { container } = render(<AnnouncementBar settings={settings} />);

    expect(container.innerHTML).toBe("");
  });

  it("shows the message with its tokens filled", () => {
    render(
      <AnnouncementBar
        settings={{
          ...settings,
          announcement: { text: "Closed Friday. Call {phone}.", link: null },
        }}
      />
    );

    expect(
      screen.getByRole("complementary", { name: "Announcement" }).textContent
    ).toContain("Closed Friday. Call 253-234-4199.");
    expect(screen.queryByRole("link")).toBeNull();
  });

  it.each([
    ["/contact", "/contact", null],
    ["tel:clinic", "tel:+12532344199", null],
    ["https://uptms.com/news", "https://uptms.com/news", "_blank"],
  ])("links %s", (href, expected, target) => {
    render(
      <AnnouncementBar
        settings={{
          ...settings,
          announcement: {
            text: "Holiday hours",
            link: { label: "More", href },
          },
        }}
      />
    );

    const link = screen.getByRole("link", { name: "More →" });
    expect(link.getAttribute("href")).toBe(expected);
    expect(link.getAttribute("target")).toBe(target);
  });
});
