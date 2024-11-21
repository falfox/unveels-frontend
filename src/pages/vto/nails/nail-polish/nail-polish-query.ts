import { useQuery } from "@tanstack/react-query";
import {
  getNailPolishProductTypeIds,
  lipsMakeupProductTypesFilter,
} from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  baseUrl,
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";

export function useNailPolishQuery({
  color,
  texture,
}: {
  color: string | null;
  texture: string | null;
}) {
  return useQuery({
    queryKey: ["products", "nailpolish", color, texture],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "nail_polish_product_type",
              value: getNailPolishProductTypeIds([
                "Nail Color",
                "Gel Color",
                "Breathable Polishes",
              ]).join(","),
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

      if (texture) {
        filters.push({
          filters: [
            {
              field: "texture",
              value: texture,
              condition_type: "eq",
            },
          ],
        });
      }

      const response = await fetch(
        baseUrl + "/rest/V1/products?" + buildSearchParams([...baseFilters]), // Hanya apply baseFilters karena filter color tidak bisa di apply
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
