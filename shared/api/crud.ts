import { HTTP } from "@/shared/api/http";

export type T_SORT_ORDER = "asc" | "desc";
export type T_FILTER_OPERATOR =
  | "eq"
  | "neq"
  | "like"
  | "ilike"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in";

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

export type T_LIST_RESPONSE<T> = {
  total: number;
  items: T[];
};

export type T_CRUD_CONFIG<
  T_SEARCH_FIELD extends string = string,
  T_ORDER_BY_FIELD extends string = string,
  T_FILTER_FIELD extends string = string,
> = {
  resource: string;
  searchFields: readonly T_SEARCH_FIELD[];
  orderByFields: readonly T_ORDER_BY_FIELD[];
  filterFields: readonly T_FILTER_FIELD[];
  /**
   * Путь для UPDATE, когда он не совпадает с `{resource}/{id}`. У черновика
   * регистрации плоского `PATCH /registration-drafts/{id}` нет — обновление
   * разбито по шагам (`/personal-info`, `/organization-info`, `/packages`).
   */
  updatePath?: (id: number) => string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function createCrudApi<
  T extends {
    id: number;
    createdAt: Date;
    updatedAt: Date;
  },
  T_CONFIG extends T_CRUD_CONFIG = T_CRUD_CONFIG,
>({
  resource,
  searchFields,
  orderByFields,
  filterFields,
  updatePath,
}: T_CONFIG) {
  type T_SEARCH_FIELD = T_CONFIG["searchFields"][number];

  type T_ORDER_BY_FIELD = T_CONFIG["orderByFields"][number];

  type T_FILTER_FIELD = T_CONFIG["filterFields"][number];

  type T_CREATE = Omit<T, "id" | "createdAt" | "updatedAt">;

  type T_UPDATE = Partial<T_CREATE>;

  const baseUrl = `${BASE_URL}/${resource}`;

  const getErrorMessage = (data: unknown, fallback: string) => {
    if (data && typeof data === "object" && "message" in data) {
      const message = (
        data as {
          message?: unknown;
        }
      ).message;

      if (typeof message === "string") {
        return message;
      }
    }

    return fallback;
  };

  return {
    LIST: async ({
      offset = 0,
      limit = 10,
      search,
      searchFields: selectedSearchFields,
      orderBy = orderByFields[0],
      orderDirection = "asc",
      filters = [],
    }: {
      offset?: number;
      limit?: number;
      search?: string;
      searchFields?: T_SEARCH_FIELD[];
      orderBy?: T_ORDER_BY_FIELD;
      orderDirection?: T_SORT_ORDER;
      filters?: Array<{
        field: T_FILTER_FIELD;
        op: T_FILTER_OPERATOR;
        val: unknown;
      }>;
    }): Promise<T_LIST_RESPONSE<T>> => {
      if (
        selectedSearchFields?.some((field) => !searchFields.includes(field))
      ) {
        throw new Error("INVALID_SEARCH_FIELD");
      }

      if (orderBy !== undefined && !orderByFields.includes(orderBy)) {
        throw new Error("INVALID_ORDER_BY");
      }

      if (filters.some((filter) => !filterFields.includes(filter.field))) {
        throw new Error("INVALID_FILTER_FIELD");
      }

      const params: Record<string, string | number> = {
        offset,
        limit,
        orderBy: String(orderBy),
        orderDirection,
      };

      if (search) {
        params.search = search;
      }

      if (selectedSearchFields?.length) {
        params.searchFields = selectedSearchFields.join(",");
      }

      if (filters.length) {
        params.filters = JSON.stringify(
          filters.map((filter) => ({
            field: filter.field,
            op: filter.op,
            val: filter.val,
          })),
        );
      }

      const res = await HTTP.GET<T_API_RESPONSE<T_LIST_RESPONSE<T>>>({
        url: baseUrl,
        params,
      });

      if (res.statusCode === 200 && res.data?.success) {
        return res.data.data;
      }

      throw new Error(getErrorMessage(res.data, "FETCH FAILED"));
    },

    GET: async (id: number): Promise<T> => {
      const res = await HTTP.GET<T_API_RESPONSE<T>>({
        url: `${baseUrl}/${id}`,
      });

      if (res.statusCode === 200 && res.data?.success) {
        return res.data.data;
      }

      throw new Error(getErrorMessage(res.data, "FETCH FAILED"));
    },

    CREATE: async (payload: T_CREATE): Promise<T> => {
      const res = await HTTP.POST<T_API_RESPONSE<T>>({
        url: baseUrl,
        body: payload,
      });

      if (res.statusCode === 201 && res.data?.success) {
        return res.data.data;
      }

      throw new Error(getErrorMessage(res.data, "CREATE FAILED"));
    },

    UPDATE: async (id: number, payload: T_UPDATE): Promise<T> => {
      const res = await HTTP.PATCH<T_API_RESPONSE<T>>({
        url: `${baseUrl}/${updatePath ? updatePath(id) : id}`,
        body: payload,
      });

      if (res.statusCode === 200 && res.data?.success) {
        return res.data.data;
      }

      throw new Error(getErrorMessage(res.data, "UPDATE FAILED"));
    },

    DELETE: async (id: number): Promise<{ id: number }> => {
      const res = await HTTP.DELETE<T_API_RESPONSE<{ id: number }>>({
        url: `${baseUrl}/${id}`,
      });

      if (res.statusCode === 200 && res.data?.success) {
        return res.data.data;
      }

      throw new Error(getErrorMessage(res.data, "DELETE FAILED"));
    },
  };
}
