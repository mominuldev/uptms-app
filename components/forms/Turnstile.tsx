"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile (spam check) for the consultation form. Rendered only
 * when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set; the script loads on the
 * Contact page alone, never site-wide.
 */
interface TurnstileApi {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(script);
  });

  return loading;
}

export function Turnstile({ siteKey, onToken, resetKey }: { siteKey: string; onToken: (token: string) => void; resetKey: number }) {
  const box = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);

  useEffect(() => {
    callback.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let widget: string | null = null;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile) return;
        widget = window.turnstile.render(box.current, {
          sitekey: siteKey,
          action: "consultation",
          appearance: "interaction-only",
          callback: (token: string) => callback.current(token),
          "expired-callback": () => callback.current(""),
          "error-callback": () => callback.current(""),
        });
      })
      .catch(() => callback.current(""));

    return () => {
      cancelled = true;
      if (widget && window.turnstile) window.turnstile.remove(widget);
    };
  }, [siteKey, resetKey]);

  return <div ref={box} className="min-h-0" />;
}
