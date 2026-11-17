import { createCrudApi } from "@/shared/api_v2/crud";
import { T_AGENDA_DAY, T_AGENDA_ENTRY, T_AGENDA_ROOM } from "./type";

export const AGENDA = {
  DAY: createCrudApi<T_AGENDA_DAY>({
    resource: "agendaDay",
  }),

  ENTRY: createCrudApi<T_AGENDA_ENTRY>({
    resource: "agendaDayEntry",
  }),

  ROOM: createCrudApi<T_AGENDA_ROOM>({
    resource: "agendaRoom",
  }),
};
