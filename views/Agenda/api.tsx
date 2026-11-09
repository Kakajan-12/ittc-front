import { createCrudApi } from "@/shared/api_v2/crud";
import { T_AGENDA } from "./type";

export const AGENDA = {
  DAY: createCrudApi<T_AGENDA.DAY.FIELDS>({
    resource: "agendaDay",
  }),

  ENTRY: createCrudApi<T_AGENDA.ENTRY.FIELDS>({
    resource: "agendaDayEntry",
  }),

  ROOM: createCrudApi<T_AGENDA.ROOM.FIELDS>({
    resource: "agendaRoom",
  }),
};
