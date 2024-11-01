import { useQuery } from "@tanstack/react-query";
import { buildSearchParams } from "../utils/apiUtils";
import { defaultHeaders, Product } from "./shared";
import { personalities } from "./attributes/personality";

const fragrancesKey = {
  products: ({ personality }: { personality: string }) => [
    "products",
    "fragrances",
    personality,
  ],
};

export function useFragrancesProductQuery({
  personality,
}: {
  personality: string;
}) {
  const personalityId = personalities.find(
    (p) => p.label.toLowerCase() === personality.toLowerCase(),
  )?.value ?? "";

  return useQuery({
    queryKey: fragrancesKey.products({
      personality: personality || "",
    }),
    queryFn: async () => {
      const filters = [
        {
          filters: [
            {
              field: "category_id",
              value: "878",
              condition_type: "eq",
            },
          ],
        },
        {
          filters: [
            {
              field: "personality",
              value: personalityId,
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

      return response.json() as Promise<{
        items: Array<Product>;
      }>;
    },
  });
}
