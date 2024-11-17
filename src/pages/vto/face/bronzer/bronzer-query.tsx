import { useQuery } from "@tanstack/react-query";
import {
  faceMakeupProductTypesFilter,
  getLashMakeupProductTypeIds,
} from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  baseUrl,
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";

export function useBronzerQuery({ texture }: { texture: string | null }) {
  return useQuery({
    queryKey: ["products", "bronzers", texture],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "face_makeup_product_type",
              value: faceMakeupProductTypesFilter(["Bronzers"]),
              condition_type: "in",
            },
          ],
        },
      ];

      const filters = [];

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
        baseUrl + "/rest/V1/products?" + buildSearchParams([...baseFilters, ...filters]),
        {
          headers: defaultHeaders,
        },
      );

      const results = (await response.json()) as {
        items: Array<Product>;
      };

      return await fetchConfigurableProducts(results);
    },
  });
}
