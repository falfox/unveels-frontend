import clsx from "clsx";
import { useState } from "react";
import { Icons } from "../../../../components/icons";

import { ColorPalette } from "../../../../components/color-palette";
import { HairColorProvider, useHairColorContext } from "./hair-color-context";
import { useHairColorQuery } from "./hair-color-query";
import { LoadingProducts } from "../../../../components/loading";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { colors } from "../../../../api/attributes/color";

export function HairColorSelector() {
  return (
    <HairColorProvider>
      <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
        <div>
          <FamilyColorSelector />

          <ColorSelector />
        </div>

        <ProductList />
      </div>
    </HairColorProvider>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = useHairColorContext();

  return (
    <div
      className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar"
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

const haircolors = [
  "/haircolors/fcb451ec-5284-476f-9872-5b749dfee8d9 1.png",
  "/haircolors/fcb451ec-5284-476f-9872-5b749dfee8d9 2.png",
  "/haircolors/fcb451ec-5284-476f-9872-5b749dfee8d9 3.png",
  "/haircolors/fcb451ec-5284-476f-9872-5b749dfee8d9 4.png",
  "/haircolors/fcb451ec-5284-476f-9872-5b749dfee8d9 5.png",
  "/haircolors/fcb451ec-5284-476f-9872-5b749dfee8d9 6.png",
  "/haircolors/fcb451ec-5284-476f-9872-5b749dfee8d9 7.png",
  "/haircolors/fcb451ec-5284-476f-9872-5b749dfee8d9 8.png",
];

function ColorSelector() {
  const { selectedColor, setSelectedColor } = useHairColorContext();
  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        {haircolors.map((path, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center rounded-sm border border-transparent text-white/80",
              {
                "border-white/80": selectedColor === index.toString(),
              },
            )}
            onClick={() => setSelectedColor(index.toString())}
          >
            <img src={path} alt="Hair Color" className="h-12 rounded w-14" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductList() {
  const { colorFamily } = useHairColorContext();

  const { data, isLoading } = useHairColorQuery({
    color: colorFamily,
    shape: null,
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
