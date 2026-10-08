import { describe, expect, it } from "vitest";
import { validateConsultation } from "./validateConsultation";

const base = { name: "Sam", phone: "(253) 555-0142", email: "", topic: "tms_depression", best_time: "", referred_by: "", question: "" };

describe("validateConsultation", () => {
  it("accepts a name, a U.S. phone number and a topic; the rest is optional", () => {
    expect(validateConsultation(base)).toEqual({});
    expect(validateConsultation({ ...base, phone: "+1 253 555 0142" })).toEqual({});
  });

  it("requires name, phone and topic and checks formats", () => {
    expect(Object.keys(validateConsultation({ ...base, name: " ", phone: "", topic: "" }))).toEqual(["name", "phone", "topic"]);
    expect(validateConsultation({ ...base, phone: "12345" }).phone).toBeDefined();
    expect(validateConsultation({ ...base, phone: "2 253 555 0142" }).phone).toBeDefined();
    expect(validateConsultation({ ...base, email: "nope" }).email).toBeDefined();
    expect(validateConsultation({ ...base, question: "a".repeat(1001) }).question).toBe("Keep your question under 1,000 characters.");
  });
});
