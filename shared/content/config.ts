/**
 * The ITTC site talks to two different backends:
 *
 *  - `NEXT_PUBLIC_BACKEND_URL`     — the registration platform (packages,
 *    promocodes, payment, participant accounts). Owned by another team.
 *  - `NEXT_PUBLIC_CONTENT_API_URL` — ittc-back: site content, visa applications
 *    and participant services.
 *
 * Keep them apart: the registration client in `shared/api` must stay pointed at
 * the first one.
 */
export const CONTENT_API_URL = (
  process.env.NEXT_PUBLIC_CONTENT_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, "");

/**
 * How long a rendered page may serve cached content before Next refetches it.
 * Editors see their change at most this many seconds later.
 */
export const CONTENT_REVALIDATE_SECONDS = Number(
  process.env.CONTENT_REVALIDATE_SECONDS ?? 300,
);
