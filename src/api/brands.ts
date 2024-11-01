import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { defaultHeaders } from "./shared";

export type CustomAttributeValue = {
  label: string;
  value: string;
};

const brandsKey = {
  all: ["brands"],
};

async function fetchBrands() {
  const response = await fetch("/rest/V1/products/attributes/brand", {
    headers: defaultHeaders,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }
  return response.json() as Promise<{
    options: Array<CustomAttributeValue>;
    search_criteria: {
      filter_groups: Array<{
        filters: Array<{
          field: string;
          value: string;
          condition_type: string;
        }>;
      }>;
    };
    total_count: number;
  }>;
}

export function useBrandsQuery() {
  return useQuery({
    queryKey: brandsKey.all,
    queryFn: fetchBrands,
  });
}

export function useBrandsQuerySuspense() {
  return useSuspenseQuery({
    queryKey: brandsKey.all,
    queryFn: fetchBrands,
  });
}

export function getBrandName(attributes: CustomAttributeValue[], id: string) {
  for (const attribute of attributes) {
    if (attribute.value === id) {
      return attribute.label;
    }
  }
  return "";
}