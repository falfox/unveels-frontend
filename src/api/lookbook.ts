import { useQuery } from "@tanstack/react-query";
import { defaultHeaders, LookbookCategory, Product } from "./shared";
import { buildSearchParams } from "../utils/apiUtils";

export type CustomAttributeValue = {
  label: string;
  value: string;
};

type LookbookFilters =
  | {
      personality: string;
    }
  | {
      faceShape: string;
    };

const lookbookKey = {
  products: (filters: LookbookFilters) => ["products", "lookbook", filters],
};

async function fetchLookbookProducts(options: LookbookFilters) {
  let response = await fetch("/rest/V1/lookbook/categories", {
    headers: defaultHeaders,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }
  const json = response.json() as Promise<LookbookCategory[]>;

  const data = await json;
  const filteredData = data
    .map((category) => category.profiles)
    .flat()
    .filter((profile) => {
      if ("personality" in options) {
        return profile.try_on_url.includes(
          `Personality=${options.personality}`,
        );
      }

      if ("faceShape" in options) {
        return profile.try_on_url.includes(`Face Shape=${options.faceShape}`);
      }

      return false;
    });

  const skus = filteredData
    .map((profile) => {
      const markers = JSON.parse(profile.marker) as {
        sku: string;
      }[];
      return markers.map((marker) => marker.sku);
    })
    .flat();

  const filters = [
    {
      filters: [
        {
          field: "sku",
          value: skus.join(","),
          condition_type: "in",
        },
      ],
    },
  ];

  response = await fetch("/rest/V1/products?" + buildSearchParams(filters), {
    headers: defaultHeaders,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }

  return response.json() as Promise<{
    items: Array<Product>;
  }>;
}

export function useLookbookProductQuery(filters: LookbookFilters) {
  return useQuery({
    queryKey: lookbookKey.products(filters),
    queryFn: () => fetchLookbookProducts(filters),
  });
}
