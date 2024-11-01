import { useQuery } from "@tanstack/react-query";
import { buildSearchParams } from "../utils/apiUtils";
import { defaultHeaders, Product } from "./shared";
import { personalities } from "./attributes/personality";

const lipsKey = {
  products: ({ personality }: { personality: string }) => [
    "products",
    "lips",
    personality,
  ],
};

export function useLipsProductQuery({ personality }: { personality: string }) {
  const personalityId =
    personalities.find(
      (p) => p.label.toLowerCase() === personality.toLowerCase(),
    )?.value ?? "";

  return useQuery({
    queryKey: lipsKey.products({
      personality: personality || "",
    }),
    queryFn: async () => {
      const filters = [
        {
          filters: [
            {
              field: "category_id",
              value: "457",
              condition_type: "eq",
            },
          ],
        },
        {
          filters: [
            {
              field: "personality",
              value: personalityId,
              condition_type: "finset",
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

      return response.json() as Promise<{
        items: Array<Product>;
      }>;
    },
  });
}
