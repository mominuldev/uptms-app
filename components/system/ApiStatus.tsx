import { ApiError, getData } from "@/lib/api";

interface Health {
  status: "ok";
  app: string;
  environment: string;
  database: "ok";
  server_time: string;
}

/**
 * Reads /api/v1/health on every request. It is uncached on purpose, so it is
 * streamed inside <Suspense> (Cache Components). Removed in Phase 2.
 */
export async function ApiStatus() {
  const result = await getData<Health>("health").then(
    (health) => ({ ok: true as const, health }),
    (error: unknown) => ({ ok: false as const, error }),
  );

  if (!result.ok) {
    const { error } = result;
    const detail = error instanceof ApiError ? `${error.code}${error.requestId ? ` · ${error.requestId}` : ""}` : "unknown error";

    return (
      <p role="status" className="flex items-center gap-2 px-2 text-caption text-danger">
        <span aria-hidden="true" className="size-2 rounded-full bg-danger" />
        Phase 0 · API not reachable ({detail}). Start uptms-ad with “composer dev”.
      </p>
    );
  }

  return (
    <p role="status" className="flex items-center gap-2 px-2 text-caption text-ink-soft">
      <span aria-hidden="true" className="size-2 rounded-full bg-success" />
      Phase 0 · {result.health.app} API connected · database {result.health.database}
    </p>
  );
}

export function ApiStatusPending() {
  return (
    <p role="status" className="flex items-center gap-2 px-2 text-caption text-ink-soft">
      <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-stone" />
      Checking the API…
    </p>
  );
}
