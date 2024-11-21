import { useQuery } from "@tanstack/react-query";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  baseUrl,
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";
import { getLashMakeupProductTypeIds } from "../../../../api/attributes/makeups";

export function useLashesQuery({
  color,
  pattern,
}: {
  color: string | null;
  pattern: string | null;
}) {
  return useQuery({
    queryKey: ["products", "lashes", color, pattern],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "lash_makeup_product_type",
              value: getLashMakeupProductTypeIds([
                "Lash Curlers",
                "Individual False Lashes",
                "Full Line Lashes",
              ]).join(","),
              condition_type: "in",
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
