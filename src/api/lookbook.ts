import { useQuery } from "@tanstack/react-query";
import { defaultHeaders, LookbookCategory, Product } from "./shared";
import { buildSearchParams } from "../utils/apiUtils";

export type CustomAttributeValue = {
  label: string;
  value: string;
};

const lookbookKey = {
  products: (personality: string) => ["products", "lookbook", personality],
};

async function fetchLookbookProducts({ personality }: { personality: string }) {
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
    .filter((profile) =>
      profile.try_on_url.includes(`Personality=${personality}`),
    );

  const skus = filteredData
    .map((profile) => {
      const markers = JSON.parse(profile.marker) as {
        sku: string;
      }[];
      return markers.map((marker) => marker.sku);
    })
    .flat();

  console.log({
    skus,
    filteredData,
  });

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

export function useLookbookProductQuery({
  personality,
}: {
  personality: string;
}) {
  return useQuery({
    queryKey: lookbookKey.products(personality),
    queryFn: () => fetchLookbookProducts({ personality }),
  });
}
