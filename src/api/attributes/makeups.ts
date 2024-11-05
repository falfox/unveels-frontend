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

export const faceMakeupProductTypesMap = face_makeup_product_types.reduce(
  (acc, { label, value }) => {
    acc[label] = value;
    return acc;
  },
  {} as Record<string, string>,
);

const lashMakeupProductType = [
  {
    label: "Mascaras",
    value: "5709",
  },
  {
    label: "Lash Curlers",
    value: "5710",
  },
  {
    label: "Individual False Lashes",
    value: "5711",
  },
  {
    label: "Full Line Lashes",
    value: "5712",
  },
];

export const lashMakeupProductTypeMap = lashMakeupProductType.reduce(
  (acc, { label, value }) => {
    acc[label] = value;
    return acc;
  },
  {} as Record<string, string>,
);

export const lensesProductType = [
  {
    label: "Daily Lenses",
    value: "5713",
  },
  {
    label: "Monthly Lenses",
    value: "5714",
  },
];

export const lensesProductTypeMap = lensesProductType.reduce(
  (acc, { label, value }) => {
    acc[label] = value;
    return acc;
  },
  {} as Record<string, string>,
);
