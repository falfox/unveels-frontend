import { useQuery } from "@tanstack/react-query";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";

export function useLenseQuery({
  color,
  pattern,
}: {
  color: string | null;
  pattern: string | null;
}) {
  return useQuery({
    queryKey: ["products", "lenses", color, pattern],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "lenses_product_type",
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
