import { useQuery } from "@tanstack/react-query";
import {
  getNailPolishProductTypeIds,
  getNailsProductTypeIds,
  lipsMakeupProductTypesFilter,
} from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  baseUrl,
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";

export function usePressOnNailsQuery({
  color,
  shape,
}: {
  color: string | null;
  shape: string | null;
}) {
  return useQuery({
    queryKey: ["products", "pressonnails", color, shape],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "nails_product_type",
              value: getNailsProductTypeIds(["Press on Nails"]).join(","),
              condition_type: "in",
            },
          ],
        },
      ];

      // Skip filter ini karena, lips_makeup_product_type tidak bisa di filter dengan color
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

      if (shape) {
        filters.push({
          filters: [
            {
              field: "shape",
              value: shape,
              condition_type: "eq",
            },
          ],
        });
      }

      const response = await fetch(
        baseUrl + "/rest/V1/products?" + buildSearchParams([...baseFilters, ...filters]), // Hanya apply baseFilters karena filter color tidak bisa di apply
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
