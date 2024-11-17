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

export function useFoundationQuery({
  skin_tone,
  texture,
}: {
  skin_tone: string | null;
  texture: string | null;
}) {
  return useQuery({
    queryKey: ["products", "foundations", skin_tone, texture],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "face_makeup_product_type",
              value: faceMakeupProductTypesFilter(["Foundations"]),
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
        baseUrl + "/rest/V1/products?" + buildSearchParams([...baseFilters]),
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
