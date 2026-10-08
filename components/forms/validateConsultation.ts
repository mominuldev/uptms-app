/**
 * Instant checks for the consultation form. Laravel validates again and its
 * messages (same wording) win; these only save a round trip.
 */
export interface ConsultationValues {
  name: string;
  phone: string;
  email: string;
  topic: string;
  best_time: string;
  referred_by: string;
  question: string;
}

export type ConsultationErrors = Partial<Record<keyof ConsultationValues | "turnstile_token", string>>;

export function validateConsultation(values: ConsultationValues): ConsultationErrors {
  const errors: ConsultationErrors = {};
  const digits = values.phone.replace(/\D/g, "");

  if (values.name.trim() === "") errors.name = "Enter your name so the team knows who to ask for.";
  else if (values.name.trim().length > 120) errors.name = "Keep your name under 120 characters.";
  if (values.phone.trim() === "") errors.phone = "Enter a phone number the clinic can call.";
  else if (digits.length < 10 || digits.length > 11 || (digits.length === 11 && !digits.startsWith("1")) || !/^[0-9 ()+.\-]+$/.test(values.phone.trim())) errors.phone = "Enter a 10-digit U.S. phone number, e.g. (253) 555-0142.";
  if (values.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address, or leave it empty.";
  if (values.topic === "") errors.topic = "Choose what you would like to talk about.";
  if (values.referred_by.length > 160) errors.referred_by = "Keep the referring provider under 160 characters.";
  if (values.question.length > 1000) errors.question = "Keep your question under 1,000 characters.";

  return errors;
}
