/**
 * Instant checks for the qualification form. Laravel validates again and its
 * messages (same wording) win; these only save a round trip.
 */
export interface ConsultationValues {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  insurance: string;
  prior_treatment: string;
  contact_method: string;
}

export type ConsultationErrors = Partial<Record<keyof ConsultationValues | "turnstile_token", string>>;

export function validateConsultation(values: ConsultationValues): ConsultationErrors {
  const errors: ConsultationErrors = {};
  const digits = values.phone.replace(/\D/g, "");

  if (values.first_name.trim() === "") errors.first_name = "Enter your first name so the team knows who to ask for.";
  else if (values.first_name.trim().length > 60) errors.first_name = "Keep your first name under 60 characters.";
  if (values.last_name.trim() === "") errors.last_name = "Enter your last name.";
  else if (values.last_name.trim().length > 60) errors.last_name = "Keep your last name under 60 characters.";
  if (values.phone.trim() === "") errors.phone = "Enter a phone number the clinic can call.";
  else if (digits.length < 10 || digits.length > 11 || (digits.length === 11 && !digits.startsWith("1")) || !/^[0-9 ()+.\-]+$/.test(values.phone.trim())) errors.phone = "Enter a 10-digit U.S. phone number, e.g. (253) 555-0142.";
  if (values.email.trim() === "") errors.email = "Enter an email address the clinic can reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address, e.g. you@example.com.";
  if (values.insurance === "") errors.insurance = "Choose your insurance, or “Other” or “No insurance”.";
  if (values.prior_treatment === "") errors.prior_treatment = "Tell us whether you have tried therapy or antidepressants.";
  if (values.contact_method === "") errors.contact_method = "Choose how you would like the clinic to reach you.";

  return errors;
}
