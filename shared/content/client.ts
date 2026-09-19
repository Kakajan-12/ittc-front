import { CONTENT_API_URL, CONTENT_REVALIDATE_SECONDS } from "./config";

type ApiSuccess<T> = { success: true; message: string; data: T };
type ApiError = { success: false; message: string; errorCode: string };
type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type ListResponse<T> = { total: number; items: T[] };

export type ListParams = {
  offset?: number;
  limit?: number;
  search?: string;
  searchFields?: string[];
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  filters?: Array<{
    field: string;
    op: "eq" | "neq" | "like" | "ilike" | "gt" | "gte" | "lt" | "lte" | "in";
    val: unknown;
  }>;
};

export class ContentApiError extends Error {
  constructor(
    message: string,
    readonly errorCode: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ContentApiError";
  }
}

function buildQuery(params: ListParams = {}): string {
  const query = new URLSearchParams();

  if (params.offset !== undefined) query.set("offset", String(params.offset));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.searchFields?.length) {
    query.set("searchFields", params.searchFields.join(","));
  }
  if (params.orderBy) query.set("orderBy", params.orderBy);
  if (params.orderDirection) query.set("orderDirection", params.orderDirection);
  if (params.filters?.length) query.set("filters", JSON.stringify(params.filters));

  const value = query.toString();

  return value ? `?${value}` : "";
}

/**
 * Reads one resource from the content API.
 *
 * Responses are cached by Next and revalidated on a timer, so a page render
 * normally costs no request at all.
 */
export async function contentGet<T>(
  path: string,
  options: { revalidate?: number; tags?: string[] } = {},
): Promise<T> {
  const url = `${CONTENT_API_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: {
      revalidate: options.revalidate ?? CONTENT_REVALIDATE_SECONDS,
      ...(options.tags ? { tags: options.tags } : {}),
    },
  });

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !body || body.success !== true) {
    throw new ContentApiError(
      body && "message" in body ? body.message : `Request to ${path} failed`,
      body && "errorCode" in body ? body.errorCode : "REQUEST_FAILED",
      response.status,
    );
  }

  return body.data;
}

export function contentList<T>(
  resource: string,
  params?: ListParams,
  options?: { revalidate?: number; tags?: string[] },
): Promise<ListResponse<T>> {
  return contentGet<ListResponse<T>>(
    `${resource}${buildQuery(params)}`,
    options,
  );
}

/**
 * Same as `contentList`, but a backend hiccup degrades the section to empty
 * instead of taking the whole page down with a 500.
 */
export async function safeContentList<T>(
  resource: string,
  params?: ListParams,
  options?: { revalidate?: number; tags?: string[] },
): Promise<T[]> {
  try {
    return (await contentList<T>(resource, params, options)).items;
  } catch (error) {
    console.error(`[content] ${resource} failed:`, (error as Error).message);

    return [];
  }
}

export async function safeContentGet<T>(
  path: string,
  options?: { revalidate?: number; tags?: string[] },
): Promise<T | null> {
  try {
    return await contentGet<T>(path, options);
  } catch (error) {
    if (error instanceof ContentApiError && error.status === 404) return null;

    console.error(`[content] ${path} failed:`, (error as Error).message);

    return null;
  }
}
