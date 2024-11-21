import { useQuery } from "@tanstack/react-query";
import {
  getLipsMakeupProductTypeIds,
  lips_makeup_product_types,
  lipsMakeupProductTypesFilter,
} from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  baseUrl,
  buildSearchParams,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";

export function useLipPlumperQuery({
  hexacode,
  texture,
}: {
  hexacode: string | null;
  texture: string | null;
}) {
  return useQuery({
    queryKey: ["products", "lip-plumper", hexacode, texture],
    queryFn: async () => {
      const baseFilters = [
        {
          filters: [
            {
              field: "lips_makeup_product_type",
              value: lipsMakeupProductTypesFilter([
                "Lip Plumpers",
                "Lip Glosses",
              ]),
              condition_type: "in",
            },
          ],
        },
      ];

      const filters = [];
      // Skip filter ini karena, lips_makeup_product_type tidak bisa di filter dengan color
      if (hexacode) {
        filters.push({
          filters: [
            {
              field: "hexacode",
              value: hexacode,
              condition_type: "im",
            },
          ],
        });
      }

      if (texture) {
        // filters.push({
        //   filters: [
        //     {
        //       field: "texture",
        //       value: texture,
        //       condition_type: "eq",
        //     },
        //   ],
        // });
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
