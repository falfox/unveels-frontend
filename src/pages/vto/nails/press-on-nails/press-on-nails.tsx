import clsx from "clsx";
import { useState } from "react";
import { Icons } from "../../../../components/icons";

import { ColorPalette } from "../../../../components/color-palette";
import {
  PressOnNailsProvider,
  usePressOnNailsContext,
} from "./press-on-nails-context";
import { usePressOnNailsQuery } from "./press-on-nails-query";
import { LoadingProducts } from "../../../../components/loading";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { patterns } from "../../../../api/attributes/pattern";
import { colors } from "../../../../api/attributes/color";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";
import { filterShapes } from "../../../../api/attributes/shape";

export function PressOnNailsSelector() {
  return (
    <PressOnNailsProvider>
      <div className="w-full px-4 mx-auto divide-y lg:max-w-xl">
        <div>
          <FamilyColorSelector />

          <ColorSelector />
        </div>

        <ShapeSelector />

        <ProductList />
      </div>
    </PressOnNailsProvider>
  );
}

function FamilyColorSelector() {
  const { colorFamily, setColorFamily } = usePressOnNailsContext();

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

function ColorSelector() {
  const { colorFamily, selectedColor, setSelectedColor } =
    usePressOnNailsContext();

  const { data } = usePressOnNailsQuery({
    color: colorFamily,
    shape: null,
  });

  const extracted_sub_colors = extractUniqueCustomAttributes(
    data?.items ?? [],
    "hexacode",
  ).flatMap((item) => item.split(","));

  return (
    <div className="w-full py-2 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-2 overflow-x-auto no-scrollbar">
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

const nailshapes = [
  "/nailshapes/press on nails-1.png",
  "/nailshapes/press on nails-2.png",
  "/nailshapes/press on nails-3.png",
];

const shapes = filterShapes(["Triangle", "Square", "Oval"]);

function ShapeSelector() {
  const { selectedShape, setSelectedShape } = usePressOnNailsContext();
  return (
    <div className="w-full py-4 mx-auto lg:max-w-xl">
      <div className="flex items-center w-full space-x-4 overflow-x-auto no-scrollbar">
        {shapes.map((shape, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center rounded-sm border border-transparent text-white/80",
              {
                "border-white/80": selectedShape === shape.value,
              },
            )}
            onClick={() => setSelectedShape(shape.value)}
          >
            <img
              src={nailshapes[index]}
              alt="Highlighter"
              className="rounded size-12"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductList() {
  const { colorFamily, selectedShape } = usePressOnNailsContext();

  const { data, isLoading } = usePressOnNailsQuery({
    color: colorFamily,
    shape: selectedShape,
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
