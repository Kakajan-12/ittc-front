import { HTTP } from "@/shared/api/http";

export type T_API_SUCCESS<T> = {
  success: true;
  message: string;
  data: T;
};

export type T_API_ERROR = {
  success: false;
  message: string;
  errorCode: string;
};

export type T_API_RESPONSE<T> = T_API_SUCCESS<T> | T_API_ERROR;
export type T_SORT_ORDER = "asc" | "desc";

type T_FILTER_OPERATOR =
  | "eq"
  | "neq"
  | "like"
  | "ilike"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in";

type T_FILTER_VALUE<T> = {
  op: T_FILTER_OPERATOR;
  val: T;
};

export type T_API_FILTER<T extends Record<string, any>> = Partial<{
  [K in keyof T]: T[K] | T_FILTER_VALUE<T[K]>;
}>;

// here we procide MORE FIELDS WE WANT TO USE IN ORDER BY
export type T_COMMON_ORDER_BY = { id?: T_SORT_ORDER };

const BASE_URL = "http://104.207.74.50:3101/api/v1";

export function createCrudApi<
  T extends { id: number; createdAt: Date; updatedAt: Date },
>({ resource }: { resource: string }) {
  const baseUrl = `${BASE_URL}/${resource}`;

  return {
    LIST: async ({
      offset = 0,
      limit = 10,
      filter = {},
      orderBy = { id: "asc" },
    }: {
      offset?: number;
      limit?: number;
      filter?: T_API_FILTER<T>;
      orderBy?: T_COMMON_ORDER_BY;
    }) => {
      const res = await HTTP.POST<
        | T_API_RESPONSE<{
            count: number;
            rows: T[];
          }>
        | T_API_ERROR
      >({
        url: `${baseUrl}/list`,
        body: {
          filter,
          pagination: {
            offset,
            limit,
          },
          orderBy,
        },
      });

      if (!!res.data && res.statusCode === 200 && !!res.data.success) {
        return res.data.data;
      } else if (!!res.data && res.statusCode === 200 && !res.data.success) {
        throw new Error(res.data.errorCode);
      } else {
        throw new Error("UNKNOWN_ERROR");
      }
    },

    GET: async (id: number) => {
      const res = await HTTP.POST<T_API_RESPONSE<T> | T_API_ERROR>({
        url: `${baseUrl}/get`,
        body: { fields: { id } },
      });

      if (res.statusCode === 200 && res.data && res.data.success) {
        return res.data.data;
      } else if (!!res.data && res.statusCode === 200 && !res.data.success) {
        throw new Error(res.data.errorCode);
      } else {
        throw new Error("UNKNOWN_ERROR");
      }
    },

    CREATE: async (payload: Omit<T, "id" | "createdAt" | "updatedAt">) => {
      const res = await HTTP.POST<T_API_RESPONSE<T> | T_API_ERROR>({
        url: `${baseUrl}/create`,
        body: {
          fields: payload,
        },
      });

      if (res.statusCode === 200 && !!res.data && res.data.success) {
        return res.data.data;
      } else if (!!res.data && res.statusCode === 200 && !res.data.success) {
        throw new Error(res.data.errorCode);
      } else {
        throw new Error("UNKNOWN_ERROR");
      }
    },

    UPDATE: async (
      id: number,
      payload: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>,
    ) => {
      const res = await HTTP.POST<T_API_RESPONSE<T> | T_API_ERROR>({
        url: `${baseUrl}/update`,
        body: {
          fields: {
            id,
            ...payload,
          },
        },
      });

      if (res.statusCode === 200 && !!res.data && !!res.data.success) {
        return res.data.data;
      } else if (!!res.data && res.statusCode === 200 && !res.data.success) {
        throw new Error(res.data.errorCode);
      } else {
        throw new Error("UNKNOWN_ERROR");
      }
    },

    DELETE: async (id: number) => {
      const res = await HTTP.POST<T_API_RESPONSE<T> | T_API_ERROR>({
        url: `${baseUrl}/delete`,
        body: {
          fields: { id },
        },
      });

      if (res.statusCode === 200 && !!res.data && !!res.data.success) {
        return res.data.data;
      } else if (!!res.data && res.statusCode === 200 && !res.data.success) {
        throw new Error(res.data.errorCode);
      } else {
        throw new Error("UNKNOWN_ERROR");
      }
    },
  };
}
