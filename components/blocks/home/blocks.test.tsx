// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { ApiSettings, TeamMember } from "@/lib/content";
import { settings } from "@/test/site-fixtures";
import type { BlockContext, FaqData, HeroData } from "../types";
import { FaqBlock } from "./Faq";
import { HeroBlock } from "./Hero";

afterEach(cleanup);

const ctx: BlockContext = { settings, api: { legal: { insurance: "", testimonials: "" } } as unknown as ApiSettings, path: "/", isFirst: true };
const link = (label: string, href: string) => ({ label, href });

const hero: HeroData = {
  eyebrow: "Deep TMS therapy in University Place, WA",
  headline: "When depression won’t lift, *explore a new way forward.*",
  subheading: "",
  body: "",
  primary: link("Take the Free TMS Self-Check", "/quiz"),
  secondary: link("Call {phone}", "tel:clinic"),
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

  it("is an h2 when it isn't the first block, and drops empty buttons", () => {
    render(<HeroBlock data={{ ...hero, secondary: link("", "") }} sources={{}} number={null} anchor={null} ctx={{ ...ctx, isFirst: false }} />);

    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
    expect(screen.queryByRole("link", { name: /Call/ })).toBeNull();
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
