// import { createCreateApi, createDeleteApi, createGetApi, createListApi, createUpdateApi } from '@/shared/api/crud';

import { T_API_RESPONSE } from "../api/crud";
import { HTTP } from "../api/http";
import { API_BASE } from "../api/config";
import { T_EVENT } from "./type";
import { PRINT } from "../lib/helpers";

export const EVENTS = {
  GET: async (id: number) => {
    // PRINT(localStorage.getItem('accessToken'))
    const res = await HTTP.POST<T_API_RESPONSE<T_EVENT>>({
      url: `${API_BASE}/event/get`,
      token: localStorage.getItem('getAnonymToken') ?? '',
      body: {
        fields: {
          id: 4,
        },
      },
    });

    if (res.statusCode === 200 && res.data?.success) {
      return res.data.data;
    }

    throw new Error("FETCH FAILED");
  },
};
