// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ApiSettings } from "@/lib/content";
import { settings } from "@/test/site-fixtures";
import type { BlockContext, LinkCardsData } from "../types";
import { LinkCards } from "./LinkCards";

vi.mock("@/lib/consultation", () => ({ submitConsultation: vi.fn() }));

afterEach(cleanup);

const ctx: BlockContext = { settings, api: { legal: { insurance: "", testimonials: "" } } as unknown as ApiSettings, path: "/quiz", isFirst: false };

/** The consultation inbox taking requests, as the API sends it to a block that opens the popup. */
const form = {
  accepting: true,
  topics: [],
  best_times: [],
  prior_treatments: [{ value: "both", label: "Yes, both therapy and antidepressants" }],
  contact_methods: [{ value: "phone", label: "Phone call" }],
};

describe("LinkCards", () => {
  const data: LinkCardsData = {
    rail: "Keep exploring",
    anchor: "keep-exploring",
    headline: "",
    cards: [
      { title: "Learn about treatment", body: "Understand what TMS involves.", link: { label: "Explore Deep TMS →", href: "/tms" }, opens_form: true },
      { title: "Understand insurance", body: "See the plans featured by the clinic.", link: { label: "Insurance & partners →", href: "/#insurance" } },
    ],
    form_title: "Find out if you qualify for TMS",
  };

  it("opens the qualification popup from the card that asks for it, and leaves the others as links", async () => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    });
    const user = userEvent.setup();
    render(<LinkCards data={data} sources={{ form, insurers: [{ id: 1, name: "Premera Blue Cross", logo: null, url: null }] }} number="02" anchor="keep-exploring" ctx={ctx} />);

    expect(screen.getByRole("link", { name: "Insurance & partners →" }).getAttribute("href")).toBe("/#insurance");
    await user.click(screen.getByRole("button", { name: "Explore Deep TMS" }));

    expect(screen.getByRole("dialog", { name: "Find out if you qualify for TMS" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Premera Blue Cross" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit Inquiry" })).toBeTruthy();
  });

  it("falls back to the card's link when online requests are off", () => {
    render(<LinkCards data={data} sources={{ form: null }} number="02" anchor="keep-exploring" ctx={ctx} />);

    expect(screen.getByRole("link", { name: "Explore Deep TMS →" }).getAttribute("href")).toBe("/tms");
  });
});
