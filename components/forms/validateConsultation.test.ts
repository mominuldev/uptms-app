import { describe, expect, it } from "vitest";
import { validateConsultation } from "./validateConsultation";

const base = { first_name: "Sam", last_name: "Lee", phone: "(253) 555-0142", email: "sam@example.com", insurance: "Premera Blue Cross", prior_treatment: "both", contact_method: "phone" };

describe("validateConsultation", () => {
  it("accepts a complete answer", () => {
    expect(validateConsultation(base)).toEqual({});
    expect(validateConsultation({ ...base, phone: "+1 253 555 0142" })).toEqual({});
  });

  it("requires every field and checks formats", () => {
    const empty = { first_name: " ", last_name: "", phone: "", email: "", insurance: "", prior_treatment: "", contact_method: "" };
    expect(Object.keys(validateConsultation(empty))).toEqual(["first_name", "last_name", "phone", "email", "insurance", "prior_treatment", "contact_method"]);
    expect(validateConsultation({ ...base, phone: "12345" }).phone).toBeDefined();
    expect(validateConsultation({ ...base, phone: "2 253 555 0142" }).phone).toBeDefined();
    expect(validateConsultation({ ...base, email: "nope" }).email).toBe("Enter a valid email address, e.g. you@example.com.");
    expect(validateConsultation({ ...base, last_name: "a".repeat(61) }).last_name).toBe("Keep your last name under 60 characters.");
  });
});
