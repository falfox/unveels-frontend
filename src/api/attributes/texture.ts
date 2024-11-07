export const textures = [
  {
    label: "Matte",
    value: "5625",
  },
  {
    label: "Shimmer",
    value: "5626",
  },
  {
    label: "Glossy",
    value: "5627",
  },
  {
    label: "Satin",
    value: "5628",
  },
  {
    label: "Metallic",
    value: "5629",
  },
  {
    label: "Sheer",
    value: "5630",
  },
];

export function filterTextures(selectedTextures: String[]) {
  const filteredTextures = textures.filter((texture) =>
    selectedTextures.includes(texture.label),
  );
  return filteredTextures;
};