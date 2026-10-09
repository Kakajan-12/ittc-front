import { createCrudApi } from "@/shared/api_v2/crud";
import { T_INSTITUTE } from "./type";

export const INSTITUTION_STEP = {
  ...createCrudApi<T_INSTITUTE>({
    resource: "institution",
  }),
};
