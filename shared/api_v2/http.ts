import { API_V2 } from ".";
import { ensureAnonToken } from "../auth/anonToken";

type T_HTTP_HEADERS = Record<string, string>;

type T_REQUEST_RESPONSE<T> = {
  data: T | null;
  statusCode: number;
};

type T_HTTP_PARAMS = Record<string, string | number>;

async function readResponseBody(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      return await response.json();
    }

    const text = await response.text();

    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch {
    return null;
  }
}

async function buildHeaders({
  headers,
  token,
  isFormData,
}: {
  headers?: T_HTTP_HEADERS;
  token?: string;
  isFormData?: boolean;
}) {
  // Waits for the anonymous session instead of assuming something fetched it
  // first — that assumption is what used to block the whole app from rendering.
  const accessToken = token ?? (await ensureAnonToken());
  return {
    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),

    ...(accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {}),

    ...(headers ?? {}),
  };
}

export const HTTP = {
  async POST<T>({
    url,
    body,
    headers,
    token,
  }: {
    url: string;
    body: any;
    headers?: T_HTTP_HEADERS;
    token?: string;
  }): Promise<T_REQUEST_RESPONSE<T>> {
    try {
      const isFormData = body instanceof FormData;

      const response = await fetch(url, {
        method: "POST",
        headers: await buildHeaders({
          headers,
          token,
          isFormData,
        }),
        body:
          isFormData || typeof body === "string" ? body : JSON.stringify(body),
      });

      const data = await readResponseBody(response);

      return {
        data: data as T,
        statusCode: response.status,
      };
    } catch (e) {
      console.log("POST NETWORK ERROR:", e);

      return {
        data: null as T,
        statusCode: 500,
      };
    }
  },

  async GET<T>({
    url,
    headers,
    params,
    token,
  }: {
    url: string;
    headers?: T_HTTP_HEADERS;
    params?: T_HTTP_PARAMS;
    token?: string;
  }): Promise<T_REQUEST_RESPONSE<T>> {
    try {
      const query = params
        ? `?${new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]))}`
        : "";

      const response = await fetch(`${url}${query}`, {
        method: "GET",
        headers: await buildHeaders({
          headers: {
            Accept: "application/json",
            ...(headers ?? {}),
          },
          token,
        }),
      });

      const data = await readResponseBody(response);

      return {
        data: data as T,
        statusCode: response.status,
      };
    } catch (error) {
      console.log("GET NETWORK ERROR:", error);

      return {
        data: null as T,
        statusCode: 500,
      };
    }
  },

  async PUT<T>({
    url,
    body,
    headers,
    token,
  }: {
    url: string;
    body: any;
    headers?: T_HTTP_HEADERS;
    token?: string;
  }): Promise<T_REQUEST_RESPONSE<T>> {
    try {
      const isFormData = body instanceof FormData;

      const response = await fetch(url, {
        method: "PUT",
        headers: await buildHeaders({
          headers,
          token,
          isFormData,
        }),
        body:
          isFormData || typeof body === "string" ? body : JSON.stringify(body),
      });

      const data = await readResponseBody(response);

      return {
        data: data as T,
        statusCode: response.status,
      };
    } catch (e) {
      console.log("PUT NETWORK ERROR:", e);

      return {
        data: null as T,
        statusCode: 500,
      };
    }
  },

  async PATCH<T>({
    url,
    body,
    headers,
    token,
  }: {
    url: string;
    body: any;
    headers?: T_HTTP_HEADERS;
    token?: string;
  }): Promise<T_REQUEST_RESPONSE<T>> {
    try {
      const isFormData = body instanceof FormData;

      const response = await fetch(url, {
        method: "PATCH",
        headers: await buildHeaders({
          headers,
          token,
          isFormData,
        }),
        body:
          isFormData || typeof body === "string" ? body : JSON.stringify(body),
      });

      const data = await readResponseBody(response);

      return {
        data: data as T,
        statusCode: response.status,
      };
    } catch (e) {
      console.log("PATCH NETWORK ERROR:", e);

      return {
        data: null as T,
        statusCode: 500,
      };
    }
  },

  async DELETE<T>({
    url,
    body,
    headers,
    token,
  }: {
    url: string;
    body?: any;
    headers?: T_HTTP_HEADERS;
    token?: string;
  }): Promise<T_REQUEST_RESPONSE<T>> {
    try {
      const isFormData = body instanceof FormData;

      const response = await fetch(url, {
        method: "DELETE",
        headers: await buildHeaders({
          headers,
          token,
          isFormData,
        }),
        body:
          body == null
            ? undefined
            : isFormData || typeof body === "string"
              ? body
              : JSON.stringify(body),
      });

      const data = await readResponseBody(response);

      return {
        data: data as T,
        statusCode: response.status,
      };
    } catch (e) {
      console.log("DELETE NETWORK ERROR:", e);

      return {
        data: null as T,
        statusCode: 500,
      };
    }
  },
};
