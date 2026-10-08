import { describe, expect, it } from "vitest";
import { validateConsultation } from "./validateConsultation";

const base = { name: "Sam", phone: "(253) 555-0142", email: "", topic: "TMS for depression", question: "" };

describe("validateConsultation", () => {
  it("accepts a name and a U.S. phone number; email is optional", () => {
    expect(validateConsultation(base)).toEqual({});
  });

  it("requires name and phone and checks formats", () => {
    expect(Object.keys(validateConsultation({ ...base, name: " ", phone: "" }))).toEqual(["name", "phone"]);
    expect(validateConsultation({ ...base, phone: "12345" }).phone).toBeDefined();
    expect(validateConsultation({ ...base, email: "nope" }).email).toBeDefined();
  });
});
