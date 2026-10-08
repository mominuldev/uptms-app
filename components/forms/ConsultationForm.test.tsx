// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConsultationForm, type ConsultationFormSource } from "./ConsultationForm";

const submit = vi.hoisted(() => vi.fn());
vi.mock("@/lib/consultation", () => ({ submitConsultation: submit }));

const form: ConsultationFormSource = {
  accepting: true,
  topics: [
    { value: "tms_depression", label: "TMS for depression" },
    { value: "provider_referral", label: "Provider referral" },
  ],
  best_times: [{ value: "mornings", label: "Weekday mornings" }],
};

const phone = { display: "253-234-4199", href: "tel:+12532344199" };

function setup(source: ConsultationFormSource | null = form) {
  const user = userEvent.setup();
  render(<ConsultationForm title="Request a phone consultation" notice="" help="" submitLabel="Send" successBody="We will call you." phone={phone} form={source} />);

  return user;
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name *"), "Sam Lee");
  await user.type(screen.getByLabelText("Phone *"), "(253) 555-0142");
  await user.selectOptions(screen.getByLabelText("How can we help? *"), "tms_depression");
}

afterEach(() => {
  cleanup();
  submit.mockReset();
});

describe("ConsultationForm", () => {
  it("checks required fields before sending anything", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByText("Enter your name so the team knows who to ask for.")).toBeTruthy();
    expect(screen.getByText("Choose what you would like to talk about.")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText("Name *"));
    expect(submit).not.toHaveBeenCalled();
  });

  it("asks for the referring provider only for referrals", async () => {
    const user = setup();
    expect(screen.queryByLabelText("Referring provider (optional)")).toBeNull();
    await user.selectOptions(screen.getByLabelText("How can we help? *"), "provider_referral");
    expect(screen.getByLabelText("Referring provider (optional)")).toBeTruthy();
  });

  it("sends, clears the fields and shows the reference", async () => {
    submit.mockResolvedValue({ status: "sent", reference: "CR-2026-0042" });
    const user = setup();
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Thank you — your request is in.")).toBeTruthy();
    expect(screen.getByText("CR-2026-0042")).toBeTruthy();
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ name: "Sam Lee", topic: "tms_depression", website: "", referred_by: "" }));

    await user.click(screen.getByRole("button", { name: "Send another request" }));
    expect((screen.getByLabelText("Name *") as HTMLInputElement).value).toBe("");
  });

  it("shows Laravel's field errors and the rate-limit and failure states", async () => {
    const user = setup();
    await fillValid(user);

    submit.mockResolvedValueOnce({ status: "invalid", errors: { phone: "Enter a 10-digit U.S. phone number, e.g. (253) 555-0142." } });
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByText("Enter a 10-digit U.S. phone number, e.g. (253) 555-0142.")).toBeTruthy();

    submit.mockResolvedValueOnce({ status: "rate-limited", retryAfter: 42 });
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByText("Too many requests from this connection.")).toBeTruthy();
    expect(screen.getByText(/Please wait 42 seconds/)).toBeTruthy();

    submit.mockResolvedValueOnce({ status: "failed", requestId: "01REQ" });
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(await screen.findByText("Your request didn’t go through.")).toBeTruthy();
    expect(screen.getByText(/01REQ/)).toBeTruthy();
  });

  it("falls back to the phone number when online requests are off", () => {
    setup(null);
    expect(screen.queryByRole("button", { name: "Send" })).toBeNull();
    expect(screen.getByRole("link", { name: "253-234-4199" }).getAttribute("href")).toBe("tel:+12532344199");
  });
});
