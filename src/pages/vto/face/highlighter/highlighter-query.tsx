import { useQuery } from "@tanstack/react-query";
import { faceMakeupProductTypesFilter } from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import { baseUrl, buildSearchParams } from "../../../../utils/apiUtils";

export function useFaceHighlighterQuery({
  texture,
  color,
}: {
  texture: string | null;
  color: string | null;
}) {
  return useQuery({
    queryKey: ["products", "facehighlighter", color, texture],
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
              value: faceMakeupProductTypesFilter(["Highlighter"]),
              condition_type: "in",
            },
          ],
        },
      ];

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
