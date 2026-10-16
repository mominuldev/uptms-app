"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActivePath } from "@/lib/navigation";
import type { NavItem } from "@/lib/site";

/**
 * Desktop pill navigation (Figma "Site header", Page=Home/TMS/Contact/Quiz).
 * A client island only because the active pill follows the current URL.
 */
export function PrimaryNav({ items, pathname }: { items: NavItem[]; pathname?: string | null }) {
  return (
    <ul className="flex items-center gap-1 rounded-full border border-line p-1.5">
      {items.map((item, index) => {
        const current = isActivePath(pathname, item.href);

        return (
          <li key={`${item.href}-${index}`}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={`block rounded-full px-5 py-2.5 font-display text-base leading-[1.2] font-semibold whitespace-nowrap transition-colors ${
                current ? "bg-navy text-white" : "text-ink hover:bg-sky-soft"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ActivePrimaryNav({ items }: { items: NavItem[] }) {
  return <PrimaryNav items={items} pathname={usePathname()} />;
}
