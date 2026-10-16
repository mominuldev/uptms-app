/**
 * The qualification form's choices, from the consultation module's
 * `consultation-form` block source. Plain module so Server Components
 * (the hero) can decide whether to offer the form.
 */
export interface ConsultationFormSource {
  accepting: boolean;
  topics: { value: string; label: string }[];
  best_times: { value: string; label: string }[];
  prior_treatments: { value: string; label: string }[];
  contact_methods: { value: string; label: string }[];
}

/** Online requests are on and the API sends this form's choices (an older API does not). */
export function acceptsRequests(form: ConsultationFormSource | null | undefined): form is ConsultationFormSource {
  return Boolean(form?.accepting && form.prior_treatments?.length && form.contact_methods?.length);
}
