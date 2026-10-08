import Image from "next/image";
import Link from "next/link";
import logo from "@/public/uptms-logo.jpg";
import logoLight from "@/public/uptms-logo-light.png";

/**
 * Clinic logo exported from Figma ("IMG uptms-logo" on white headers,
 * "IMG uptms-logo-light" on the footer's white plate). Sizes per frame:
 * 196×56 desktop header, 168×48 tablet, 140×40 mobile, 186×53 footer.
 */
const sizes = {
  desktop: "h-14 w-[196px]",
  tablet: "h-12 w-[168px]",
  mobile: "h-10 w-[140px]",
  compact: "h-10 w-[140px] md:h-12 md:w-[168px]",
} as const;

export function Logo({
  size = "desktop",
  clinicName,
  eager = false,
}: {
  size?: keyof typeof sizes;
  clinicName: string;
  /** Above the fold: load eagerly instead of lazily. */
  eager?: boolean;
}) {
  return (
    <Link href="/" className={`block shrink-0 rounded-control ${sizes[size]}`}>
      <Image
        src={logo}
        alt={`${clinicName} — home`}
        loading={eager ? "eager" : "lazy"}
        sizes="196px"
        className="size-full object-contain"
      />
    </Link>
  );
}

export function FooterLogo({ clinicName, compact = false }: { clinicName: string; compact?: boolean }) {
  return (
    <span className="inline-flex rounded-control bg-white px-3 py-2">
      <Image
        src={logoLight}
        alt={clinicName}
        sizes="186px"
        className={`object-contain ${compact ? "h-12 w-[168px]" : "h-[53px] w-[186px]"}`}
      />
    </span>
  );
}
