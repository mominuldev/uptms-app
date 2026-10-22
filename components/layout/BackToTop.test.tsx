// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BackToTop } from "./BackToTop";

/** jsdom has no layout, so the scroll position is set by hand. */
function scrollTo(y: number) {
  act(() => {
    window.scrollY = y;
    window.dispatchEvent(new Event("scroll"));
  });
}

const noMatchMedia = window.matchMedia;

afterEach(() => {
  cleanup();
  window.scrollY = 0;
  window.matchMedia = noMatchMedia;
  vi.restoreAllMocks();
});

describe("BackToTop", () => {
  it("stays out of the tab order until a viewport has scrolled past", () => {
    render(<BackToTop />);

    const button = screen.getByLabelText("Back to top", { selector: "button" });
    expect(button.getAttribute("aria-hidden")).toBe("true");
    expect(button.tabIndex).toBe(-1);

    scrollTo(window.innerHeight + 1);

    expect(button.getAttribute("aria-hidden")).toBe("false");
    expect(button.tabIndex).toBe(0);

    scrollTo(0);

    expect(button.getAttribute("aria-hidden")).toBe("true");
  });

  it("scrolls smoothly to the top, or jumps under reduced motion", async () => {
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<BackToTop />);
    scrollTo(window.innerHeight + 1);

    const button = screen.getByRole("button", { name: "Back to top" });
    await userEvent.click(button);

    expect(scroll).toHaveBeenLastCalledWith({ top: 0, behavior: "smooth" });

    // jsdom ships no matchMedia, so reduced motion is stubbed in.
    window.matchMedia = vi.fn(() => ({ matches: true }) as MediaQueryList);
    await userEvent.click(button);

    expect(scroll).toHaveBeenLastCalledWith({ top: 0, behavior: "auto" });
  });
});
