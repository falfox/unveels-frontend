export const lips_makeup_product_types = [
  {
    label: "Lip Primers",
    value: "5725",
  },
  {
    label: "Lipsticks",
    value: "5726",
  },
  {
    label: "Lip Stains",
    value: "5727",
  },
  {
    label: "Lip Tints",
    value: "5728",
  },
  {
    label: "Lip Liners",
    value: "5729",
  },
  {
    label: "Lip Glosses",
    value: "5730",
  },
  {
    label: "Lip Balms",
    value: "5731",
  },
  {
    label: "Lip Plumpers",
    value: "5732",
  },
];

export const lipsMakeupProductTypesFilter = (productTypes: String[]) => {
  const filteredLipsProductTypes = lips_makeup_product_types
    .filter((product) => productTypes.includes(product.label))
    .map((product) => product.value)
    .join(",");
  return filteredLipsProductTypes;
};

export const lipsMakeupProductTypesMap = lips_makeup_product_types.reduce(
  (acc, { label, value }) => {
    acc[label] = value;
    return acc;
  },
  {} as Record<string, string>,
);

export const face_makeup_product_types = [
  {
    label: "Foundations",
    value: "5715",
  },
  {
    label: "Blushes",
    value: "5716",
  },
  {
    label: "Highlighters",
    value: "5717",
  },
  {
    label: "Correctors",
    value: "5718",
  },
  {
    label: "Primers",
    value: "5719",
  },
  {
    label: "Compact Powders",
    value: "5720",
  },
  {
    label: "Bronzers",
    value: "5721",
  },
  {
    label: "Contouring",
    value: "5722",
  },
  {
    label: "Face Makeup Removers",
    value: "5723",
  },
  {
    label: "Loose Powders",
    value: "5724",
  },
];

export const faceMakeupProductTypesFilter = (productTypes: String[]) => {
  const filteredFaceProductTypes = face_makeup_product_types
    .filter((product) => productTypes.includes(product.label))
    .map((product) => product.value)
    .join(",");
  return filteredFaceProductTypes;
};

export const faceMakeupProductTypesMap = face_makeup_product_types.reduce(
  (acc, { label, value }) => {
    acc[label] = value;
    return acc;
  },
  {} as Record<string, string>,
);
