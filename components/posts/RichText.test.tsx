// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RichText, safeHref } from "./RichText";

describe("RichText", () => {
  it("renders headings, lists, quotes and safe links as elements", () => {
    render(
      <RichText
        doc={{
          content: [
            { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "During a session" }] },
            { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "No anesthesia" }] }] }] },
            { type: "paragraph", content: [{ type: "text", text: "Ask the clinic", marks: [{ type: "link", attrs: { href: "/contact" } }] }] },
            { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", text: "A quote" }] }] },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: "During a session" })).toBeTruthy();
    expect(screen.getByRole("listitem").textContent).toBe("No anesthesia");
    expect(screen.getByRole("link", { name: "Ask the clinic" }).getAttribute("href")).toBe("/contact");
  });

  it("drops unsafe links and unknown nodes", () => {
    const { container } = render(
      <RichText
        doc={{
          content: [
            { type: "paragraph", content: [{ type: "text", text: "Click", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] },
            { type: "script", content: [{ type: "text", text: "alert(1)" }] },
          ],
        }}
      />,
    );

    expect(container.querySelector("a")).toBeNull();
    expect(container.textContent).toBe("Click");
    expect(safeHref("//evil.example")).toBeNull();
    expect(safeHref("https://www.nimh.nih.gov")).toBe("https://www.nimh.nih.gov");
  });
});
