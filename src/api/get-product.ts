import { useQuery } from "@tanstack/react-query";
import { buildSearchParams } from "../utils/apiUtils";
import { defaultHeaders, Product } from "./shared";

const lipsKey = {
  product: ({ sku }: { sku: string }) => ["product", sku],
};

export function useSingleProductQuery({ sku }: { sku: string }) {
  return useQuery({
    queryKey: lipsKey.product({
      sku: sku,
    }),
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
              field: "sku",
              value: sku,
              condition_type: "eq",
            },
          ],
        },
      ];

      const response = await fetch(
        "/rest/V1/products?" + buildSearchParams(filters),
        {
          headers: defaultHeaders,
        },
      );

      const results = (await response.json()) as {
        items: Array<Product>;
      };

      if (results.items.length === 0) {
        throw new Error("No product found");
      }

      return results.items[0];
    },
  });
}
