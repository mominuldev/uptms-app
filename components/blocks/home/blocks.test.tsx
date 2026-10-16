// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ApiSettings, TeamMember } from "@/lib/content";
import { settings } from "@/test/site-fixtures";
import type { BlockContext, FaqData, HeroData } from "../types";
import { FaqBlock } from "./Faq";
import { HeroBlock } from "./Hero";

vi.mock("@/lib/consultation", () => ({ submitConsultation: vi.fn() }));

afterEach(cleanup);

const ctx: BlockContext = { settings, api: { legal: { insurance: "", testimonials: "" } } as unknown as ApiSettings, path: "/", isFirst: true };
const link = (label: string, href: string) => ({ label, href });

const hero: HeroData = {
  eyebrow: "Deep TMS therapy in University Place, WA",
  headline: "When depression won’t lift, *explore a new way forward.*",
  subheading: "",
  body: "",
  primary: link("Call {phone}", "tel:clinic"),
  primary_opens_form: false,
  form_title: "",
  note: "",
  aside: "image",
  image: { id: 1, url: "/x.jpg", width: 800, height: 438, alt: "Clinician preparing a patient", focal: { x: 50, y: 50 }, sources: {} },
  card_eyebrow: "",
  card_title: "Care starts with understanding you.",
  card_body: "",
  show_founder: true,
  team_eyebrow: "",
  team_title: "",
  team_link: link("", ""),
  show_trust_points: true,
};

const founder = { id: 1, name: "Ayub Mwaura", credentials: "MSN, PMHNP-BC", role_title: "Founder & psychiatric nurse practitioner", initials: "AM", photo: null } as TeamMember;

describe("HeroBlock", () => {
  it("renders the h1 with its accent, resolved phone button, founder chip and trust strip", () => {
    render(
      <HeroBlock
        data={hero}
        sources={{ founder: [founder], trust_points: [{ id: 1, title: "BrainsWay Deep TMS", body: null, icon: null, link_label: null, link_url: null }] }}
        number={null}
        anchor={null}
        ctx={ctx}
      />,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.querySelector("em")?.textContent).toBe("explore a new way forward.");
    expect(screen.getByRole("link", { name: "Call 253-234-4199" }).getAttribute("href")).toBe("tel:+12532344199");
    expect(screen.getByText("Ayub Mwaura, MSN, PMHNP-BC")).toBeTruthy();
    expect(screen.getByRole("list", { name: "Why people choose us" }).textContent).toContain("BrainsWay Deep TMS");
    expect(screen.getByRole("img", { name: "Clinician preparing a patient" })).toBeTruthy();
  });

  it("is an h2 when it isn't the first block, and drops an empty button", () => {
    render(<HeroBlock data={{ ...hero, primary: link("", "") }} sources={{}} number={null} anchor={null} ctx={{ ...ctx, isFirst: false }} />);

    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Call/ })).toBeNull();
  });

  const form = {
    accepting: true,
    topics: [],
    best_times: [],
    prior_treatments: [{ value: "both", label: "Yes, both therapy and antidepressants" }],
    contact_methods: [{ value: "phone", label: "Phone call" }],
  };
  const qualify = { ...hero, primary: link("Find Out If You Qualify", "/contact#consultation-form"), primary_opens_form: true, form_title: "Find out if you qualify for TMS" };

  it("opens the qualification form in a popup from its button", async () => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    });
    const user = userEvent.setup();
    render(<HeroBlock data={qualify} sources={{ form, insurers: [{ id: 1, name: "Premera Blue Cross", logo: null, url: null }] }} number={null} anchor={null} ctx={ctx} />);

    expect(screen.queryByLabelText("First Name *")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Find Out If You Qualify" }));

    expect(screen.getByRole("dialog", { name: "Find out if you qualify for TMS" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Premera Blue Cross" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit Inquiry" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("falls back to the button's link when online requests are off", () => {
    render(<HeroBlock data={qualify} sources={{ form: null }} number={null} anchor={null} ctx={ctx} />);

    expect(screen.getByRole("link", { name: "Find Out If You Qualify" }).getAttribute("href")).toBe("/contact#consultation-form");
  });
});

describe("FaqBlock", () => {
  const data: FaqData = {
    rail: "Good questions deserve clear answers",
    anchor: "faq",
    headline: "Before you book.",
    intro: "",
    primary: link("Ask Us · {phone}", "tel:clinic"),
    group: "home",
    aside_title: "",
    aside_body: "",
    aside_link: link("", ""),
    footnote: "Background:",
    footnote_links: [link("NIMH depression", "https://www.nimh.nih.gov/a"), link("NIMH OCD", "https://www.nimh.nih.gov/b")],
  };

  it("opens the first answer, renders answer links and the rail number", () => {
    const { container } = render(
      <FaqBlock
        data={data}
        sources={{ faqs: [{ id: 1, group: "home", question: "What is TMS therapy?", answer: "Pulses. [Read our guide.](/tms)", in_schema: true }, { id: 2, group: "home", question: "Is it free?", answer: "Yes.", in_schema: true }] }}
        number="09"
        anchor="faq"
        ctx={ctx}
      />,
    );

    const details = container.querySelectorAll("details");
    expect(details[0]?.open).toBe(true);
    expect(details[1]?.open).toBe(false);
    expect(screen.getByRole("link", { name: "Read our guide." }).getAttribute("href")).toBe("/tms");
    expect(screen.getByText("09")).toBeTruthy();
    expect(container.textContent).toContain("Background: NIMH depression · NIMH OCD.");
  });
});
