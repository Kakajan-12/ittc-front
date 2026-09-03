import { createCrudApi } from "@/shared/api/crud";
import { Country } from "./type";

export const COUNTRIES = createCrudApi<Country>({
  resource: "country",
  searchFields: ["titleEn", "titleRu", "titleTk", "code"],
  orderByFields: [
    "titleEn",
    "titleRu",
    "titleTk",
    "code",
    "createdAt",
    "updatedAt",
    "id",
  ],
  filterFields: [
    "titleEn",
    "titleRu",
    "titleTk",
    "code",
    "createdAt",
    "updatedAt",
    "id",
  ],
});
