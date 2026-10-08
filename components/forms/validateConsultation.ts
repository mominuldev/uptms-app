/** Client-side checks for the consultation form. Laravel validates again in Phase 3. */
export interface ConsultationValues {
  name: string;
  phone: string;
  email: string;
  topic: string;
  question: string;
}

export type ConsultationErrors = Partial<Record<keyof ConsultationValues, string>>;

export function validateConsultation(values: ConsultationValues): ConsultationErrors {
  const errors: ConsultationErrors = {};
  const digits = values.phone.replace(/\D/g, "");

  if (values.name.trim() === "") errors.name = "Enter your name so the team knows who to ask for.";
  if (values.phone.trim() === "") errors.phone = "Enter a phone number the clinic can call.";
  else if (digits.length < 10 || digits.length > 11 || !/^[0-9 ()+.\-]+$/.test(values.phone.trim())) errors.phone = "Enter a 10-digit U.S. phone number, e.g. (253) 555-0142.";
  if (values.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address, or leave it empty.";
  if (values.question.length > 1000) errors.question = "Keep your question under 1,000 characters.";

  return errors;
}
