const HOST = (process.env.NEXT_PUBLIC_BACKEND_URL ?? "").replace(/\/+$/, "");

export const API_BASE = `${HOST}/api/v1`;
