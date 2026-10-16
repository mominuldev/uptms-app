// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { quizFixture } from "@/test/quiz-fixture";
import { QuizWizard } from "./QuizWizard";

const submit = vi.hoisted(() => vi.fn());
const feedback = vi.hoisted(() => vi.fn());
vi.mock("@/lib/quiz", () => ({ submitQuiz: submit, sendQuizFeedback: feedback }));

const phone = { display: "253-234-4199", href: "tel:+12532344199" };
const depression = {
  key: "depression",
  label: "Depression",
  instrument: "PHQ-9",
  title: "Results of your depression check",
  score: 9,
  max: 27,
  band: { title: "Mild depression", body: "Speak in depth with your physician.", min: 5, max: 9 },
  bands: [
    { min: 0, max: 4, title: "Minimal depression" },
    { min: 5, max: 9, title: "Mild depression" },
    { min: 10, max: 27, title: "More" },
  ],
};

function setup() {
  const user = userEvent.setup();
  render(<QuizWizard quiz={quizFixture} phone={phone} donePrimary={{ label: "Learn about Deep TMS", href: "/tms" }} doneSecondary={null} />);

  return user;
}

const heading = () => screen.getAllByRole("heading")[0]!.textContent ?? "";
const next = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole("button", { name: /^(Next|See (my )?results|Finish)/ }));

/** Picks a choice and moves on at once (the auto-advance timer is cancelled by Next). */
async function pick(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.click(screen.getByLabelText(label));
  await next(user);
}

async function throughContact(user: ReturnType<typeof userEvent.setup>, phq9 = "Several days") {
  await user.click(screen.getByRole("button", { name: /Start/ }));
  await user.type(screen.getByLabelText("First name"), "Sam");
  await user.type(screen.getByLabelText("Last name"), "Lee");
  await next(user);
  await next(user); // concerns are optional
  await pick(user, "Depression check");
  for (let i = 0; i < 8; i++) await pick(user, "Several days");
  await pick(user, phq9);
  await pick(user, "Somewhat difficult");
  await pick(user, "Sleep issues");
  await pick(user, "Recently, 0–2 weeks");
  await pick(user, "No");
  await next(user); // life events are optional
  await user.type(screen.getByRole("textbox"), "sam@example.com");
  await next(user);
  await user.type(screen.getByRole("textbox"), "(253) 555-0142");
}

afterEach(() => {
  cleanup();
  submit.mockReset();
  feedback.mockReset();
});

describe("QuizWizard", () => {
  it("asks for required answers before moving on", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await next(user);

    expect(screen.getByText("Enter your first name so the team knows who to ask for.")).toBeTruthy();
    expect(heading()).toContain("First, please tell us your name.");
  });

  it("sends the submission, shows Laravel's score, then sends feedback", async () => {
    submit.mockResolvedValue({ status: "sent", reference: "CR-2026-0001", feedbackToken: "token", scales: [depression], crisis: false });
    feedback.mockResolvedValue({ status: "sent" });
    const user = setup();
    await throughContact(user, "Not at all");
    await next(user);

    await waitFor(() => expect(heading()).toContain("Results of your depression check"));
    const sent = submit.mock.calls[0]![0];
    expect(sent.answers).toMatchObject({ name: { first: "Sam", last: "Lee" }, test: "depression", "phq-1": "several-days", "tried-treatment": "no", phone: "(253) 555-0142" });
    expect(sent.answers).not.toHaveProperty("gad-1");
    expect(sent.answers).not.toHaveProperty("helpful");
    expect(screen.getByText("Mild depression")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Score 9 out of 27: Mild depression." })).toBeTruthy();
    // The answers are with the clinic: the card before the results is closed.
    expect(screen.queryByRole("button", { name: /Previous|Back/ })).toBeNull();

    await next(user);
    await pick(user, "Yes");
    await user.type(screen.getByRole("textbox"), "Shorter please");
    await next(user);

    await waitFor(() => expect(heading()).toContain("Thank you. The clinic will be in touch."));
    expect(feedback).toHaveBeenCalledWith({ feedback_token: "token", answers: { helpful: "yes", improve: "Shorter please" } });
    expect(screen.getByText("CR-2026-0001")).toBeTruthy();
  });

  it("shows crisis help as soon as a crisis answer is picked", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: /Start/ }));
    await user.type(screen.getByLabelText("First name"), "Sam");
    await user.type(screen.getByLabelText("Last name"), "Lee");
    await next(user);
    await next(user);
    await pick(user, "Depression check");
    for (let i = 0; i < 8; i++) await pick(user, "Not at all");
    await user.click(screen.getByLabelText("Several days"));

    expect(screen.getByRole("alert").textContent).toContain("help is available right now");
    expect(screen.getByRole("link", { name: "Call 988" }).getAttribute("href")).toBe("tel:988");
  });

  it("takes the visitor back to the step Laravel refused", async () => {
    submit.mockResolvedValue({ status: "invalid", errors: { email: "Enter a valid email address, e.g. you@example.com." } });
    const user = setup();
    await throughContact(user);
    await next(user);

    await waitFor(() => expect(heading()).toContain("What's the best email to reach you?"));
    expect(screen.getByText("Enter a valid email address, e.g. you@example.com.")).toBeTruthy();
  });

  it("keeps the visitor on the card when sending fails", async () => {
    submit.mockResolvedValue({ status: "failed", requestId: "req-1" });
    const user = setup();
    await throughContact(user);
    await next(user);

    await waitFor(() => expect(screen.getByText("Your answers didn’t go through.")).toBeTruthy());
    expect(screen.getByText(/req-1/)).toBeTruthy();
    expect(heading()).toContain("Let's talk about what your results mean.");
  });
});
