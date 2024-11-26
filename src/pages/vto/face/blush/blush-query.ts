import { useQuery } from "@tanstack/react-query";
import { faceMakeupProductTypesFilter } from "../../../../api/attributes/makeups";
import {
  baseUrl,
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";
import { defaultHeaders, Product } from "../../../../api/shared";

export function useBlushQuery({ texture }: { texture: string | null }) {
  return useQuery({
    queryKey: ["products", "faceblush", texture],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "face_makeup_product_type",
              value: faceMakeupProductTypesFilter(["Blushes"]),
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
      console.log("filters", filters);

      const response = await fetch(
        baseUrl + "/rest/V1/products?" + buildSearchParams(baseFilters),
        {
          headers: defaultHeaders,
        },
      );

      const results = (await response.json()) as {
        items: Array<Product>;
      };

      return fetchConfigurableProducts(results, filters);
    },
  });
}
