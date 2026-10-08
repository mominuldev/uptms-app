import { Suspense } from "react";
import { ApiStatus, ApiStatusPending } from "@/components/system/ApiStatus";

/**
 * Phase 0 placeholder: proves the tokens and fonts match the Figma hero
 * (Version C, node 26:70) and that the site reads the Laravel API. Phase 2
 * replaces this page with the full Home built from API content.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-3 sm:p-6">
      <section
        aria-labelledby="hero-title"
        className="flex flex-col gap-6 rounded-panel bg-navy px-6 py-14 text-white sm:px-12 lg:px-[72px] lg:py-20"
      >
        <p className="font-display text-eyebrow font-bold uppercase text-white/80">
          Deep TMS therapy in University Place, WA
        </p>
        <h1 id="hero-title" className="max-w-3xl font-serif text-[44px] leading-[1.05] tracking-[-0.02em] sm:text-display-l lg:text-display-xl">
          When depression won’t lift, <em className="text-sky">explore a new way forward.</em>
        </h1>
        <p className="max-w-2xl text-body-l">
          Medication hasn’t helped enough? You deserve a conversation about what comes next.
        </p>
      </section>

      <Suspense fallback={<ApiStatusPending />}>
        <ApiStatus />
      </Suspense>
    </main>
  );
}
