import type { ButtonVariant } from "@/components/ui/Button";
import type { InsurancePartner } from "@/lib/content";
import type { SiteSettings } from "@/lib/site";
import { fillTokens } from "@/lib/tokens";
import type { ConsultationFormSource } from "./formSource";
import { QualifyDialog } from "./QualifyDialog";

/**
 * A block button that opens the qualification popup (Home hero, "Let's talk
 * about your options"): the same form, title and wording wherever a block
 * asks for it. The caller decides whether the inbox takes requests
 * (`acceptsRequests`) and falls back to the plain link button when it does not.
 */
export function QualifyButton({
  label,
  title,
  form,
  insurers,
  tokens,
  variant = "light",
  className = "",
}: {
  label: string;
  title: string;
  form: ConsultationFormSource;
  insurers: InsurancePartner[];
  tokens: SiteSettings;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <QualifyDialog
      label={fillTokens(label, tokens)}
      variant={variant}
      className={className}
      title={title || "Find out if you qualify for TMS"}
      notice=""
      help=""
      submitLabel="Submit Inquiry"
      successBody={fillTokens("The team will reach out within one business day during office hours. If you need help sooner, call {phone}.", tokens)}
      phone={tokens.phone}
      form={form}
      insurers={insurers.map((insurer) => insurer.name)}
    />
  );
}
