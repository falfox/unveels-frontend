import { useQuery } from "@tanstack/react-query";
import { getLashMakeupProductTypeIds } from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  baseUrl,
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";

export function useMascaraQuery({
  color,
  sub_color,
}: {
  color: string | null;
  sub_color: string | null;
}) {
  return useQuery({
    queryKey: ["products", "mascara", color, sub_color],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "lash_makeup_product_type",
              value: getLashMakeupProductTypeIds(["Mascaras"]).join(","),
              condition_type: "in",
            },
          ],
        },
      ];

      // Skip filter ini karena, mascara_makeup_product_type tidak bisa di filter dengan color
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
