import { useQuery } from "@tanstack/react-query";
import {
  getEyeMakeupProductTypeIds,
  getLipsMakeupProductTypeIds,
  lips_makeup_product_types,
} from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  baseUrl,
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";

export function useEyebrowsQuery({
  color,
  pattern,
}: {
  color: string | null;
  pattern: string | null;
}) {
  return useQuery({
    queryKey: ["products", "eyebrows", color, pattern],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "brow_makeup_product_type",
              value: "",
              condition_type: "notnull",
            },
          ],
        },
      ];

      const filters = [];

      if (color) {
        filters.push({
          filters: [
            {
              field: "color",
              value: color,
              condition_type: "eq",
            },
          ],
        });
      }

      if (pattern) {
        filters.push({
          filters: [
            {
              field: "pattern",
              value: pattern,
              condition_type: "finset",
            },
          ],
        });
      }

      const response = await fetch(
        baseUrl + "/rest/V1/products?" + buildSearchParams([...baseFilters, ...filters]),
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
