import { useQuery } from "@tanstack/react-query";
import { faceMakeupProductTypesFilter } from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import { baseUrl, buildSearchParams } from "../../../../utils/apiUtils";

export function useFaceHighlighterQuery({
  texture,
  hexacode,
}: {
  texture: string | null;
  hexacode: string | null;
}) {
  return useQuery({
    queryKey: ["products", "facehighlighter", hexacode, texture],
    queryFn: async () => {
      const filters = [
        {
          filters: [
            {
              field: "type_id",
              value: "simple",
              condition_type: "eq",
            },
          ],
        },
        {
          filters: [
            {
              field: "face_makeup_product_type",
              value: faceMakeupProductTypesFilter(["Highlighters"]),
              condition_type: "in",
            },
          ],
        },
      ];

      if (hexacode) {
        filters.push({
          filters: [
            {
              field: "hexacode",
              value: hexacode,
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

      console.log("filters", filters);

      const response = await fetch(
        baseUrl + "/rest/V1/products?" + buildSearchParams(filters),
        {
          headers: defaultHeaders,
        },
      );

      const results = (await response.json()) as {
        items: Array<Product>;
      };

      return results;
    },
  });
}
