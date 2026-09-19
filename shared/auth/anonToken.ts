import { API_BASE } from "../api/config";

const STORAGE_KEY = "getAnonymToken";

/** In-flight request, so concurrent callers share one round trip. */
let pending: Promise<string | null> | null = null;

export function readAnonToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function clearAnonToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Resolves the anonymous session token the registration platform expects on
 * every call. Cached in localStorage; fetched once per tab otherwise.
 *
 * Uses fetch directly rather than API_V2 — the token endpoint is the one call
 * that must not wait for a token, and going through the shared client would
 * make that a cycle.
 */
export async function ensureAnonToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) return cached;

  pending ??= (async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/getAnonToken`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: {} }),
      });

      if (!response.ok) return null;

      const payload = await response.json();
      const token: string | undefined = payload?.data?.token;

      if (!token) return null;

      localStorage.setItem(STORAGE_KEY, token);
      return token;
    } catch {
      return null;
    } finally {
      pending = null;
    }
  })();

  return pending;
}
