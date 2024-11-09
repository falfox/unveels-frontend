import { getLipsMakeupProductTypeIds } from "../api/attributes/makeups";
import { defaultHeaders, Product } from "../api/shared";

type Filter = {
  field: string;
  value: string | number;
  condition_type: string;
};

type FilterGroup = {
  filters: Filter[];
};

export const baseApiUrl = "https://magento-1231949-4398885.cloudwaysapps.com";
export const baseMediaUrl =
  "https://magento-1231949-4398885.cloudwaysapps.com/media/catalog/product/cache/df714aaa5e59335a5bf39a17764906ba";

export function mediaUrl(imagePath: string | undefined) {
  if (!imagePath) {
    return "https://picsum.photos/id/237/200/300";
  }
  return baseMediaUrl + imagePath;
}

/**
 * Converts an array of filter groups into a query string following the
 * `searchCriteria[filter_groups][n][filters][m][...]` pattern.
 * @param filterGroups - Array of filter groups with filters.
 * @returns A string representing the search parameters.
 */
export function buildSearchParams(filterGroups: FilterGroup[]): string {
  const params = new URLSearchParams();

  filterGroups.forEach((group, groupIndex) => {
    group.filters.forEach((filter, filterIndex) => {
      Object.entries(filter).forEach(([key, value]) => {
        const paramName = `searchCriteria[filter_groups][${groupIndex}][filters][${filterIndex}][${key}]`;
        params.append(paramName, String(value));
      });
    });
  });

  return params.toString();
}

export function extractUniqueCustomAttributes(
  products: Product[],
  attributeCode: string,
) {
  const uniqueAttributes = new Set<string>();
  for (const product of products) {
    for (const attr of product.custom_attributes) {
      if (attr.attribute_code === attributeCode) {
        uniqueAttributes.add(attr.value as string);
      }
    }
  }
  return Array.from(uniqueAttributes);
}

export const getProductAttributes = (
  product: Product,
  attributeCName: string,
) => {
  return (
    product.custom_attributes.find(
      (attr) => attr.attribute_code === attributeCName,
    )?.value ?? ""
  );
};

export async function fetchConfigurableProducts(
  results: {
    items: Array<Product>;
  },
  parentFilters: FilterGroup[] = [],
) {
  // Check if it has any configurable products
  const productFound = results.items.filter(
    (p) => p.type_id === "configurable",
  );

  if (productFound.length === 0) {
    return {
      items: results.items,
    };
  }

  // Get entity ids of the configurable products in prodcut[extension_attributes][configurable_product_links]
  const configurableProductIds = productFound
    .map((p) => p.extension_attributes.configurable_product_links ?? [])
    .flat();

  const filters = [
    ...parentFilters,
    {
      filters: [
        {
          field: "entity_id",
          value: configurableProductIds.join(","),
          condition_type: "in",
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

  // Combine results with configurable products
  const filteredResults = results.items.filter(
    (product) => product.type_id === "simple",
  );

  const configrableResponse = (await response.json()) as {
    items: Array<Product>;
  };

  return {
    items: [...filteredResults, ...configrableResponse.items],
  };
}
