import { useQuery } from "@tanstack/react-query";
import { getEyeMakeupProductTypeIds } from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";

export function useEyeshadowsQuery({
  color,
  texture,
  hexcodes,
}: {
  color: string | null;
  texture: string | null;
  hexcodes: string[] | null;
}) {
  return useQuery({
    queryKey: ["products", "eyeshadows", color, hexcodes, texture],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "eye_makeup_product_type",
              value: getEyeMakeupProductTypeIds(["Eyeshadows"]).join(","),
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

      if (hexcodes) {
        filters.push({
          filters: [
            {
              field: "hexacode",
              value: hexcodes.join(","),
              condition_type: "finset",
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
