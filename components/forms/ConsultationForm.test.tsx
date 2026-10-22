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
    { value: "insurance", label: "Insurance & coverage" },
  ],
  best_times: [{ value: "mornings", label: "Weekday mornings" }],
  prior_treatments: [
    { value: "both", label: "Yes, both therapy and antidepressants" },
    { value: "neither", label: "Neither yet" },
  ],
  contact_methods: [
    { value: "phone", label: "Phone call" },
    { value: "text", label: "Text message" },
  ],
};

const phone = { display: "253-234-4199", href: "tel:+12532344199" };

function setup(source: ConsultationFormSource | null = form) {
  const user = userEvent.setup();
  render(<ConsultationForm title="Find out if you qualify for TMS" notice="" help="" submitLabel="Send" successBody="We will call you." phone={phone} form={source} insurers={["Premera Blue Cross", "Molina Healthcare"]} />);

  return user;
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("First Name *"), "Sam");
  await user.type(screen.getByLabelText("Last Name *"), "Lee");
  await user.type(screen.getByLabelText("Phone *"), "(253) 555-0142");
  await user.type(screen.getByLabelText("Email *"), "sam@example.com");
  await user.selectOptions(screen.getByLabelText("Insurance Name *"), "Premera Blue Cross");
  await user.selectOptions(screen.getByLabelText("Have you tried therapy and antidepressants? *"), "both");
  await user.selectOptions(screen.getByLabelText("Preferred method of communication *"), "text");
}

afterEach(() => {
  cleanup();
  submit.mockReset();
  window.history.replaceState(null, "", "/");
});

describe("ConsultationForm", () => {
  it("checks required fields before sending anything", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByText("Enter your first name so the team knows who to ask for.")).toBeTruthy();
    expect(screen.getByText("Enter an email address the clinic can reply to.")).toBeTruthy();
    expect(screen.getByText("Choose how you would like the clinic to reach you.")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText("First Name *"));
    expect(submit).not.toHaveBeenCalled();
  });

  it("offers the insurance partners plus Other and No insurance", () => {
    setup();
    const options = Array.from((screen.getByLabelText("Insurance Name *") as HTMLSelectElement).options).map((option) => option.textContent);
    expect(options).toEqual(["Please select…", "Premera Blue Cross", "Molina Healthcare", "Other", "No insurance"]);
  });

  it("sends, clears the fields and shows the reference", async () => {
    window.history.replaceState(null, "", "/contact?topic=insurance");
    submit.mockResolvedValue({ status: "sent", reference: "CR-2026-0042" });
    const user = setup();
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Thank you — your request is in.")).toBeTruthy();
    expect(screen.getByText("CR-2026-0042")).toBeTruthy();
    expect(screen.getByText("A confirmation with this reference is on its way to your email.")).toBeTruthy();
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ first_name: "Sam", last_name: "Lee", email: "sam@example.com", insurance: "Premera Blue Cross", prior_treatment: "both", contact_method: "text", topic: "insurance", website: "" }),
    );

    await user.click(screen.getByRole("button", { name: "Send another request" }));
    expect((screen.getByLabelText("First Name *") as HTMLInputElement).value).toBe("");
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
