// import { createCreateApi, createDeleteApi, createGetApi, createListApi, createUpdateApi } from '@/shared/api/crud';

import { T_API_RESPONSE } from "../api/crud";
import { HTTP } from "../api/http";
import { API_BASE } from "../api/config";
import { T_EVENT } from "./type";

export const EVENTS = {
  GET: async (id: number) => {
    const res = await HTTP.GET<T_API_RESPONSE<T_EVENT>>({
      url: `${API_BASE}/events/${id}`,
    });

    if (res.statusCode === 200 && res.data?.success) {
      return res.data.data;
    }

    throw new Error("FETCH FAILED");
  },
};
