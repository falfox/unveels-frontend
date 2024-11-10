import clsx from "clsx";
import { Icons } from "../../../../components/icons";


import { useLocation } from "react-router-dom";
import { colors } from "../../../../api/attributes/color";
import { filterMaterials } from "../../../../api/attributes/material";
import { LoadingProducts } from "../../../../components/loading";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { HandwearProvider, useHandwearContext } from "./handwear-context";
import { useHandwearQuery } from "./handwear-query";

function useActiveHandwear(): "Rings" | "Bracelets" | "Necklaces" {
  const location = useLocation();

  // Extract the neckwear type from the path
  const pathSegments = location.pathname.split("/");
  const activeNeckwear = pathSegments.includes("virtual-try-on")
    ? pathSegments[2]
    : null;

  if (
    activeNeckwear == null ||
    !["rings", "bracelets", "necklaces"].includes(activeNeckwear)
  ) {
    throw new Error("No active neckwear found");
  }

  // capitalize the first letter
  return (activeNeckwear.charAt(0).toUpperCase() + activeNeckwear.slice(1)) as
    | "Rings"
    | "Bracelets"
    | "Necklaces";
}

export function HandwearSelector() {
  return (
    <HandwearProvider>
      <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
        <FamilyColorSelector />
        <ColorSelector />
        <MaterialSelector />
        <HandwearProductList />
      </div>
    </HandwearProvider>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useHandwearContext();

  return (
    <div
      className="flex items-center w-full py-2 space-x-2 overflow-x-auto no-scrollbar"
      data-mode="lip-color"
    >
      {colors.map((item, index) => (
        <button
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-transparent px-3 py-1 text-white/80",
            {
              "border-white/80": colorFamily === item.value,
            },
          )}
          onClick={() => setColorFamily(item.value)}
        >
          <div
            className="size-2.5 shrink-0 rounded-full"
            style={{
              background: item.hex,
            }}
          />
          <span className="text-sm">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function ColorSelector() {
  const { colorFamily, selectedColor, setSelectedColor } = useHandwearContext();
  const handwearType = useActiveHandwear();

  const { data } = useHandwearQuery(handwearType, {
    color: colorFamily,
    material: null,
  });

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  ).flatMap((item) => item.split(","));

  return (
    <div className="mx-auto w-full !border-t-0 pb-4 lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex items-center border border-transparent rounded-full size-10 shrink-0 gap-x-2 text-white/80"
          onClick={() => {
            setSelectedColor(null);
          }}
        >
          <Icons.empty className="size-10" />
        </button>
        {extracted_sub_colors.map((color, index) => (
          <button
            key={color}
            type="button"
            className={clsx(
              "inline-flex size-10 shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80",
              {
                "border-white/80": selectedColor === color,
              },
            )}
            style={{ background: color }}
            onClick={() => {
              if (selectedColor === color) {
                setSelectedColor(null);
              } else {
                setSelectedColor(color);
              }
            }}
          ></button>
        ))}
      </div>
    </div>
  );
}

const materials = filterMaterials([
  "Silver",
  "Silver Plated",
  "Gold Plated",
  "Brass",
  "Stainless",
]);

function MaterialSelector() {
  const { selectedMaterial, setSelectedMaterial } = useHandwearContext();

  return (
    <div className="flex items-center w-full py-2 space-x-2 overflow-x-auto no-scrollbar">
      {materials.map((material, index) => (
        <button
          key={material.value}
          type="button"
          className={clsx(
            "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80",
            {
              "selectedShape-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                selectedMaterial === material.value,
            },
          )}
          onClick={() => setSelectedMaterial(material.value)}
        >
          <span className="text-sm">{material.label}</span>
        </button>
      ))}
    </div>
  );
}

function HandwearProductList() {
  const { colorFamily, selectedMaterial, selectedColor } = useHandwearContext();
  const handwearType = useActiveHandwear();
  const { data, isLoading } = useHandwearQuery(handwearType, {
    color: colorFamily,
    material: selectedMaterial,
  });

  return (
    <div className="flex w-full gap-4 pt-4 pb-2 overflow-x-auto no-scrollbar active:cursor-grabbing">
      {isLoading ? (
        <LoadingProducts />
      ) : (
        data?.items.map((product, index) => {
          return <VTOProductCard product={product} key={product.id} />;
        })
      )}
    </div>
  );
}
