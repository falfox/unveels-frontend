import { useQuery } from "@tanstack/react-query";
import {
  faceMakeupProductTypesFilter,
  getEyeMakeupProductTypeIds,
  getLashMakeupProductTypeIds,
} from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";

export function useConcealerQuery({ skin_tone }: { skin_tone: string | null }) {
  return useQuery({
    queryKey: ["products", "concealers", skin_tone],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "eye_makeup_product_type",
              value: getEyeMakeupProductTypeIds(["Concealers"]).join(","),
              condition_type: "in",
            },
          ],
        },
      ];

      const filters = [];

      if (skin_tone) {
        filters.push({
          filters: [
            {
              field: "skin_tone",
              value: skin_tone,
              condition_type: "eq",
            },
          ],
        });
      }

      const response = await fetch(
        "/rest/V1/products?" + buildSearchParams([...baseFilters]),
        {
          headers: defaultHeaders,
        },
      );

      const results = (await response.json()) as {
        items: Array<Product>;
      };

      return await fetchConfigurableProducts(results, filters);
    },
  });
}
