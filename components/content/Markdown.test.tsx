// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Markdown, parseInline } from "./Markdown";

describe("Markdown", () => {
  it("splits paragraphs and renders bold, italic and safe links", () => {
    render(<Markdown text={"**Experiencing both?** Tell the *clinician*.\n\n[Read the guide](/tms)"} />);

    expect(screen.getByText("Experiencing both?").tagName).toBe("STRONG");
    expect(screen.getByText("clinician").tagName).toBe("EM");
    expect(screen.getByRole("link", { name: "Read the guide" })).toHaveProperty("pathname", "/tms");
  });

  it("never renders unsafe links or raw HTML", () => {
    const { container } = render(<Markdown text={'[click](javascript:alert(1)) <img src=x onerror="x">'} />);

    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("<img");
  });

  it("parses nested emphasis inside links", () => {
    expect(parseInline("[**bold** link](https://example.com)")[0]).toMatchObject({ kind: "link", href: "https://example.com" });
  });
});
