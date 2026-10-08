// @vitest-environment jsdom
import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSiteMenus, getSiteSettings } from "@/lib/site";
import { SiteMenu } from "./SiteMenu";

const navigation = vi.hoisted(() => ({ pathname: "/tms" }));

vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));
// next/image needs the Next bundler for static imports; the logo is irrelevant here.
vi.mock("./Logo", () => ({ Logo: () => <a href="/home-placeholder">UPTMS home</a> }));

const settings = getSiteSettings();
const menus = getSiteMenus();

function setup() {
  const user = userEvent.setup();
  const view = render(<SiteMenu settings={settings} menus={menus} />);
  const toggle = screen.getByRole("button", { name: "Menu" });
  const dialog = document.getElementById(toggle.getAttribute("aria-controls") ?? "") as HTMLElement;

  return { user, view, toggle, dialog };
}

beforeEach(() => {
  navigation.pathname = "/tms";
});

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("SiteMenu", () => {
  it("starts closed, with the toggle pointing at the hidden dialog", () => {
    const { toggle, dialog } = setup();

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute("role")).toBe("dialog");
    expect(dialog.hidden).toBe(true);
  });

  it("opens as a modal, focuses the close button and locks page scroll", async () => {
    const { user, toggle, dialog } = setup();

    await user.click(toggle);

    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(dialog.hidden).toBe(false);
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(document.activeElement).toBe(within(dialog).getByRole("button", { name: "Close menu" }));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closes on Escape, returns focus to the toggle and unlocks scroll", async () => {
    const { user, toggle, dialog } = setup();

    await user.click(toggle);
    await user.keyboard("{Escape}");

    expect(dialog.hidden).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
    expect(document.body.style.overflow).toBe("");
  });

  it("closes from the close button and returns focus to the toggle", async () => {
    const { user, toggle, dialog } = setup();

    await user.click(toggle);
    await user.click(within(dialog).getByRole("button", { name: "Close menu" }));

    expect(dialog.hidden).toBe(true);
    expect(document.activeElement).toBe(toggle);
  });

  it("traps Tab and Shift+Tab inside the dialog", async () => {
    const { user, toggle, dialog } = setup();

    await user.click(toggle);

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;

    last.focus();
    await user.tab();
    expect(document.activeElement).toBe(first);

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("marks only the current page's link with aria-current", async () => {
    const { user, toggle, dialog } = setup();

    await user.click(toggle);
    const nav = within(dialog).getByRole("navigation", { name: "Menu" });

    expect(within(nav).getByRole("link", { name: "TMS" }).getAttribute("aria-current")).toBe("page");
    for (const name of ["Home", "Contact", "Quiz"]) {
      expect(within(nav).getByRole("link", { name }).getAttribute("aria-current")).toBeNull();
    }
  });

  it("closes when a link is followed and when the route changes", async () => {
    const { user, toggle, dialog, view } = setup();

    await user.click(toggle);
    const link = within(dialog).getByRole("link", { name: "Contact" });
    link.addEventListener("click", (event) => event.preventDefault());
    await user.click(link);
    expect(dialog.hidden).toBe(true);

    await user.click(toggle);
    expect(dialog.hidden).toBe(false);

    navigation.pathname = "/quiz";
    act(() => view.rerender(<SiteMenu settings={settings} menus={menus} />));
    expect(dialog.hidden).toBe(true);
    expect(document.body.style.overflow).toBe("");
  });
});
