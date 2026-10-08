import { useQuery } from "@tanstack/react-query";
import { API_V2 } from "@/shared/api_v2";

/** Справочник учреждений платформы. Он небольшой, поэтому берём целиком. */
export function useInstitutions() {
  return useQuery({
    queryKey: ["institutions"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { rows } = await API_V2.INSTITUTION_STEP.LIST({
        offset: 0,
        limit: 999,
      });
      return rows;
    },
  });
}
