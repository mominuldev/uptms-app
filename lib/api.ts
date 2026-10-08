import "server-only";

/**
 * Server-side client for the Laravel API (uptms-ad). Every read happens in a
 * Server Component or route handler, so the API URL never reaches the
 * browser. Laravel answers in one envelope (uptms-ad docs/API.md §1):
 *
 *   success: { success: true, message, data, meta }
 *   error:   { success: false, message, error_code, errors, meta: { request_id } }
 */
export interface Envelope<T> {
  success: true;
  message: string;
  data: T;
  meta: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly requestId: string | null = null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function apiUrl(path: string): string {
  const base = process.env.API_URL;

  if (!base) {
    throw new Error("API_URL is not set. Copy .env.example to .env.local.");
  }

  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export async function apiGet<T>(path: string, init: { signal?: AbortSignal } = {}): Promise<Envelope<T>> {
  let response: Response;

  try {
    response = await fetch(apiUrl(path), {
      headers: { Accept: "application/json" },
      signal: init.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new ApiError(0, "NETWORK_ERROR", "The API cannot be reached.");
  }

  const payload = (await response.json().catch(() => null)) as
    | (Partial<Envelope<T>> & { success?: boolean; error_code?: string; meta?: { request_id?: string } })
    | null;

  if (!response.ok || payload?.success !== true) {
    throw new ApiError(
      response.status,
      payload?.error_code ?? "SERVER_ERROR",
      payload?.message ?? "The API returned an unexpected response.",
      payload?.meta?.request_id ?? response.headers.get("X-Request-Id"),
    );
  }

  return payload as Envelope<T>;
}

/** Shorthand when only `data` matters. */
export async function getData<T>(path: string): Promise<T> {
  return (await apiGet<T>(path)).data;
}
