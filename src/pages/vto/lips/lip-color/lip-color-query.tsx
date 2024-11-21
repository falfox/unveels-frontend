import { useQuery } from "@tanstack/react-query";
import { lipsMakeupProductTypesFilter } from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  baseUrl,
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";

export function useLipColorQuery({
  color,
  sub_color,
  texture,
}: {
  color: string | null;
  sub_color: string | null;
  texture: string | null;
}) {
  return useQuery({
    queryKey: ["products", "lipcolor", color, sub_color, texture],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "lips_makeup_product_type",
              value: lipsMakeupProductTypesFilter([
                "Lipsticks",
                "Lip Stains",
                "Lip Tints",
                "Lip Balms",
              ]),
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
